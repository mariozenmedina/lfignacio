<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

defineProps({
  label: { type: String, default: 'Research network' },
})

const canvas = ref(null)
const unsupported = ref(false)

let resizeObserver
let visibilityObserver
let frame
let cleanup = () => {}

const createSeededRandom = (seed = 739) => () => {
  seed = (seed * 16807) % 2147483647
  return (seed - 1) / 2147483646
}

onMounted(async () => {
  const element = canvas.value
  if (!element) return

  const THREE = await import('three')
  if (!canvas.value) return

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const pointer = new THREE.Vector2(0, 0)
  const pointerTarget = new THREE.Vector2(0, 0)
  const clock = new THREE.Clock()
  const random = createSeededRandom()
  let isVisible = true
  let renderer

  try {
    renderer = new THREE.WebGLRenderer({
      canvas: element,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
  } catch {
    unsupported.value = true
    return
  }

  renderer.setClearColor(0x000000, 0)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
  camera.position.set(0, 0, 11.5)

  const graph = new THREE.Group()
  graph.rotation.set(-0.16, -0.28, 0.08)
  scene.add(graph)

  const ambientLight = new THREE.AmbientLight('#d9eee9', 1.2)
  const keyLight = new THREE.DirectionalLight('#ffe7a8', 2.6)
  keyLight.position.set(4, 5, 7)
  const fillLight = new THREE.DirectionalLight('#68b9ad', 1.8)
  fillLight.position.set(-5, -2, 4)
  scene.add(ambientLight, keyLight, fillLight)

  const palette = [
    new THREE.Color('#d2a51e'),
    new THREE.Color('#3d9f92'),
    new THREE.Color('#ce704f'),
  ]

  const nodeCount = 72
  const basePositions = []
  const livePositions = []
  const phases = []
  const nodeColors = Array.from({ length: nodeCount }, (_, index) => palette[index % 3].clone())
  const targetColors = nodeColors.map((color) => color.clone())
  let nextColorShuffle = 0.8

  for (let index = 0; index < nodeCount; index += 1) {
    const branch = index % 6
    const progress = index / nodeCount
    const angle = progress * Math.PI * 10 + branch * 0.26
    const radius = 0.65 + random() * 2.2
    const position = new THREE.Vector3(
      Math.cos(angle) * radius * 1.08 + (random() - 0.5) * 0.45,
      Math.sin(angle * 0.72) * radius * 0.9 + (random() - 0.5) * 0.45,
      Math.sin(angle) * 1.1 + (random() - 0.5) * 1.3,
    )
    basePositions.push(position)
    livePositions.push(position.clone())
    phases.push(random() * Math.PI * 2)
  }

  const edgeSet = new Set()
  const edges = []
  const connect = (a, b) => {
    if (a === b) return
    const key = a < b ? `${a}:${b}` : `${b}:${a}`
    if (edgeSet.has(key)) return
    edgeSet.add(key)
    edges.push([a, b])
  }

  basePositions.forEach((position, index) => {
    const nearest = basePositions
      .map((candidate, candidateIndex) => ({ candidateIndex, distance: position.distanceTo(candidate) }))
      .filter(({ candidateIndex }) => candidateIndex !== index)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, index % 6 === 0 ? 4 : 3)
    nearest.forEach(({ candidateIndex }) => connect(index, candidateIndex))
    if (index < nodeCount - 6) connect(index, index + 6)
    if (index % 3 === 0 && index < nodeCount - 11) connect(index, index + 11)
  })

  const nodeGeometry = new THREE.IcosahedronGeometry(0.11, 1)
  const nodeMaterial = new THREE.MeshPhongMaterial({
    color: '#fffdf8',
    specular: '#8fbab2',
    shininess: 58,
    flatShading: true,
  })
  const nodeMesh = new THREE.InstancedMesh(nodeGeometry, nodeMaterial, nodeCount)
  nodeMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  const matrix = new THREE.Matrix4()
  const quaternion = new THREE.Quaternion()
  const scaleVector = new THREE.Vector3()
  const pulsePosition = new THREE.Vector3()
  basePositions.forEach((position, index) => {
    const scale = index % 11 === 0 ? 1.85 : index % 5 === 0 ? 1.28 : 1
    scaleVector.setScalar(scale)
    matrix.compose(position, quaternion, scaleVector)
    nodeMesh.setMatrixAt(index, matrix)
    nodeMesh.setColorAt(index, nodeColors[index])
  })
  nodeMesh.instanceColor.setUsage(THREE.DynamicDrawUsage)
  graph.add(nodeMesh)

  const linePositions = new Float32Array(edges.length * 6)
  const lineColors = new Float32Array(edges.length * 6)
  edges.forEach(([from, to], index) => {
    nodeColors[from].toArray(lineColors, index * 6)
    nodeColors[to].toArray(lineColors, index * 6 + 3)
  })
  const lineGeometry = new THREE.BufferGeometry()
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
  lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3))
  const lineMaterial = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.24,
    depthWrite: false,
  })
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial)
  graph.add(lines)

  const pulseCount = 14
  const pulseGeometry = new THREE.SphereGeometry(0.055, 8, 8)
  const pulseMaterial = new THREE.MeshBasicMaterial({ color: palette[0], toneMapped: false })
  const pulses = new THREE.InstancedMesh(pulseGeometry, pulseMaterial, pulseCount)
  pulses.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  graph.add(pulses)

  const dustGeometry = new THREE.BufferGeometry()
  const dustPositions = new Float32Array(120 * 3)
  for (let index = 0; index < 120; index += 1) {
    dustPositions[index * 3] = (random() - 0.5) * 10
    dustPositions[index * 3 + 1] = (random() - 0.5) * 8
    dustPositions[index * 3 + 2] = (random() - 0.5) * 7
  }
  dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3))
  const dustMaterial = new THREE.PointsMaterial({
    color: '#fffdf8',
    size: 0.025,
    transparent: true,
    opacity: 0.34,
    depthWrite: false,
  })
  const dust = new THREE.Points(dustGeometry, dustMaterial)
  graph.add(dust)

  const updateLines = () => {
    edges.forEach(([from, to], index) => {
      livePositions[from].toArray(linePositions, index * 6)
      livePositions[to].toArray(linePositions, index * 6 + 3)
      nodeColors[from].toArray(lineColors, index * 6)
      nodeColors[to].toArray(lineColors, index * 6 + 3)
    })
    lineGeometry.attributes.position.needsUpdate = true
    lineGeometry.attributes.color.needsUpdate = true
  }

  const resize = () => {
    const { width, height } = element.getBoundingClientRect()
    if (!width || !height) return
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    graph.scale.setScalar(camera.aspect < 0.85 ? 0.78 : camera.aspect < 1.05 ? 0.9 : 1)
  }

  const onPointerMove = (event) => {
    const rect = element.getBoundingClientRect()
    pointerTarget.set(
      ((event.clientX - rect.left) / rect.width - 0.5) * 2,
      -((event.clientY - rect.top) / rect.height - 0.5) * 2,
    )
  }

  const onPointerLeave = () => pointerTarget.set(0, 0)

  const shuffleNodeColors = () => {
    const assignments = Array.from({ length: nodeCount }, (_, index) => index % 3)
    for (let index = assignments.length - 1; index > 0; index -= 1) {
      const target = Math.floor(random() * (index + 1))
      const previous = assignments[index]
      assignments[index] = assignments[target]
      assignments[target] = previous
    }
    assignments.forEach((colorIndex, index) => targetColors[index].copy(palette[colorIndex]))
  }

  const render = () => {
    const elapsed = clock.getElapsedTime()
    pointer.lerp(pointerTarget, 0.045)

    if (!reducedMotion && elapsed >= nextColorShuffle) {
      shuffleNodeColors()
      nextColorShuffle = elapsed + 1.25 + random() * 0.35
    }

    basePositions.forEach((base, index) => {
      const position = livePositions[index]
      const phase = phases[index]
      const motion = reducedMotion ? 0 : 1
      position.set(
        base.x + Math.sin(elapsed * 0.52 + phase) * 0.09 * motion,
        base.y + Math.cos(elapsed * 0.43 + phase * 1.3) * 0.1 * motion,
        base.z + Math.sin(elapsed * 0.35 + phase * 0.7) * 0.08 * motion,
      )
      const scale = index % 11 === 0 ? 1.85 : index % 5 === 0 ? 1.28 : 1
      scaleVector.setScalar(scale)
      matrix.compose(position, quaternion, scaleVector)
      nodeMesh.setMatrixAt(index, matrix)

      nodeColors[index].lerp(targetColors[index], reducedMotion ? 1 : 0.085)
      nodeMesh.setColorAt(index, nodeColors[index])
    })
    nodeMesh.instanceMatrix.needsUpdate = true
    nodeMesh.instanceColor.needsUpdate = true
    updateLines()

    for (let index = 0; index < pulseCount; index += 1) {
      const edge = edges[(index * 7) % edges.length]
      const progress = reducedMotion ? ((index * 0.17) % 1) : (elapsed * (0.09 + (index % 4) * 0.018) + index * 0.13) % 1
      pulsePosition.copy(livePositions[edge[0]]).lerp(livePositions[edge[1]], progress)
      const pulseScale = 0.72 + Math.sin(progress * Math.PI) * 0.7
      scaleVector.setScalar(pulseScale)
      matrix.compose(pulsePosition, quaternion, scaleVector)
      pulses.setMatrixAt(index, matrix)
    }
    pulses.instanceMatrix.needsUpdate = true

    if (!reducedMotion) {
      graph.rotation.y += 0.0012
      graph.rotation.x = -0.16 + pointer.y * 0.08
      graph.rotation.z = 0.08 - pointer.x * 0.045
      camera.position.x += (pointer.x * 0.5 - camera.position.x) * 0.025
      camera.position.y += (pointer.y * 0.32 - camera.position.y) * 0.025
      dust.rotation.y -= 0.00035
    }

    camera.lookAt(0, 0, 0)
    renderer.render(scene, camera)
    if (!reducedMotion && isVisible) frame = requestAnimationFrame(render)
  }

  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(element)
  visibilityObserver = new IntersectionObserver(([entry]) => {
    const nextVisible = entry.isIntersecting
    if (nextVisible && !isVisible && !reducedMotion) {
      isVisible = true
      clock.getDelta()
      frame = requestAnimationFrame(render)
    } else {
      isVisible = nextVisible
      if (!isVisible) cancelAnimationFrame(frame)
    }
  }, { threshold: 0.05 })
  visibilityObserver.observe(element)

  element.addEventListener('pointermove', onPointerMove)
  element.addEventListener('pointerleave', onPointerLeave)
  resize()
  updateLines()
  render()

  cleanup = () => {
    element.removeEventListener('pointermove', onPointerMove)
    element.removeEventListener('pointerleave', onPointerLeave)
    cancelAnimationFrame(frame)
    resizeObserver?.disconnect()
    visibilityObserver?.disconnect()
    nodeGeometry.dispose()
    nodeMaterial.dispose()
    lineGeometry.dispose()
    lineMaterial.dispose()
    pulseGeometry.dispose()
    pulseMaterial.dispose()
    dustGeometry.dispose()
    dustMaterial.dispose()
    renderer.dispose()
    renderer.forceContextLoss()
  }
})

onBeforeUnmount(() => cleanup())
</script>

<template>
  <figure class="research-graph" :class="{ 'is-unsupported': unsupported }">
    <canvas ref="canvas" :aria-label="label" role="img" />
    <div v-if="unsupported" class="research-graph__fallback" aria-hidden="true">
      <span v-for="index in 9" :key="index" />
    </div>
  </figure>
</template>

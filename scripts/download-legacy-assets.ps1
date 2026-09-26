param(
    [string]$SourceBase = 'https://profs.ic.uff.br/~lfignacio/'
)

$ErrorActionPreference = 'Stop'
$repoRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$materialsRoot = [IO.Path]::GetFullPath((Join-Path $repoRoot 'public\materials\legacy'))
$documentsRoot = [IO.Path]::GetFullPath((Join-Path $repoRoot 'public\documents'))
$archiveRoot = [IO.Path]::GetFullPath((Join-Path $repoRoot 'archive\legacy-site'))
$pagesRoot = Join-Path $archiveRoot 'pages'
$assetsRoot = Join-Path $archiveRoot 'assets'

foreach ($target in @($materialsRoot, $documentsRoot, $pagesRoot, $assetsRoot)) {
    if (-not $target.StartsWith($repoRoot, [StringComparison]::OrdinalIgnoreCase)) {
        throw "Refusing to write outside the repository: $target"
    }
    New-Item -ItemType Directory -Force -Path $target | Out-Null
}

function Save-RemoteFile {
    param(
        [Parameter(Mandatory = $true)][string]$Url,
        [Parameter(Mandatory = $true)][string]$Destination,
        [switch]$Overwrite
    )

    $resolvedDestination = [IO.Path]::GetFullPath($Destination)
    if (-not $resolvedDestination.StartsWith($repoRoot, [StringComparison]::OrdinalIgnoreCase)) {
        throw "Refusing to write outside the repository: $resolvedDestination"
    }

    if (-not $Overwrite -and (Test-Path -LiteralPath $resolvedDestination) -and ((Get-Item -LiteralPath $resolvedDestination).Length -gt 0)) {
        return
    }

    $parent = Split-Path -Parent $resolvedDestination
    New-Item -ItemType Directory -Force -Path $parent | Out-Null
    $partial = "$resolvedDestination.partial"

    for ($attempt = 1; $attempt -le 3; $attempt++) {
        try {
            Invoke-WebRequest -UseBasicParsing -Uri $Url -OutFile $partial
            if ((Get-Item -LiteralPath $partial).Length -le 0) {
                throw "Empty response for $Url"
            }
            Move-Item -LiteralPath $partial -Destination $resolvedDestination -Force
            return
        }
        catch {
            if ($attempt -eq 3) { throw }
            Write-Warning "Retry $attempt for $Url"
        }
    }
}

$pageNames = @('index', 'about', 'research', 'teaching', 'asa', 'fmc', 'teocomp', 'prog1', 'grafos', 'alggrafos', 'topicosbioinfo')
foreach ($page in $pageNames) {
    Save-RemoteFile -Url "$SourceBase$page.html" -Destination (Join-Path $pagesRoot "$page.html") -Overwrite
}

$legacyAssets = @('style.css', 'foto1.png', 'foto2.png', 'lattes-logo.png', 'orcid-mini-icon.png', 'scholar-logo.png', 'youtube-logo.png', 'email-logo.png', 'uff-logo.jpeg')
foreach ($asset in $legacyAssets) {
    Save-RemoteFile -Url "$SourceBase$asset" -Destination (Join-Path $assetsRoot $asset)
}

$cvArchive = Join-Path $assetsRoot 'CV-LuisFelipe-en.pdf'
Save-RemoteFile -Url "${SourceBase}CV-LuisFelipe-en.pdf" -Destination $cvArchive
Save-RemoteFile -Url "${SourceBase}CV-LuisFelipe-en.pdf" -Destination (Join-Path $documentsRoot 'cv-luis-felipe-ignacio-en.pdf')

$materialLinks = New-Object 'System.Collections.Generic.List[string]'
foreach ($page in @('asa', 'fmc', 'teocomp', 'prog1', 'grafos', 'alggrafos', 'topicosbioinfo')) {
    $html = Get-Content -Raw -Encoding UTF8 (Join-Path $pagesRoot "$page.html")
    $html = [regex]::Replace($html, '<!--.*?-->', '', [Text.RegularExpressions.RegexOptions]::Singleline)
    $matches = [regex]::Matches($html, 'href\s*=\s*["'']([^"'']+\.(?:pdf|zip))["'']', [Text.RegularExpressions.RegexOptions]::IgnoreCase)
    foreach ($match in $matches) {
        $href = $match.Groups[1].Value
        if ($href -eq 'teocomp/Aula_7_2023_1.pdf') {
            $href = 'teocomp/aula_7_2023_1.pdf'
        }
        $materialLinks.Add($href)
    }
}

$materialLinks.Add('asa/atividades/RevisaoP4_ASA.pdf')
$materialLinks = $materialLinks | Sort-Object -Unique

$completed = 0
foreach ($href in $materialLinks) {
    $localHref = $href
    if ($href -like 'alggrafos/atividades/AlgGrafos_Lista_de_revisa*') {
        $decomposed = $href.Normalize([Text.NormalizationForm]::FormD)
        $localHref = [regex]::Replace($decomposed, '\p{Mn}', '')
    }
    $relativePath = $localHref.Replace('/', [IO.Path]::DirectorySeparatorChar)
    $destination = Join-Path $materialsRoot $relativePath
    Save-RemoteFile -Url "$SourceBase$href" -Destination $destination
    $completed++
    if (($completed % 10) -eq 0 -or $completed -eq $materialLinks.Count) {
        Write-Output "Downloaded $completed/$($materialLinks.Count) teaching materials"
    }
}

$materialFiles = Get-ChildItem -LiteralPath $materialsRoot -Recurse -File | Where-Object { $_.Extension -in @('.pdf', '.zip') }
$totalBytes = ($materialFiles | Measure-Object -Property Length -Sum).Sum
Write-Output "Legacy archive complete: $($materialFiles.Count) teaching materials, $totalBytes bytes"

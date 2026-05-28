function Get-ChangelogVersion {
    param([string]$Path = 'CHANGELOG.md')
    $content = Get-Content $Path -Raw
    if ($content -match '(?m)^## \[(\d+\.\d+\.\d+)\]') {
        return $Matches[1]
    }
    return $null
}

function Set-ReadmeVersion {
    [CmdletBinding(SupportsShouldProcess)]
    [OutputType([bool])]
    param([string]$Path = 'README.md', [string]$Version)
    $content = Get-Content $Path -Raw
    $updated = $content -replace 'dotskills#v[\d.]+', "dotskills#v$Version"
    if ($updated -eq $content) {
        return $false
    }
    if ($PSCmdlet.ShouldProcess($Path, "Set version to $Version")) {
        Set-Content $Path $updated -NoNewline
    }
    return $true
}

function Invoke-Release {
    [Diagnostics.CodeAnalysis.SuppressMessageAttribute('PSAvoidUsingWriteHost', '')]
    param()

    $ErrorActionPreference = 'Stop'  # covers PS cmdlets only; native commands need $LASTEXITCODE checks

    # 1. Parse version
    $version = Get-ChangelogVersion
    if (-not $version) {
        Write-Error 'No ## [X.Y.Z] entry found in CHANGELOG.md'
        exit 1
    }

    # 2. Duplicate-tag guard
    $existingTag = git tag --list "v$version"
    if ($existingTag) {
        Write-Error "Tag v$version already exists. Did you forget to update CHANGELOG.md?"
        exit 1
    }

    # 3. Dirty-tree check (README.md excluded -- we are about to write it)
    $dirty = git status --porcelain | Where-Object { $_ -notmatch 'README\.md' }
    if ($dirty) {
        Write-Error "Working tree has uncommitted changes:`n$($dirty -join "`n")"
        exit 1
    }

    # 4. Bump README
    $bumped = Set-ReadmeVersion -Version $version
    if (-not $bumped) {
        Write-Error 'Install line (dotskills#vX.Y.Z) not found in README.md'
        exit 1
    }

    # 5. Confirm -- intentionally before commit/tag so an abort leaves git history clean
    Write-Host ''
    Write-Host "  Version : $version"
    Write-Host "  Tag     : v$version"
    Write-Host "  Push    : origin main + v$version"
    Write-Host ''
    $confirm = Read-Host 'Proceed? [y/N]'

    if ($confirm -ine 'y') {
        Write-Host 'Aborted. README.md was updated but not committed -- restore it with: git restore README.md'
        exit 0
    }

    # 6. Commit + tag
    git add README.md
    git commit -m "docs: release prep for v$version"
    if ($LASTEXITCODE -ne 0) { Write-Error 'git commit failed'; exit 1 }
    git tag "v$version"
    if ($LASTEXITCODE -ne 0) { Write-Error "git tag failed -- commit exists but tag was not created. Fix manually: git tag v$version && git push origin main v$version"; exit 1 }

    # 7. Push
    git push origin main
    if ($LASTEXITCODE -ne 0) { Write-Error 'git push failed'; exit 1 }
    git push origin "v$version"
    if ($LASTEXITCODE -ne 0) { Write-Error "git push origin v$version failed"; exit 1 }

    Write-Host "Released v$version successfully."
}

if ($MyInvocation.InvocationName -ne '.') {
    Invoke-Release
}

BeforeAll {
    . (Join-Path $PSScriptRoot 'release.ps1')
}

Describe 'Get-ChangelogVersion' {
    It 'extracts the first semver entry' {
        $tmp = New-TemporaryFile
        Set-Content $tmp "# Changelog`n`n## [0.3.2] - 2026-05-22`n`n### Added`n- stuff`n`n## [0.3.1] - 2026-05-21`n`n### Fixed`n- other"
        Get-ChangelogVersion -Path $tmp | Should -Be '0.3.2'
        Remove-Item $tmp
    }

    It 'skips Unreleased section' {
        $tmp = New-TemporaryFile
        Set-Content $tmp "# Changelog`n`n## [Unreleased]`n`n## [0.3.1] - 2026-05-21`n`n### Fixed`n- thing"
        Get-ChangelogVersion -Path $tmp | Should -Be '0.3.1'
        Remove-Item $tmp
    }

    It 'returns $null when no version found' {
        $tmp = New-TemporaryFile
        Set-Content $tmp '# Changelog'
        Get-ChangelogVersion -Path $tmp | Should -BeNullOrEmpty
        Remove-Item $tmp
    }
}
Describe 'Set-ReadmeVersion' {
    It 'replaces the version in the install line and returns "updated"' {
        $tmp = New-TemporaryFile
        Set-Content $tmp "# Readme`n`napm install TDL-XR-dev/dotskills#v0.3.1`n" -NoNewline
        Set-ReadmeVersion -Path $tmp -Version '0.3.2' | Should -Be 'updated'
        Get-Content $tmp -Raw | Should -Match 'dotskills#v0\.3\.2'
        Remove-Item $tmp
    }

    It 'returns "already" when the install line already matches the target version' {
        $tmp = New-TemporaryFile
        Set-Content $tmp "# Readme`n`napm install TDL-XR-dev/dotskills#v0.3.2`n" -NoNewline
        Set-ReadmeVersion -Path $tmp -Version '0.3.2' | Should -Be 'already'
        Remove-Item $tmp
    }

    It 'returns "not-found" when the install line is not found' {
        $tmp = New-TemporaryFile
        Set-Content $tmp '# Readme with no install line' -NoNewline
        Set-ReadmeVersion -Path $tmp -Version '0.3.2' | Should -Be 'not-found'
        Remove-Item $tmp
    }

    It 'does not alter other content in README' {
        $tmp = New-TemporaryFile
        $content = "# Readme`n`napm install TDL-XR-dev/dotskills#v0.3.1`n`nSome other text.`n"
        Set-Content $tmp $content -NoNewline
        Set-ReadmeVersion -Path $tmp -Version '0.3.2' | Out-Null
        $result = Get-Content $tmp -Raw
        $result | Should -Match 'Some other text\.'
        $result | Should -Match 'dotskills#v0\.3\.2'
        Remove-Item $tmp
    }
}

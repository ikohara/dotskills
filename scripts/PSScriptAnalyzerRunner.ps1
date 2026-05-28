#!/usr/bin/env pwsh
<#
.SYNOPSIS
  Pre-commit wrapper for PSScriptAnalyzer.

.DESCRIPTION
  pre-commit passes changed .ps1/.psm1/.psd1 paths as positional arguments. Invoke-ScriptAnalyzer's
  -Path parameter is singular and does not accept arrays, so this wrapper iterates file-by-file
  and aggregates findings.

  Settings file is resolved via $PSScriptRoot so the wrapper works regardless of the caller's
  working directory and regardless of whether it is placed at project root or under a subdirectory.

  Edit PSScriptAnalyzerSettings.psd1 (sibling to this script) to tweak rules; this wrapper stays
  as-shipped.
#>
[CmdletBinding()]
param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Files)

$settingsPath = Join-Path $PSScriptRoot 'PSScriptAnalyzerSettings.psd1'

$findings = foreach ($f in $Files) {
    Invoke-ScriptAnalyzer -Path $f -Settings $settingsPath
}

if ($findings) {
    $findings | Format-Table -AutoSize
    exit 1
}

# Ralph Loop Agent - PowerShell Version for Windows
# Autonomous AI coding loop that works through PRD stories
#
# Usage: .\ralph.ps1 [-MaxIterations 10] [-Agent "claude"]
#
# Prerequisites:
# - Claude Code CLI installed and authenticated (claude command available)
# - OR Amp CLI installed (amp command available)
# - jq installed for JSON parsing (winget install jqlang.jq)

param(
    [int]$MaxIterations = 10,
    [string]$Agent = "claude",  # "claude" or "amp"
    [switch]$DryRun = $false
)

# Configuration
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$PrdFile = Join-Path $ScriptDir "prd.json"
$ProgressFile = Join-Path $ScriptDir "progress.txt"
$PromptFile = Join-Path $ScriptDir "prompt.md"
$ArchiveDir = Join-Path $ScriptDir ".ralph-archive"

# Colors for output
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

function Write-Header {
    param([string]$Text)
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "  $Text" -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Status {
    param([string]$Text, [string]$Color = "White")
    Write-Host "[RALPH] " -ForegroundColor Yellow -NoNewline
    Write-Host $Text -ForegroundColor $Color
}

# Check prerequisites
function Test-Prerequisites {
    Write-Status "Checking prerequisites..."

    # Check for jq
    if (-not (Get-Command "jq" -ErrorAction SilentlyContinue)) {
        Write-Status "jq not found. Install with: winget install jqlang.jq" "Red"
        return $false
    }

    # Check for agent CLI
    if ($Agent -eq "claude") {
        if (-not (Get-Command "claude" -ErrorAction SilentlyContinue)) {
            Write-Status "Claude Code CLI not found. Install from: https://claude.ai/code" "Red"
            return $false
        }
    } elseif ($Agent -eq "amp") {
        if (-not (Get-Command "amp" -ErrorAction SilentlyContinue)) {
            Write-Status "Amp CLI not found." "Red"
            return $false
        }
    }

    # Check for PRD file
    if (-not (Test-Path $PrdFile)) {
        Write-Status "prd.json not found at $PrdFile" "Red"
        return $false
    }

    # Check for prompt file
    if (-not (Test-Path $PromptFile)) {
        Write-Status "prompt.md not found at $PromptFile" "Red"
        return $false
    }

    Write-Status "All prerequisites met!" "Green"
    return $true
}

# Get next incomplete story from PRD
function Get-NextStory {
    $prd = Get-Content $PrdFile -Raw | ConvertFrom-Json

    foreach ($module in $prd.modules) {
        foreach ($story in $module.stories) {
            if ($story.passes -eq $false) {
                return @{
                    Id = $story.id
                    Title = $story.title
                    Priority = $story.priority
                    Module = $module.name
                    Criteria = $story.acceptance_criteria
                }
            }
        }
    }

    return $null
}

# Count remaining stories
function Get-RemainingCount {
    $prd = Get-Content $PrdFile -Raw | ConvertFrom-Json
    $count = 0

    foreach ($module in $prd.modules) {
        foreach ($story in $module.stories) {
            if ($story.passes -eq $false) {
                $count++
            }
        }
    }

    return $count
}

# Build the prompt for this iteration
function Build-IterationPrompt {
    param([hashtable]$Story, [int]$Iteration)

    $basePrompt = Get-Content $PromptFile -Raw

    $storyPrompt = @"

## Current Iteration: $Iteration

## Your Task This Iteration

Work on story **$($Story.Id): $($Story.Title)** from module "$($Story.Module)"

### Acceptance Criteria (ALL must pass):
$($Story.Criteria | ForEach-Object { "- $_" } | Out-String)

### Instructions:
1. Read the current codebase to understand existing patterns
2. Implement the feature to meet ALL acceptance criteria above
3. Run ``npm run build`` to verify no errors
4. Update prd.json to set this story's ``passes`` to ``true``
5. Append your progress to progress.txt
6. Commit your changes with message: "feat($($Story.Id)): $($Story.Title)"

When complete, output: <promise>COMPLETE</promise>
"@

    return $basePrompt + $storyPrompt
}

# Run a single iteration
function Invoke-Iteration {
    param([int]$Iteration, [hashtable]$Story)

    Write-Header "ITERATION $Iteration - $($Story.Id): $($Story.Title)"
    Write-Status "Module: $($Story.Module)"
    Write-Status "Priority: $($Story.Priority)"
    Write-Status "Criteria count: $($Story.Criteria.Count)"
    Write-Host ""

    $prompt = Build-IterationPrompt -Story $Story -Iteration $Iteration

    if ($DryRun) {
        Write-Status "DRY RUN - Would send prompt:" "Yellow"
        Write-Host $prompt
        return $true
    }

    # Create temp file for prompt
    $tempPrompt = [System.IO.Path]::GetTempFileName()
    $prompt | Out-File -FilePath $tempPrompt -Encoding utf8

    try {
        Write-Status "Starting $Agent agent..." "Cyan"

        if ($Agent -eq "claude") {
            # Run Claude Code with the prompt
            $result = Get-Content $tempPrompt | claude --print 2>&1
        } elseif ($Agent -eq "amp") {
            # Run Amp with the prompt
            $result = Get-Content $tempPrompt | amp 2>&1
        }

        # Check for completion signal
        if ($result -match "<promise>COMPLETE</promise>") {
            Write-Status "Story completed successfully!" "Green"
            return $true
        } else {
            Write-Status "Story may not be complete - no COMPLETE signal found" "Yellow"
            return $false
        }
    }
    catch {
        Write-Status "Error during iteration: $_" "Red"
        return $false
    }
    finally {
        Remove-Item $tempPrompt -ErrorAction SilentlyContinue
    }
}

# Archive current run
function Save-Archive {
    param([int]$TotalIterations)

    if (-not (Test-Path $ArchiveDir)) {
        New-Item -ItemType Directory -Path $ArchiveDir | Out-Null
    }

    $timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
    $archiveFile = Join-Path $ArchiveDir "run_$timestamp.json"

    @{
        timestamp = $timestamp
        iterations = $TotalIterations
        agent = $Agent
        remaining_stories = Get-RemainingCount
    } | ConvertTo-Json | Out-File $archiveFile

    Write-Status "Run archived to $archiveFile"
}

# Main loop
function Start-RalphLoop {
    Write-Header "RALPH LOOP AGENT - Website Builder"
    Write-Status "Agent: $Agent"
    Write-Status "Max Iterations: $MaxIterations"
    Write-Status "Dry Run: $DryRun"
    Write-Host ""

    if (-not (Test-Prerequisites)) {
        return
    }

    $remainingBefore = Get-RemainingCount
    Write-Status "Stories remaining: $remainingBefore"

    if ($remainingBefore -eq 0) {
        Write-Status "All stories complete! Nothing to do." "Green"
        return
    }

    $iteration = 1
    $completedThisRun = 0

    while ($iteration -le $MaxIterations) {
        $story = Get-NextStory

        if ($null -eq $story) {
            Write-Header "ALL STORIES COMPLETE!"
            break
        }

        $success = Invoke-Iteration -Iteration $iteration -Story $story

        if ($success) {
            $completedThisRun++
        }

        $iteration++

        # Brief pause between iterations
        if ($iteration -le $MaxIterations -and (Get-NextStory)) {
            Write-Status "Pausing 5 seconds before next iteration..."
            Start-Sleep -Seconds 5
        }
    }

    # Summary
    Write-Header "RUN COMPLETE"
    Write-Status "Iterations run: $($iteration - 1)"
    Write-Status "Stories completed: $completedThisRun"
    Write-Status "Stories remaining: $(Get-RemainingCount)"

    Save-Archive -TotalIterations ($iteration - 1)
}

# Run the loop
Start-RalphLoop

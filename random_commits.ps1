$startDate = Get-Date "2025-10-03"
$endDate = Get-Date "2025-11-09"
$targetCommits = 79
$maxPerDay = 7

# Generate all dates in range
$allDates = @()
$current = $startDate
while ($current -le $endDate) {
    $allDates += $current
    $current = $current.AddDays(1)
}

# Randomly select days to skip (approx 30% skip rate to ensure irregularity)
$activeDates = $allDates | Where-Object { (Get-Random -Minimum 0 -Maximum 100) -gt 30 }

# Distribute commits
$commits = @()
$remaining = $targetCommits

# First pass: Assign 1 commit to each active date to ensure coverage (if enough commits)
foreach ($date in $activeDates) {
    if ($remaining -gt 0) {
        $commits += $date
        $remaining--
    }
}

# Second pass: Randomly distribute remaining commits
while ($remaining -gt 0) {
    $date = $activeDates | Get-Random
    # Check current count for this date
    $count = ($commits | Where-Object { $_ -eq $date }).Count
    if ($count -lt $maxPerDay) {
        $commits += $date
        $remaining--
    }
}

# Sort commits by date
$commits = $commits | Sort-Object

# Execute commits
$i = 1
foreach ($date in $commits) {
    # Random time between 09:00 and 23:00
    $hour = Get-Random -Minimum 9 -Maximum 23
    $minute = Get-Random -Minimum 0 -Maximum 59
    $second = Get-Random -Minimum 0 -Maximum 59
    
    $commitDate = $date.ToString("yyyy-MM-dd") + "T$($hour.ToString('00')):$($minute.ToString('00')):$($second.ToString('00'))"
    
    $env:GIT_COMMITTER_DATE = $commitDate
    $env:GIT_AUTHOR_DATE = $commitDate
    
    Add-Content -Path "contribution_log.txt" -Value "Random commit $i on $commitDate"
    git add contribution_log.txt
    git commit -m "Random contribution $i"
    
    $i++
}

Write-Host "Generated $($i-1) commits."

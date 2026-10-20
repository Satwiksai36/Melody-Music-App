Add-Type -AssemblyName System.Drawing

$src = "d:\Desktop\stitch_melody_music_streaming_app\public\melody-logo.png"
if (-not (Test-Path $src)) {
    Write-Error "Source logo not found at $src"
    exit 1
}

$bmp = [System.Drawing.Bitmap]::FromFile($src)

$sizes = @{
    "android\app\src\main\res\mipmap-mdpi" = 48
    "android\app\src\main\res\mipmap-hdpi" = 72
    "android\app\src\main\res\mipmap-xhdpi" = 96
    "android\app\src\main\res\mipmap-xxhdpi" = 144
    "android\app\src\main\res\mipmap-xxxhdpi" = 192
}

foreach ($entry in $sizes.GetEnumerator()) {
    $dir = $entry.Key
    $sz = $entry.Value
    
    $destBmp = New-Object System.Drawing.Bitmap $sz, $sz
    $g = [System.Drawing.Graphics]::FromImage($destBmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.Clear([System.Drawing.Color]::FromArgb(13, 12, 20)) # #0d0c14 Melody dark surface
    
    # Draw logo centered with subtle padding
    $pad = [int]($sz * 0.1)
    $drawSz = $sz - ($pad * 2)
    $g.DrawImage($bmp, $pad, $pad, $drawSz, $drawSz)
    $g.Dispose()
    
    $outPath = Join-Path $dir "ic_launcher.png"
    $destBmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $outRound = Join-Path $dir "ic_launcher_round.png"
    $destBmp.Save($outRound, [System.Drawing.Imaging.ImageFormat]::Png)
    $outFg = Join-Path $dir "ic_launcher_foreground.png"
    $destBmp.Save($outFg, [System.Drawing.Imaging.ImageFormat]::Png)
    $destBmp.Dispose()
    Write-Host "Updated icons for $dir ($sz x $sz)"
}

# Update splash images
$splashDrawables = @(
    "android\app\src\main\res\drawable\splash.png",
    "android\app\src\main\res\drawable-port-mdpi\splash.png",
    "android\app\src\main\res\drawable-port-hdpi\splash.png",
    "android\app\src\main\res\drawable-port-xhdpi\splash.png",
    "android\app\src\main\res\drawable-port-xxhdpi\splash.png",
    "android\app\src\main\res\drawable-port-xxxhdpi\splash.png"
)

foreach ($sp in $splashDrawables) {
    if (Test-Path $sp) {
        $spBmp = New-Object System.Drawing.Bitmap 480, 800
        $spG = [System.Drawing.Graphics]::FromImage($spBmp)
        $spG.Clear([System.Drawing.Color]::FromArgb(13, 12, 20))
        $logoSz = 160
        $x = [int]((480 - $logoSz) / 2)
        $y = [int]((800 - $logoSz) / 2)
        $spG.DrawImage($bmp, $x, $y, $logoSz, $logoSz)
        $spG.Dispose()
        $spBmp.Save($sp, [System.Drawing.Imaging.ImageFormat]::Png)
        $spBmp.Dispose()
        Write-Host "Updated splash at $sp"
    }
}

$bmp.Dispose()
Write-Host "All Android icons and splash images updated with Melody branding!"

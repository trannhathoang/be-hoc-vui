# Server tĩnh đơn giản để mở game trên iPhone/iPad cùng mạng Wi-Fi.
# Chạy:  powershell -ExecutionPolicy Bypass -File serve.ps1 [-Port 8080]
param([int]$Port = 8080)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$types = @{
  '.html' = 'text/html; charset=utf-8'; '.css' = 'text/css; charset=utf-8'
  '.js' = 'application/javascript; charset=utf-8'; '.json' = 'application/json; charset=utf-8'
  '.png' = 'image/png'; '.svg' = 'image/svg+xml'; '.mp3' = 'audio/mpeg'; '.ico' = 'image/x-icon'
}

$listener = New-Object System.Net.Sockets.TcpListener ([System.Net.IPAddress]::Any), $Port
$listener.Start()

Write-Host "Dang chay game tai:"
Write-Host "  http://localhost:$Port"
Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
  Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254.*' } |
  ForEach-Object { Write-Host "  http://$($_.IPAddress):$Port   <- mo dia chi nay bang Safari tren iPhone/iPad" }
Write-Host "Nhan Ctrl+C de dung."

function Send-Response($client, $buffer) {
  $stream = $client.GetStream()
  $text = [System.Text.Encoding]::ASCII.GetString($buffer)
  $requestLine = ($text -split "`r`n")[0]
  $parts = $requestLine -split ' '
  $path = '/'
  if ($parts.Length -ge 2) { $path = [Uri]::UnescapeDataString($parts[1].Split('?')[0]) }
  if ($path.EndsWith('/')) { $path += 'index.html' }
  $file = [System.IO.Path]::GetFullPath((Join-Path $root $path.TrimStart('/')))

  if ($file.StartsWith($root + [System.IO.Path]::DirectorySeparatorChar) -and (Test-Path $file -PathType Leaf)) {
    $body = [System.IO.File]::ReadAllBytes($file)
    $type = $types[[System.IO.Path]::GetExtension($file).ToLower()]
    if (-not $type) { $type = 'application/octet-stream' }
    $status = '200 OK'
  } else {
    $body = [System.Text.Encoding]::UTF8.GetBytes('Not found')
    $type = 'text/plain'
    $status = '404 Not Found'
  }
  $header = "HTTP/1.1 $status`r`nContent-Type: $type`r`nContent-Length: $($body.Length)`r`nCache-Control: no-cache`r`nConnection: close`r`n`r`n"
  $hb = [System.Text.Encoding]::ASCII.GetBytes($header)
  $stream.Write($hb, 0, $hb.Length)
  $stream.Write($body, 0, $body.Length)
  $stream.Flush()
}

# Không chờ chặn trên từng kết nối: trình duyệt hay mở sẵn kết nối mà chưa gửi gì.
$pending = New-Object System.Collections.ArrayList
while ($true) {
  while ($listener.Pending()) {
    $c = $listener.AcceptTcpClient()
    [void]$pending.Add(@{ Client = $c; Since = [DateTime]::UtcNow; Data = (New-Object System.IO.MemoryStream) })
  }
  foreach ($p in @($pending)) {
    $c = $p.Client
    $done = $false
    try {
      if ($c.Available -gt 0) {
        $buf = New-Object byte[] $c.Available
        $n = $c.GetStream().Read($buf, 0, $buf.Length)
        $p.Data.Write($buf, 0, $n)
        $all = $p.Data.ToArray()
        if ([System.Text.Encoding]::ASCII.GetString($all).Contains("`r`n`r`n")) {
          Send-Response $c $all
          $done = $true
        }
      } elseif (([DateTime]::UtcNow - $p.Since).TotalSeconds -gt 30) {
        $done = $true
      }
    } catch {
      $done = $true
    }
    if ($done) {
      try { $c.Close() } catch { }
      $pending.Remove($p)
    }
  }
  Start-Sleep -Milliseconds 5
}

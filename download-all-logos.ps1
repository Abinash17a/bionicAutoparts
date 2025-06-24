$baseUrl = "https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb"
$outputDir = "public\car-logos"

Write-Host "Downloading car logos..."

$logos = @(
    "amc.png", "acura.png", "alfa-romeo.png", "aston-martin.png", "audi.png", "austin.png",
    "autocar.png", "avanti.png", "bmw.png", "bentley.png", "buick.png", "cadillac.png",
    "chevrolet.png", "chrysler.png", "citroen.png", "daewoo.png", "daihatsu.png",
    "delorean.png", "dodge.png", "eagle.png", "ferrari.png", "fiat.png", "fisker.png",
    "ford.png", "genesis.png", "gmc.png", "honda.png", "hudson.png", "hummer.png",
    "hyundai.png", "infiniti.png", "isuzu.png", "jaguar.png", "jeep.png", "kia.png",
    "lamborghini.png", "land-rover.png", "lexus.png", "lincoln.png", "lotus.png",
    "mg.png", "maserati.png", "maybach.png", "mazda.png", "mclaren.png",
    "mercedes-benz.png", "mercury.png", "mini.png", "mitsubishi.png", "nissan.png",
    "oldsmobile.png", "plymouth.png", "polestar.png", "pontiac.png", "porsche.png",
    "ram.png", "renault.png", "rolls-royce.png", "rover.png", "saab.png", "saturn.png",
    "subaru.png", "suzuki.png", "tesla.png", "toyota.png", "triumph.png",
    "volkswagen.png", "volvo.png", "western-star.png", "willys.png", "winnebago.png", "yugo.png"
)

foreach ($logo in $logos) {
    $url = "$baseUrl/$logo"
    $outputPath = "$outputDir\$logo"
    Write-Host "Downloading $logo..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $outputPath -UseBasicParsing
        Write-Host "Downloaded $logo"
    }
    catch {
        Write-Host "Failed to download $logo"
    }
}

Write-Host "Download completed!"


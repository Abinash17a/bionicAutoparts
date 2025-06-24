# PowerShell script to download car logos
$baseUrl = "https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb"
$outputDir = "public\car-logos"

# Create output directory if it doesn't exist
if (!(Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force
}

# List of car makes and their corresponding logo filenames
$carLogos = @{
    "AMC" = "amc.png"
    "Acura" = "acura.png"
    "ALFA" = "alfa-romeo.png"
    "Aston_Martin" = "aston-martin.png"
    "Audi" = "audi.png"
    "Austin" = "austin.png"
    "AutoCar" = "autocar.png"
    "Avanti" = "avanti.png"
    "BMW" = "bmw.png"
    "Bentley" = "bentley.png"
    "Buick" = "buick.png"
    "Cadillac" = "cadillac.png"
    "Chevy" = "chevrolet.png"
    "Chrysler" = "chrysler.png"
    "Citroen" = "citroen.png"
    "Daewoo" = "daewoo.png"
    "Daihatsu" = "daihatsu.png"
    "Delorean" = "delorean.png"
    "Dodge" = "dodge.png"
    "Eagle" = "eagle.png"
    "Ferrari" = "ferrari.png"
    "Fiat" = "fiat.png"
    "Fisker" = "fisker.png"
    "Ford" = "ford.png"
    "Genesis" = "genesis.png"
    "GMC" = "gmc.png"
    "Honda" = "honda.png"
    "Hudson" = "hudson.png"
    "Hummer" = "hummer.png"
    "Hyundai" = "hyundai.png"
    "Infiniti" = "infiniti.png"
    "Isuzu" = "isuzu.png"
    "Jaguar" = "jaguar.png"
    "Jeep" = "jeep.png"
    "Kia" = "kia.png"
    "Lamborghini" = "lamborghini.png"
    "LandRover" = "land-rover.png"
    "Lexus" = "lexus.png"
    "Lincoln" = "lincoln.png"
    "Lotus" = "lotus.png"
    "MG" = "mg.png"
    "Maserati" = "maserati.png"
    "Maybach" = "maybach.png"
    "Mazda" = "mazda.png"
    "McLaren" = "mclaren.png"
    "MercedesBenz" = "mercedes-benz.png"
    "Mercury" = "mercury.png"
    "Mini" = "mini.png"
    "Mitsubishi" = "mitsubishi.png"
    "Nissan" = "nissan.png"
    "Oldsmobile" = "oldsmobile.png"
    "Plymouth" = "plymouth.png"
    "Polestar" = "polestar.png"
    "Pontiac" = "pontiac.png"
    "Porsche" = "porsche.png"
    "Ram" = "ram.png"
    "Renault" = "renault.png"
    "RollsRoyce" = "rolls-royce.png"
    "Rover" = "rover.png"
    "Saab" = "saab.png"
    "Saturn" = "saturn.png"
    "Subaru" = "subaru.png"
    "Suzuki" = "suzuki.png"
    "Tesla" = "tesla.png"
    "Toyota" = "toyota.png"
    "Triumph" = "triumph.png"
    "Volkswagen" = "volkswagen.png"
    "Volvo" = "volvo.png"
    "Western" = "western-star.png"
    "Willys" = "willys.png"
    "Winnebago" = "winnebago.png"
    "Yugo" = "yugo.png"
}

Write-Host "Starting download of car logos..." -ForegroundColor Green

$successCount = 0
$errorCount = 0

foreach ($make in $carLogos.Keys) {
    $filename = $carLogos[$make]
    $url = "$baseUrl/$filename"
    $outputPath = "$outputDir\$filename"

    try {
        Write-Host "Downloading $make logo..." -ForegroundColor Yellow
        Invoke-WebRequest -Uri $url -OutFile $outputPath -UseBasicParsing
        Write-Host "✓ Downloaded $make logo" -ForegroundColor Green
        $successCount++
    }
    catch {
        Write-Host "✗ Failed to download $make logo: $($_.Exception.Message)" -ForegroundColor Red
        $errorCount++
    }
}

Write-Host "`nDownload completed!" -ForegroundColor Green
Write-Host "Successfully downloaded: $successCount logos" -ForegroundColor Green
Write-Host "Failed downloads: $errorCount logos" -ForegroundColor Red
Write-Host "Logos saved to: $outputDir" -ForegroundColor Cyan


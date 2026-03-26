<?php


header('Content-Type: application/json');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Vérifier méthode POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['erreur' => 'Méthode non autorisée']);
    exit;
}

//  Récupération des données envoyées par la requête POST (au format URL-encodé)
// Chaque champ est converti en nombre flottant s’il est présent, ou laissé à null sinon.
// Cela permet de vérifier que les données nécessaires à la prédiction ont bien été transmises.

$sog = isset($_POST['sog']) ? floatval($_POST['sog']) : null;
$cog = isset($_POST['cog']) ? floatval($_POST['cog']) : null;
$heading = isset($_POST['heading']) ? floatval($_POST['heading']) : null;
$latitude = isset($_POST['lat']) ? floatval($_POST['lat']) : null;
$longitude = isset($_POST['lon']) ? floatval($_POST['lon']) : null;

if ($sog === null || $cog === null || $heading === null || $latitude === null || $longitude === null) {
    http_response_code(400);
    echo json_encode(['erreur' => 'Paramètres manquants ou invalides']);
    exit;
}

// Construire la commande python avec les arguments
$pythonScript = "/usr/bin/python3";
$scriptPath = "../python/predict_position.py";

$cmd = escapeshellcmd("$pythonScript $scriptPath") .
       " --sog " . escapeshellarg($sog) .
       " --cog " . escapeshellarg($cog) .
       " --heading " . escapeshellarg($heading) .
       " --latitude " . escapeshellarg($latitude) .
       " --longitude " . escapeshellarg($longitude) .
       " 2>&1"; // <-- capture aussi stderr
// Exécuter la commande et récupérer la sortie
$output = shell_exec($cmd);

if (!$output) {
    http_response_code(500);
    echo json_encode(['erreur' => 'Erreur lors de l\'exécution du script Python']);
    exit;
}

// Extraire la dernière ligne qui devrait être du JSON
$lines = explode("\n", trim($output));
$json_line = end($lines);

$result = json_decode($json_line, true);
if ($result === null) {
    http_response_code(500);
    echo json_encode(['erreur' => 'Réponse JSON invalide du script Python', 'debug' => $output]);
    exit;
}

echo json_encode($result);

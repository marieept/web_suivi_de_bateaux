<?php

header('Content-Type: application/json');

//Active l'affichage des erreurs
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

//On vérifie que c'est bien la méthode POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['erreur' => 'Méthode non autorisée']);
    exit;
}
//On récupère les données envoyées en POST

$mmsi    = $_POST['mmsi'];
$length  = $_POST['length'];
$width   = $_POST['width'];
$draft   = $_POST['draft'];
$heading = $_POST['heading'];

//On construit le JSON attendu par le script python
$inputData = [
    [
        'mmsi'    => $mmsi,
        'length'  => floatval($length),
        'width'   => floatval($width),
        'draft'   => floatval($draft),
        'heading' => floatval($heading)
    ]
];

//On encode en JSON
$jsonInput = escapeshellarg(json_encode($inputData));

//On éxecute le script
$pythonScript = "/usr/bin/python3";
$scriptPath   = "../python/predict_type.py";
$cmd = "$pythonScript $scriptPath --data $jsonInput";
$output = shell_exec($cmd); //on utilise shell_exec car on a un seul résultat à la fin

//On vérifie si il y a pas d'erreur python
if (!$output) {
    http_response_code(500);
    echo json_encode(['erreur' => 'Erreur script Python']);
    exit;
}

//On envoie en JSON
echo $output;

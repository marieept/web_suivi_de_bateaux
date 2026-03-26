<?php
require_once("database.php");

//Afficher les erreurs PHP
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

//Connexion à la base de données
$db = dbConnect();

if($db==false){
    header('HTTP/1.1 503 Service Unavailable');
    echo "Base de données indisponible. Merci de contacter l'administrateur.";
    exit;
}

//On vérifie si il y a bien une requête
if(!isset($_GET['request'])){
    header('HTTP/1.1 400 Bad Request');
    echo "Requête non valide";
    exit;
}

$request = $_GET['request'];

//Cas 1 : on récupère la liste des états (GET)
if($request === 'etats' && $_SERVER['REQUEST_METHOD'] === 'GET'){
    $etats = dbGetEtat($db);
    header('Content-Type: application/json');
    echo json_encode($etats);  
    exit;
}

//Cas 2 : On ajoute une donnée pour un bateau (POST)
if($request==='donnee' && $_SERVER['REQUEST_METHOD'] === 'POST'){
    if (
        isset($_POST['mmsi']) &&
        isset($_POST['nom_bateau']) &&
        isset($_POST['longueur']) &&
        isset($_POST['largeur']) &&
        isset($_POST['tirant_eau']) &&
        isset($_POST['horodatage']) &&
        isset($_POST['latitude']) &&
        isset($_POST['longitude']) &&
        isset($_POST['sog']) &&
        isset($_POST['cog']) &&
        isset($_POST['heading']) &&
        isset($_POST['id_etat'])
    ) {
        // Construction du tableau attendu par dbAddDonnee
        $donnee = [
            'mmsi' => $_POST['mmsi'],
            'nom_bateau' => $_POST['nom_bateau'],
            'longueur' => $_POST['longueur'],
            'largeur' => $_POST['largeur'],
            'tirant_eau' => $_POST['tirant_eau'],
            'horodatage' => $_POST['horodatage'],
            'latitude' => $_POST['latitude'],
            'longitude' => $_POST['longitude'],
            'sog' => $_POST['sog'],
            'cog' => $_POST['cog'],
            'heading' => $_POST['heading'],
            'id_etat' => $_POST['id_etat']
        ];

        $succes = dbAddDonnee($db, $donnee);

        echo json_encode($succes);
    } else {
        header('HTTP/1.1 400 Bad Request');
        echo "Certains champs sont manquants.";
    }
    exit;
}

//Cas 3 : on récupère toutes les données (GET)
if ($request == 'donnees' && $_SERVER['REQUEST_METHOD'] == 'GET') {
    $donnees = dbGetDonnees($db);
    header('Content-Type: application/json');
    echo json_encode($donnees);
    exit;
}

//Cas 4 : on récupère les positions des bateaux pour la carte
if ($request == 'carte' && $_SERVER['REQUEST_METHOD'] == 'GET') { //get (on ne modifie rien)
    try {
        $rows = dbGetPositions($db); //récupère les positions des bateaux sous forme de tableau
        header('Content-Type: application/json');
        echo json_encode($rows); //renvoie les données au format JSON
    } catch (PDOException $e) { // s'il y a une erreur
        header('HTTP/1.1 500 Internal Server Error');
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit;
}
?>
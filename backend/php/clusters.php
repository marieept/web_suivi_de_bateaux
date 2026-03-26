<?php
require_once("database.php");

//Active l'affichage des erreurs
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

//Connexion à la base de données
$db = dbConnect();

//Erreur si la connexion échoue
if ($db === false) {
    header('HTTP/1.1 503 Service Unavailable');
    echo json_encode(["error" => "Base de données indisponible"]);
    exit;
}

//On vérifie que le paramètre GET soit bien 'request'
if (!isset($_GET['request'])) {
    header('HTTP/1.1 400 Bad Request');
    echo "Requête non valide";
    exit;
}

//On récupère sa valeur
$request= $_GET['request'];

//Si la requête est 'cluster' et la méthode GET
if ($request==='clusters' && $_SERVER['REQUEST_METHOD']==='GET'){

    $donnees = dbGetDonnees($db);//récupère les données

    //On prépare deux tableaux, un pour le python et un pour tout
    $data_python=[];
    $data_complet=[];

    //On parcourt toutes les lignes
    foreach($donnees as $row){
        //Tableau pour appliquer le python
        $data_python[]=[
            "sog" => $row['sog'],
            "cog" => $row['cog'],
            "heading" => $row['heading'],
        ];

        //Tableau avec toutes les infos
        $data_complet[] = [
            "mmsi" => $row['mmsi'],
            "lat" => $row['latitude'],
            "lon" => $row['longitude']
        ];
    }

    //On transforme les données en JSON pour le python
    $json_arg = escapeshellarg(json_encode($data_python));
    //escapeshellarg sert a éviter les erreurs dans les commandes (espaces, ...)


    //On exécute le script
    $script_python="../python/predict_clusters.py";
    $command ="python3 $script_python --data $json_arg";
    exec($command,$output, $return_var);

    //Si il y a une erreur
    if ($return_var !== 0) {
        header('HTTP/1.1 500 Internal Server Error');
        echo "Erreur lors de l'exécution du script Python.";
        exit;
    }

    //Met à la suite les lignes de sortie en une seule chaine JSON
    $clusters_json = implode("", $output);
    //implode transforme un tableau en une chaine de caractère, séparé par ""

    //Décode le JSON en tableau
    $clusters = json_decode($clusters_json, true);

    //Tableau final 
    $resultats=[];
    for ($i =0; $i <count($clusters); $i++){
        $resultats[] = [
            "mmsi" => $data_complet[$i]["mmsi"],
            "lat" => $data_complet[$i]["lat"],
            "lon" => $data_complet[$i]["lon"],
            "cluster" => $clusters[$i]["cluster"]
        ];
    }

    //Réponse en JSON
    header('Content-Type: application/json');
    echo json_encode($resultats);
    exit;
}
?>
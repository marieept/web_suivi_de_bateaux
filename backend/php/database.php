<?php
require_once("constante.php");

function dbConnect()
{
    try
    {
        $db = new PDO('mysql:host='.DB_SERVER.';dbname='.DB_NAME.';charset=utf8',//essayer de créer une connexion PDO
            DB_USER, DB_PASSWORD);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);//configurer l'attribut d'erreur
        //on dit à la PDO de lancer une exception si une erreur survient
        //Lancer une exception signifie qu’on « signale » ce problème pour
        //pouvoir le traiter à un endroit spécifique du code.
    }
    catch (PDOException $exception)//si la connexion échoue, une exception est levée
    {
        error_log('Connection error: '.$exception->getMessage());//on écrit l'erreur dans le fichier PHP
        return false;
    }
    return $db;//permet d'intéragir avec toute la base si la connexion s'est bien passée
}

//Fonction pour obtenir les états des bateaux dans la database
function dbGetEtat($db){
    $stmt= $db->query("SELECT id_etat, libelle FROM Etat ORDER BY id_etat");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

//Fonction pour inserer une nouvelle donnée
function dbAddDonnee($db, $donnee){
    try {
        // On ajoute le bateau s'il n'existe pas encore
        $stmt = $db->prepare("INSERT INTO Bateau (MMSI, nom_bateau, longueur, largeur, tirant_eau)
        VALUES (:mmsi, :nom_bateau, :longueur, :largeur, :tirant_eau)");

        //On associe chaque paramètre à sa valeur
        $stmt->bindParam(':mmsi',$donnee['mmsi']);
        $stmt->bindParam(':nom_bateau',$donnee['nom_bateau']);
        $stmt->bindParam(':longueur',$donnee['longueur']);
        $stmt->bindParam(':largeur',$donnee['largeur']);
        $stmt->bindParam(':tirant_eau',$donnee['tirant_eau']);

        $stmt->execute();

        // On ajoute la donnée
        $stmt = $db->prepare("INSERT INTO Donnee (horodatage, latitude, longitude, sog, cog, heading, MMSI, id_etat)
        VALUES (:horodatage, :latitude, :longitude, :sog, :cog, :heading, :mmsi, :id_etat)");

        //On associe chaque paramètre à sa valeur
        $stmt->bindParam(':horodatage',$donnee['horodatage']);
        $stmt->bindParam(':latitude',$donnee['latitude']);
        $stmt->bindParam(':longitude',$donnee['longitude']);
        $stmt->bindParam(':sog',$donnee['sog']);
        $stmt->bindParam(':cog',$donnee['cog']);
        $stmt->bindParam(':heading',$donnee['heading']);
        $stmt->bindParam(':mmsi',$donnee['mmsi']);
        $stmt->bindParam(':id_etat',$donnee['id_etat']);

        $stmt->execute();

    } catch(PDOException $exception) {
        error_log("Erreur SQL: " . $exception->getMessage());
        return false;
    }
    return true;
}

//Fonction pour récupérer toutes les données des bateaux
function dbGetDonnees($db) {
    try {
        $sql = "SELECT d.mmsi, d.horodatage, d.latitude, d.longitude, d.sog, d.cog, d.heading, 
                   b.nom_bateau, e.libelle AS etat, b.longueur, b.largeur, b.tirant_eau
            FROM Donnee d
            JOIN Bateau b ON d.MMSI = b.MMSI
            JOIN Etat e ON d.id_etat = e.id_etat
            ORDER BY d.horodatage DESC";

        $stmt = $db->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch(PDOException $exception) {
        error_log("Erreur SQL: " . $exception->getMessage());
        return false;
    }
    
}

//Fonction pour récupérer les positions GPS des bateaux
function dbGetPositions($db){
    //Requête SQL pour récupérer les positions des bateaux
    $sql = "SELECT B.MMSI as mmsi, B.nom_bateau as name, D.latitude as lat, D.longitude as lon, D.sog, E.libelle as etat
        FROM Bateau B
        JOIN Donnee D ON B.MMSI = D.MMSI
        JOIN Etat E ON D.id_etat = E.id_etat
        ORDER BY B.MMSI, D.horodatage";

    $stmt = $db->query($sql);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
?>
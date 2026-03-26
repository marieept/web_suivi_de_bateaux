'use strict';

function main() {
    //On récupère les paramètres de l'URL
    const params = new URLSearchParams(window.location.search);
    const mmsi = params.get("mmsi");
    const length = params.get("length");
    const width = params.get("width");
    const draft = params.get("draft");
    const heading = params.get("heading");

    //On crée l'HTML avec les infos 
    const infoBateau = `
        <ul>
            <li><strong>MMSI</strong> : ${mmsi}</li>
            <li><strong>Longueur</strong> : ${length} m</li>
            <li><strong>Largeur</strong> : ${width} m</li>
            <li><strong>Tirant d'eau</strong> : ${draft} m</li>
            <li><strong>Cap (Heading)</strong> : ${heading}°</li>
        </ul>
    `;

    //On ajoute ces infos dans l'HTML 
    document.getElementById("info-bateau").innerHTML = infoBateau;

    // Formatage des paramètres à envoyer en POST
    const data =
        "mmsi=" + encodeURIComponent(mmsi) +
        "&length=" + encodeURIComponent(length) +
        "&width=" + encodeURIComponent(width) +
        "&draft=" + encodeURIComponent(draft) +
        "&heading=" + encodeURIComponent(heading);

    // Envoie une requête POST pour obtenir la prédiction
    ajaxRequest(
        "POST",
        "../backend/php/predict_type.php",
        afficherResultat,
        data
    );
}

function afficherResultat(data) {
    //Sélectionne dans l'HTML où on veut afficher les résutats
    const container = document.getElementById("resultat_prediction");
    container.innerHTML = ''; //on le vide avant

    //On affiche la prédiction dans le HTML
    const prediction = data.predictions[0];
    container.innerHTML = `<p>Type prédit : <strong>${prediction.type}</strong></p>`;

}

main();

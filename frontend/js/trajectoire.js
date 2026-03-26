'use strict';

function main() {
    // Extraction des paramètres de l'URL (sog,cog,heading,lat,lon)
    const params = new URLSearchParams(window.location.search);

    const sog = params.get("sog");
    const cog = params.get("cog");
    const heading = params.get("heading");
    const lat = params.get("lat");
    const lon = params.get("lon");

    // Affichage des informations du navire sur la page HTML 
    const infoBoat = `
        <ul>
            <li><strong>SOG (Speed Over Ground)</strong> : ${sog} noeuds</li>
            <li><strong>COG (Course Over Ground)</strong> : ${cog}°</li>
            <li><strong>Heading</strong> : ${heading}°</li>
            <li><strong>Latitude</strong> : ${lat}°</li>
            <li><strong>Longitude</strong> : ${lon}°</li>
        </ul>
    `;
    document.getElementById("info-bateau").innerHTML = infoBoat;

    //Construction des données à envoyer au serveur 
    const data =
        "sog=" + encodeURIComponent(sog) +
        "&cog=" + encodeURIComponent(cog) +
        "&heading=" + encodeURIComponent(heading) +
        "&lat=" + encodeURIComponent(lat) +
        "&lon=" + encodeURIComponent(lon);

    // Envoie de la requête POST au serveur pour obtenir la position prédite 
    ajaxRequest(
        "POST",
        "../backend/php/prediction_trajectoire.php",
        afficherResultat,
        data
    );
}


// Afficher les résultats de la prédiction et tracer la trajectoire sur une carte  

function afficherResultat(data) {
    const container = document.getElementById("resultat_prediction");
    container.innerHTML = '';
    //Vérification que les coordonnées prédites sont présentes dans la réponse JSON
    if (data.latitude_predite && data.longitude_predite) {
        const lat_pred = data.latitude_predite;
        const lon_pred = data.longitude_predite;
        //Affichage textuel de la position prédite 
        const div = document.createElement("div");
        div.innerHTML = `
            <p>Position prédite : <strong>Lat ${lat_pred}, Lon ${lon_pred}</strong></p>
        `;
        container.appendChild(div);
        // Péparation des données pour le tracé de la carte  
        const params = new URLSearchParams(window.location.search);
        const lat = parseFloat(params.get("lat"));
        const lon = parseFloat(params.get("lon"));

        const trace = {
            type: "scattermapbox", //Type de graphique : tracé géographique 
            mode: "markers+lines", // Affiche à la fois les points et la ligne entre eux 
            lat: [lat, lat_pred],  // Latitude des deux points (actuel et prédit)
            lon: [lon, lon_pred],   // Longitude des deux points (actuel et prédit)
            marker: { size: 10, color: ["blue", "red"] },
            line: { color: "red", width: 2 }, // Couleur du point actuel (bleu) et du point prédit (rouge)
            text: ["Position actuelle", "Position prédite"], // Étiquettes affichées au survol
            hoverinfo: "text"   // Affiche uniquement le texte défini ci-dessus au survo
        };

        const layout = {
            mapbox: {
                style: "open-street-map", // Fond de carte libre fourni par OpenStreetMap
                center: { lat: (lat + lat_pred)/2, lon: (lon + lon_pred)/2 }, // Latitude et longitude  centrées entre les deux points
                zoom: 2
            },
            margin: { t: 0, b: 0, l: 0, r: 0 },
            height: 500
        };

        Plotly.newPlot("map", [trace], layout);

    } else {
        //Si la réponse du serveur est invalide (coordonnées manquantes), on affiche un message d’erreur
        container.innerHTML = '<p style="color:red;">Réponse du serveur invalide</p>';
    }
}

main();

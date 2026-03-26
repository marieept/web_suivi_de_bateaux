'use strict';

//Fonction appelée au chargement de la page
function main(){
    setupBouton();
    setupBouton2();
    setupBouton3();
    chargerTableau();
    afficherCarte();
}

//Variable globale pour stocker les infos nécessaires à la prédiction de la trajectoire
let urlTrajectoire = "";

//Fonction pour envoyer sur cluster.html en cliquant sur le bouton
function setupBouton(){
    const bouton = document.getElementById("b_predire");
    if (bouton) {
        bouton.addEventListener("click", function () {
        window.open("cluster.html", "_blank");//dans un nouvel onglet
        });
    }
}

//Fonction pour envoyer sur type.html en cliquant sur le bouton
function setupBouton2(){
    const bouton = document.getElementById("t_predire");
    if (bouton) {
        bouton.addEventListener("click", function () {
            const bateau = getSelectedBateau_type(); //Récupère le bateau sélectionné
            if (!bateau) {
                alert("Veuillez sélectionner un bateau dans le tableau.");
                return;
            }

            // Créer une URL avec les infos du bateau dans les paramètres
            const url = new URL("/groupe-5-projet-web/frontend/type.html", window.location.origin);
            // Ajouter les paramètres à l'URL
            url.searchParams.set("mmsi", bateau.mmsi);
            url.searchParams.set("length", bateau.length);
            url.searchParams.set("width", bateau.width);
            url.searchParams.set("draft", bateau.draft);
            url.searchParams.set("heading", bateau.heading);

            // Ouvrir la nouvelle page avec les paramètres
            window.open(url.toString(), "_blank");
        });
    }
}

//Fonction qui ouvre trajectoire.html avec les paramètres dans l'URL
function setupBouton3(){
    const boutonTrajectoire = document.getElementById("b_predire_traj");
    if (boutonTrajectoire) {
        boutonTrajectoire.addEventListener("click", function () {

            if (!urlTrajectoire) {
                alert("Veuillez d'abord sélectionner un bateau.");
                return;
            }
            window.open("trajectoire.html" + urlTrajectoire, "_blank");
        });
    }
}

//Fonction qui envoie une requête GET pour avoir les données de la db
function chargerTableau(){
    ajaxRequest('GET', "../backend/php/api.php?request=donnees", afficherTableau);
}

//Fonction qui affiche ces données dans un tableau
function afficherTableau(data){
    const tbody = document.querySelector("#tableBateaux tbody");
    tbody.innerHTML="";

    for (let bateau of data){
        const row = document.createElement("tr");
        row.innerHTML=`

            <td><input type="radio" name="bateauSelect" onClick="predict_trajectoire('${bateau.sog}', '${bateau.cog}', '${bateau.heading}', '${bateau.latitude}', '${bateau.longitude}')" value="${bateau.mmsi}"></td>
            <td>${bateau.mmsi}</td>
            <td>${bateau.horodatage}</td>
            <td>${bateau.latitude}</td>
            <td>${bateau.longitude}</td>
            <td>${bateau.sog}</td>
            <td>${bateau.cog}</td>
            <td>${bateau.heading}</td>
            <td>${bateau.nom_bateau}</td>
            <td>${bateau.etat}</td>
            <td>${bateau.longueur}</td>
            <td>${bateau.largeur}</td>
            <td>${bateau.tirant_eau}</td>
        `;
        tbody.appendChild(row); //Ajoute la ligne au tableau
    }
}

//Fonction qui prépare les paramètres pour la prédiction de trajectoire
function predict_trajectoire(SOG, COG, HEADING, LAT, LON) {
    SOG = Number(SOG);
    COG = Number(COG);
    HEADING = Number(HEADING);
    LAT = Number(LAT);
    LON = Number(LON);

    if ([SOG, COG, HEADING, LAT, LON].some(isNaN)) {
        alert("Les coordonnées du bateau sont incomplètes ou invalides.");
        return;
    }

    urlTrajectoire = `?sog=${SOG}&cog=${COG}&heading=${HEADING}&lat=${LAT}&lon=${LON}`;
}


//Fonction pour récupérer les données pour la carte
function afficherCarte(){
    ajaxRequest('GET', "../backend/php/api.php?request=carte", tracerCarte);
}


// Fonction pour tracer la carte avec Plotly
function tracerCarte(data){
    const bateaux={};

    // On regroupe les bateaux par MMSI
    for (let point of data){
        const id= point.mmsi;
        //si le bateau n'existe pas encore, on le créé
        if (!bateaux[id]){
            bateaux[id]={
                type: 'scattergeo',
                mode: 'markers',
                name: point.name || id,
                lat: [],
                lon: [],
                text: [],
                line: { width: 2 }
            };
        }
        //On ajoute les coordonnées et les informations du bateau
        bateaux[id].lat.push(point.lat);
        bateaux[id].lon.push(point.lon);
        bateaux[id].text.push(`Nom : ${point.name}<br>SOG : ${point.sog} noeuds<br>État : ${point.etat}`);
    }
    //création de la carte avec Plotly
    const layout={
        geo: {
            projection: {type: 'natural earth'},
            showland: true,
            landcolor: '#eaeaea'
        },
        margin: {t: 0, b: 0}
    };
    //affichage de la carte
    Plotly.newPlot('map', Object.values(bateaux), layout);
    
    

}

//Fonction qui récupère les infos du bateau sélectionné dans le tableau
function getSelectedBateau_type(){
    const radio = document.querySelector('input[name="bateauSelect"]:checked');
    
    //Si il y en a aucun de coché
    if (!radio) return null;

    //On trouve la ligne où est ce radio coché
    const row = radio.closest('tr');

    return {
        mmsi: radio.value,
        draft: parseFloat(row.cells[12].textContent),   // Tirant d'eau
        heading: parseFloat(row.cells[6].textContent),  // Heading
        length: parseFloat(row.cells[10].textContent),   // Longueur
        width: parseFloat(row.cells[11].textContent)    // Largeur
    };
}

main();


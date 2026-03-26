'use strict';

//Fonction appelée lors du chargement de la page
function main(){
    afficherClustersMap();
}

//Envoie une requête AJAX GET pour récupérer les données des clusters
function afficherClustersMap(){
    ajaxRequest('GET', '/groupe-5-projet-web/backend/php/clusters.php?request=clusters', tracerClustersMap);
}

//Trace les clusters sur une carte avec Plotly
function tracerClustersMap(data){
    const clusterCouleurs = ['red','blue','green','orange','purple','brown'];

    // Regrouper les points par cluster
    let clustersData = {};

    //On boucle sur tous les points
    for (let i = 0; i < data.length; i++) {
        let point = data[i];
        let c = point.cluster;

        //Si le cluster n'existe pas on le créé
        if (!clustersData[c]) {
            clustersData[c] = {
                lats: [],
                lons: [],
                hover_texte: [],
                couleur: clusterCouleurs[c % clusterCouleurs.length]
            };
        }

        //On ajoute les coordonnées du point dans le bon cluster
        clustersData[c].lats.push(parseFloat(point.lat));
        clustersData[c].lons.push(parseFloat(point.lon));
        clustersData[c].hover_texte.push(
            "MMSI: "+ point.mmsi + 
            "<br>Cluster: " + point.cluster + 
            "<br>Latitude: " + point.lat + 
            "<br>Longitude: " + point.lon);
    }

    // Créer une trace pour chaque cluster
    let traces = [];
    for (let c in clustersData) {
        traces.push({
            type: 'scattermapbox',
            mode: 'markers',
            lat: clustersData[c].lats, //Liste des latitudes
            lon: clustersData[c].lons, //Liste des longitudes
            text: clustersData[c].hover_texte,
            marker: {
                color: clustersData[c].couleur, //Couleur du cluster
                size: 10
            },
            hoverinfo: 'text',
            name: 'Cluster ' + c //Nom sur la légende
        });
    }

    //On centre la carte sur le premier point pour une meilleure visibilité
    let firstPoint = data[0];
    var layout = {
    mapbox: {
        style: "open-street-map",
        center: {
            lat: parseFloat(firstPoint.lat),
            lon: parseFloat(firstPoint.lon)
        },
        zoom: 5
    },
    margin: {t:0, b:0, l:0, r:0}, //aucune marge autour de la carte

    //On paramètre la légende
    legend: {
        title: { text: "Clusters"},
        bgcolor: 'rgba(255, 255, 255, 0.9)', //Fond blanc un peu transparent
        borderwidth: 0,            
        x: 0.01,    // position horizontale (gauche)
        y: 0.99,    // position verticale (en haut)
        orientation: 'v',  //Légende verticale
    }
};

    //Affiche la carte dans l'id map2 sur l'HTML
    Plotly.newPlot('map2', traces, layout);
}

//Exécute le main quand la page est chargée
window.addEventListener('DOMContentLoaded', main) //l'appel se fait une fois la page chargée
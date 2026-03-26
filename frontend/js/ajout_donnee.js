'use strict';

function main(){
    charger_etats();

    const form = document.getElementById('form_bateau');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        envoyerDonnee();
    });
}

//Fonction pour envoyer une requête GET pour avoir la liste des états
function charger_etats(){
    ajaxRequest('GET','../backend/php/api.php?request=etats',afficher_etats);
}

//Fonction pour afficher les états dans le menu déroulant
function afficher_etats(data){
    const select = document.getElementById('etatSelect');
    select.innerHTML = '<option disabled selected>--Etat--</option>';

    for (const etat of data){
        const option= document.createElement('option');
        option.value= etat.id_etat;
        option.textContent= etat.id_etat + ' - ' + etat.libelle;
        select.appendChild(option);
    }
}

//Fonction pour envoyer les données du formulaire
function envoyerDonnee() {
  const form = document.getElementById('form_bateau');

  // Construction manuelle de la chaîne URL
  const params = 
    'mmsi=' + encodeURIComponent(form.mmsi.value) +
    '&nom_bateau=' + encodeURIComponent(form.nom.value) +
    '&longueur=' + encodeURIComponent(form.longueur.value) +
    '&largeur=' + encodeURIComponent(form.largeur.value) +
    '&tirant_eau=' + encodeURIComponent(form.tirant_eau.value) +
    '&horodatage=' + encodeURIComponent(form.horodatage.value) +
    '&latitude=' + encodeURIComponent(form.latitude.value) +
    '&longitude=' + encodeURIComponent(form.longitude.value) +
    '&sog=' + encodeURIComponent(form.sog.value) +
    '&cog=' + encodeURIComponent(form.cog.value) +
    '&heading=' + encodeURIComponent(form.heading.value) +
    '&id_etat=' + encodeURIComponent(form.etatSelect.value);

  ajaxRequest('POST', '../backend/php/api.php?request=donnee', function(response) {
    alert("Donnée ajoutée !");
    form.reset(); //réinitialiser le formulaire
  }, params);
}


main();
# Projet Web - Analyse des Données de Navigation Maritime

Ce projet a pour objectif d'analyser les données AIS (Automatic Identification System)  et de modéliser les comportements de navigation des navires. Cette interface web permet de rendre accessible notre modèle d'intelligence artificielle, en permettant à l'utilisateur de saisir les caractéristiques d'un navire afin d'en prédire le type, visualiser ses clusters de comportement et sa trajectoire sur une carte interactive.

## Membres

Marie EPINAT - Lisa PASSIEUX - Asma RASSIL

## Remarque importante

Ce projet n'est plus fonctionnel en l'état sur un environnement local ou distant, car il dépend de configurations et de bases de données spécifiques à l'ISEN Ouest.  

Le code et les fichiers présents illustrent :
- L'organisation du projet (frontend, backend, base de données)
- Les fonctionnalités développées
- Les scripts Python pour les prédictions
- L'intégration frontend-backend avec PHP/AJAX  

Le but est de montrer les compétences acquises et les travaux réalisés pendant le projet.

## Organisation du projet
```
web_suivi_de_bateaux/
├── frontend/
│ ├── css/
│ ├── js/
│ ├── index.html
│ ├── ajouter.html
│ ├── visualisation.html
│ ├── cluster.html
│ ├── trajectoire.html
│ └── type.html
├── backend/
│ ├── php/
│ └── python/
├── sql/
├── docs/
│   ├── API_Endpoints.pdf
│   └── mcd_navires.pdf
└── README.md
```

## Fonctionnalités

### Visualisation des navires (visualisation.html)
- Tableau listant tous les navires de la base de données (MMSI, position, vitesse, état…)
- Carte interactive Plotly centrée sur les positions enregistrées
- Sélection d'un navire pour déclencher les prédictions

### Ajout d'un navire (ajouter.html)
- Formulaire de saisie des caractéristiques du navire (MMSI, nom, dimensions)
- Saisie des données de navigation (latitude, longitude, SOG, COG, heading)
- Sélection de l'état AIS parmi les 16 statuts officiels

### Prédiction du type de navire (type.html)
- Entrée : longueur, largeur, tirant d'eau, heading
- Modèle : classificateur entraîné sur les données AIS
- Sortie : type prédit du navire

### Prédiction des clusters (cluster.html)
- Entrée : ensemble des navires de la base
- Modèle : KMeans (k=6) avec normalisation StandardScaler
- Sortie : carte Plotly avec les navires colorés par cluster de comportement

### Prédiction de trajectoire (trajectoire.html)
- Entrée : SOG, COG, heading, latitude, longitude
- Modèle : Random Forest — prédit un delta de position à 15 minutes
- Sortie : carte avec position actuelle (bleu) et position prédite (rouge)

## Technologies

- Frontend : HTML5, CSS3, JavaScript, Plotly.js, Leaflet.js
- Backend : PHP
- Base de données : MySQL
- IA : Python, scikit-learn (KMeans, Random Forest, classificateur), pandas, joblib

## Modèle Conceptuel des Données (MCD)

![MCD des navires](docs/mcd_navires.pdf)

## API / Endpoints

Le backend expose plusieurs endpoints pour gérer les navires et effectuer les prédictions.

| Fonctionnalité                | Méthode | URL PHP                                      | Données envoyées                           | Réponse JSON                    |
|-------------------------------|--------|-----------------------------------------------|--------------------------------------------|---------------------------------|
| Lister tous les bateaux       | GET    | ../backend/php/api.php?request=cars           | -                                          |Liste des bateaux `{mmsi:..., nom:...}`|
| Lister toutes les données AIS | GET    | ../backend/php/api.php?request=données        | -                                          | Positions, vitesses, etc.       |
| Ajouter un bateau + données   | POST   | ../backend/php/api.php?request=donnee         | MMSI, nom, longueur, largeur, tirant d'eau | true / false                    |
| Récupérer les états           | GET    | ../backend/php/api.php?request=etats          | -                                          | `{id_etat:..., libelle:...}`    |
| Prédiction clusters           | GET    | ../backend/php/clusters.php?request=clusters  | -                                          | `{clusters:[...]}`              |
| Prédiction type               | POST   | ../backend/php/prediction_type.php            | Données du navire                          | `{prediction:...}`              |
| Prédiction trajectoire        | POST   | ../backend/php/prediction_trajectoire.php     | Données du navire                          | `{sog:..., cog:..., heading:..., lat:..., lon:...}` |

La liste complète des endpoints du backend est disponible dans [docs/API_Endpoints.pdf](docs/API_Endpoints.pdf)

## Répartition du travail

- **Marie EPINAT** : MCD et scripts SQL, interface client-serveur PHP/AJAX,  affichage des états, carte de visualisation (F4), ajout de bateaux en base
- **Asma RASSIL** : Maquette, HTML/CSS de la page visualisation, tableau des navires (F3), HTML/JS de la prédiction de trajectoire (F5)
- **Lisa PASSIEUX** : Maquette, page d'ajout (F1), HTML de la prédiction de type, JS de la prédiction de type (F5), scripts Python de prédiction, CSS final

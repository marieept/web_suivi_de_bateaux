# predict_position.py

import argparse
import joblib
import numpy as np
import os
import sys
from sklearn.preprocessing import StandardScaler

def check_arguments():
    parser = argparse.ArgumentParser()
    parser.add_argument('--sog', type=float)
    parser.add_argument('--cog', type=float)
    parser.add_argument('--heading', type=float)
    parser.add_argument('--latitude', type=float)
    parser.add_argument('--longitude', type=float)
    return parser.parse_args()

#Fonction pour transformer les données brutes en features exploitables par le modèle 
def prepare_features(sog, cog, heading, minutes):
    cog_sin = np.sin(np.deg2rad(cog))
    cog_cos = np.cos(np.deg2rad(cog))
    heading_sin = np.sin(np.deg2rad(heading))
    heading_cos = np.cos(np.deg2rad(heading))
    return np.array([[sog, cog_sin, cog_cos, heading_sin, heading_cos, minutes]])
# Fonction pour charger le modèle correspondant à l'horizon du temps demandé 
def load_model(minutes, modele):
    nom_fichier = f"../python/pkl/{modele}_{minutes}min.pkl"
    if not os.path.exists(nom_fichier):
        print(f"Erreur : Modèle {nom_fichier} introuvable.")
        sys.exit(1)
    return joblib.load(nom_fichier)

def main():
    # Récupération des arguments passées depuis le script PHP 
    args = check_arguments()
    #Cofiguration : on fixe ici l'horizon de prédiction à 15 minutes 
    minutes=15
    modele = 'ranfor'

    # Chargement du modèle 
    model = load_model(minutes, modele)
    # Transformation des données d'entrées en features compatibles avec le modèle 
    features = prepare_features(args.sog, args.cog, args.heading, minutes)
    #Prédictinon du déplacement (delta latitude/ delta longitude)
    prediction = model.predict(features)
    #Ajout de delta à la position actuelle pour obtenir la position future 
    delta_lat = prediction[0, 0]
    delta_lon = prediction[0, 1]
    lat_pred = args.latitude + delta_lat
    lon_pred = args.longitude + delta_lon
    import os
    os.system('cls||clear')
    
    #Affichage du résultat sous format JSON pour le script PHP 
    import json
    print(json.dumps({
        "latitude_predite": lat_pred,
        "longitude_predite": lon_pred
    }))

if __name__ == "__main__":
    main()

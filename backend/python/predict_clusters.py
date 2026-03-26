import sys
import argparse #pour les arguments en ligne de commande
import pandas as pd
import pickle #pour charger les pkl
import json

#On définit qu'on veut des arguments en ligne de commande
parser = argparse.ArgumentParser()

#On définit cet argument obligatoire
parser.add_argument("--data", required=True)

#On récupère les valeurs passées à --data
args = parser.parse_args()

#On ouvre le fichier qui contient le scaler
with open("../python/pkl/scaler_kmeans.pkl", "rb") as f:
    scaler = pickle.load(f)

#On ouvre le fichier qui contient le modèle
with open("../python/pkl/kmeans_k6.pkl", "rb") as f:
    kmeans = pickle.load(f)

#On transforme la chaine JSON en liste python
data_list = json.loads(args.data)

#On crée un dataframe
df = pd.DataFrame(data_list)

#On renomme les colonnes pour correspondre au modèle
df.rename(columns={
    'sog': 'SOG',
    'cog': 'COG', 
    'heading': 'Heading'
}, inplace=True)

#On sélectionne les colonnes dont on a besoin
data = df[['SOG', 'COG', 'Heading']]

#On normalise les données à l'aide de notre scaler
data_scaled = scaler.transform(data)

#On prédit les clusters avec le modèle KMeans
clusters = kmeans.predict(data_scaled)

#On ajoute la colonne cluster
df['cluster'] = clusters

output = [{"cluster": int(c)} for c in clusters]
#[{"cluster": 0}, {"cluster": 1}, {"cluster": 2}, {"cluster": 0}, {"cluster": 1}]

print(json.dumps(output))#re transforme en json

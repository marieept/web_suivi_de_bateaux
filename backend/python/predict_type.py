import sys
import argparse #pour les arguments en ligne de commande
import pandas as pd
import joblib #pour charger les pkl
import json

#On définit qu'on veut des arguments en ligne de commande
parser = argparse.ArgumentParser()

#On définit cet argument
parser.add_argument("--data")

#On récupère les valeurs passés à --data
args = parser.parse_args()

#On ouvre le fichier qui contient le scaler
scaler = joblib.load("../python/pkl/scaler.pkl")

#On ouvre le fichier qui contient le modèle
model = joblib.load("../python/pkl/model.pkl")

#On transforme la chaine JSON en liste python
data_list = json.loads(args.data)

#On crée un dataframe
df = pd.DataFrame(data_list)

#On renomme les colonnes pour correspondre au modèle
df.rename(columns={
    'draft': 'Draft',
    'heading': 'Heading',
    'length': 'Length',
    'width': 'Width'
}, inplace=True)

#On sélectionne les colonnes dont on a besoin
data = df[['Draft', 'Heading', 'Length', 'Width']]

# Reorder les colonnes pour être comme celles du scaler
data = data[scaler.feature_names_in_]

#On normalise les données à l'aide de notre scaler
data_scaled = scaler.transform(data)

#On prédit les clusters avec le modèle KMeans
predictions = model.predict(data_scaled)

output = {
    "predictions": [
        {
            "type": int(p),
        }
        for p in predictions
    ]
}

print(json.dumps(output))

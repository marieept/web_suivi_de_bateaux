#------------------------------------------------------------
#        Script MySQL.
#------------------------------------------------------------


#------------------------------------------------------------
# Table: Bateau
#------------------------------------------------------------

CREATE TABLE Bateau(
        MMSI       Int NOT NULL COMMENT "Identifiant unique du navire (MMSI = Maritime Mobile Service Identity)"  ,
        nom_bateau Varchar (100) NOT NULL COMMENT "Nom du bateau"  ,
        longueur   Float NOT NULL COMMENT "Longueur du navire (en m)"  ,
        largeur    Float NOT NULL COMMENT "Largeur du bateau (en m)"  ,
        tirant_eau Float NOT NULL COMMENT "Profondeur maximale immergée du navire (m)" 
	,CONSTRAINT Bateau_PK PRIMARY KEY (MMSI)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Etat
#------------------------------------------------------------

CREATE TABLE Etat(
        id_etat Int  Auto_increment  NOT NULL COMMENT "Identifiant unique de l’état"  ,
        libelle Varchar (50) NOT NULL COMMENT "Description de l’état" 
	,CONSTRAINT Etat_AK UNIQUE (libelle)
	,CONSTRAINT Etat_PK PRIMARY KEY (id_etat)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: Donnée
#------------------------------------------------------------

CREATE TABLE Donnee(
        id_donnee  Int  Auto_increment  NOT NULL COMMENT "Identifiant unique de la donnée"  ,
        horodatage Datetime NOT NULL COMMENT "Date et heure de la mesure"  ,
        latitude   Float NOT NULL COMMENT "Latitude GPS"  ,
        longitude  Float NOT NULL COMMENT "Longitude GPS"  ,
        sog        Float NOT NULL COMMENT "Speed Over Ground (vitesse sur le fond)"  ,
        cog        Float NOT NULL COMMENT "Course Over Ground (cap sur le fond)"  ,
        heading    Float NOT NULL COMMENT "Cap réel du navire"  ,
        MMSI       Int NOT NULL COMMENT "Identifiant unique du navire (MMSI = Maritime Mobile Service Identity)"  ,
        id_etat    Int NOT NULL COMMENT "Identifiant unique de l’état" 
	,CONSTRAINT Donnee_PK PRIMARY KEY (id_donnee)

	,CONSTRAINT Donnee_Bateau_FK FOREIGN KEY (MMSI) REFERENCES Bateau(MMSI)
	,CONSTRAINT Donnee_Etat0_FK FOREIGN KEY (id_etat) REFERENCES Etat(id_etat)
)ENGINE=InnoDB;












# V2

# REFACTOR MAJEUR – ARCHITECTURE MULTI-SYSTÈMES ET FUTURE MIGRATION

Nous sommes en pleine migration d'infrastructure.

L'architecture doit être pensée pour supporter simultanément les anciens et nouveaux systèmes.

---

# SYSTÈMES ACTUELS

Legacy :

* ATLAS
* ISIS

Futurs systèmes :

* PADME (remplacera ATLAS)
* LEIA (remplacera ISIS)

Pendant plusieurs années, les quatre systèmes pourront cohabiter.

Il est donc interdit de considérer qu'un nom de job est unique.

---

# MODÈLE DE DONNÉES

Ajouter :

```ts
system: string
```

Valeurs possibles :

```text
ATLAS
ISIS
PADME
LEIA
```

Exemple :

```ts
{
    system: "ATLAS",
    monitor: "$ZBAT",
    job_name: "OAPUHPRO"
}
```

---

# CLÉ UNIQUE

Ne plus utiliser :

```text
job_name
```

ou :

```text
monitor + job_name
```

La clé unique devient :

```text
system + monitor + job_name
```

Exemples :

ATLAS.$ZBAT.OAPUHPRO

PADME.$ZBAT.OAPUHPRO

ISIS.$ZBAT.OAPUHPRO

LEIA.$ZBAT.OAPUHPRO

Ces quatre jobs doivent pouvoir coexister.

---

# INDEX

Mettre à jour :

jobs.json

name_index.json

number_index.json

pour intégrer le système.

Les recherches par nom doivent pouvoir retourner plusieurs résultats.

Exemple :

Recherche :

OAPUHPRO

Résultats :

ATLAS / $ZBAP / OAPUHPRO

PADME / $ZBAP / OAPUHPRO

ISIS / $ZBAP / OAPUHPRO

LEIA / $ZBAP / OAPUHPRO

---

# EXPLORER

Ajouter un filtre :

Système

☑ ATLAS

☑ PADME

☑ ISIS

☑ LEIA

Afficher le système sur chaque carte.

Exemple :

PADME • $ZBAP

OAPUHPRO

User 22,22

---

# GENERATOR

Le chargement d'un modèle doit utiliser :

system + monitor + job_name

et non plus seulement le nom.

Si plusieurs jobs portent le même nom :

afficher une liste :

ATLAS / $ZBAP / OAPUHPRO

PADME / $ZBAP / OAPUHPRO

ISIS / $ZBAP / OAPUHPRO

LEIA / $ZBAP / OAPUHPRO

---

# BOUTON "UTILISER COMME MODÈLE"

Depuis Explorer :

Transmettre :

system

monitor

job_name

pour charger exactement le bon modèle.

---

# DATABASE

Ajouter le champ :

System

dans :

* recherche
* création
* édition
* suppression

---

# AUDIT

Filtres supplémentaires :

System

Monitor

User

Description

Executor

EVERY

WAITON

AFTER

Export CSV avec la colonne :

System

---

# OBJECTIF

Préparer NetBatch Helper à la coexistence :

ATLAS → PADME

ISIS → LEIA

sans avoir à refaire l'architecture plus tard.

Le système doit être pensé dès maintenant comme une plateforme multi-systèmes.


---

# V3

Migration JSON → SQLite

Puis :

API locale

Puis :

authentification

Puis :

multi-utilisateurs.

Priorité : FUTUR

integration des données de netbatch depuis les resultats des commandes info *, obey-form corréllées au resultat de la commande status job * sur chaque moniteur

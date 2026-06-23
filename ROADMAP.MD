# ROADMAP / TODO – NetBatch Helper

## BUG BLOQUANT

### Erreur de build

Le fichier :

lib/next-run.ts

importe :

```ts
import { CronExpressionParser } from "cron-parser";
```

mais le module n'est pas installé ou ses types ne sont pas disponibles.

Objectif :

* Corriger l'erreur de build.
* Vérifier la version compatible de cron-parser.
* Installer correctement la dépendance.
* Ou supprimer cette dépendance et utiliser une implémentation interne plus simple.

Priorité : CRITIQUE

---

# GENERATOR

## Conservation du modèle complet

Actuellement le Generator reconstruit un OBEY minimal.

Comportement attendu :

* Charger tous les paramètres du modèle.

* Modifier uniquement :

  * Job Name
  * Volume
  * Script IN
  * Output
  * Executor
  * Hold
  * Stop On Abend
  * ChangeUser
  * EVERY
  * WAITON
  * AFTER

* Tous les autres paramètres doivent être conservés automatiquement.

Le Generator doit fonctionner comme :

Clone du modèle + modifications.

Priorité : HAUTE

---

## Bouton "Utiliser comme modèle"

Depuis l'Explorer :

Ajouter un bouton :

"Utiliser comme modèle"

Action :

Ouvrir :

/generator

avec le job sélectionné préchargé.

Exemple :

Explorer → OAPAE0

Cliquer :

Utiliser comme modèle

Le Generator charge automatiquement OAPAE0.

Priorité : HAUTE

---

## Gestion complète des dépendances

Conserver :

WAITON

AFTER

dans le modèle.

Permettre :

* ajout
* suppression
* édition

Priorité : HAUTE

---

## Génération dynamique de l'OBEY

Supprimer la construction statique :

SET VOLUME ...
SET IN ...
SET OUT ...

Créer l'OBEY à partir de l'ensemble des paramètres présents dans le job.

Priorité : HAUTE

---

# OUTIL ADMINISTRATION BASE

Créer une section :

/admin

ou

/database

avec :

## Recherche

Recherche par :

* nom
* numéro
* monitor
* utilisateur

---

## Modification d'un job

Permettre :

* édition des paramètres
* édition de l'OBEY
* modification du numéro
* modification du monitor

Sauvegarde automatique :

jobs.json

name_index.json

number_index.json

sans réimport.

Priorité : HAUTE

---

## Suppression d'un job

Bouton :

Supprimer

Avec confirmation.

Mettre à jour :

* jobs.json
* name_index.json
* number_index.json

Priorité : HAUTE

---

## Ajout d'un job

Importer :

* un OBEY
  ou
* un job existant

NUmero du job doit etre demandé obligatoirement.


---

# OUTIL AUDIT

Créer :

/audit

Objectif :

Lister tous les jobs.

Filtres :

* monitor
* user
* description
* script
* executor
* EVERY
* présence WAITON
* présence AFTER

Recherche texte libre.

Résultats :

tableau paginé.

Colonnes :

* numéro
* nom
* monitor
* user
* description
* script
* executor
* EVERY

Export :

CSV

Priorité : HAUTE

---

# NEXT RUN

Afficher :

Prochaine exécution

dans :

Explorer

et

Generator.

Compatible avec la syntaxe Batchcom :

* listes
* plages 1-5
* plages horaires 8-11,13-19,21
* mois multiples
* jours multiples

Ne pas utiliser de syntaxe cron incompatible.

Priorité : MOYENNE

---

# V2

Statistiques :

* nombre de jobs
* nombre par monitor
* nombre par user
* répartition des horaires
* jobs orphelins

Graphiques :

* jobs par monitor
* jobs par utilisateur

Export CSV

Priorité : BASSE

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

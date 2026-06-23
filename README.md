# NetBatch Helper 🚀

**NetBatch Helper** est une application web moderne développée avec **Next.js 16 (App Router)** destinée à faciliter l'exploration, la gestion et la génération de fichiers OBEY pour les planifications **HP NonStop NetBatch**.

L'application prend en charge une architecture multi-systèmes permettant la transition fluide entre les infrastructures actuelles et futures.

---

## 🌟 Fonctionnalités Clés

* 🖥️ **Multi-Systèmes** : Cohabitation transparente des environnements legacy (**ATLAS**, **ISIS**) et cibles (**PADME**, **LEIA**).
* 🔍 **Recherche Avancée** : Moteur de recherche performant indexé par numéro de job, nom exact, machine (système) ou moniteur, avec recherche full-text sur les configurations.
* ⚙️ **Générateur d'OBEY** : Interface interactive permettant de modifier les paramètres d'un job (volume, entrées/sorties, utilisateurs, dépendances) et d'exporter un fichier d'obéissance valide.
* 📊 **Audit & Suivi** : Visualisation globale et filtres multicritères sur l'ensemble du parc de jobs.
* 🔗 **Visualisation des Dépendances** : Représentation visuelle des liens `WAITON` et `AFTER`.
* 🛡️ **Sécurité Renforcée** :
  * Authentification des sessions gérée par cookies sécurisés `HTTP-Only` (signés via clé secrète).
  * Base de données métier décentralisée sous **SQLite / Turso** via l'ORM **Drizzle**, éliminant tout stockage de données en clair dans le dépôt Git.

---

## 🛠️ Stack Technique

* **Framework** : [Next.js 16 (App Router)](https://nextjs.org/)
* **Langage** : [TypeScript](https://www.typescriptlang.org/)
* **Base de Données** : [Turso / SQLite](https://turso.tech/)
* **ORM** : [Drizzle ORM](https://orm.drizzle.team/)
* **Styling** : Vanilla CSS / TailwindCSS
* **Composants UI** : Radix UI & Lucide Icons

---

## ⚙️ Configuration & Installation

### 1. Prérequis

Assurez-vous d'avoir installé [Node.js](https://nodejs.org/) (version 18+ recommandée) et `npm`.

### 2. Cloner le projet et installer les dépendances

```bash
git clone <url-du-depot>
cd netbatch-helper
npm install
```

### 3. Variables d'Environnement

Créez un fichier `.env` ou `.env.local` à la racine du projet en vous basant sur le fichier `.env.example` :

```env
# URL de connexion à la base de données Turso ou SQLite locale
TURSO_DATABASE_URL=file:netbatch.db
TURSO_AUTH_TOKEN=

# Secret utilisé pour signer les cookies de session
SESSION_SECRET=votre_secret_de_session_tres_complexe



## 🗄️ Initialisation de la Base de Données

Le projet utilise Drizzle Kit pour gérer le schéma de la base de données.

### 1. Pousser le schéma sur la base locale / distante

Cette commande applique la structure définie dans `./database/schema.ts` à la base de données cible :

```bash
npx drizzle-kit push
```

### 2. Migrer les anciennes données JSON (Une seule fois)

Si vous disposez d'un historique au format JSON, vous pouvez le charger dans la base de données en exécutant le script d'importation :

```bash
npx tsx scripts/migrate.ts
```

---

## 🚀 Lancement de l'Application

### En mode Développement

Lancez le serveur de développement local :

```bash
npm run dev
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000).

### En mode Production

Compilez l'application puis lancez le serveur optimisé :

```bash
npm run build
npm run start
```

---

## 📂 Structure du Projet

```text
├── app/                  # Routes Next.js App Router (Pages & API)
│   ├── api/              # Endpoints API (jobs, auth, sessions)
│   └── explorer/ ...     # Pages de l'application
├── components/           # Composants React partagés (UI, Contextes)
├── database/             # Schémas de base de données et migrations
├── lib/                  # Services, utilitaires et accès aux données (DAL)
├── scripts/              # Scripts utilitaires et migrations de données
├── proxy.ts              # Proxy Next.js (sécurité, authentification globale)
├── drizzle.config.ts     # Configuration de Drizzle Kit
└── package.json          # Dépendances et scripts de l'application
```

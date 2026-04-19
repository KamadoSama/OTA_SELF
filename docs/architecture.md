# Architecture de la Plateforme OTA Self-Hosted

## 1. Vue d'Ensemble
L'objectif est de remplacer le service payant "EAS Update" d'Expo par une infrastructure complète, gratuite et sous votre contrôle total. Le système vous permettra d'héberger vos propres fichiers de mise à jour (Over-The-Air) et de les distribuer à vos applications React Native / Expo, tout en ayant un tableau de bord professionnel pour gérer l'ensemble.

## 2. L'Infrastructure Technique (Docker & Cloud-Ready)
Tout sera conteneurisé avec **Docker** et orchestré via **Docker Compose** pour un déploiement ultra simple sur n'importe quel VPS.

*   **Serveur de Stockage : MinIO**
    *   Le standard de l'industrie pour le stockage objet auto-hébergé (compatible S3).
    *   **Rôle** : Stocker vos "bundles" Expo compilés (les fichiers JavaScript `.js`) ainsi que tous vos assets (images, polices, etc.).
*   **Base de Données : PostgreSQL**
    *   Base relationnelle robuste et performante.
    *   **Rôle** : Sauvegarder les informations sur vos applications, les branches/canaux (ex: `production`, `staging`), l'historique de toutes les mises à jour, et les comptes administrateurs.

## 3. Le Backend Core (NestJS)
Le cœur du réacteur sera développé en **NestJS**. Il s'occupera d'exposer deux APIs distinctes :

*   **API Protocol Expo Updates (Publique)** : 
    *   L'endpoint que vos applications mobiles appelleront au démarrage.
    *   Analyse la plateforme (iOS/Android) et la version courante (`runtimeVersion`).
    *   Sert dynamiquement un manifeste JSON (`expo-updates protocol`) signé cryptographiquement. Ce manifeste contient les liens vers les bundles .js situés sur l'instance MinIO.
*   **API d'Administration (Privée & Sécurisée par JWT)** : 
    *   Expose les endpoints pour le Dashboard (Création de projet, upload d'une release exportée en local, annulation d'une version, etc.).
    *   Communique avec MinIO de façon sécurisée (via le SDK AWS S3).

## 4. Le Dashboard d'Administration (Next.js)
Nous allons concevoir un tableau de bord très propre, professionnel et optimisé.

*   **Technologies** : Next.js (App Router), Tailwind CSS, Shadcn UI, Recharts.
*   **Style UX/UI** : Pattern *"Data-Dense Dashboard"* (fonds sombres `#0F172A`, fort contraste, interface très "technique" et code-oriented avec typographie Fira Code). Recommandation issue de `ui-ux-pro-max`.
*   **Fonctionnalités clés** :
    *   Vue condensée des applications avec métriques clés.
    *   Tableaux clairs listant l'historique des releases.
    *   Indicateurs de succès/erreurs (rollback rapide d'un simple clic).
    *   Statistiques du nombre de téléchargements par les utilisateurs actifs.

## 5. Le Workflow d'Utilisation
1.  **Développement** : Vous codez votre app React Native sur votre machine.
2.  **Export** : Vous tapez `npx expo export` en local.
3.  **Upload** : Vous zippez le dossier `dist` et vous l'uploadez via votre tout nouveau Dashboard Next.js.
4.  **Distribution** : Le backend NestJS décompresse, enregistre les empreintes sur Postgres, pousse les fichiers sur MinIO, et rend la mise à jour disponible instantanément pour tous vos utilisateurs.

# Sistema Central 2.0

Prototype de redesign pour un nouveau back-office complementaire a Jean Louis David MX.

## Constat

Les captures du systeme actuel montrent un outil utile mais fragmente :

- navigation dupliquee par module
- tables tres plates avec peu de hierarchie visuelle
- beaucoup d'espace vide
- peu de contexte metier au moment de la consultation
- maintenance catalogue, clients, productivite et inventaire separees

Ce depot ne contient pas le backend legacy. La bonne strategie ici est donc de construire une
nouvelle couche d'interface qui peut se brancher progressivement au systeme existant.

## Proposition

Le nouveau systeme est structure en trois couches:

1. UI shell unique
   Sidebar, top search, vues standardisees, actions rapides, permissions.

2. Domaines metier
   - Command center
   - Productividad
   - Clientes 360
   - Catalogos
   - Inventario
   - Sucursales
   - Bitacora / permisos

3. Capa adaptadora
   Un ensemble d'API, requetes SQL ou endpoints legacy normalises vers un modele commun.

## Priorites produit

### 1. Command center

Vue d'entree unique avec:

- revenus du jour
- ticket moyen
- occupation agenda
- alertes stock
- comparatifs entre sucursales

### 2. Productivite

Refaire les ecrans "individual detail" et "concentrada" avec:

- filtres persistants
- tri utile
- vue par collaborateur et par succursale
- actions suggerees
- export clair

### 3. Clients 360

Remplacer les simples listes par une vraie fiche client:

- historique visites
- annulations
- services favoris
- panier moyen
- prochaine action

### 4. Catalogos + inventario

Unifier:

- services
- produits
- classifications
- prix
- existences
- mouvements

## Strategie de migration

### Phase 1

Cartographier les donnees du legacy :

- tables
- noms de colonnes
- ecrans sources
- regles de calcul

### Phase 2

Construire le shell :

- login
- navigation
- recherche globale
- roles
- dashboard executif

### Phase 3

Migrer les domaines les plus critiques :

- productivite
- clients
- catalogos

### Phase 4

Ajouter la couche de controle :

- audit log
- alertes
- approbations
- comparatifs automatiques

## Livrables ajoutes dans ce repo

- `src/pages/sistema-central-2.astro`
  Route de prototype visuel.
- `src/components/system/CentralSystemShell.astro`
  Shell principal du nouveau systeme.
- `src/components/system/SystemIcon.astro`
  Iconographie inline reutilisable.
- `src/data/central-system.ts`
  Donnees de navigation, KPI, alertes, roadmap.

## Usage

```bash
npm install
npm run dev
```

Puis ouvrir:

```text
/sistema-central-2/
```

## Etape suivante recommandee

Brancher ce shell sur de vraies donnees du legacy, module par module, en commencant par:

1. productivite
2. clients
3. catalogos

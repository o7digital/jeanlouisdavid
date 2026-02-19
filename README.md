# Jean Louis David MX - Migration Astro + React

Base de migration du site `https://jeanlouisdavid.com.mx/` vers Astro + React.

## Ce qui est en place

- Clone statique des pages publiques WordPress (snapshot du 19 fevrier 2026).
- Reproduction des routes principales:
  - `/`
  - `/nosotros/`
  - `/sucursales/`
  - `/servicios/`
  - `/contacto/`
  - `/colecciones/`
  - `/privacidad/`
  - 4 articles de collection/blog
- Assets WP servis localement depuis `public/wp-content` et `public/wp-includes`.
- Rendu Astro + composant React client (`src/components/ClientBoot.jsx`).

## Commandes

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Structure utile

- `mirror/`: aspiration brute du site source (reference).
- `src/lib/mirror.ts`: parsing HTML + normalisation des liens WP.
- `src/pages/index.astro` et `src/pages/[...slug].astro`: routes Astro generees.
- `public/wp-content`, `public/wp-includes`: assets statiques locaux.

## Suite prevue

Le e-commerce sera raccorde plus tard a WordPress (headless/API ou integration hybride), sans bloquer cette base de migration front.

# Birthday Cake

## Développement local

```bash
npm install
npm run dev
```

## Build de production

```bash
npm run build
```

## Déploiement sur GitHub Pages

Ce projet est prêt pour GitHub Pages via GitHub Actions.

1. Pousse le dépôt sur GitHub.
2. Dans les réglages du dépôt, active **Pages** et choisis **GitHub Actions** comme source.
3. À chaque push sur `master`, le workflow `.github/workflows/deploy.yml` construit l'app et la publie.

### URL attendue

Le projet est configuré pour être servi depuis :

```text
/birthday-cake/
```

Si le nom du dépôt change, mets aussi à jour `base` dans `vite.config.ts`.


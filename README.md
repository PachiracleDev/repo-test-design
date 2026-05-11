# Pupford Hero Redesign (Astro)

Rediseño técnico de la sección hero de Pupford, construido con Astro + CSS puro + GSAP (entrada y microinteracciones).

## Stack

- Astro `^4.0.0`
- GSAP `^3.12.5`
- CSS puro (custom properties, sin frameworks)
- JavaScript vanilla

## Estructura

```text
/
├── astro.config.mjs
├── package.json
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── BenefitCallout.astro
│   │   └── DiscountBadge.astro
│   ├── styles/
│   │   ├── global.css
│   │   ├── header.css
│   │   └── hero.css
│   ├── scripts/
│   │   ├── hero-animations.js
│   │   └── lenis.js
│   └── pages/
│       └── index.astro
└── README.md
```

## Cómo ejecutar

```bash
npm install
npm run dev
```

## Build de producción

```bash
npm run build
```

## Validación recomendada

- Responsive: `375px`, `768px`, `1280px`, `1920px`
- Sin overflow horizontal
- Sin errores de consola
- `prefers-reduced-motion` respetado
- Lighthouse objetivo:
  - Performance `>= 90`
  - Accessibility `>= 95`
  - Best Practices `>= 95`

## Navegadores probados

- Chrome (última versión estable)
- Edge (última versión estable)
- Firefox (última versión estable)

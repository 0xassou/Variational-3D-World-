# Variational Summit · 3D World

Hall de conférence 3D interactif dédié à **Variational** (Omni & Pro, sur Arbitrum).
Une salle claire et corporate, avec :

- une estrade où trois intervenants sont assis (Lucas Schuermann, l'interviewer et un invité) avec leurs micros ;
- un grand écran qui affiche une bannière HD animée du Summit, ou un extrait YouTube à la demande ;
- 4 stands thématiques et un stand central **Live Metrics & Volume** (tour à 4 écrans, anneau-ticker, sculptures 3D de données) alimenté en direct ;
- un espace networking meublé : salons avec canapés et fauteuils, mange-debout, tables hautes avec tabourets, totems et kakemonos de marque, bacs végétalisés et plantes ;
- un plafond habillé : poutres, ponts lumineux avec projecteurs, halo suspendu, enseignes circulaires au-dessus des stands, suspensions chaleureuses ;
- un café chaleureux (comptoir arrondi bois et marbre, machine à espresso, vitrine, menu ardoise), des toilettes intégrées (bardage bois, portes modernes, signalétique rétroéclairée) et un **Twitter Alpha Wall** avec un totem « Follow & Access » ;
- une foule de PNJ et des hôtes en t-shirt au logo officiel ;
- un avatar contrôlable avec des collisions physiques.

Stack : **Next.js 15 (App Router)**, **React 19**, **Three.js**, **React Three Fiber 9**, **@react-three/drei 10**, **@react-three/rapier 2**, **Tailwind CSS**, **Lucide React** et **Zustand**.

## Démarrage

```bash
npm install
npm run dev        # http://localhost:3000
# ou en production
npm run build && npm start
```

Node.js 18.18 ou plus récent est requis (testé avec Node 22).

## Commandes

| Action | Touches |
| --- | --- |
| Se déplacer | **ZQSD** (AZERTY) / **WASD** (QWERTY) / flèches |
| Courir | **Maj** |
| Caméra | clic gauche maintenu + souris, molette pour zoomer |
| Interagir avec une borne | **E** ou clic sur la borne ou le stand (à moins de 5-6 m) |
| Fermer le pop-up | **Échap**, bouton ✕ ou clic hors du panneau |

Les touches sont lues par position physique (`event.code`), donc ZQSD sur AZERTY et WASD sur QWERTY fonctionnent sans réglage.

## Architecture

```
app/
  layout.tsx            Métadonnées, police, CSS global
  page.tsx              Point d'entrée et rendu de <World />
  globals.css           Tailwind et @font-face Inter (local)
components/
  World.tsx             Charge la 3D côté client uniquement (dynamic, ssr: false), avec le HUD et le Modal
  Experience.tsx        Bloc 1 : Canvas, éclairage doux et ombres, Environment local, monde physique Rapier
  player/
    Player.tsx          Bloc 2 : RigidBody dynamique, CapsuleCollider, déplacements, caméra 3e personne
    Avatar.tsx          Avatar du joueur avec animation de marche procédurale
    useKeyboard.ts      Lecture clavier (ZQSD / WASD / flèches / Maj)
  world/                Bloc 3 : décor
    Hall.tsx            Sol carrelé brillant (MeshReflectorMaterial), murs, plafond lumineux, collisions du hall
    Stage.tsx           Estrade, 3 intervenants assis avec micros, bannière HD animée ou écran YouTube (<Html transform occlude="blending">)
    Stands.tsx          4 stands thématiques, staff en t-shirt Variational avec logo, bornes
    Amenities.tsx       Networking (salons, mange-debout, tables hautes, totems, kakemonos), Twitter Alpha Wall, toilettes, coffee bar
    Decor.tsx           Mobilier réutilisable : plantes, bacs, tabourets, kakemonos, totems, canapés, fauteuils
    Logo.tsx            Plan 3D portant le logo officiel
    brandTextures.ts    Dessin du logo officiel sur canvas (Path2D) : t-shirts, bornes, kakemonos, totems
    Crowd.tsx           Public assis et PNJ debout (InstancedMesh) ; environ 1 PNJ sur 100 animé
    people.tsx          Modèle de personnage low-poly partagé et texture du logo
    Kiosk.tsx           Borne interactive (anneau de proximité, marqueur, clic)
    MetricsStand.tsx    Stand central Live Metrics (écrans canvas live, ticker, barres 3D, anneau RWA)
    metricsTextures.ts  Dessin des écrans du stand Metrics
    CeilingDecor.tsx    Poutres, ponts lumineux, halo, enseignes suspendues, suspensions
    Cafe.tsx            Café : comptoir courbe extrudé, machine à espresso, tables, menu
    Restrooms.tsx       Toilettes : bardage à lames, portes, pictogrammes rétroéclairés
    Interaction.tsx     Détection de proximité, raccourcis E et Échap
  ui/                   Bloc 4 : UI 2D en Tailwind
    Modal.tsx           Pop-up à onglets : Essentiel, Deep Tech, Visuels, Citations & sources
    ModalParts.tsx      Chiffres clés, cartes, schéma, galerie + visionneuse, vidéos, liens sociaux
    MetricsDashboard.tsx Tableau de bord SVG : KPI, historique OI, top marchés, part RWA
    LanguageSwitcher.tsx  Sélecteur FR / EN / KO
    HUD.tsx             Écran d'accueil, invite d'interaction, toasts, aide
    VariationalLogo.tsx Logo officiel en SVG inline pour l'interface 2D
lib/
  content.ts            Bloc 5 : contenu multilingue par stand, tiré de la page Notion
  i18n.ts               Libellés de l'interface (FR / EN / KO)
  layout.ts             Dimensions du hall, positions des stands et des bornes
  brand.ts              Tracés SVG du logo officiel Variational (emblème + wordmark)
  metrics.ts            Chargement et parsing des métriques live (API Variational + DefiLlama)
  metricsSnapshot.ts    Instantané daté utilisé hors ligne / avant le premier chargement
  visuals.ts            Chiffres clés et figures réelles (captures DefiLlama / docs) par stand
  links.ts              Liens sociaux et lien d'accès / d'affiliation à Omni
public/research/        Captures et schémas issus de la page Notion (DefiLlama Research, docs Variational)
  store.ts              État global (Zustand) et position du joueur
public/fonts/           Police Inter (OFL), utilisée par les textes 3D
```

### Points techniques

- **Collisions.** Toutes les collisions passent par Rapier : sol, murs, pilastres, estrade, stands, comptoirs, staff, PNJ debout (un cylindre chacun), rangées du public (un bloc par rangée), mobilier, toilettes et bar. Le joueur est une capsule dynamique dont les rotations sont verrouillées et la friction est nulle, pour glisser le long des murs.
- **Logo.** Les tracés du logo officiel (emblème en vague bleue `#4C9AF8` et wordmark) sont repris du SVG publié sur variational.io et stockés dans `lib/brand.ts`. En 3D, ils sont dessinés sur canvas avec `Path2D`, sans aucun fichier image. Dans l'interface 2D, ils sont rendus en SVG inline.
- **Bannière de scène.** Par défaut, l'écran affiche une bannière 1920×1080 dessinée sur canvas et rafraîchie environ 10 fois par seconde : pastille LIVE, horloge, vignette « Up next » qui fait défiler les extraits avec une barre de progression, vagues animées. Elle ne dépend d'aucun réseau.
- **Écran de scène (vidéo).** Quand on choisit « Diffuser sur l'écran » dans un pop-up, l'iframe YouTube (`youtube-nocookie.com/embed/…?start=…&end=…`) est rendue avec `Html transform occlude="blending"`, donc les objets 3D situés devant l'écran le masquent correctement. Sa taille est calculée pour que 1280 px correspondent exactement à la largeur de l'écran (18 m). La lecture est automatique et muette (règle des navigateurs). « Arrêter » ramène la bannière. Pour le son, on passe par « Regarder ici » dans le pop-up.
- **Foule.** Les PNJ statiques sont dessinés avec un `InstancedMesh` par partie du corps, soit environ 7 draw calls par pose. Les PNJ animés (1 sur 100) et le staff sont des objets individuels.
- **Hors ligne.** Aucun asset n'est téléchargé à l'exécution : pas de HDR (l'environnement est fait de `Lightformer`), les polices sont locales et le logo et le carrelage sont générés sur canvas. Seules les vidéos YouTube et les liens externes ont besoin d'Internet.

## Métriques en direct

Le stand Live Metrics et son pop-up interrogent au chargement, puis toutes les 60 s :

- `https://omni-client-api.prod.ap-northeast-1.variational.io/metadata/stats` (API publique Variational) : volume 24h, volume cumulé, TVL, open interest, nombre de marchés et volume par marché ;
- `https://api.llama.fi/summary/open-interest/variational` (DefiLlama) : historique de l'open interest.

Si ces API ne répondent pas, l'interface affiche l'instantané daté de `lib/metricsSnapshot.ts` avec un badge « Instantané ». La répartition RWA / crypto repose sur une heuristique appliquée au nom du marché ; elle est donnée à titre indicatif.

## Liens sociaux et affiliation

Ils se configurent dans `lib/links.ts` :

- `VARIATIONAL_X` : le compte officiel `@variational_io`, celui que lie variational.io.
- `CEO_URL` : aucun compte X personnel de Lucas Schuermann n'est lié depuis ses pages officielles. Le lien pointe donc par défaut vers son site, lucasschuermann.com. Remplace-le par l'URL de son compte X une fois que tu l'as vérifiée.
- `REFERRAL_CODE` : ton code de parrainage Omni. Une fois renseigné, le bouton « Accéder à Omni » devient un lien d'affiliation (`?ref=CODE`).

## Contenu

Tout le contenu vient de la page Notion « Variationnal 3D World ». Cette page précise que les citations, chiffres et liens proviennent d'une recherche **non vérifiée**. L'interface le signale donc :

- chaque citation porte un badge « à recouper » ;
- les points listés « À vérifier avant affichage » dans le Notion (airdrop d'environ 32 %, fin des points, date du ticker VAR, lancement de Pro en 2027, timestamps) sont regroupés dans un encadré d'avertissement ;
- un pied de page indique qu'il ne s'agit **pas d'un conseil financier**.

Pour modifier ou traduire un texte, tout se trouve dans `lib/content.ts`. Chaque champ existe en `fr`, `en` et `ko`.

## Limites connues

- Les déplacements se font au clavier ; les contrôles tactiles sur mobile ne sont pas pris en charge.
- Le sol réfléchissant et les ombres douces demandent un GPU. Sur une machine modeste, on peut baisser `resolution` du `MeshReflectorMaterial` dans `components/world/Hall.tsx` ou `shadow-mapSize` dans `components/Experience.tsx`.

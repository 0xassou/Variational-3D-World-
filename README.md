# Variational Summit · 3D World

Hall de conférence 3D interactif dédié à **Variational** (Omni & Pro, sur Arbitrum).
Une salle claire et corporate, avec une estrade et un écran YouTube, 4 stands thématiques, un espace networking, un coffee bar, des toilettes, un **Twitter Alpha Wall**, une foule de PNJ, des hôtes en t-shirt Variational et un avatar contrôlable avec des collisions physiques.

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
    Stage.tsx           Estrade, fauteuils, micros, pupitre, écran YouTube (<Html transform occlude="blending">)
    Stands.tsx          4 stands thématiques, staff en t-shirt Variational avec logo, bornes
    Amenities.tsx       Networking, lounges, Twitter Alpha Wall, toilettes, coffee bar
    Crowd.tsx           Public assis et PNJ debout (InstancedMesh) ; environ 1 PNJ sur 100 animé
    people.tsx          Modèle de personnage low-poly partagé et texture du logo
    Kiosk.tsx           Borne interactive (anneau de proximité, marqueur, clic)
    Interaction.tsx     Détection de proximité, raccourcis E et Échap
  ui/                   Bloc 4 : UI 2D en Tailwind
    Modal.tsx           Pop-up : débutants, Deep Tech / Alpha, schéma, tableau, citations, vidéos, sources
    LanguageSwitcher.tsx  Sélecteur FR / EN / KO
    HUD.tsx             Écran d'accueil, invite d'interaction, toasts, aide
lib/
  content.ts            Bloc 5 : contenu multilingue par stand, tiré de la page Notion
  i18n.ts               Libellés de l'interface (FR / EN / KO)
  layout.ts             Dimensions du hall, positions des stands et des bornes
  store.ts              État global (Zustand) et position du joueur
public/fonts/           Police Inter (OFL), utilisée par les textes 3D
```

### Points techniques

- **Collisions.** Toutes les collisions passent par Rapier : sol, murs, pilastres, estrade, stands, comptoirs, staff, PNJ debout (un cylindre chacun), rangées du public (un bloc par rangée), mobilier, toilettes et bar. Le joueur est une capsule dynamique dont les rotations sont verrouillées et la friction est nulle, pour glisser le long des murs.
- **Écran de scène.** L'iframe YouTube (`youtube-nocookie.com/embed/…?start=…&end=…`) est rendue avec `Html transform occlude="blending"`, donc les objets 3D situés devant l'écran le masquent correctement. Sa taille est calculée pour que 1280 px correspondent exactement à la largeur de l'écran (18 m). La lecture est automatique et muette (règle des navigateurs). Pour le son, on passe par « Regarder ici » dans le pop-up.
- **Foule.** Les PNJ statiques sont dessinés avec un `InstancedMesh` par partie du corps, soit environ 7 draw calls par pose. Les PNJ animés (1 sur 100) et le staff sont des objets individuels.
- **Hors ligne.** Aucun asset n'est téléchargé à l'exécution : pas de HDR (l'environnement est fait de `Lightformer`), les polices sont locales et le logo et le carrelage sont générés sur canvas. Seules les vidéos YouTube et les liens externes ont besoin d'Internet.

## Contenu

Tout le contenu vient de la page Notion « Variationnal 3D World ». Cette page précise que les citations, chiffres et liens proviennent d'une recherche **non vérifiée**. L'interface le signale donc :

- chaque citation porte un badge « à recouper » ;
- les points listés « À vérifier avant affichage » dans le Notion (airdrop d'environ 32 %, fin des points, date du ticker VAR, lancement de Pro en 2027, timestamps) sont regroupés dans un encadré d'avertissement ;
- un pied de page indique qu'il ne s'agit **pas d'un conseil financier**.

Pour modifier ou traduire un texte, tout se trouve dans `lib/content.ts`. Chaque champ existe en `fr`, `en` et `ko`.

## Limites connues

- Les déplacements se font au clavier ; les contrôles tactiles sur mobile ne sont pas pris en charge.
- Le sol réfléchissant et les ombres douces demandent un GPU. Sur une machine modeste, on peut baisser `resolution` du `MeshReflectorMaterial` dans `components/world/Hall.tsx` ou `shadow-mapSize` dans `components/Experience.tsx`.

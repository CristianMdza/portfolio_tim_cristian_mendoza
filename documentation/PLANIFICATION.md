# *Planification du portfolio* 

## *Les 4 choix technologiques*

### *1. Gestion des données* 
- **Choix retenu :** Fichier JSON local.
- **Justification :** J'ai choisi le fichier JSON parce qu'on l'a appris dans nos cours de web et que c'est la façon la plus simple d'isoler mes projets du code HTML. C'est rapide, fiable et amplement suffisant pour mon portfolio.

### *2. Animations* 
- **Choix retenu :** CSS pur et Anime.js.
- **Justification :** Je choisis le CSS pur pour les petites animations simples comme le survol des boutons parce que c'est très léger. Pour les animations plus poussées (comme l'apparition des éléments au scroll), j'utilise Anime.js. Vu qu'on a déjà utilisé ces deux outils dans nos cours de Web 2 et Web 3, je suis à l'aise avec leur fonctionnement et je n'ai pas besoin d'apprendre une nouvelle librairie.

### *3. Structure de navigation* 
- **Choix retenu :** Multipages avec paramètre d'URL, sinon l'option One-pager avec pop-up.
- **Justification :** Mon premier choix est le système multipages avec paramètre d'URL. Quand on clique sur un projet, ça ouvre une nouvelle page complète avec toutes les photos et la description détaillée, ce qui évite de tout surcharger sur la page d'accueil. Par contre, si je réalise que c'est trop lourd de naviguer de page en page, je basculerai sur un système de One-pager où le projet s'ouvre directement dans un pop-up.

### *4. Hébergement* 
- **Choix retenu :** GitHub Pages.
- **Justification :** C'est l'option la plus recommandée et la plus logique puisque mon projet est déjà sur un dépôt GitHub. L'hébergement est totalement gratuit, facile à mettre en place et mon site se mettra à jour automatiquement à chaque fois que je pousserai mon code.

## *Planification des animations*

### *Animation 1 : Boutons et éléments interactifs*
- **Élément à animer :** Les boutons de navigation (header) et les boutons d'action (ex. "Mes projets", "Télécharger mon CV", "Me contacter").
- **Type d'animation :** Changement de couleur de fond et léger effet de zoom (scale) au survol, suivi d'un changement de couleur plus sombre à l'enfoncement (click/pressed).
- **Déclencheur :** Survol (hover) et clic (active/pressed).

### *Animation 2 : Éléments de la section "À propos"*
- **Élément à animer :** Le texte (titres et paragraphes), la photo de profil et les barres de progression des compétences.
- **Type d'animation :** Fondu et glissement depuis la gauche pour le texte, fondu simple pour la photo de profil, suivi du remplissage animé et séquentiel des barres de progression une après l'autre.
- **Déclencheur :** Apparition au défilement (scroll).

### *Animation 3 : Cartes de la section "Mes projets"*
- **Élément à animer :** Les cartes de présentation des projets.
- **Type d'animation :** Fondu d'apparition (opacity) combiné à un déplacement latéral (la carte de gauche arrive depuis la gauche, la carte de droite depuis la droite) avec un temps de décalage (stagger) entre chaque carte.
- **Déclencheur :** Apparition au défilement (scroll).

### *Animation 4 : Carrousel des logiciels maîtrisés*
- **Élément à animer :** La bande d'icônes des logiciels (After Effects, Maya, Photoshop, Figma, Illustrator, Unity, etc.).
- **Type d'animation :** Défilement horizontal continu et automatique (en boucle infinie) sans flèches de navigation.
- **Déclencheur :** Chargement de la page (automatique / en continu).
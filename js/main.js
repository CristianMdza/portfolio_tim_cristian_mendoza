// Importation des fonctions nécessaires pour charger les projets, créer les cartes de projet et initialiser la pop-up de projet.
import { chargerProjets } from "./data.js";
import { creerCarteProjet } from "./composants/carte_projet.js";
import { initialiserPopUp } from "./composants/pop_up_projet.js";

const grille = document.querySelector(".projects__grid");

//  Animation d'apparisition du titre principal "PORTFOLIO" lettre par lettre, avec un délai entre chaque lettre pour créer un effet de révélation avec Anime.js.
function animerTitreHero() {
	const lettres = document.querySelectorAll(".hero__title-letter");
	if (!lettres.length || typeof window.anime !== "function") return;

	window.anime({
		targets: lettres,
		opacity: [0, 1],
		delay: window.anime.stagger(120),
		duration: 800,
		easing: "easeOutQuad"
	});
}

// Animation progressive des éléments de la section "À propos" (titre, paragraphes de description, photo, badge d'expérience, barres de compétences) lorsqu'ils entrent dans la section, en utilisant Intersection Observer et Anime.js pour créer des transitions fluides.
function initialiserAnimationAPropos() {
	const section = document.querySelector("#a-propos");
	if (!section || typeof window.anime !== "function") return;

	const anime = window.anime;
	const lignesTitre = section.querySelectorAll(".about__title > span");
	const paragraphes = section.querySelectorAll(".about__copy p");
	const photo = section.querySelector(".about__photo-placeholder");
	const badge = section.querySelector(".about__experience");
	const compteur = section.querySelector(".about__experience strong");
	const barres = section.querySelectorAll(".skill__progress");
	const pourcentages = section.querySelectorAll(".skill__heading span:last-child");
	const progressions = [...barres].map((barre, index) => ({
		barre,
		label: pourcentages[index],
		valeur: { nombre: 0 },
		finale: Number.parseInt(getComputedStyle(barre).getPropertyValue("--progress"), 10)
	}));

	// Position initiale masquée des éléments pour l'animation (opacité à 0 et translation hors de la vue) avant que l'animation ne commence.
	anime.set(lignesTitre[0], { opacity: 0, translateX: -50 });
	anime.set(lignesTitre[1], { opacity: 0, translateX: 50 });
	anime.set(paragraphes, { opacity: 0, translateX: -30 });
	anime.set(photo, { opacity: 0 });
	anime.set(badge, { opacity: 0 });
	anime.set(barres, { width: "0%" });
	pourcentages.forEach((pourcentage) => {
		pourcentage.textContent = "0%";
	});

	const valeurCompteur = { valeur: 0 };
	const timeline = anime.timeline({ autoplay: false });

	// Les descriptions apparaissent avec le mot accentué, puis les éléments visuels se révèlent ensemble.
	timeline
		.add({
			targets: lignesTitre[0],
			opacity: [0, 1],
			translateX: [-50, 0],
			duration: 700,
			easing: "easeOutCubic"
		})
		.add({
			targets: [...lignesTitre].slice(1).concat([...paragraphes]),
			opacity: [0, 1],
			translateX: (element, index) => index === 0 ? [50, 0] : [-30, 0],
			delay: anime.stagger(80),
			duration: 650,
			easing: "easeOutCubic"
		}, "-=120")
		.add({
			targets: [photo, badge],
			opacity: [0, 1],
			duration: 1000,
			easing: "easeOutQuad"
		}, "+=120")
		.add({
			targets: valeurCompteur,
			valeur: 3,
			round: 1,
			duration: 900,
			easing: "easeOutCubic",
			update: () => {
				compteur.textContent = `${valeurCompteur.valeur}+`;
			}
		}, "-=900");

	// Les cinq barres progressent en parallèle avec la photo et le badge.
	timeline.add({
		targets: progressions.map((progression) => progression.valeur),
		nombre: (target, index) => progressions[index].finale,
		round: 1,
		duration: 900,
		easing: "easeOutCubic",
		update: () => progressions.forEach((progression) => {
			progression.barre.style.width = `${progression.valeur.nombre}%`;
			progression.label.textContent = `${progression.valeur.nombre}%`;
		})
	}, "-=1000");

	// Déclenchement de la timeline seulement quand la section est visible à 25% dans la fenêtre d'affichage, pour éviter de jouer l'animation avant que l'utilisateur ne voie la section.
	const observer = new IntersectionObserver(([entree]) => {
		if (!entree.isIntersecting) return;
		timeline.play();
		observer.unobserve(section);
	}, { threshold: 0.25 });

	observer.observe(section);
}

function initialiserNavigationMobile() {
	const bouton = document.querySelector(".site-nav-toggle");
	const navigation = document.querySelector(".site-nav");
	const backdrop = document.querySelector("[data-menu-backdrop]");
	if (!bouton || !navigation || !backdrop) return;

	const fermerMenu = () => {
		navigation.classList.remove("is-open");
		bouton.setAttribute("aria-expanded", "false");
		bouton.setAttribute("aria-label", "Ouvrir le menu");
		document.body.classList.remove("menu-is-open");
	};

	bouton.addEventListener("click", () => {
		const ouvert = navigation.classList.toggle("is-open");
		bouton.setAttribute("aria-expanded", String(ouvert));
		bouton.setAttribute("aria-label", ouvert ? "Fermer le menu" : "Ouvrir le menu");
		document.body.classList.toggle("menu-is-open", ouvert);
	});

	navigation.addEventListener("click", (evenement) => {
		const lien = evenement.target.closest(".site-nav__link");
		if (!lien) return;
		fermerMenu();
	});

	backdrop.addEventListener("click", fermerMenu);

	document.addEventListener("keydown", (evenement) => {
		if (evenement.key === "Escape") fermerMenu();
	});
}

function initialiserContrasteRetourHaut() {
	const bouton = document.querySelector(".back-to-top");
	const sectionsClaires = [...document.querySelectorAll("#a-propos, #contact")];
	if (!bouton || !sectionsClaires.length) return;

	const mettreAJour = () => {
		const boutonRect = bouton.getBoundingClientRect();
		const pointY = boutonRect.top + boutonRect.height / 2;
		const surFondClair = sectionsClaires.some((section) => {
			const rect = section.getBoundingClientRect();
			return pointY >= rect.top && pointY <= rect.bottom;
		});
		bouton.classList.toggle("is-on-light", surFondClair);
	};

	window.addEventListener("scroll", mettreAJour, { passive: true });
	window.addEventListener("resize", mettreAJour);
	mettreAJour();
}

function initialiserBoucleLogiciels() {
	const piste = document.querySelector(".software__track");
	if (!piste || piste.children.length < 2) return;

	const mesurerDistance = () => {
		const milieu = piste.children.length / 2;
		const premier = piste.children[0];
		const copie = piste.children[milieu];
		if (!premier || !copie) return;
		const distance = copie.getBoundingClientRect().left - premier.getBoundingClientRect().left;
		piste.style.setProperty("--software-loop-distance", `${distance}px`);
	};

	mettreAJourApresChargement(mesurerDistance);
	window.addEventListener("resize", mesurerDistance);
}

function mettreAJourApresChargement(callback) {
	if (document.readyState === "complete") {
		callback();
		return;
	}
	window.addEventListener("load", callback, { once: true });
}

function prechargerIconesLogiciels() {
	const icones = [...document.querySelectorAll(".software__item iconify-icon")]
		.map((icone) => icone.getAttribute("icon"))
		.filter(Boolean);
	const requetes = [...new Set(icones)].map((icone) => {
		const [prefixe, nom] = icone.split(":");
		return fetch(`https://api.iconify.design/${prefixe}.json?icons=${encodeURIComponent(nom)}`, { cache: "force-cache" });
	});

	Promise.allSettled(requetes).then((resultats) => {
		if (resultats.some((resultat) => resultat.status === "rejected")) {
			console.warn("Certaines icônes de logiciels n'ont pas pu être préchargées.");
		}
	});
}

// Animation d'apparisiton des cartes de projets au défilement de la page, avec un effet de translation et d'opacité pour chaque carte, en utilisant Intersection Observer et Anime.js.
function initialiserAnimationProjets() {
	const section = document.querySelector("#projets");
	if (!section || typeof window.anime !== "function") return;

	const anime = window.anime;
	const titre = section.querySelector(".projects__title");
	const cartes = [...section.querySelectorAll(".project-card")];

	if (titre) {
		anime.set(titre, { opacity: 0, translateX: -60 });
		const titreObserver = new IntersectionObserver(([entree]) => {
			if (!entree.isIntersecting) return;
			anime({
				targets: titre,
				opacity: [0, 1],
				translateX: [-60, 0],
				duration: 500,
				easing: "easeOutCubic"
			});
			titreObserver.unobserve(entree.target);
		}, { threshold: 0.2 });

		titreObserver.observe(titre);
	}

	// Anime chaque carte séparément au fur et à mesure du défilement, avec un effet de translation et d'opacité, et un léger décalage pour créer un effet de cascade.
	cartes.forEach((carte, index) => {
		const media = carte.querySelector(".project-card__media");
		const contenu = carte.querySelectorAll(".project-card__title, .project-card__description");
		const footer = carte.querySelector(".project-card__footer");
		const decalage = index % 2 === 0 ? -60 : 60;

		anime.set(media, { opacity: 0, translateX: decalage });
		anime.set(contenu, { opacity: 0, translateY: 20 });
		anime.set(footer, { opacity: 0, scale: 0.95 });

		const carteObserver = new IntersectionObserver(([entree]) => {
			if (!entree.isIntersecting) return;
			anime.timeline({ easing: "easeOutCubic" })
				.add({
					targets: media,
					opacity: [0, 1],
					translateX: [decalage, 0],
					duration: 500
				})
				.add({
					targets: contenu,
					opacity: [0, 1],
					translateY: [20, 0],
					delay: anime.stagger(60),
					duration: 400
				}, "-=300")
				.add({
					targets: footer,
					opacity: [0, 1],
					scale: [0.95, 1],
					duration: 300
				}, "-=200");
			carteObserver.unobserve(entree.target);
		}, { threshold: 0.3, rootMargin: "0px 0px -50px 0px" });

		carteObserver.observe(carte);
	});
}

// Animation d'apparistion des cartes de la section "Services" au défilement de la page, avec un effet de translation et d'opacité pour chaque carte, en utilisant Intersection Observer et Anime.js.
function initialiserAnimationServices() {
	const section = document.querySelector("#services");
	if (!section || typeof window.anime !== "function") return;

	const anime = window.anime;
	const titre = section.querySelector(".services__title");
	const lignesTitre = section.querySelectorAll(".services__title > span");
	const grille = section.querySelector(".services__grid");
	const cartes = [...section.querySelectorAll(".service-card")];
	if (!titre || lignesTitre.length < 2 || !grille || !cartes.length) return;

	anime.set(lignesTitre[0], { opacity: 0, translateX: -60 });
	anime.set(lignesTitre[1], { opacity: 0, translateX: 60 });
	anime.set(cartes, { opacity: 0 });

	const titreAnimation = anime.timeline({ autoplay: false });
	titreAnimation
		.add({
			targets: lignesTitre[0],
			opacity: [0, 1],
			translateX: [-60, 0],
			duration: 500,
			easing: "easeOutCubic"
		})
		.add({
			targets: lignesTitre[1],
			opacity: [0, 1],
			translateX: [60, 0],
			duration: 500,
			easing: "easeOutCubic"
		}, "-=300");

	let titreTermine = false;
	const afficherCartes = () => {
		anime({
			targets: cartes,
			opacity: [0, 1],
			delay: anime.stagger(100),
			duration: 500,
			easing: "easeOutCubic"
		});
	};

	const titreObserver = new IntersectionObserver(([entree]) => {
		if (!entree.isIntersecting) return;
		titreAnimation.play();
		titreAnimation.finished.then(() => {
			titreTermine = true;
		});
		titreObserver.unobserve(entree.target);
	}, { threshold: 0.2 });

	const cartesObserver = new IntersectionObserver(([entree]) => {
		if (!entree.isIntersecting) return;
		if (titreTermine) {
			afficherCartes();
		} else {
			titreAnimation.finished.then(afficherCartes);
		}
		cartesObserver.unobserve(entree.target);
	}, { threshold: 0.3, rootMargin: "0px 0px -50px 0px" });

	titreObserver.observe(titre);
	cartesObserver.observe(grille);
}

// Animation du titre et du lien email dans la section "Contact" au défilement de la page, avec un effet de translation et d'opacité pour chaque élément, en utilisant Intersection Observer et Anime.js.
function initialiserAnimationContact() {
	const section = document.querySelector("#contact");
	if (!section || typeof window.anime !== "function") return;

	const anime = window.anime;
	const lignes = section.querySelectorAll(".contact__title-line");
	const email = section.querySelector(".contact__email");
	if (lignes.length < 3 || !email) return;

	anime.set(lignes[0], { opacity: 0, translateX: -60 });
	anime.set(lignes[1], { opacity: 0, translateX: 60 });
	anime.set(lignes[2], { opacity: 0, translateX: -60 });
	anime.set(email, { opacity: 0 });

	const timeline = anime.timeline({ autoplay: false });
	timeline
		.add({
			targets: lignes[0],
			opacity: [0, 1],
			translateX: [-60, 0],
			duration: 500,
			easing: "easeOutCubic"
		})
		.add({
			targets: lignes[1],
			opacity: [0, 1],
			translateX: [60, 0],
			duration: 500,
			easing: "easeOutCubic"
		}, "-=200")
		.add({
			targets: lignes[2],
			opacity: [0, 1],
			translateX: [-60, 0],
			duration: 500,
			easing: "easeOutCubic"
		}, "-=200")
		.add({
			targets: email,
			opacity: [0, 1],
			duration: 400,
			easing: "easeOutCubic"
		}, "-=200");

	const observer = new IntersectionObserver(([entree]) => {
		if (!entree.isIntersecting) return;
		timeline.play();
		observer.unobserve(entree.target);
	}, { threshold: 0.2 });

	observer.observe(section);
}

// Chargement initial des projets et injection dans la grille.
try {
	const projets = await chargerProjets();
	grille.innerHTML = projets.map(creerCarteProjet).join("");
	initialiserPopUp(projets);
} catch (erreur) {
	grille.innerHTML = "<p class=\"projects__error\">Les projets n'ont pas pu être chargés.</p>";
	console.error(erreur);
}

// Lancement des écouteurs d'animations et attente du chargement des polices pour le titre Hero.
initialiserAnimationAPropos();
initialiserAnimationProjets();
initialiserAnimationServices();
initialiserAnimationContact();
initialiserNavigationMobile();
initialiserContrasteRetourHaut();
initialiserBoucleLogiciels();
prechargerIconesLogiciels();
document.fonts.ready.then(animerTitreHero);

import { chargerProjets } from "./data.js";
import { creerCarteProjet } from "./composants/carte_projet.js";
import { initialiserPopUp } from "./composants/pop_up_projet.js";

const grille = document.querySelector(".projects__grid");

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

function initialiserCarrouselLogiciels() {
	const carrousel = document.querySelector("[data-software-carousel]");
	if (!carrousel) return;

	const viewport = carrousel.querySelector(".software__viewport");
	const piste = carrousel.querySelector(".software__track");
	const logiciels = [...carrousel.querySelectorAll(".software__item")];
	let indexActif = 0;

	function centrerLogiciel() {
		logiciels.forEach((logiciel, index) => logiciel.classList.toggle("is-active", index === indexActif));
		const actif = logiciels[indexActif];
		const decalage = actif.offsetLeft + actif.offsetWidth / 2 - viewport.clientWidth / 2;
		piste.style.transform = `translateX(${-Math.max(0, decalage)}px)`;
	}

	centrerLogiciel();
	window.addEventListener("resize", centrerLogiciel);
	window.setInterval(() => {
		indexActif = (indexActif + 1) % logiciels.length;
		centrerLogiciel();
	}, 2400);
}

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

	timeline
		.add({
			targets: lignesTitre[0],
			opacity: [0, 1],
			translateX: [-50, 0],
			duration: 700,
			easing: "easeOutCubic"
		})
		.add({
			targets: lignesTitre[1],
			opacity: [0, 1],
			translateX: [50, 0],
			duration: 700,
			easing: "easeOutCubic"
		}, "-=120")
		.add({
			targets: paragraphes,
			opacity: [0, 1],
			translateX: [-30, 0],
			delay: anime.stagger(120),
			duration: 600,
			easing: "easeOutCubic"
		}, "+=100")
		.add({
			targets: photo,
			opacity: [0, 1],
			duration: 1000,
			easing: "easeOutQuad"
		}, "-=300")
		.add({
			targets: badge,
			opacity: [0, 1],
			duration: 700,
			easing: "easeOutQuad"
		}, "-=700")
		.add({
			targets: valeurCompteur,
			valeur: 3,
			round: 1,
			duration: 900,
			easing: "easeOutCubic",
			update: () => {
				compteur.textContent = `${valeurCompteur.valeur}+`;
			}
		}, "-=500")
	progressions.forEach((progression, index) => {
		timeline.add({
			targets: progression.valeur,
			nombre: progression.finale,
			round: 1,
			duration: 700,
			easing: "easeOutCubic",
			update: () => {
				progression.barre.style.width = `${progression.valeur.nombre}%`;
				progression.label.textContent = `${progression.valeur.nombre}%`;
			}
		}, index === 0 ? "+=150" : "+=0");
	});

	const observer = new IntersectionObserver(([entree]) => {
		if (!entree.isIntersecting) return;
		timeline.play();
		observer.unobserve(section);
	}, { threshold: 0.25 });

	observer.observe(section);
}

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

try {
	const projets = await chargerProjets();
	grille.innerHTML = projets.map(creerCarteProjet).join("");
	initialiserPopUp(projets);
} catch (erreur) {
	grille.innerHTML = "<p class=\"projects__error\">Les projets n'ont pas pu être chargés.</p>";
	console.error(erreur);
}

initialiserCarrouselLogiciels();
initialiserAnimationAPropos();
initialiserAnimationProjets();
document.fonts.ready.then(animerTitreHero);

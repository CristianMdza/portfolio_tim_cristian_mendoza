import { chargerProjets } from "./data.js";
import { creerCarteProjet } from "./composants/carte_projet.js";
import { initialiserPopUp } from "./composants/pop_up_projet.js";

const grille = document.querySelector(".projects__grid");

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

try {
	const projets = await chargerProjets();
	grille.innerHTML = projets.map(creerCarteProjet).join("");
	initialiserPopUp(projets);
} catch (erreur) {
	grille.innerHTML = "<p class=\"projects__error\">Les projets n'ont pas pu être chargés.</p>";
	console.error(erreur);
}

initialiserCarrouselLogiciels();

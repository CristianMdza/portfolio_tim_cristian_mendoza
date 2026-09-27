import { chargerProjets } from "./data.js";
import { creerCarteProjet } from "./composants/carte_projet.js";
import { initialiserPopUp } from "./composants/pop_up_projet.js";

const grille = document.querySelector(".projects__grid");

try {
	const projets = await chargerProjets();
	grille.innerHTML = projets.map(creerCarteProjet).join("");
	initialiserPopUp(projets);
} catch (erreur) {
	grille.innerHTML = "<p class=\"projects__error\">Les projets n'ont pas pu être chargés.</p>";
	console.error(erreur);
}

// Fonction pour échapper les caractères spéciaux dans le texte
function echapper(texte = "") {
	return String(texte).replace(/[&<>"']/g, (caractere) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[caractere]));
}

// Génère le template HTML pour une carte de projet individuelle, en utilisant les données du projet et l'index pour déterminer la position (gauche/droite) de la carte dans la grille.
export function creerCarteProjet(projet, index) {
	// Vérifie si le projet a une image principale ou s'il faut afficher un placeholder.
	const apercu = projet.imagePrincipale
		? `<img src="${echapper(projet.imagePrincipale)}" alt="Aperçu de ${echapper(projet.titre)}" loading="lazy">`
		: `<div class="project-card__media-placeholder">Vidéo</div>`;
	
	// Crée les capsules (tags) pour les détails du projet (rôle, logiciel, année).
	const details = [projet.role, projet.logiciel, projet.annee].map((detail) => `<span>${echapper(detail)}</span>`).join("");

	// Alterne l'alignement (gauche/droite) de la carte en fonction de l'index pour créer un effet visuel dynamique dans la grille de projets.
	return `<article class="project-card project-card--${index % 2 === 0 ? "left" : "right"}">
		<div class="project-card__media" data-project-id="${projet.id}" role="button" tabindex="0" aria-label="Ouvrir le projet ${echapper(projet.titre)}">${apercu}</div>
		<h3 class="project-card__title">${echapper(projet.titre)} <span>– ${echapper(projet.categorie)}</span></h3>
		<p class="project-card__description">${echapper(projet.description)}</p>
		<div class="project-card__footer"><div class="project-card__tags">${details}</div><button class="bouton project-card__button" type="button" data-project-id="${projet.id}"><span>Voir projet</span></button></div>
	</article>`;
}

function echapper(texte = "") {
	return String(texte).replace(/[&<>"']/g, (caractere) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[caractere]));
}

export function creerCarteProjet(projet, index) {
	const apercu = projet.imagePrincipale
		? `<img src="${echapper(projet.imagePrincipale)}" alt="Aperçu de ${echapper(projet.titre)}" loading="lazy">`
		: `<div class="project-card__media-placeholder">Vidéo</div>`;
	const details = [projet.role, projet.logiciel, projet.annee].map((detail) => `<span>${echapper(detail)}</span>`).join("");

	return `<article class="project-card project-card--${index % 2 === 0 ? "left" : "right"}">
		<div class="project-card__media">${apercu}</div>
		<h3 class="project-card__title">${echapper(projet.titre)} <span>– ${echapper(projet.categorie)}</span></h3>
		<p class="project-card__description">${echapper(projet.description)}</p>
		<div class="project-card__footer"><div class="project-card__tags">${details}</div><button class="bouton bouton--pale project-card__button" type="button" data-project-id="${projet.id}">Voir projet</button></div>
	</article>`;
}

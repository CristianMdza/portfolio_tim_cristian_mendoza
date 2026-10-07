// Fonction pour échapper les caractères spéciaux dans le texte
function echapper(texte = "") {
	return String(texte).replace(/[&<>"']/g, (caractere) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[caractere]));
}

// Génère les étiquettts (tags) du projet, soit version courte pour la carte ou complète pour la modale (pour le pop-up du projet).
function creerTags(projet, complet = false) {
	const cles = complet ? ["role", "logiciel", "annee", "modalite", "mention", "format"] : ["role", "logiciel", "annee"];
	return cles.map((cle) => `<span>${echapper(projet[cle])}</span>`).join("");
}

// Formate le texte de l'étape du processus pour qu'il commence par une majuscule et le reste en minuscules.
function formaterEtape(texte) {
	const minuscule = String(texte).toLowerCase();
	return minuscule.charAt(0).toUpperCase() + minuscule.slice(1);
}

// Initialise le composant de la fenetre modale (pop-up) et ses interactions d'événements pour afficher les détails d'un projet lorsqu'on clique sur une carte de projet.
export function initialiserPopUp(projets) {
	const modal = document.querySelector("#project-modal");
	const corps = modal.querySelector(".project-modal__body");
	let minuteur;
	let indexMedia = 0;
	let projetActif;

	// Met à jour l'image affichée dans la modale en fonction de l'index actuel et met à jour les points de navigation (dots) pour refléter l'image active.
	function afficherMedia() {
		const medias = projetActif.galerieImages;
		const conteneur = corps.querySelector(".modal-project__media");
		const media = conteneur.querySelector("img");
		if (!media || !medias.length) return;
		media.src = medias[indexMedia];
		media.alt = `${projetActif.titre}, image ${indexMedia + 1}`;
		corps.querySelectorAll(".modal-project__dot").forEach((dot, index) => dot.classList.toggle("is-active", index === indexMedia));
	}

	// Ferme la modale (pop-up), réinitialise le minuteur et met en pause la vidéo si présente.
	function fermer() {
		modal.classList.remove("is-open");
		modal.setAttribute("aria-hidden", "true");
		document.body.classList.remove("modal-is-open");
		clearInterval(minuteur);
		const video = corps.querySelector("video");
		if (video) video.pause();
	}

	// Ouvre la modale (pop-up), injecte les détails du projet et démarre le carrousel d'images automatique si c'est une galarie d'images (et non une vidéo).
	function ouvrir(projet) {
		projetActif = projet;
		indexMedia = 0;
		const estVideo = Boolean(projet.video);
		const media = estVideo
			? `<video src="${echapper(projet.video)}" controls autoplay playsinline></video>`
			: `<img src="${echapper(projet.galerieImages[0])}" alt="Aperçu de ${echapper(projet.titre)}">`;
		const controles = estVideo ? "" : `<button class="modal-project__control modal-project__control--previous" type="button" aria-label="Image précédente" data-media-previous><iconify-icon icon="solar:arrow-left-linear" aria-hidden="true"></iconify-icon></button><button class="modal-project__control modal-project__control--next" type="button" aria-label="Image suivante" data-media-next><iconify-icon icon="solar:arrow-right-linear" aria-hidden="true"></iconify-icon></button><div class="modal-project__dots">${projet.galerieImages.map((_, index) => `<button class="modal-project__dot${index === 0 ? " is-active" : ""}" type="button" aria-label="Afficher l'image ${index + 1}" data-media-index="${index}"></button>`).join("")}</div>`;
		const processus = projet.processus?.length ? `<div class="modal-project__section"><h4>Processus de création</h4><div class="modal-project__process">${projet.processus.map((etape) => `<div class="modal-project__process-item"><strong>${echapper(formaterEtape(etape.titre))}</strong><p>${echapper(etape.texte)}</p></div>`).join("")}</div></div>` : "";

		corps.innerHTML = `<div class="modal-project__media">${media}${controles}</div><h3 class="modal-project__heading" id="modal-title">${echapper(projet.titre)} <span>– ${echapper(projet.categorie)}</span></h3><div class="modal-project__separator"></div>${projet.synopsis ? `<section class="modal-project__section"><h4>Synopsis</h4><p>${echapper(projet.synopsis)}</p></section>` : ""}<section class="modal-project__section"><h4>Description du projet</h4><p>${echapper(projet.descriptionDemande)}</p></section><section class="modal-project__section"><h4>Description de ma démarche</h4><p>${echapper(projet.descriptionProjet)}</p></section>${processus}<div class="modal-project__tags">${creerTags(projet, true)}</div>`;
		modal.classList.add("is-open");
		modal.setAttribute("aria-hidden", "false");
		document.body.classList.add("modal-is-open");
		corps.querySelector(".project-modal__close")?.focus();
		clearInterval(minuteur);

		// Défilement automatique de la galerie toutes les 5 secondes.
		if (!estVideo && projet.galerieImages.length > 1) minuteur = setInterval(() => { indexMedia = (indexMedia + 1) % projet.galerieImages.length; afficherMedia(); }, 5000);
	}

	// Gestion globale des clics (overture, fermeture, flèches de navigation, puces de navigation).
	document.addEventListener("click", (evenement) => {
		const bouton = evenement.target.closest(".project-card__button[data-project-id]");
		if (bouton) ouvrir(projets.find((projet) => String(projet.id) === bouton.dataset.projectId));
		if (evenement.target.closest("[data-modal-close]")) fermer();
		if (evenement.target.closest("[data-media-next]")) { indexMedia = (indexMedia + 1) % projetActif.galerieImages.length; afficherMedia(); }
		if (evenement.target.closest("[data-media-previous]")) { indexMedia = (indexMedia - 1 + projetActif.galerieImages.length) % projetActif.galerieImages.length; afficherMedia(); }
		const point = evenement.target.closest("[data-media-index]");
		if (point) { indexMedia = Number(point.dataset.mediaIndex); afficherMedia(); }
	});

	// Permet d'ouvrir la modale (Pop-up) au clic avec les touches Entrée / Espaces sur la miniature du projet (image) pour l'accessibilité.
	document.querySelectorAll(".project-card__media[data-project-id]").forEach((media) => {
		const ouvrirProjet = () => ouvrir(projets.find((projet) => String(projet.id) === media.dataset.projectId));
		media.addEventListener("click", ouvrirProjet);
		media.addEventListener("keydown", (evenement) => {
			if (evenement.key === "Enter" || evenement.key === " ") {
				evenement.preventDefault();
				ouvrirProjet();
			}
		});
	});

	// Navigation au clavier (Échap pour ferner, flèches gauche/droite pour naviguer dans la galerie d'images).
	document.addEventListener("keydown", (evenement) => {
		if (!modal.classList.contains("is-open")) return;
		if (evenement.key === "Escape") fermer();
		if (evenement.key === "ArrowRight" && projetActif?.galerieImages.length) { indexMedia = (indexMedia + 1) % projetActif.galerieImages.length; afficherMedia(); }
		if (evenement.key === "ArrowLeft" && projetActif?.galerieImages.length) { indexMedia = (indexMedia - 1 + projetActif.galerieImages.length) % projetActif.galerieImages.length; afficherMedia(); }
	});
}

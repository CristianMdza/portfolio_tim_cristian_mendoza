function echapper(texte = "") {
	return String(texte).replace(/[&<>"']/g, (caractere) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[caractere]));
}

function creerTags(projet, complet = false) {
	const cles = complet ? ["role", "logiciel", "annee", "modalite", "mention", "format"] : ["role", "logiciel", "annee"];
	return cles.map((cle) => `<span>${echapper(projet[cle])}</span>`).join("");
}

export function initialiserPopUp(projets) {
	const modal = document.querySelector("#project-modal");
	const corps = modal.querySelector(".project-modal__body");
	let minuteur;
	let indexMedia = 0;
	let projetActif;

	function afficherMedia() {
		const medias = projetActif.galerieImages;
		const conteneur = corps.querySelector(".modal-project__media");
		const media = conteneur.querySelector("img");
		if (!media || !medias.length) return;
		media.src = medias[indexMedia];
		media.alt = `${projetActif.titre}, image ${indexMedia + 1}`;
		corps.querySelectorAll(".modal-project__dot").forEach((dot, index) => dot.classList.toggle("is-active", index === indexMedia));
	}

	function fermer() {
		modal.classList.remove("is-open");
		modal.setAttribute("aria-hidden", "true");
		document.body.classList.remove("modal-is-open");
		clearInterval(minuteur);
		const video = corps.querySelector("video");
		if (video) video.pause();
	}

	function ouvrir(projet) {
		projetActif = projet;
		indexMedia = 0;
		const estVideo = Boolean(projet.video);
		const media = estVideo
			? `<video src="${echapper(projet.video)}" controls autoplay playsinline></video>`
			: `<img src="${echapper(projet.galerieImages[0])}" alt="Aperçu de ${echapper(projet.titre)}">`;
		const controles = estVideo ? "" : `<button class="modal-project__control modal-project__control--previous" type="button" aria-label="Image précédente" data-media-previous>←</button><button class="modal-project__control modal-project__control--next" type="button" aria-label="Image suivante" data-media-next>→</button><div class="modal-project__dots">${projet.galerieImages.map((_, index) => `<button class="modal-project__dot${index === 0 ? " is-active" : ""}" type="button" aria-label="Afficher l'image ${index + 1}" data-media-index="${index}"></button>`).join("")}</div>`;
		const processus = projet.processus?.length ? `<div class="modal-project__section"><h4>Processus de création</h4><div class="modal-project__process">${projet.processus.map((etape) => `<div class="modal-project__process-item"><strong>${echapper(etape.titre)}</strong><p>${echapper(etape.texte)}</p></div>`).join("")}</div></div>` : "";

		corps.innerHTML = `<div class="modal-project__media">${media}${controles}</div><h3 class="modal-project__heading" id="modal-title">${echapper(projet.titre)} <span>– ${echapper(projet.categorie)}</span></h3><div class="modal-project__separator"></div>${projet.synopsis ? `<section class="modal-project__section"><h4>Synopsis</h4><p>${echapper(projet.synopsis)}</p></section>` : ""}<section class="modal-project__section"><h4>Description du projet</h4><p>${echapper(projet.descriptionDemande)}</p></section><section class="modal-project__section"><h4>Description de ma démarche</h4><p>${echapper(projet.descriptionProjet)}</p></section>${processus}<div class="modal-project__tags">${creerTags(projet, true)}</div>`;
		modal.classList.add("is-open");
		modal.setAttribute("aria-hidden", "false");
		document.body.classList.add("modal-is-open");
		corps.querySelector(".project-modal__close")?.focus();
		clearInterval(minuteur);
		if (!estVideo && projet.galerieImages.length > 1) minuteur = setInterval(() => { indexMedia = (indexMedia + 1) % projet.galerieImages.length; afficherMedia(); }, 3000);
	}

	document.addEventListener("click", (evenement) => {
		const bouton = evenement.target.closest("[data-project-id]");
		if (bouton) ouvrir(projets.find((projet) => String(projet.id) === bouton.dataset.projectId));
		if (evenement.target.closest("[data-modal-close]")) fermer();
		if (evenement.target.closest("[data-media-next]")) { indexMedia = (indexMedia + 1) % projetActif.galerieImages.length; afficherMedia(); }
		if (evenement.target.closest("[data-media-previous]")) { indexMedia = (indexMedia - 1 + projetActif.galerieImages.length) % projetActif.galerieImages.length; afficherMedia(); }
		const point = evenement.target.closest("[data-media-index]");
		if (point) { indexMedia = Number(point.dataset.mediaIndex); afficherMedia(); }
	});

	document.addEventListener("keydown", (evenement) => {
		if (!modal.classList.contains("is-open")) return;
		if (evenement.key === "Escape") fermer();
		if (evenement.key === "ArrowRight" && projetActif?.galerieImages.length) { indexMedia = (indexMedia + 1) % projetActif.galerieImages.length; afficherMedia(); }
		if (evenement.key === "ArrowLeft" && projetActif?.galerieImages.length) { indexMedia = (indexMedia - 1 + projetActif.galerieImages.length) % projetActif.galerieImages.length; afficherMedia(); }
	});
}

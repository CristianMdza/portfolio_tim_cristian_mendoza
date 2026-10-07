// Chargement des projets depuis le fichier JSON.
export async function chargerProjets() {
	const reponse = await fetch("data/projets.json");
	if (!reponse.ok) {
		throw new Error("Impossible de charger les projets.");
	}
	return reponse.json();
}

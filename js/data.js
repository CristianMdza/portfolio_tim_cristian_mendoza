// Chargement des projets depuis le fichier JSON.
export async function chargerProjets() {
	// Effectue une requête fetch pour récupérer les données des projets depuis le fichier JSON.
	const reponse = await fetch("data/projets.json");
	// Vérifie si la réponse est correcte (status 200-299). Si ce n'est pas le cas, lance une erreur.
	if (!reponse.ok) {
		throw new Error("Impossible de charger les projets.");
	}
	return reponse.json();
}

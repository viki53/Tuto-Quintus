/* ---------------------- *
 *                        *
 *        Partie 3        *
 *                        *
 * ---------------------- */

// Attention à ne pas utiliser cette méthode de chargement dans votre application, mais à inclure le fichier à la liste de la partie 2
Q.load(['nuages.png'], function() {
	console.log('Image de fond chargée');
});


Q.scene('game', function(stage) {
	console.log('Niveau 1 !');

	stage.insert(new Q.Repeater({ asset: 'nuages.png', speedY: 0.8 }));
});
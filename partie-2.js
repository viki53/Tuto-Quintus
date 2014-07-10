/* ---------------------- *
 *                        *
 *        Partie 2        *
 *                        *
 * ---------------------- */


Q.scene('startGame', function(stage) { // On crée une nouvelle scène que l'on nomme. Une fois affichée la fonction sera appelée, avec en paramètre notre objet scène (dont on récupèrera quelques infos et auquel on balancera quelques objets)
	var sprite_bg = new Q.Sprite({ x: 0, y: 0, w: Q.width, h: Q.height, type: Q.SPRITE_UI }); // On crée un sprite pour le fond de la scène, de la taille de la scène
	sprite_bg.draw = function(ctx) { // Au moment de dessiner le sprite, on récupère le contexte 2D du canvas pour dessiner librement
		ctx.fillStyle = '#e0b232'; // On veut du jaune
		ctx.fillRect(this.p.x, this.p.y, this.p.w, this.p.h); // On dessine un rectangle de la taille du sprite
	var degrade = ctx.createRadialGradient(Q.width/2, Q.height/2, 0, Q.width/2, Q.height/2, Q.width/2); // On crée un dégradé radial qui commence du centre du sprite et qui s'étend sur la moitié de la taille de ce même sprite
		degrade.addColorStop(0, '#ffffff'); // Le centre sera blanc
		degrade.addColorStop(1, 'rgba(255, 255, 255, 0)'); // La fin sera transparente
		ctx.fillStyle = degrade; // On veut dessiner notre dégradé
		ctx.fillRect(0, 0, Q.width, Q.height); // On dessine le dégradé par-dessus le fond jaune
	};
	stage.insert(sprite_bg);
	
	var img_bg = new Q.Sprite({ x: Q.width/2, y: Q.height/2, w: Q.width, h: Q.height, tileW: Q.width, tileH: Q.width, asset: 'raymond.png'}); // On peut ajouter une image de fond, avec un petit dessin par exemple
	stage.insert(img_bg); // Ne pas oublier d'insérer l'image (à noter que vous pouvez tout faire sur une seule ligne, comme pour le texte juste en-dessous)
	img_bg.add('tween');

	function moveSheep() {
		this.animate({ y: this.p.cy-50 }, 1.5, Q.Easing.Quadratic.InOut, {}).chain({ y: this.p.cy }, 1.5, Q.Easing.Quadratic.InOut, { callback: moveSheep });
	}

	moveSheep.apply(img_bg);

	var title = stage.insert(new Q.UI.Text({ x: Q.width/2, y: 50, label: 'Mon super jeu', align: 'center', size: 48, color: '#aa4242' })); // On insère un titre sous forme de texte en haut, centré



	var container = stage.insert(new Q.UI.Container({ // On crée un conteneur avec un fond transparent, centré, avec des angles arrondis de 5 px
		x: Q.width/2,
		y: Q.height/2,
		fill: 'rgba(0, 0, 0, 0.5)',
		radius: 5
	}));

	var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: '#f7f7f7', label: 'Jouer', highlight: '#ffffff', radius: 2 })); // On insère un bouton dans le conteneur, avec un fond blanc cassé, qui devient blanc au clic, en haut du conteneur
	button.on('click', function() { // On place un écouteur sur le bouton pour gérer le clic
		Q.clearStages(); // On vide les scènes affichées, pour repartir sur un canvas vierge
		console.log('Bouton cliqué, lancement du jeu…'); // Regardez votre console ;)
		Q.stageScene('game', 0); // On affiche une autre scène (qui sera crée dans la partie 3) au rang 0, soit tout en bas dans la pile des calques
	});
	container.fit(10); // On adapte la taille du conteneur à son contenu (le bouton), avec un padding de 10px

	console.log('Écran de lancement affiché');
});


Q.load(['raymond.png'], function() {
	Q.stageScene('startGame', 0); // On affiche notre scène
}, {
	progressCallback: function(loaded, total) {
		console.log('Chargement : ' + Math.floor(loaded/total*100) + '%');
	}
});

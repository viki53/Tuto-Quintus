/* ---------------------- *
 *                        *
 *        Partie 3        *
 *                        *
 * ---------------------- */

// Attention à ne pas utiliser cette méthode de chargement dans votre application, mais à inclure le fichier à la liste de la partie 2
Q.load(['clouds.png', 'game-tiles.png', 'game.json', 'player-sprite.png', 'sheepfold-sprite.png'], function () {
	console.log('Fichiers du niveau chargés');

	Q.sheet('my_tiles', 'game-tiles.png', { tileW: 30, tileH: 30 }); // On crée des tiles
	Q.sheet('my_player', 'player-sprite.png', { tileW: 25, tileH: 30 }); // On crée la feuille du joueur, qui permet de décomposer les états (pour l'animer par exemple)
	Q.sheet('my_sheepfold', 'sheepfold-sprite.png', { tileW: 30, tileH: 30 }); // On crée la feuille du joueur, qui permet de décomposer les états (pour l'animer par exemple)

	Q.animations('my_player', {
		stand: { frames: [0], rate: 1/60, loop: true },
		walk_left: { frames: [1], rate: 1/60 },
		walk_right: { frames: [2], rate: 1/60 },
		jump: { frames: [3], rate: 1/60 },
	});
});

Q.Sprite.extend('Player', {
	init: function (p) {
		this._super(p, {
			sheet: 'my_player',
			sprite: 'my_player',
			type: Q.SPRITE_PLAYER,
			speed: 300,
			jumpSpeed: -500,
			direction: null
		});

		this.add('2d, platformerControls, animation');

		this.on('hit.sprite',function(collision) { // Quand le joueur entre en collision avec un autre Sprite
			if(collision.obj.isA('Sheepfold')) { // S'il s'agit d'une bergerie
				console.log('Bienvenue à la bergerie !');
				Q.stageScene('endGame', 1, { label: 'Gagné !' });
				this.destroy();
			}
		});
	},
	step: function (dt) {
		// console.dir(this.p)
		if (this.p.x <= 0) {
			this.p.x = 0;
		}
		else if (this.p.x >= Q.width) {
			this.p.x = Q.width;
		}

		if (Q.inputs['up']) {
			this.play('jump');
			return;
		}

		if (this.p.vx > 0) {
			this.p.direction = 'right';
		}
		else if (this.p.vx < 0) {
			this.p.direction = 'left';
		}
		else {
			this.p.direction = null;
		}

		if (this.p.direction) {
			this.play('walk_' + this.p.direction);
		}
		else {
			this.play('stand');
		}
	}
});

Q.Sprite.extend('Sheepfold', {
	init: function (p) {
		this._super(p, { sheet: 'my_sheepfold' });
	}
});

Q.scene('game', function (stage) {
	console.log('Niveau 1 !');

	stage.insert(new Q.Repeater({ asset: 'clouds.png', speedY: 0.5 }));

	var tiles = new Q.TileLayer({
		dataAsset: 'game.json', // Nom du fichier tileset
		sheet: 'my_tiles', // Nom des tiles
		tileW: Q.sheets['my_tiles'].tileW, // Dimensions des tiles : on va les chercher directement depuis la feuille que l'on a créée au chargement
		tileH: Q.sheets['my_tiles'].tileH
	});

	stage.collisionLayer(tiles);

	var player = new Q.Player();
	player.p.x = tiles.p.w / 2; // On place notre joueur horizontalement au centre…
	player.p.y = tiles.p.h - (player.p.cy + tiles.p.tileH); // … et verticalement en bas
	stage.insert(player);
	
	stage.add('viewport').follow(player, { x: false, y :true }, { minX:0, maxX: tiles.p.w, maxY: tiles.p.h} );

	stage.insert(new Q.Sheepfold({
		x: tiles.p.w - Q.sheets['my_sheepfold'].tileW/2,
		y: Q.sheets['my_sheepfold'].tileW/2
	}));
});

Q.scene('endGame', function (stage) {
	var container = stage.insert(new Q.UI.Container({
		x: Q.width/2,
		y: Q.height/2,
		fill: 'rgba(0, 0, 0, 0.5)',
		radius: 5
	}));

	var button_y = 0;

	if (stage.options.label) {
		container.insert(new Q.UI.Text({
			x: 0,
			y: 0,
			color: '#ffffff',
			align: 'center',
			label: stage.options.label
		}));
		
		button_y += Math.ceil(container.children[container.children.length - 1].p.h) + 10;
	}

	var button = container.insert(new Q.UI.Button({ x: 0, y: button_y, fill: '#f7f7f7', label: 'Rejouer', highlight: '#ffffff', radius: 2 }));

	button.on('click', function() { // On place un écouteur sur le bouton pour gérer le clic
		Q.clearStages(); // On vide les scènes affichées, pour repartir sur un canvas vierge
		console.log('Bouton cliqué, re-lancement du jeu…'); // Regardez votre console ;)
		Q.stageScene('game', 0); // On relance le jeu
	});

	container.fit(10);
})
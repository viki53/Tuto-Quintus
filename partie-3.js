/* ---------------------- *
 *                        *
 *        Partie 3        *
 *                        *
 * ---------------------- */

// Attention à ne pas utiliser cette méthode de chargement dans votre application, mais à inclure le fichier à la liste de la partie 2
Q.load(['nuages.png', 'game-tiles.png', 'game.json', 'player-sprite.png'], function() {
	console.log('Fichiers du niveau chargés');

	Q.sheet('my_tiles', 'game-tiles.png', { tileW: 30, tileH: 30 }); // On crée des tiles
	Q.sheet('my_player', 'player-sprite.png', { tileW: 25, tileH: 30 }); // On crée la feuille du joueur, qui permet de décomposer les états (pour l'animer par exemple)

	Q.animations('my_player', {
		stand: { frames: [0], rate: 1/60, loop: true },
		walk_left: { frames: [1], rate: 1/60 },
		walk_right: { frames: [2], rate: 1/60 },
		jump: { frames: [3], rate: 1/60 },
	});
});

Q.Sprite.extend('Player', {
	init: function(p) {
		this._super(p, {
			sheet: 'my_player',
			sprite: 'my_player',
			type: Q.SPRITE_PLAYER,
			speed: 300,
			jumpSpeed: -500,
			direction: null
		});

		this.add('2d, platformerControls, animation');
		console.dir(this);
	},
	step: function(dt) {
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

Q.scene('game', function(stage) {
	console.log('Niveau 1 !');

	stage.insert(new Q.Repeater({ asset: 'nuages.png', speedY: 0.8 }));

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
	
	stage.add('viewport').follow(player, { x: false, y :true }, { minX:0, minY:0, maxX: tiles.p.w, maxY: tiles.p.h} );

	console.dir(Q);
});
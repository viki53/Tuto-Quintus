/* ---------------------- *
 *                        *
 *        Partie 3        *
 *                        *
 * ---------------------- */

// Attention à ne pas utiliser cette méthode de chargement dans votre application, mais à inclure le fichier à la liste de la partie 2
Q.load(['clouds.png', 'game-tiles.png', 'game.json', 'player-sprite.png', 'sheepfold-sprite.png', 'wolf-sprite.png'], function () {
	console.log('Fichiers du niveau chargés');

	Q.sheet('my_tiles', 'game-tiles.png', { tileW: 30, tileH: 30 }); // On crée des tiles
	Q.sheet('my_player', 'player-sprite.png', { tileW: 25, tileH: 30 }); // On crée la feuille du joueur, qui permet de décomposer les états (pour l'animer par exemple)
	Q.sheet('my_sheepfold', 'sheepfold-sprite.png', { tileW: 30, tileH: 30 });
	Q.sheet('my_wolf', 'wolf-sprite.png', { tileW: 30, tileH: 23 });

	Q.animations('my_player', {
		stand: { frames: [0], rate: 1/60, loop: true },
		walk_left: { frames: [1], rate: 1/60 },
		walk_right: { frames: [2], rate: 1/60 },
		jump: { frames: [3], rate: 1/60 },
	});

	Q.animations('my_wolf', {
		stand: { frames: [0], rate: 1/60, flip: false, loop: true },
		walk_left: { frames: [1], rate: 1/60, flip: false, loop: true },
		walk_right: { frames: [1], rate: 1/60, flip: 'x' }, // Eh oui, pour réduire le nombre d'images, il suffit de retourner celle que l'on souhaite !
		dying: { frames: [1], rate: 1/60, flip: 'y' }, // Et ça fonctionne aussi pour une symétrie verticale !
	});
});

Q.Sprite.extend('Player', {
	init: function (p) {
		this._super(p, {
			sheet: 'my_player',
			sprite: 'my_player',
			collisionMask: Q.SPRITE_DEFAULT,
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

Q.Sprite.extend('Wolf', {
	init: function(p) {
		this._super(p, {
			sheet: 'my_wolf',
			sprite: 'my_wolf',
			vx: -100, // On part vers la gauche
			collisionMask: Q.SPRITE_DEFAULT
		});

		this.add('2d, animation, aiBounce');

		this.on('bump.left, bump.right, bump.bottom', function(collision) {
			if(collision.obj.isA('Player')) {
				Q.stageScene('endGame', 1, { label: 'Perdu !' });
				collision.obj.destroy();
			}
		});

		this.on('bump.top', this, 'die');
	},
	step: function (dt) {
		if (this.p.x <= 0 || this.p.x >= Q.width) {
			this.p.vx = -this.p.vx; // S'il va au bord, on inverse sa vitesse pour qu'il fasse demi-tour
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
	},
	die: function (collision) {
		this.p.vx = this.p.vy = 0; // Pas bouger !
		this.play('dying'); // Fais le mort

		(function (wolf) {
			setTimeout(function() {
				wolf.destroy(); // On attend un peu puis on le détruit (il ne gênera pas les autres loups ou le joueur, comme ça)
			}, 300);
		})(this);

		collision.obj.p.vy = -300; // On fait rebondir le joueur
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

	stage.insert(new Q.Wolf({ x: tiles.p.w/2, y: tiles.p.h/2 }));

	stage.insert(new Q.Wolf({ x: tiles.p.w/4, y: tiles.p.h - (player.p.cy + tiles.p.tileH) }));

	stage.insert(new Q.Wolf({ x: tiles.p.w - Q.sheets['my_sheepfold'].tileW * 2, y: 0, vy: 100 }));
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
		console.log('Bouton cliqué, redémarrage du jeu…'); // Regardez votre console ;)
		Q.stageScene('game', 0); // On relance le jeu
	});

	container.fit(10);
})
/* Mise en place de la librairie */

var Q = new Quintus({
	development: true // On lance le développement, pour forcer le refresh des assets (images, fichiers JSON…)
}).include([ // On indique quels composants inclure de base
	Quintus.Sprites, // Pour gérer les sprites (les calques en gros)
	Quintus.Scenes, // Pour gérer les scenes (les différentes pages, pour faire simple)
	Quintus.Anim, // Pour gérer les animations (sur des sprites, par exemple)
	Quintus['2D'], // Pour gérer la 2D : permet d'avoir des ennemis qui se déplacent et de détecter les collisions automatiquement
	Quintus.Input, // Pour gérer les contrôles (certains contrôles sont inclus de base, c'est assez pratique)
	Quintus.Touch, // Pour gérer les contrôles via une surcouche tactile (avec un joypad si nécessaire — c'est paramétrable)
	Quintus.UI // Pour afficher des boutons, du texte, etc.
]).setup('game', { // On paramètre un peu le tout (le premier paramètre permet d'indiquer le canvas, vous pouvez aussi passer directement un élément du DOM ou ne rien spécifier si vous voulez que la librairie crée un canvas pour vous)
	maximize: false, // Inutile de modifier la taille du canvas (`true` permet d'étendre à toute la surface disponible)
	width: 600, // Largeur de base
	height: 800 // Hauteur de base
}).controls().touch(); // On initialise la gestion des contrôles et la couche tactile qui va avec

console.log('Quintus est prêt !');
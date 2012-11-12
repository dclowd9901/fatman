ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	'game.entities.textbox',
	'game.plugins.utilities',
	'game.levels.level5',
	'impact.font',
	'impact.debug.debug'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	// Load a font
	paused : false,
	
	gravity: 400, // All entities are affected by this
	
	init: function() {
		_this = this;
		// Initialize your game here; bind keys etc.

		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );

		ig.music.add('media/music/bg_music2.mp3');

		this.loadLevel( LevelLevel5 );

		ig.music.volume = 0.5;
		//ig.music.play();

		ig.game.spawnEntity('EntityTextbox', 0, 0);

	},
	
	update: function() {

		// Update all entities and backgroundMaps
		
		if( !this.paused ){
			this.parent();
		}
		// Add your own, additional update code here
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		
		
		// Add your own drawing code here
		var x = ig.system.width/2,
			y = 20;
	}
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, WINDOW_WIDTH, WINDOW_HEIGHT, 2 );

});

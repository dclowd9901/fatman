var WINDOW_WIDTH = 640,
	WINDOW_HEIGHT = 480;

ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	'game.entities.player',
	'game.entities.finish',
	'game.entities.ramp',
	'game.entities.earthquake',
	'game.plugins.utilities',
	'game.levels.level_1',
	'impact.font'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	msg : '',
	paused : false,
	
	gravity: 400, // All entities are affected by this
	
	init: function() {
		_this = this;
		// Initialize your game here; bind keys etc.

		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );

		this.loadLevel( LevelLevel_1 );

		this.getEntityByName('EntityEarthquake').events.on('quakeStart', function(){
		});

		this.getEntityByName('EntityEarthquake').events.on('quakeEnd', function(){
			//ig.game.collisionMap.data = Utilities._rotateSlopesCW( _this.getMapByName( 'collision' ).data );
		});

		console.log( this.entities );
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
		
		this.font.draw( this.msg, x, y, ig.Font.ALIGN.CENTER );
	}
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, WINDOW_WIDTH, WINDOW_HEIGHT, 2 );

});

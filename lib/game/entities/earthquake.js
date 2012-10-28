ig.module(
	'game.entities.earthquake'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityEarthquake = ig.Entity.extend({
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(80, 130, 170, 0.7)',
	
	size: {x: 8, y: 8},
	name : 'EntityEarthquake',

	events : _.extend({}, Backbone.Events),
	
  mutingFactor: 5,
  quakeStrength: null,
  quakeDuration: null,
  quakeTimer: null,
  collisionDirection: null,
  quaking: false,

  resetTime : .5,
  resetTimer : null,
  resetting : false,

  startMovement : null,
  endMovement   : null,
  movementDiff  : null,
	
	init: function( x, y, settings ) {
		this.resetTimer = this.quakeTimer = new ig.Timer();

		var _this = this;

		this.events.on('quake', function( options ){
			_this.quakeDuration 			= options.duration;
			_this.quakeStrength 			= options.strength;
			_this.collisionDirection 	= options.direction;
			_this.silence 						= options.silence;

			if( !_this.silence ){
				_this.quaking = true;
        _this.startMovement = { x : ig.game.screen.x, y : ig.game.screen.y };
				_this.events.trigger('quakeStart');
			}

  		_this.movementCache = {x : 0, y : 0};
			_this.quakeTimer.set( _this.quakeDuration );
		});

		this.events.on('quakeEnd', function(){
			_this.resetting = true;
			_this.resetTimer.set(_this.resetTime);
			_this.events.trigger('resetStart');
			
		});

		this.parent( x, y, settings );
	},	
	
	update: function() {
  	if( this.quaking ){
  		this.quake();
  	}

  	if( this.resetting ){
  		//this.resetScreen();
  	}
	},

	resetScreen : function(){
		var delta = this.resetTimer.delta(),
			tick = this.resetTimer.tick();

		if( delta < 0 && tick < this.resetTime ){
			ig.game.screen.x -= tick.map(0, this.resetTime, 0, this.movementCache.x);
			ig.game.screen.y -= tick.map(0, this.resetTime, 0, this.movementCache.y);

		} else if( delta > 0 && this.resetting ){
			this.resetting = false;
			this.events.trigger('resetEnd');
		}
	},

	quake: function(){
    var delta = this.quakeTimer.delta();

    if( delta < 0 ) {
      var s = this.quakeStrength * Math.pow( -delta / this.quakeDuration, 2 ),
      	x, y;

      if( s > 0.5 ) {
        if( this.collisionDirection === 'x' ){
          x = Math.random().map( 0, 1, -s, s );
          y = Math.random().map( 0, 1, -s/this.mutingFactor, s/this.mutingFactor );
        }

        if( this.collisionDirection === 'y' ){
          x = Math.random().map( 0, 1, -s/this.mutingFactor, s/this.mutingFactor );
          y = Math.random().map( 0, 1, -s, s );
        }

        ig.game.screen.x += x;
        ig.game.screen.y += y;

      } else if ( this.quaking === true && !_this.silence ) {
        this.endMovement = { x : ig.game.screen.x, y : ig.game.screen.y };
        this.events.trigger('quakeEnd');
        this.quaking = false;
      }
    }   		
	}
});

});

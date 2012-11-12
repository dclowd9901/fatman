ig.module(
  'game.entities.player'
)
.requires(
  'impact.entity',
  'game.entities.earthquake'
)
.defines(function(){ 

  // Create your own entity, subclassed from ig.Enitity
  EntityPlayer = ig.Entity.extend({
    name : 'Player',

    // Set some of the properties
    collides: ig.Entity.COLLIDES.ACTIVE,
    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.B,
    maxVel: {x: 300, y: 800},
    quakeVel: {x: 250, y: 400},
    friction: {x: 1600, y: 0},
    size: {x: 36, y: 60},
    health: 50,
    events: _.extend({}, Backbone.Events),
    zIndex : ZI_PLAYER,

    sounds : {
      step : new ig.Sound( 'media/sounds/step.ogg', false )
    },    

    maxQuakeDuration: 1,
    maxQuakeStrength: 8,

    accelGround: 300,
    accelAir: 200,
    flip : false,

    cameraTimer : null,
    cameraSpeed : 20,
    moveTo : null,

    soundTimer : new ig.Timer(),
    soundRepeatRate : null,
    playstep : false,

    // Load an animation sheet
    animSheet: new ig.AnimationSheet( 'media/player.png', 36, 60 ),
    currentFrame : null,
    
    init: function( x, y, settings ) {
      this.sounds.step.volume = 1;
      this.soundRepeatRate = .15;                    
      this.soundTimer.set(0);

      // Add animations for the animation sheet
      this.addAnim( 'idle', .5, [0,1,2,1] );
      this.addAnim( 'running', .1, [6,7,8,9,10,11] );
      
      // Call the parent constructor
      this.parent( x, y, settings );

      this.defaults = {
        maxVel : {
          x : this.maxVel.x
        }
      };
    },
    
    update: function() {      

      // move left or right
      var accel = this.standing ? this.accelGround : this.accelAir;
      if( ig.input.state('left') ) {
        this.accel.x = -accel;
        this.flip = true;
      }
      else if( ig.input.state('right') ) {
        this.accel.x = accel;
        this.flip = false;     
      } else {
        this.accel.x = 0;
      }

      if( this.vel.x !== 0 ){
        var velX = Math.abs( this.vel.x );

        if( velX > ( this.maxVel.x/3) ){
          this.anims.running.frameTime = .1;
        }
        if( velX > ( this.maxVel.x/1.5) ){
          this.anims.running.frameTime = .07;
        }
        if( velX === this.maxVel.x ){
          this.anims.running.frameTime = .05;
        }          
        this.currentAnim = this.anims.running;

        if( this.soundTimer.delta() > 0 && this.playstep && velX > this.maxVel.x/1.5 ){
          this.sounds.step.play();
          this.soundTimer.set( this.soundRepeatRate );
        }

      } else {
        this.anims.running.frameTime = .1;
        this.currentAnim = this.anims.idle;
      }

      this.currentAnim.flip.x = this.flip;

      this.cameraLook();
      
      // Call the parent update() method to move the entity
      // according to its physics
      this.parent(); 
    },

    cameraLook : function(){
      var x = this.pos.x - (WINDOW_WIDTH/2) + this.size.x,
        y = this.pos.y - (WINDOW_HEIGHT/2) + this.size.y,
        mapWidth,
        mapHeight,
        maxX,
        maxY;

      if( this.mainMap ){
        mapWidth = this.mainMap.width * this.mainMap.tilesize;
        mapHeight = this.mainMap.height * this.mainMap.tilesize;
        maxX = mapWidth - WINDOW_WIDTH;
        maxY = mapHeight - WINDOW_HEIGHT; 

        x = ( x > maxX ) ? maxX : x;
        y = ( y > maxY ) ? maxY : y;
        x = ( x < 0 ) ? 0 : x;
        y = ( y < 0 ) ? 0 : y;               
      }

      moveTo = {
        x : x,
        y : y
      };

      ig.game.screen.x -= ( ig.game.screen.x - moveTo.x )/this.cameraSpeed;
      ig.game.screen.y -= ( ig.game.screen.y - moveTo.y )/this.cameraSpeed;

    },

    handleMovementTrace: function( res ) {
      var xspeed = Math.abs( this.vel.x ),
        yspeed = Math.abs( this.vel.y ),
        silence = false,
        _this = this,
        direction;

      if( res.collision.x && xspeed > this.quakeVel.x ){
        if ( this.vel.x < 0 ){
          direction = 'left';
        } else {
          direction = 'right';
        }

        ig.game.getEntityByName('EntityEarthquake').events.trigger('quake', {
          strength : xspeed.map( 0, _this.maxVel.x, 0, _this.maxQuakeStrength ),
          duration : xspeed.map( 0, _this.maxVel.x, 0, _this.maxQuakeDuration ),
          direction : direction,
          silence : silence
        });
      }
      
      if( res.collision.y && yspeed > this.quakeVel.y ){

        ig.game.getEntityByName('EntityEarthquake').events.trigger('quake', {
          strength : yspeed.map( 0, _this.maxVel.y, 0, _this.maxQuakeStrength ),
          duration : yspeed.map( 0, _this.maxVel.y, 0, _this.maxQuakeDuration ),
          direction : 'down',
          silence : silence
        });    
      }

      if( res.collision.y || res.collision.slope ){
        this.playstep = true;
        this.maxVel.x = this.defaults.maxVel.x;
      } else {
        this.maxVel.x = this.vel.x;
        this.playstep = false;
      }

      // Continue resolving the collision as normal
      this.parent(res); 
    },

    draw : function(){
      this.parent();     

      if( !this.mainMap && ig.game.getMapByName ){
        this.mainMap = ig.game.getMapByName('main');
      }
    }
  });
});
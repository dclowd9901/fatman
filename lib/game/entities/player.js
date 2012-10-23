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

    // Set some of the properties
    collides: ig.Entity.COLLIDES.ACTIVE,
    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.B,
    maxVel: {x: 250 , y: 400},
    friction: {x: 800, y: 0},
    size: {x: 18, y: 30},
    health: 50,
    events: _.extend({}, Backbone.Events),

    maxQuakeDuration: 1,
    maxQuakeStrength: 8,

    accelGround: 300,
    accelAir: 200,
    flip : false,

    cameraTimer : null,
    cameraSpeed : 20,

    // Load an animation sheet
    animSheet: new ig.AnimationSheet( 'media/player.png', 18, 30 ),
    
    init: function( x, y, settings ) {
      this.quakeTimer = new ig.Timer();

      // Add animations for the animation sheet
      this.addAnim( 'idle', .5, [0,1,2,1] );
      this.addAnim( 'running', .1, [4,5,6,5] );
      
      // Call the parent constructor
      this.parent( x, y, settings );
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
      var moveTo = {
        x : this.pos.x - (WINDOW_WIDTH/2) + this.size.x,
        y : this.pos.y - (WINDOW_HEIGHT/2) + this.size.y
      };

      ig.game.screen.x -= ( ig.game.screen.x - moveTo.x )/this.cameraSpeed;
      ig.game.screen.y -= ( ig.game.screen.y - moveTo.y )/this.cameraSpeed;

    },

    handleMovementTrace: function( res ) {
      var xspeed = Math.abs( this.vel.x ),
        yspeed = Math.abs( this.vel.y ),
        silence = false,
        _this = this;

      if( res.collision.x && xspeed === this.maxVel.x ){
        ig.game.getEntityByName('EntityEarthquake').events.trigger('quake', {
          strength : xspeed.map( 0, _this.maxVel.x, 0, _this.maxQuakeStrength ),
          duration : xspeed.map( 0, _this.maxVel.x, 0, _this.maxQuakeDuration ),
          direction : 'x',
          silence : silence
        });
      }
      
      if( res.collision.y && yspeed > 50 ){
        silence = true;

        if( yspeed === this.maxVel.y ){
          silence = false;
        }

        ig.game.getEntityByName('EntityEarthquake').events.trigger('quake', {
          strength : yspeed.map( 0, _this.maxVel.y, 0, _this.maxQuakeStrength ),
          duration : yspeed.map( 0, _this.maxVel.y, 0, _this.maxQuakeDuration ),
          direction : 'y',
          silence : silence
        });    
      }

      // Continue resolving the collision as normal
      this.parent(res); 
    },
    collideWith : function( other ){
    }
  });
});
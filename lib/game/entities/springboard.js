ig.module(
  'game.entities.springboard'
).requires(
  'impact.entity'
).defines(function(){

  EntitySpringboard = ig.Entity.extend({
    collides : ig.Entity.COLLIDES.FIXED,
    type : ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,    
    gravityFactor : 0,
    _wmDrawBox: true,
    _wmScalable : true,
    _wmBoxColor: 'rgba(128, 128, 128, 0.8)',
    size : { x: 104, y: 8 },

    strength : 3200,
    maxHeight : 40,

    originalPosition : null,
    triggered : false,
    resetting : false,

    launchTimer : new ig.Timer(),

    init : function( x, y, settings ){
      this.friction = { x : 0, y : 0 };
      this.maxVel = { x : 2 * this.strength, y : 2 * this.strength };
      this.defaultMaxVel = {
        x : this.maxVel.x,
        y : this.maxVel.y
      };
      this.speed  = 2 * ( this.strength / this.maxHeight );
      this.animSheet = new ig.AnimationSheet( 'media/springboard.png', this.size.x, this.size.y );

      this.strength = settings.strength || this.strength;

      this.parent( x, y, settings );

      this.addAnim('idle', 1, [0]);
      this.addAnim('two', 1, [1]);
      this.addAnim('one', 1, [2]);
    },

    update : function(){      
      var d = this.launchTimer.delta();

      if( d > 0 && this.triggered ){

        if( this.pos.y >= (this.originalPosition - this.maxHeight) ){
          this.accel.y = -this.strength;
        } else {
          this.triggered = false;
          this.resetting = true;
        }
      }

      if( this.resetting ){
        diff = this.originalPosition - this.pos.y;
        
        if( diff > 1 ){
          this.accel.y = this.strength;

        } else {
          this.accel.y = 0;
          this.maxVel.y = 0;
          this.pos.y = this.originalPosition;
          this.resetting = false;
        }
      }

      if( d < -1 ){
        this.currentAnim = this.anims.two;
      } else if( d < 0 ){
        this.currentAnim = this.anims.one;
      } else {
        this.currentAnim = this.anims.idle;
      }

      this.parent();
    },

    collideWith : function( other ){
      if( other.name === 'Player' && !this.triggered && !this.resetting ){
        this.launchTimer.set( 2 );
        this.triggered = true;
        this.originalPosition = this.pos.y;
        this.maxVel.y = this.defaultMaxVel.y;
      }
    }
  });
});
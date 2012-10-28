ig.module(
  'game.entities.ramp'
).requires(
  'impact.entity',
  'game.entities.earthquake'
).defines(function(){

  EntityRamp = ig.Entity.extend({
    // size and animsheet are determined by rampType
    collides : ig.Entity.COLLIDES.NEVER,
    flipping : false,
    upsideDown : false,
    gravityFactor : 0,

    bounceTimer : null,
    bounceDuration : .25,
    bounceHeight : 3,
    originalPosition : null,
    zIndex : ZI_PLAYER - 1,

    init : function( x, y, settings ){

      var _this = this;

      this.parent( x, y, settings );

      this.size.x = this.sizeX;
      this.size.y = this.sizeY;
      this.animSheet = new ig.AnimationSheet( 'media/' + this.texture + '.png', this.sizeX, this.sizeY );

      this.addAnim( 'idle', 1, [0] );

      this.currentAnim.pivot = { x : this.sizeX/2, y : this.sizeY/2 };

      if( _this.upsideDown ){
        _this.collides = ig.Entity.COLLIDES.FIXED;
      }

      if( ig.game.getEntityByName('EntityEarthquake') ){
        ig.game.getEntityByName('EntityEarthquake').events.on('quakeStart', function(){
          _this.bounceTimer = new ig.Timer();
          _this.bounceTimer.set( _this.bounceDuration );
          _this.originalPosition = _this.pos.y;
          _this.flipping = true;
        });

        ig.game.getEntityByName('EntityEarthquake').events.on('quakeEnd', function(){
          _this.upsideDown = !_this.upsideDown;
          _this.collides = ( _this.upsideDown ) ? ig.Entity.COLLIDES.FIXED : ig.Entity.COLLIDES.NEVER;          
          _this.flipping = false;
        });
      }
    },

    update : function(){
      if( this.bounceTimer ){
        var delta = this.bounceTimer.delta();
        if( delta <= this.bounceDuration ){
          this.pos.y += delta.map( -this.bounceDuration, this.bounceDuration, -this.bounceHeight, this.bounceHeight );
        } else {
          this.pos.y = this.originalPosition;
        }
      }

      if( this.flipping ){
        if( !this.upsideDown ){
          if( this.currentAnim.angle < (180).toRad() ){
            this.currentAnim.angle += (20).toRad();
          }
        } else {
          if( this.currentAnim.angle < (359).toRad() ){
            this.currentAnim.angle += (20).toRad();          
          }
        }
      } else {
        if( this.upsideDown ){
          this.currentAnim.angle = (180).toRad();
        } else {
          this.currentAnim.angle = (0).toRad();          
        }
      }

      this.parent();
    }
  });
});
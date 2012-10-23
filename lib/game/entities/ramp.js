ig.module(
  'game.entities.ramp'
).requires(
  'impact.entity',
  'game.entities.earthquake'
).defines(function(){

  EntityRamp = ig.Entity.extend({
    // size and animsheet are determined by rampType
    size : { x : 24, y : 32 },
    animSheet: new ig.AnimationSheet( 'media/ramp15.png', 24, 32 ),
    collides : ig.Entity.COLLIDES.NEVER,
    flipping : false,
    upsideDown : false,
    gravityFactor : 0,

    init : function( x, y, settings ){
      var _this = this;
      this.parent( x, y, settings );

      this.addAnim( 'idle', 1, [0] );
      this.addAnim( 'flipping', 0.1, [0,1,2,3,4] );
      this.addAnim( 'flippingBack', 0.1, [4,3,2,1,0] );
      this.addAnim( 'idleUpsideDown', 1, [4] );

      if( _this.upsideDown ){
        _this.collides = ig.Entity.COLLIDES.FIXED;
      }

      if( ig.game.getEntityByName('EntityEarthquake') ){
        ig.game.getEntityByName('EntityEarthquake').events.on('quakeStart', function(){
          _this.anims.flipping = _this.anims.flipping.rewind();
          _this.anims.flippingBack = _this.anims.flippingBack.rewind();

          _this.flipping = true;
        });

        ig.game.getEntityByName('EntityEarthquake').events.on('quakeEnd', function(){
          if( !_this.upsideDown ){
            _this.upsideDown = true;
            _this.collides = ig.Entity.COLLIDES.FIXED;
          } else {
            _this.upsideDown = false;
            _this.collides = ig.Entity.COLLIDES.NEVER;            
          }
          _this.flipping = false;
        });
      }
    },

    update : function(){

      if( this.flipping ){
        if( !this.upsideDown ){
          this.currentAnim = this.anims.flipping;
        } else {
          this.currentAnim = this.anims.flippingBack;
        }
      } else {
        if( this.upsideDown ){
          this.currentAnim = this.anims.idleUpsideDown;
        } else {
          this.currentAnim = this.anims.idle;
        }
      }

      this.parent();
    },
    collideWith : function( other ){
    }
  });
});
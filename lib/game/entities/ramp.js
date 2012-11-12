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
    flipX : false,

    bounceTimer : null,
    bounceDuration : .25,
    bounceHeight : 3,
    originalPosition : null,
    zIndex : ZI_PLAYER - 1,

    onlyOnDirection : null,

    init : function( x, y, settings ){

      var _this = this;

      this.parent( x, y, settings );

      this.size.x = this.sizeX;
      this.size.y = this.sizeY;
      this.animSheet = new ig.AnimationSheet( 'media/' + this.texture + '.png', this.sizeX, this.sizeY );

      this.addAnim( 'idle', 1, [0] );

      if( this.flipX ){
        this.currentAnim.flip.x = true;
      }

      this.currentAnim.pivot = { x : this.sizeX/2, y : this.sizeY/2 };

      if( _this.upsideDown ){
        _this.collides = ig.Entity.COLLIDES.FIXED;
      }

      if( typeof Utilities === 'object' ){
        Utilities.registerOnQuake({
          quakeStart : prepareFlip,
          quakeEnd   : endFlip
        }, this );
      }

      function prepareFlip( thisInstance ){
        thisInstance.bounceTimer = new ig.Timer();
        thisInstance.bounceTimer.set( thisInstance.bounceDuration );
        thisInstance.originalPosition = thisInstance.pos.y;
        thisInstance.flipping = true;        
      }

      function endFlip( thisInstance ){
        if( thisInstance.flipping ){
          thisInstance.upsideDown = !thisInstance.upsideDown;
          thisInstance.collides = ( thisInstance.upsideDown ) ? ig.Entity.COLLIDES.FIXED : ig.Entity.COLLIDES.NEVER;          
          thisInstance.flipping = false;
        }        
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
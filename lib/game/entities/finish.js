ig.module(
  'game.entities.finish'
).requires(
  'impact.entity'
).defines(function(){

  EntityFinish = ig.Entity.extend({
    size: { x: 24, y: 24 },    
    collides : ig.Entity.COLLIDES.LITE,
    checkAgainst : ig.Entity.TYPE.A,
    name : 'EntityFinish',
    gravityFactor : 0, 

    _wmScalable : true,
    _wmDrawBox : true,
    _wmBoxColor : 'rgba( 0,255,0, .5 )',

    init : function( x, y, settings ){
      this.parent( x, y, settings );
    },

    update : function(){
      this.parent();
    },

    collideWith : function( other ){
      if( other.name === 'EntityPlayer' ){
        ig.game.msg = 'You Win!';
        // ig.game.paused = true;
      }
    }
  });
});
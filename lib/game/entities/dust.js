ig.module(
  'game.entities.dust'
).requires(
  'impact.entity'
).defines(function(){
  EntityDust = ig.Entity.extend({
    collides : ig.Entity.COLLIDES.NEVER,
    size : {x: 1, y: 1},
    friction: {x: 100, y: 0},    
    animSheet : new ig.AnimationSheet('media/dust.png', 1, 1),

    life : null,

    init : function(x, y, settings){
      this.addAnim('idle', 1, [0]);

      this.currentAnim.gotoRandomFrame();

      this.parent(x, y, settings);
      
      this.vel.x = this.velocity;

      this.life = new ig.Timer();
      this.life.set( 1 );
    },

    update : function(){
      if( this.life.delta() > 0 ){
        this.kill();
      }

      this.parent();
    }
  });
});
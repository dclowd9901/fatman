ig.module(
  'game.entities.textbox'
).requires(
  'impact.font',
  'impact.entity'
).defines(function(){

  EntityTextbox = ig.Entity.extend({
    size : {
      x : 240,
      y : 100
    },
    font: new ig.Font( 'media/04b03.font.png' ),
    msg : '',    
    name : 'EntityTextbox',
    gravityFactor : 0,
    animSheet : new ig.AnimationSheet('media/textbox.png', 240, 100),

    init : function( x, y, settings ){
      this.parent( x, y, settings );

      this.addAnim('showing', 1, [0]);
      this.addAnim('hiding', 1, [1]);

      this.currentAnim = this.anims.hiding;

    },
    update: function(){

      this.parent();
    },
    figurePosition : function(){
      this.pos.x = ( ig.game.screen.x + ( WINDOW_WIDTH / 2 ) ) - (this.size.x/2);
      this.pos.y = ig.game.screen.y + 20;
    },
    draw : function(){
      this.parent();

      if( this.msg ){
        this.currentAnim = this.anims.showing;
        this.figurePosition();
      } else {
        this.currentAnim = this.anims.hiding;
      }

      this.font.draw( this.msg, WINDOW_WIDTH/2, 30, ig.Font.ALIGN.CENTER );
    }
  });
});
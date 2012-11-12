ig.module(
  'game.entities.message-entity'
).requires(
  'impact.font',
  'impact.entity'
).defines(function(){

  EntityMessageEntity = ig.Entity.extend({
    message : '',

    _wmDrawBox: true,
    _wmScalable : true,
    _wmBoxColor: 'rgba(12, 24, 48, 0.7)',

    collides : ig.Entity.COLLIDES.NEVER,
    type : ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,  

    gravityFactor : 0,

    init : function( x, y, settings){
      this.parent( x, y, settings );     
    },

    update : function(){
      this.parent();

      if( !this.textbox ){
        this.textbox = ig.game.getEntityByName('EntityTextbox');
      }

      this.textbox.msg = '';
    },

    check : function( other ){
      if( other.name === 'Player' ){
        this.textbox.msg = this.message;
      }      
    }
  });
});
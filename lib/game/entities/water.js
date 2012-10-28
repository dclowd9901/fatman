ig.module(
  'game.entities.water'
)
.requires(
  'impact.entity',
  'game.entities.fish'
)
.defines(function(){

  EntityWater = ig.Entity.extend({

    _wmDrawBox: true,
    _wmScalable : true,
    _wmBoxColor: 'rgba(0, 0, 255, 0.7)',

    fishBlock : 10000,
    fishDensity : 2,

    init : function( x, y, settings ){

      var area,
        region,
        spawn,
        fishToEmit,
        i;

      this.parent( x, y, settings );

      area = this.size.x * this.size.y;
      region = {
        x1 : this.pos.x,
        y1 : this.pos.y,
        x2 : this.pos.x + this.size.x,
        y2 : this.pos.y + this.size.y
      };

      fishToEmit = ( area / this.fishBlock ).ceil() * this.fishDensity;

      if( ig.game.spawnEntity ){
        for( i = 0; i <= fishToEmit; i++ ){
          spawn = {
            x : Math.random().map( 0, 1, region.x1, region.x2 ),
            y : Math.random().map( 0, 1, region.y1, region.y2 )
          };          
          
          ig.game.spawnEntity('EntityFish', spawn.x, spawn.y, { region : region });  
        }
      }
    }
  });
});
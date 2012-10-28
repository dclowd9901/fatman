ig.module(
  'game.entities.particle-emitter'
)
.requires(
  'impact.entity',
  'game.entities.dust'
)
.defines(function(){

  EntityParticleEmitter = ig.Entity.extend({
    _wmDrawBox: true,
    _wmScalable : true,
    _wmBoxColor: 'rgba(40, 40, 40, 0.7)',
    
    size: {x: 32, y: 32},
    name : 'EntityParticleEmitter',
    direction : 'down',

    init : function(x, y, settings){
      var _this = this,
        earthquake = ig.game.getEntityByName('EntityEarthquake');

      this.parent( x, y, settings );

      this.region = {
        x1 : this.pos.x,
        y1 : this.pos.y,
        x2 : this.pos.x + this.size.x,
        y2 : this.pos.y + this.size.y
      };

      if( earthquake ){
        earthquake.events.on('quakeStart', function(){
          _this.runEmit = true;
        });

        earthquake.events.on('quakeEnd', function(){
          _this.runEmit = false;
        });        
      }
    },

    update : function() {
      if( this.runEmit ){
        this.emit();
      }
    },

    emit : function (){

      var spawn = {
          x : Math.random().map( 0, 1, this.region.x1, this.region.x2 ),
          y : Math.random().map( 0, 1, this.region.y1, this.region.y2 )
        }, 
        velocity;

      if( this.direction === 'down' ){
        ig.game.spawnEntity('EntityDust', spawn.x, spawn.y, { velocity : 0 });
      }

      if( this.direction === 'right' ){
        velocity = Math.random().map( 0, 1, 1, 50 );
        ig.game.spawnEntity('EntityDust', spawn.x, spawn.y, { velocity : velocity });
      }

      if( this.direction === 'left' ){
        velocity = -Math.random().map( 0, 1, 1, 50 );        
        ig.game.spawnEntity('EntityDust', spawn.x, spawn.y, { velocity : velocity });
      }
    }
  });
});
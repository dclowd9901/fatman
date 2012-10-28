ig.module(
  'game.entities.fish'
).requires(
  'impact.entity'
).defines(function(){
  EntityFish = ig.Entity.extend({
    collides : ig.Entity.COLLIDES.NEVER,
    size : {x: 16, y: 16},
    friction: {x: 400, y: 400},
    gravityFactor : 0, 
    animSheet : new ig.AnimationSheet('media/koi.png', 16, 16),
    moving : false,
    moveTimer : new ig.Timer(),
    timerSet : true,
    newPos : {},

    minMoveInterval : 1,
    maxMoveInterval : 3,
    fishSpeed : null,
    defaultFishSpeedMin : 40, // Higher = slower
    defaultFishSpeedMax : 80,
    defaultActiveness : 2, // pixel threshold before fish takes off in another direction
    freakoutFactor : 4,

    init : function(x, y, settings){
      var eq,
        _this = this;

      this.addAnim( 'idle', .5, [0,1] );

      this.setMoveTimer();

      this.parent( x, y, settings );

      this.activeness = this.defaultActiveness;
      this.fishSpeedMin = this.defaultFishSpeedMin;
      this.fishSpeedMax = this.defaultFishSpeedMax;

      this.region = {
        x1 : this.region.x1,
        x2 : this.region.x2 - this.size.x,
        y1 : this.region.y1,
        y2 : this.region.y2 - this.size.y
      };

      if( ig.game.getEntityByName('EntityEarthquake') ){
        eq = ig.game.getEntityByName('EntityEarthquake');

        eq.events.on('quakeStart', function(){
          _this.activeness = _this.defaultActiveness * _this.freakoutFactor;
          _this.fishSpeedMin = _this.defaultFishSpeedMin / _this.freakoutFactor;
          _this.fishSpeedMax = _this.defaultFishSpeedMax / _this.freakoutFactor;
          _this.move();
        });

        eq.events.on('quakeEnd', function(){
          _this.activeness = _this.defaultActiveness;
          _this.fishSpeedMin = _this.defaultFishSpeedMin;
          _this.fishSpeedMax = _this.defaultFishSpeedMax;          
        });
      }
    },

    update : function(){
      var d = this.moveTimer.delta();

      if( d > 0 && this.moving ){ // If Timer is up...
        this.moveStep( d );
      }

      if( d > 0 && !this.moving ){
        this.move();
      }

      this.parent();
    },

    setMoveTimer : function(){
      var newtime = Math.random().map( 0, 1, this.minMoveInterval, this.maxMoveInterval );
      this.moveTimer.set( newtime );
    },

    move : function(){
      this.newPos.x = Math.random().map( 0,1, this.region.x1,this.region.x2 ).ceil();
      this.newPos.y = Math.random().map( 0,1, this.region.y1,this.region.y2 ).ceil();
      this.fishSpeed = Math.random().map( 0,1, this.fishSpeedMin,this.fishSpeedMax ).ceil();

      this.moving = true;
    },

    moveStep : function( delta ){
      if( Math.abs( this.pos.x - this.newPos.x ) <= this.activeness ){
        this.moving = false;
        this.timerSet = false;
      } else {
        this.pos.x -= ( this.pos.x - this.newPos.x )/this.fishSpeed;
        this.pos.y -= ( this.pos.y - this.newPos.y )/this.fishSpeed;
      }

      if( this.newPos.x < this.pos.x ){
        this.currentAnim.flip.x = true;
      } else {
        this.currentAnim.flip.x = false;
      }
    }
  });
});
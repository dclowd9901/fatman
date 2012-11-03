ig.module(
  'game.plugins.utilities'
).defines( function(){
  Utilities = {
    _rotateSlopesCW : function( map ){
      for( i in map ){
        for( j in map[i] ){
          if( map[i][j] > 4 && map[i][j] < 8 ){
            map[i][j] += 33;
          } else if( map[i][j] > 37 && map[i][j] < 41 ){
            map[i][j] -= 33;
          }          
        }
      }
      return map;
    },
    _rotateSlopesCCW : function( map ){
      for( i in map ){
        for( j in map[i] ){

        }
      }

      return map;   
    },
    registerOnQuake : function( newMethods, context, newParams ){
      var _this = context,
        params = _.extend( {}, newParams ),
        methods = _.extend({
          quakeStart : function(){},
          quakeEnd   : function(){}
        }, newMethods );

      if( ig.game.getEntityByName('EntityEarthquake') ){
        ig.game.getEntityByName('EntityEarthquake').events.on('quakeStart', function( options ){ 
          if( _this.onlyOnDirection ){
            if ( _this.onlyOnDirection === options.direction ) method( _this, params );
          } else {
            methods.quakeStart( _this, params );
          }
        });
      }

      if( ig.game.getEntityByName('EntityEarthquake') ){
        ig.game.getEntityByName('EntityEarthquake').events.on('quakeEnd', function(){ 
          methods.quakeEnd( _this, params );
        });
      }
    }
  }
});
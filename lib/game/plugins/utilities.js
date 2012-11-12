ig.module(
  'game.plugins.utilities'
).defines( function(){
  Utilities = {
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
            if ( _this.onlyOnDirection === options.direction ) methods.quakeStart( _this, params );
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
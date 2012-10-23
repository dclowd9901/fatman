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
    }
  }
});
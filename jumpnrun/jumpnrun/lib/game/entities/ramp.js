ig.module(
  'game.entities.ramp'
).requires(
  'impact.entity'
).defines(function(){

  EntityRamp = ig.Entity.extend({
    collides: ig.Entity.COLLIDES.ACTIVE,
    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,

    // size and animsheet are determined by rampType
    size : { x : 12, y : 4 },

    _wmDrawBox : true,
    _wmBoxColor : 'rgba( 0, 255, 255, 1 )'
  });
});
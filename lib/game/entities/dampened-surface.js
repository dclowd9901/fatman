ig.module(
  'game.entities.dampened-surface'
)
.requires(
  'impact.entity',
  'game.entities.dust'
)
.defines(function(){
  EntityDampenedSurface = ig.Entity.extend({
    collides : ig.Entity.COLLIDES.FIXED,
    gravityFactor : 0,

    _wmDrawBox: true,
    _wmScalable : true,
    _wmBoxColor: 'rgba(0, 128, 28, 0.5)',
    
    size: {x: 32, y: 32},
    name : 'EntityDampenedSurface'
  });
});
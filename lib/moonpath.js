import SunCalc from 'suncalc';

import  rotate from 'gl-vec2/rotate'
import add from 'gl-vec2/add'

function radians_to_degrees(radians){
  return radians * (180/Math.PI);
}

export const moonPath = (fraction, phase, parallacticAngle = 1,radius = 500, center=[0,0]) => {
  // phase: moon phase; varies from 0.0 to 1.0, described below
  // fraction: illuminated fraction of the moon; varies from 0.0 (new moon) to 1.0 (full moon)
  const arcRadius = radius ;
  
  var waxingArc = arcRadius;
  var waxingSweep = 1;
  var waningArc = arcRadius;
  var waningSweep = 1;

  var sweep = 0;
  var arcFraction = 1 - fraction * 2;

  if (arcFraction < 0) {
    arcFraction = arcFraction * -1;
    sweep = 1;
  }

  var degree = radians_to_degrees(parallacticAngle);
  var angle = parallacticAngle;
  
  var p1 = [0, -radius];
  var p2 = [0, radius];

  rotate(p1,p1,angle)
  rotate(p2,p2,angle)

  add(p1, p1, center)
  add(p2, p2, center)
  
  var [x1, y1] = p1;
  var [x2, y2] = p2;

  if (phase <= 0.5) {
    // Waxing
    waxingArc = arcFraction * arcRadius;
    waxingSweep = sweep;
  } else {
    // Waning
    waningArc = arcFraction * arcRadius;
    waningSweep = sweep;
  }

  // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
  var path = "";
  // Set pen to first point of inner shadow
  path += `M ${x1} ${y1} `;
  // draw the waning (right) arc
  path += `A ${waningArc} ${arcRadius} ${degree} 0 ${waningSweep} ${x2} ${y2}`;
  // draw the waxingArc (left) arc
  path += `A ${waxingArc} ${arcRadius} ${degree} 0 ${waxingSweep} ${x1} ${y1}`;
  // close inner path
  path += `z`;
  return path;
};


export const getMoonIcon=(location=[50.935173, 6.953101], date=new Date, radius=100, center=[0,0]) =>{

  let {fraction, phase} = SunCalc.getMoonIllumination(date);
  let {parallacticAngle} = SunCalc.getMoonPosition(date,location[0],location[1])

  return `<path d="${moonPath(fraction, phase,parallacticAngle,radius,center)}" fill="#fff"></path>`

}
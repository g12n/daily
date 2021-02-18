'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var SunCalc = require('suncalc');
var dateFns = require('date-fns');
var math = require('canvas-sketch-util/math');
var rotate = require('gl-vec2/rotate');
var add = require('gl-vec2/add');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var SunCalc__default = /*#__PURE__*/_interopDefaultLegacy(SunCalc);
var math__default = /*#__PURE__*/_interopDefaultLegacy(math);
var rotate__default = /*#__PURE__*/_interopDefaultLegacy(rotate);
var add__default = /*#__PURE__*/_interopDefaultLegacy(add);

const point = (x, y, r, angel) => [
  (x + Math.sin(angel) * r).toFixed(2),
  (y - Math.cos(angel) * r).toFixed(2),
];

const full = (x, y, R, r) => {
  if (r <= 0) {
    return `M ${x - R} ${y} A ${R} ${R} 0 1 1 ${x + R} ${y} A ${R} ${R} 1 1 1 ${x - R} ${y} Z`;
  }
  return `M ${x - R} ${y} A ${R} ${R} 0 1 1 ${x + R} ${y} A ${R} ${R} 1 1 1 ${x - R} ${y} M ${x - r} ${y} A ${r} ${r} 0 1 1 ${x + r} ${y} A ${r} ${r} 1 1 1 ${x - r} ${y} Z`;
};

const part = (x, y, R, r, start, end) => {
  const [s, e] = [(start / 360) * 2 * Math.PI, (end / 360) * 2 * Math.PI];
  const P = [
    point(x, y, r, s),
    point(x, y, R, s),
    point(x, y, R, e),
    point(x, y, r, e),
  ];
  const flag = e - s > Math.PI ? '1' : '0';
  return `M ${P[0][0]} ${P[0][1]} L ${P[1][0]} ${P[1][1]} A ${R} ${R} 0 ${flag} 1 ${P[2][0]} ${P[2][1]} L ${P[3][0]} ${P[3][1]} A ${r} ${r}  0 ${flag} 0 ${P[0][0]} ${P[0][1]} Z`;
};

const arc = (opts = {}) => {
  const { x = 0, y = 0 } = opts;
  let {
    R = 0, r = 0, start, end,
  } = opts;

  [R, r] = [Math.max(R, r), Math.min(R, r)];
  if (R <= 0) return '';
  if (start !== +start || end !== +end) return full(x, y, R, r);
  if (Math.abs(start - end) < 0.000001) return '';
  if (Math.abs(start - end) % 360 < 0.000001) return full(x, y, R, r);

  [start, end] = [start % 360, end % 360];

  if (start > end) end += 360;
  return part(x, y, R, r, start, end);
};

const getTimeDegrees = (time, hours=24) => {
    let seconds =  dateFns.differenceInSeconds(time, dateFns.startOfDay(time));
    let angle = (360 / (24*60*60)) * seconds +180;
    return math__default['default'].wrap(angle,0,360);
};


const timeArcCenter =  (startTime, endTime, radius) => {

    let seconds =  dateFns.differenceInSeconds(startTime, endTime );
    
    let high = dateFns.addSeconds(startTime,  seconds);

    console.log(dateFns.format(startTime,"HH:mm"),dateFns.format(high,"HH:mm"), dateFns.format(endTime,"HH:mm") );

    let degrees = getTimeDegrees(high);
    
    let radians = degrees * (Math.PI/180);
    
    let x = radius * Math.sin(radians);
    let y = radius * Math.cos(radians);
    return [x,y]

};

const timeArc = (startTime, endTime, innerRadius=40, outerRadius=118) =>{
    const path= arc({
        R: innerRadius,
        r: outerRadius,
        start: getTimeDegrees(startTime),
        end:  getTimeDegrees(endTime)
    });
    return path
};

function radians_to_degrees(radians){
  return radians * (180/Math.PI);
}

const moonPath = (fraction, phase, parallacticAngle = 1,radius = 500, center=[0,0]) => {
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

  rotate__default['default'](p1,p1,angle);
  rotate__default['default'](p2,p2,angle);

  add__default['default'](p1, p1, center);
  add__default['default'](p2, p2, center);
  
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


const getMoonIcon=(location=[50.935173, 6.953101], date=new Date, radius=100, center=[0,0]) =>{

  let {fraction, phase} = SunCalc__default['default'].getMoonIllumination(date);
  let {parallacticAngle} = SunCalc__default['default'].getMoonPosition(date,location[0],location[1]);

  return `<path d="${moonPath(fraction, phase,parallacticAngle,radius,center)}" fill="#fff"></path>`

};

const  sunTimesCircle = (location=[50.935173, 6.953101], date=new Date, day="#FFBB0E", night="070055" )=> {
    
    var times = SunCalc__default['default'].getTimes(date, location[0], location[1]);
    
    let svg = `<g>`;
	svg += `<path d="${timeArc(times.night,times.nightEnd)}" fill="#070055"></path>`;
	svg += `<path d="${timeArc(times.nightEnd,times.nauticalDawn)}" fill="#0F00BB"></path>`;
	svg += `<path d="${timeArc(times.nauticalDawn,times.dawn)}" fill="#573887"></path>`;
	svg += `<path d="${timeArc(times.dawn,times.sunrise)}" fill="#9F7053"></path>`;
	svg += `<path d="${timeArc(times.sunrise,times.sunset)}" fill="#FFBB0E"></path>`;
	svg += `<path d="${timeArc(times.sunset,times.dusk)}" fill="#9F7053"></path>`;
	svg += `<path d="${timeArc(times.dusk,times.nauticalDusk)}" fill="#573887"></path>`;
	svg += `<path d="${timeArc(times.nauticalDusk,times.night)}" fill="#0F00BB"></path>`;
    svg += "</g>";
	
	var moonTimes = SunCalc__default['default'].getMoonTimes(date, location[0], location[1]);

	console.log(JSON.stringify(moonTimes));
	if(moonTimes.rise && moonTimes.set){

	svg += `<path d="${timeArc(moonTimes.rise,moonTimes.set, 80,82)}" fill="#fff"></path>`;
	

	let moonCenter = timeArcCenter(moonTimes.rise,moonTimes.set, 81);

	svg += `<circle cx="${moonCenter[0]}" cy="${moonCenter[1]}" r="10" />`;
	svg += getMoonIcon(location, date,9,moonCenter);


	}
	return svg;
};

const sunTimesTable = (location=[50.935173, 6.953101], date=new Date ) =>{


var times = SunCalc__default['default'].getTimes(date, location[0], location[1]);
let moonTimes = SunCalc__default['default'].getMoonTimes(date, location[0], location[1]);

Object.assign(times, moonTimes);

let timesArray = [];


Object.keys(times).map( key => {
    timesArray.push(
        {
            key: key,
            date: times[key], 
            time: dateFns.format(times[key],"HH:mm"),
        }
    );
});

var suntimeIsBefore = (st1, st2) =>{

    if (dateFns.isBefore(st1.date, st2.date)) {
        return -1;
      }
      if (dateFns.isBefore(st2.date, st1.date)) {
        return 1;
      }

      return 0;
};

timesArray = timesArray.sort(suntimeIsBefore);

let table = "<table class='sun-times-table'>";
timesArray.map(({time, key}) => {
      table += `<tr class="${key}"><th scope="row">${key}<th><td>${time}</td></tr>`;
});


table += "</table>";

return table

};

const clock = () => {
    return `
    <svg viewBox = "-150 -150 300 300">
        ${sunTimesCircle()}
    </svg>`
};

const table = () =>{
    return sunTimesTable()
};

exports.clock = clock;
exports.table = table;

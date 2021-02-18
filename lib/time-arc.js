import { differenceInSeconds, startOfDay, addSeconds, format} from 'date-fns';
import math from 'canvas-sketch-util/math';
import arc from './arc';

export const getTimeDegrees = (time, hours=24) => {
    let seconds =  differenceInSeconds(time, startOfDay(time));
    let angle = (360 / (24*60*60)) * seconds +180;
    return math.wrap(angle,0,360);
}


export const timeArcCenter =  (startTime, endTime, radius) => {

    let seconds =  differenceInSeconds(startTime, endTime );
    
    let high = addSeconds(startTime,  seconds)

    console.log(format(startTime,"HH:mm"),format(high,"HH:mm"), format(endTime,"HH:mm") )

    let degrees = getTimeDegrees(high);
    
    let radians = degrees * (Math.PI/180);
    
    let x = radius * Math.sin(radians);
    let y = radius * Math.cos(radians);
    return [x,y]

}

export const timeArc = (startTime, endTime, innerRadius=40, outerRadius=118) =>{
    const path= arc({
        R: innerRadius,
        r: outerRadius,
        start: getTimeDegrees(startTime),
        end:  getTimeDegrees(endTime)
    })
    return path
}
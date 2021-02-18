import {sunTimesCircle} from "./lib//sun-times-circle.js"
import {sunTimesTable} from "./lib//sun-times-table.js"



export const  clock = () => {
    return `
    <svg viewBox = "-150 -150 300 300">
        ${sunTimesCircle()}
    </svg>`
}

export const table = () =>{
    return sunTimesTable()
}

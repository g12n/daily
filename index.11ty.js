let now = new Date;
const Arvelie =  require('./lib/arvelie')

let today =now.toArvelie()

class Test {
  // or `async data() {`
  // or `get data() {`
  data() {
    return {
      name: "d",
     // layout: "teds-rad-layout",
      // … other front matter keys
    };
  }

  render({name}) {
    // will always be "Ted"
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${today.toString()}</title>
    <style>
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
      font-size: clamp(16px, calc(1rem + 0.5vw), 24px)
    }
    .arvelie{
      display: grid;
      grid-gap: 10px;
      padding: 10px;
      margin: auto auto;
      justify-content: center;
      text-align: center;
      width: 100vmin;
      height: 100vmin;
      grid-template-rows: repeat(7,1fr);
      grid-template-columns: repeat(7,1fr);
      box-sizing: border-box;
      background: #fff;
    }
    .arvelie span{
      background: #ddd;
      display: flex; 
      align-items: center; 
      justify-content: center;
      grid-column: span 3;
      grid-row: span 3;
      font-size: 8vmin;
      font-weight: 800;
    }

    .arvelie .y{
      grid-area: 1/1/4/4;
    }
    .arvelie .m{
      grid-area: 3/3/6/6;
    }
    .arvelie .d{
      grid-area: 5/5/8/8  ;
    }

    </style>
  </head>
  <body>
    <div class="arvelie">
      <span class="y">${today.y}</span>
      <span class="m">${today.m}</span>
      <span class="d">${today.d}</span>
    </div>
  </body>
</html>`
  }
}

module.exports = Test;
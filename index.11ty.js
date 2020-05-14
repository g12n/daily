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
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${today.toString()}</title></head>
<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: clamp(16px, calc(1rem + 0.5vw), 24px)
}


.arvelie{display: grid; grid-gap: 10px; padding: 10px; marign: 10px auto; justify-content: center;text-align: center}
</style>

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
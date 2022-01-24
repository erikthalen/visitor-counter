export default `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>visitor-counter</title>
  </head>
  <body>
    <code>
      <pre style="margin: 0;">Demo page for visitor-counter 📈👀

<a href="https://github.com/erikthalen/visitor-counter">Github</a>
<a href="https://www.npmjs.com/package/visitor-counter">NPM</a>

Minimal effort way of tracking the
amount of visitors on your website

Get visitors of this page:

<input style="width: 236px" type="range" min="0" max="7" step="1" value="3">
 |   |   |   |   |   |   |   |
 s   m   h   d   w   m   y  all

Visitors last <span class="range"></span>:

<output style="color: dodgerblue;background: #f5f5f5;display: inline-block;padding: 1em 4em 1em 1em;border-radius: 5px;"></output>
      </pre>
    </code>
    <script>
      const map = {
        0: '/?range=second',
        1: '/?range=minute',
        2: '/?range=hour',
        3: '/?range=day',
        4: '/?range=week',
        5: '/?range=month',
        6: '/?range=year',
        7: '/?all'
      }
      const input = document.querySelector('input')
      const output = document.querySelector('output')
      const range = document.querySelector('.range')
      input.addEventListener('input', ({ target: { value } }) => updateOutput(value))
      updateOutput(3)
      async function updateOutput(value) {
        range.textContent = map[value].split('=')[1] || 'forever'
        output.textContent = await fetch(map[value]).then(res =>
          res.text()
        )
      }
    </script>
  </body>
</html>
`

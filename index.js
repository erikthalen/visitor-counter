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

Minimal effort way of tracking the amount of visitors on your website

Stats for this page:
There are currently <span class="currently">0</span> visitor(s) on this page
<a href="/?all">All</a>
<a href="/?range=second">Last second</a>
<a href="/?range=minute">Last minute</a>
<a href="/?range=hour">Last hour</a>
<a href="/?range=day">Last day</a>
<a href="/?range=month">Last month</a>
<a href="/?range=year">Last year</a>
      </pre>
    </code>
    <script>
      ;(async () => {
        const currently = document.querySelector('.currently')
        currently.textContent = await fetch('/currently').then(res =>
          res.text()
        )
      })()
    </script>
  </body>
</html>
`

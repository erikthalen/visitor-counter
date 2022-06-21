const map = {
  0: '/?range=second',
  1: '/?range=minute',
  2: '/?range=hour',
  3: '/?range=day',
  4: '/?range=week',
  5: '/?range=month',
  6: '/?range=year',
  7: '/?range=all',
}

let canvas = null
let canvas2 = null
const input = document.querySelector('input')
const total = document.getElementById('total')

input.addEventListener('input', ({ target: { value } }) => updateOutput(value))

updateOutput(input.value)

async function updateOutput(value) {
  canvas && canvas.destroy()
  canvas2 && canvas2.destroy()
  total.textContent = ''
  loading(true)

  const response = await fetch('/visitor-counter' + map[value])
  const text = await response.text()
  const json = JSON.parse(text)

  console.log(json)

  if (!json.total) {
    loading(false, 'No visitors in this period')
    return
  }

  total.textContent = 'Total: ' + json.total

  Chart.defaults.font.family = 'monospace'

  let delayed
  let delayed2

  const plugins = {
    legend: false,
    tooltip: {
      titleFont: { weight: 'normal', size: 12 },
      bodyFont: { weight: 'normal', size: 48 },
      titleSpacing: 0,
      bodySpacing: 0,
      titleColor: '#fff',
      bodyColor: '#fff',
      backgroundColor: 'rgba(0,0,0,0.9)',
      padding: {
        top: 16,
        right: 84,
        bottom: 16,
        left: 16,
      },
      cornerRadius: 10,
      displayColors: false,
      caretSize: 8,
      caretPadding: 10,
    },
  }

  const config = {
    type: 'line',
    data: {
      labels: Object.keys(json.dates),
      datasets: [
        {
          label: '',
          borderColor: 'dodgerblue',
          data: Object.values(json.dates),
          fill: {
            target: 'origin',
            above: 'RGBA(30, 144, 255, 0.05)',
          },
        },
      ],
    },
    options: {
      elements: {
        line: {
          tension: 0.1,
        },
        point: {
          radius: 2,
          hitRadius: 15,
          hoverRadius: 2,
        },
      },
      interaction: {
        mode: 'nearest',
      },
      plugins,
      animation: {
        onComplete: () => {
          delayed = true
        },
        delay: (context, idx) => {
          let delay = 0
          if (
            context.type === 'data' &&
            context.mode === 'default' &&
            !delayed
          ) {
            delay = context.dataIndex * 5 + context.datasetIndex * 10
          }
          return delay
        },
      },
    },
  }

  const config2 = {
    type: 'doughnut',
    data: {
      labels: Object.keys(json.countries),
      datasets: [
        {
          label: '',
          backgroundColor: [...Array(Object.keys(json.countries).length)].map(
            (_, i) =>
              `hsla(${210}, 80%, ${Math.floor((i * 14 + 50) % 100)}%, 0.9)`
          ),
          borderWidth: 0,
          data: Object.values(json.countries),
        },
      ],
    },
    options: {
      plugins,
    },
  }

  canvas = new Chart(document.getElementById('canvas'), config)
  canvas2 = new Chart(document.getElementById('canvas2'), config2)
  loading(false)
}

function loading(isLoading, msg = '') {
  const loading = document.querySelector('.loading')
  loading.innerHTML = isLoading ? 'Loading...' : msg
}

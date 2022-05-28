"use strict";var n=require("crypto"),e=require("fast-geoip"),t=require("mongodb"),a=require("url");function o(n){return n&&"object"==typeof n&&"default"in n?n:{default:n}}var i=o(e),r=o(a);const s=new Intl.DisplayNames(["en"],{type:"region"}),c=async n=>{const e=(n.headers["x-forwarded-for"]||"").split(",")[0]||n.connection.remoteAddress;if(e&&"::ffff:127.0.0.1"!==e)return await(async(n,e=Date.now())=>{const t=await i.default.lookup(n);return{ip:n,countryCode:t?.country||!1,country:!!t&&s.of(t.country),date:e}})(e)},d=async n=>({total:n.length,...n.sort(((n,e)=>n.date<e.date?-1:1)).reduce(((n,{country:e,date:t})=>{const a=new Date(t).toLocaleDateString();return{...n,countries:{...n.countries,[e]:(n.countries&&n.countries[e]||0)+1},dates:{...n.dates,[a]:(n.dates&&n.dates[a]||0)+1}}}),{})}),l=864e5,u={second:1e3,minute:6e4,hour:36e5,day:l,week:6048e5,month:2627856e3,year:31534272e3};module.exports=async({mongourl:e="mongodb://127.0.0.1:27017",id:a="default"}={})=>{const o=await(({mongourl:n,dbName:e="visitor-counter",id:a,ttl:o=3600})=>new Promise((i=>{var r;t.MongoClient.connect(`${r=n,r.endsWith("/")?r.slice(0,-1):r}/${e}`,(async(n,t)=>{if(n)throw n;const r=t.db(e),s=r.collection(a),c=r.collection(`${a}-current`);try{c.createIndex({createdAt:1},{expireAfterSeconds:o})}catch(n){console.log(n)}i({setTTL:n=>{try{c.dropIndexes(),c.createIndex({createdAt:1},{expireAfterSeconds:n})}catch(n){console.log(n)}},setVisitor:n=>{try{return c.insertOne({id:n,createdAt:new Date})}catch(n){console.log(n)}},getVisitor:async n=>{try{return await c.findOne({id:n})}catch(n){console.log(n)}},getVisitorCount:async()=>new Promise(((n,e)=>{c.count({},((a,o)=>{a&&(t.close(),e(a)),n(o)}))})),set:n=>{try{if(n)return s.insertOne(n)}catch(n){console.log(n)}},get:(n={})=>new Promise(((e,a)=>{s.find(n,{projection:{_id:0}}).toArray(((n,o)=>{n&&(t.close(),a(n)),e(o)}))}))})}))})))({id:a,mongourl:e});async function i(n){if(!n)return d(await o.get());const[e,t]=n.split("-"),a=u[e]?Date.now()-u[e]:new Date(e).getTime(),i=t?new Date(t).getTime():Date.now(),r=await o.get({date:{$gte:a,$lte:i}});return d(r)}return{record:async(e,t,i)=>{const r=(s=e.headers.cookie,s?s.split(";").map((n=>n.split("="))).reduce(((n,[e,t])=>({...n,[decodeURIComponent(e.trim())]:decodeURIComponent(t.trim())})),{}):{})[`vc-id-${a}`];var s;if(!await o.getVisitor(r)){const i=n.randomUUID();o.setVisitor(i),o.set(await c(e)),t.setHeader("Set-Cookie",`vc-id-${a}=${i}`)}"function"==typeof i&&i()},get:i,visitors:async()=>await o.getVisitorCount(),async ui(n,e,t){const{pathname:a,query:o}=r.default.parse(n.url,!0);"visitor-counter"===a.replaceAll("/","")&&(o.range||e.end("<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>visitor-counter</title><script src=\"https://cdn.jsdelivr.net/npm/chart.js\"><\/script></head><body><code><pre style=\"margin: 0\">📈👀\n      \n<input style=\"width: 236px\" type=\"range\" min=\"0\" max=\"7\" step=\"1\" value=\"5\">\n |   |   |   |   |   |   |   |\n s   m   h   d   w   m   y  all\n\n\n</pre><div class=\"loading\"></div><div style=\"position: relative; width: 100%\"><canvas id=\"canvas\"></canvas><canvas id=\"canvas2\"></canvas></div></code><script>const map = {\n        0: '/?range=second',\n        1: '/?range=minute',\n        2: '/?range=hour',\n        3: '/?range=day',\n        4: '/?range=week',\n        5: '/?range=month',\n        6: '/?range=year',\n        7: '/?range=all',\n      }\n\n      let canvas = null\n      let canvas2 = null\n      const input = document.querySelector('input')\n\n      input.addEventListener('input', ({ target: { value } }) =>\n        updateOutput(value)\n      )\n\n      updateOutput(input.value)\n\n      async function updateOutput(value) {\n        canvas && canvas.destroy()\n        canvas2 && canvas2.destroy()\n        loading(true)\n\n        const response = await fetch('/visitor-counter' + map[value])\n        const text = await response.text()\n        const json = JSON.parse(text)\n\n        console.log(json)\n\n        Chart.defaults.font.family = 'monospace'\n\n        let delayed\n        let delayed2\n\n        const config = {\n          type: 'line',\n          data: {\n            labels: Object.keys(json.dates),\n            datasets: [\n              {\n                label: '',\n                borderColor: 'dodgerblue',\n                data: Object.values(json.dates),\n                fill: {\n                  target: 'origin',\n                  above: 'RGBA(30, 144, 255, 0.05)',\n                },\n              },\n            ],\n          },\n          options: {\n            elements: {\n              line: {\n                tension: 0.1,\n              },\n              point: {\n                radius: 2,\n                hitRadius: 15,\n                hoverRadius: 2,\n              },\n            },\n            interaction: {\n              mode: 'nearest',\n            },\n            plugins: {\n              legend: false,\n              tooltip: {\n                titleFont: { weight: 'normal', size: 12 },\n                bodyFont: { weight: 'normal', size: 48 },\n                titleSpacing: 0,\n                bodySpacing: 0,\n                titleColor: '#fff',\n                bodyColor: '#fff',\n                backgroundColor: 'rgba(0,0,0,0.9)',\n                padding: {\n                  top: 16,\n                  right: 84,\n                  bottom: 16,\n                  left: 16,\n                },\n                cornerRadius: 10,\n                displayColors: false,\n                caretSize: 8,\n                caretPadding: 10,\n              },\n            },\n            animation: {\n              onComplete: () => {\n                delayed = true\n              },\n              delay: (context, idx) => {\n                let delay = 0\n                if (\n                  context.type === 'data' &&\n                  context.mode === 'default' &&\n                  !delayed\n                ) {\n                  delay = context.dataIndex * 5 + context.datasetIndex * 10\n                }\n                return delay\n              },\n            },\n          },\n        }\n\n        const config2 = {\n          type: 'pie',\n          data: {\n            labels: Object.keys(json.countries),\n            datasets: [\n              {\n                label: '',\n                backgroundColor: 'dodgerblue',\n                borderColor: '#eee',\n                data: Object.values(json.countries),\n              },\n            ],\n          },\n          options: {\n            responsive: true,\n            plugins: {\n              legend: {\n                position: 'top',\n              },\n              title: {\n                display: false,\n              },\n            },\n          },\n        }\n\n        canvas = new Chart(document.getElementById('canvas'), config)\n        // canvas2 = new Chart(document.getElementById('canvas2'), config2)\n        loading(false)\n      }\n\n      function loading(isLoading) {\n        const loading = document.querySelector('.loading')\n        loading.innerHTML = isLoading ? 'Loading...' : ''\n      }<\/script></body></html>"),e.end(JSON.stringify(await i("all"!==o.range&&o.range)))),"function"==typeof t&&t()}}};

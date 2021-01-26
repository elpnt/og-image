import { readFileSync } from 'fs'
import marked from 'marked'
import { sanitizeHtml } from './sanitizer'
import { ParsedRequest } from './types'
const twemoji = require('twemoji')
const twOptions = { folder: 'svg', ext: '.svg' }
const emojify = (text: string) => twemoji.parse(text, twOptions)

const rglr = readFileSync(
  `${__dirname}/../_fonts/NotoSans-Regular.woff2`
).toString('base64')
const bold = readFileSync(
  `${__dirname}/../_fonts/NotoSans-Bold.woff2`
).toString('base64')
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString(
  'base64'
)

function getCss(theme: string, fontSize: string) {
  const foreground = theme === 'dark' ? '#fff' : '#111'

  return `
    @import url('https://fonts.googleapis.com/css?family=Noto+Sans+JP');
    @font-face {
        font-family: 'NotoSans';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'NotoSans';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
      }

    body {
        height: 100vh;
        margin: 0;
        padding: 0;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
    }

    code {
        color: #D400FF;
        padding: 0.1em;
        border-radius: 0.1em;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }
    
    .heading {
        font-family: 'NotoSans', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
        color: ${foreground};
        line-height: 1.8;
        text-heading: justify;
        text-shadow: 0 0 0.04em #808080;
    }
    
    #tsparticles {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: -1;
    }`
}

export function getHtml(parsedReq: ParsedRequest) {
  const { text, theme, md, fontSize, num } = parsedReq
  const background = theme === 'dark' ? '#111' : '#fff'
  const particleColor = theme === 'dark' ? '#707070' : '#a0a0a0'

  const config = {
    particles: {
      number: {
        value: parseInt(num),
      },
      links: {
        enable: true,
        color: particleColor,
      },
      move: {
        enable: false,
      },
      size: {
        value: 3,
        random: true,
      },
      color: {
        value: particleColor,
      },
    },
    background: {
      color: background,
    },
  }

  return `
    <!DOCTYPE html>
    <html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize)}
    </style>
    <body>
        <div id="tsparticles"></div>
        <div>
            <div class="heading">${emojify(
              md ? marked(text) : sanitizeHtml(text)
            )}
            </div>
        </div>
    </body>
    <script
        src="https://cdnjs.cloudflare.com/ajax/libs/tsparticles/1.18.1/tsparticles.min.js"
        integrity="sha512-PYHWDEuXOTJ9MZ+/QHqkbgiEYZ+LImQv3i/9NyYOABFvK37e4q4Wg7aQDN1JpoGiEu1TYZh6JMrZluZox2gbDA=="
        crossorigin="anonymous"
    ></script>
    <script>
        tsParticles.load('tsparticles', ${JSON.stringify(config)});
    </script>
    </html>`
}

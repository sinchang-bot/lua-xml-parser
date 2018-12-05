const json = require('../assets/home.json')
const fs = require('fs')

let wrap = `
<?xml version="1.0" encoding="UTF-8"?>
<manifest xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
	<page id="${json.id}">
		<scripts>
			<script src="${json.scripts[0].src}" />
		</scripts>
`

let s = ''

Object.keys(json.layout).forEach(v => {
  if (v !== 'qName' && v !== 'subitems') {
    s += `${v}="${json.layout[v]}" `
  }
})

wrap += `<layout ${s} >`

let q = ''

if (json.layout.subitems) {
  parse(json.layout.subitems, 'layout')
}

wrap += q

wrap += `</page>
</manifest>`

fs.writeFileSync('dist/home.xml', wrap)

function parse(items, qName) {
  if (!items || items.length < 1) return
  for (let index = 0; index < items.length; index++) {
    const element = items[index];
    let s = `<${element.qName} `
    Object.keys(element).forEach(v => {
      if (v !== 'subitems' && v !== 'qName') {
        s += `${v}="${element[v]}" `
      }
    })

    if (element.subitems) {
      s += '>'
      q += s
      parse(element.subitems, element.qName)
    } else {
      s += `></${element.qName}>`
      q += s
    }
  }

  q += `</${qName}>`
}
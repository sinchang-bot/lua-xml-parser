const fs = require('fs')
const convert = require('xml-js')

module.exports = (xmlPath, distPath) => {
  const filename = xmlPath
    .split('/')
    [xmlPath.split('/').length - 1].split('.')[0]
  const xml = fs.readFileSync(xmlPath)
  const result = JSON.parse(
    convert.xml2json(xml, { compact: false, spaces: 2 })
  )

  let ret = { schema: 'v1' }
  const elements = result.elements[0].elements

  ret.id = elements[0].attributes.id

  elements[0].elements.forEach(element => {
    if (element.name === 'scripts') {
      ret.scripts = []

      element.elements.forEach(script => {
        ret.scripts.push({
          src: script.attributes.src
        })
      })
    } else {
      if (element.name === 'layout') {
        ret[element.name] = {
          qName: 'view'
        }

        for (const prop in element.attributes) {
          ret[element.name][prop] = element.attributes[prop]
        }

        const repeat = (params, key) => {
          if (!params) return false

          params.forEach(param => {
            const obj = {
              qName: param.name
            }

            for (const prop in param.attributes) {
              obj[prop] = param.attributes[prop]
            }

            if (!key.subitems) key.subitems = []

            key.subitems.push(obj)

            if (param.elements) {
              obj.subitems = []
              repeat(param.elements, obj)
            }
          })
        }

        repeat(element.elements, ret[element.name])
      }
    }
  })

  fs.writeFileSync(distPath + filename + '.json', JSON.stringify(ret))
}

const watch = require('watch')
const readPkg = require('read-pkg')
const parser = require('./parser')

const pkg = readPkg.sync()
const src= pkg.lua.src
const distPath = pkg.lua.dist

src.forEach(srcPath => {
  parser(srcPath, distPath)
})

watch.watchTree('./', {
  ignoreDotFiles: true,
  ignoreDirectoryPattern: /node_modules/,
}, (f, curr, prev) => {
  if (typeof f == "object" && prev === null && curr === null) {
    // Finished walking the tree
  } else if (prev === null) {
    // f is a new file
  } else if (curr.nlink === 0) {
    // f was removed
  } else {
    // f was changed    
    if (!src.includes(f)) return
    console.log(f + ' changed')
    parser(f, distPath)
  }
})
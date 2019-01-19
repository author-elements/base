const fs = require('fs-extra')
const dist = require('path').join('./dist')

if (fs.existsSync(dist)) {
  fs.removeSync(dist)
}

import fs from 'fs'
import path from 'path'
import { readPackage } from 'read-pkg';

const resolvePkg = function (context) {
  if (fs.existsSync(path.join(context, 'package.json'))) {
    return readPackage.sync({ cwd: context })
  }
  return {}
}

export default resolvePkg
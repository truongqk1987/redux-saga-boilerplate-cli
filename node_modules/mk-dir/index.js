var fs = require('fs');
var path = require('path');
// console.log('process.cwd()', process.cwd());
function MakeFolder(folder) {
  try {
    if (!folder) return;
    folder = path.normalize(folder);
    var now = folder;
    while (now && !fs.existsSync(now)) {
      now = now.substr(0, now.lastIndexOf('/'));
      // console.log('now:', now);
    }
    if (now && now[now.length - 1] !== '/') now += '/';
    var append = folder.substr(now.length);
    var folders = append.split('/').filter(function (v) {
      return v.length > 0;
    });
    // console.log('folders:', folders);
    for (var i = 0; i < folders.length; i++) {
      now += folders[i] + '/';
      // console.log('mk-dir:', now);
      fs.mkdirSync(now);
    }
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

module.exports = MakeFolder;
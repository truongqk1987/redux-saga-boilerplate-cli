var mkdir = require('../index.js');


mkdir('sub/../sub/sub/test');
mkdir('p/p/p/p');
mkdir('p/../../p/p/test');
mkdir(__dirname + '/abc/abc/test');
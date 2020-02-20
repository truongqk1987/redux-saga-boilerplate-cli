const path = require('path');
const copydir = require('copy-dir');

const { getCLIPath } = require('../global-store');

module.exports = () => [
    'make-project <project-name>',
    'Make project from react-boilerplate',
    yargs => {
        return yargs.positional('project-name', {
            describe: 'Name of project',
          })
    },
    (args) => {
        try {
            const spawn = require("cross-spawn");
            const childProcess = spawn("npx", ["create-react-app", args['project-name']], {stdio: 'inherit'});
            childProcess.on('close', function (code) {
                if (code === 0) {
                    console.log('Project is ready to using now!');
                }
            })
            
        } catch(error) {
            if (error) console.log(error);
        }
    }
]
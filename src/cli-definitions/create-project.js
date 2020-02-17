const path = require('path');
const copydir = require('copy-dir');

const { getCLIPath } = require('../global-store');

module.exports = () => [
    'create-project <project-name>',
    'Create project from react-boilerplate',
    yargs => {
        return yargs.positional('project-name', {
            describe: 'Name of project',
          })
    },
    (args) => {
        try {
            copydir.sync(
                path.join(__dirname, 'react-boilerplate'),
                path.join(getCLIPath(), args['project-name']),
                { cover: false },
                error => error && console.log(error)
            );
            console.log('Project is ready to using now!');
        } catch(error) {
            if (error) console.log(error);
        }
    }
]
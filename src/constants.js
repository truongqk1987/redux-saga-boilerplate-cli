
module.exports = {
    DEFAULT_ENCODING: "utf-8",
    DEFAULT_BASE_API: "http://localhost:3000",
    DEFAULT_TEMPLATE_FILE_MAP_INFO: {
        'action': {
            parentFolderName: 'actions',
            extension: 'ActionCreator.js'
        },
        'saga': {
            parentFolderName: 'sagas',
            extension: 'Saga.js'
        },
        'sagas-index': {
            parentFolderName: 'sagas',
            extension: '.js'
        },
        'reducer': {
            parentFolderName: 'reducers',
            extension: 'Reducer.js'
        },
        'reducers-index': {
            parentFolderName: 'reducers',
            extension: '.js'
        },
        'entity-component': {
            parentFolderName: 'components',
            extension: '.js'
        },
        'entity-components-index': {
            parentFolderName: 'components',
            extension: '.js'
        },
        'container-component': {
            parentFolderName: '',
            extension: '.js'
        }
    },
    DEFAULT_REQUIRED_LIBS: [
        'redux',
        'react-redux',
        'hoist-non-react-statics',
        'redux-thunk',
        'redux-saga',
        'redux-devtools-extension',
        'invariant',
        'lodash',
        'react-router',
        'connected-react-router',
        'axios'
    ],
    DEFAULT_PROJECT_SOURCE_PATH: "src",
    DEFAULT_ROOT_CONTAINERS_PATH: "containers",
    DEFAULT_PROJECT_TEMPLATES_PATH: "templates",
}
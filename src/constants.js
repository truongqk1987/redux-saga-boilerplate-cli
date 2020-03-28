
module.exports = {
    DEFAULT_ENCODING: "utf-8",
    DEFAULT_BASE_API: "http://localhost:3000",
    DEFAULT_TEMPLATE_FILE_MAP_INFO: {
        'action': {
            parentFolder: 'actions',
            extension: 'ActionCreator.js'
        },
        'saga': {
            parentFolder: 'sagas',
            extension: 'Saga.js'
        },
        'sagas-index': {
            parentFolder: 'sagas',
            extension: '.js'
        },
        'reducer': {
            parentFolder: 'reducers',
            extension: 'Reducer.js'
        },
        'reducers-index': {
            parentFolder: 'reducers',
            extension: '.js'
        },
        'entity-component': {
            parentFolder: 'components',
            extension: '.js'
        },
        'entity-components-index': {
            parentFolder: 'components',
            extension: '.js'
        },
        'container-component': {
            parentFolder: '',
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
        'axios',
        'reselect',
        'history'
    ],
    DEFAULT_PROJECT_SOURCE_PATH: "src",
    DEFAULT_ROOT_CONTAINERS_PATH: "containers",
}
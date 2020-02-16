
module.exports = {
    DEFAULT_ENCODING: "utf-8",
    DEFAULT_BASE_API: "http://localhost:3000",
    DEFAULT_INIT_REDUX_SAGA_FILES_CONFIG: {
        'store': {
            container: 'src',
            targetFileName: 'my-store',
        },
        'rootReducer': {
            container: 'src',
            targetFileName: '',
        },
        'rootSaga': {
            container: 'src',
            targetFileName: '',
        }
    },
    DEFAULT_REDUX_SAGA_FOLDERS: [
        'actions',
        'sagas',
        'reducers',
        'components'
    ],
    DEFAULT_TEMPLATE_FILE_MAP_INFO: {
        'action': {
            container: 'actions',
            extension: 'ActionCreator.js'
            // containerWithoutSpecificContainer: "src"
        },
        'saga': {
            container: 'sagas',
            extension: 'Saga.js'
        },
        'reducer': {
            container: 'reducers',
            extension: 'Reducer.js'
        },
        'entityComponent': {
            container: 'components',
            extension: 'Component.js'
        }
    },
    DEFAULT_REQUIRED_LIBS: [
        'redux',
        'redux-thunk',
        'redux-saga',
        'redux-devtools-extension',
        'axios'
    ],
    DEFAULT_ROOT_PROJECT_SOURCE_PATH: "src",
    DEFAULT_ROOT_CONTAINERS_PATH: "src/containers"
}

module.exports = {
    TARGET_FILE_IN_ROOT_FOLDER: 0,
    TARGET_FILE_IN_SPECIFIC_CONTAINER_FOLDER: 1, // src/container/<A>/actions/
    TARGET_FILE_IN_GLOBAL_REDUX_FOLDER: 2, // src/actions, src/sagas, src/reducers
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
    DEFAULT_REDUX_SAGA_TEMLATE_FILES: [
        'action',
        'saga',
        'reducer',
        'entityComponent'
    ],
    DEFAULT_TEMPLATE_FILE_MAP_INFO: {
        'action': {
            parentFolderName: 'actions',
            extension: 'ActionCreator.js'
        },
        'saga': {
            parentFolderName: 'sagas',
            extension: 'Saga.js'
        },
        'reducer': {
            parentFolderName: 'reducers',
            extension: 'Reducer.js'
        },
        'entityComponent': {
            parentFolderName: 'components',
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
}
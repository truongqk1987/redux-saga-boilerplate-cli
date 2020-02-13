module.exports = {
    TARGET_FILE_IN_ROOT_FOLDER: 0,
    TARGET_FILE_IN_CONTAINER_REDUX_FOLDER: 1, // src/container/<A>/actions/
    TARGET_FILE_IN_GLOBAL_REDUX_FOLDER: 2, // src/actions, src/sagas, src/reducers
    INIT_REDUX_SAGA_FILES: [
        'store',
        'rootReducer',
        'rootSaga',
    ],
}
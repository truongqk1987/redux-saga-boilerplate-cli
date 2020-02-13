import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';


import reducers from './rootReducer';
import sagas from './rootSaga';

const sagaMiddleWare = createSagaMiddleware()

const middleWare = [thunk, sagaMiddleWare];

const enhancers = composeWithDevTools(
    applyMiddleware(...middleWare)
)
let store = createStore(reducers, enhancers);
sagaMiddleWare.run(sagas);

export default store;
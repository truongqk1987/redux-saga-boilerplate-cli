
import { all, takeEvery, put, call } from 'redux-saga/effects'
import axios from 'axios';

import {
  FETCH_'<NAMEOF>',
  FETCH_'<NAMEOF>'_SUCCESS,
  FETCH_'<NAMEOF>'_FAILURE,

  UPDATE_'<NAMEOF>',
  UPDATE_'<NAMEOF>'_SUCCESS,
  UPDATE_'<NAMEOF>'_FAILURE,

  DELETE_'<NAMEOF>',
  DELETE_'<NAMEOF>'_SUCCESS,
  DELETE_'<NAMEOF>'_FAILURE,

  CREATE_'<NAMEOF>',
  CREATE_'<NAMEOF>'_SUCCESS,
  CREATE_'<NAMEOF>'_FAILURE
} from "../actions/'<nameOf>'ActionCreator";

function* fetch'<NameOf>'(action) {
  try {
    const response = yield call(axios.get, "'<BaseAPI>'/'<nameOf>'" + action.id);
    const result = yield response.json();
    yield put({ type: FETCH_'<NAMEOF>'_SUCCESS, payload: result})
  } catch (error) {
    yield put({ type: FETCH_'<NAMEOF>'_FAILURE, error})
  }
}

function* delete'<NameOf>'(action) {
  try {
     const response = yield call(axios.delete, "'<BaseAPI>'/'<nameOf>'/" + action.id);
     const result = yield response.json();
     yield put({ type: DELETE_'<NAMEOF>'_SUCCESS, payload: result})
   } catch (error) {
     yield put({ type: DELETE_'<NAMEOF>'_FAILURE, error})
   }
}

function* update'<NameOf>'(action) {
  try {
     const response = yield call(axios.put, "'<BaseAPI>'/'<nameOf>'/" + action.id, action.payload);
     const result = yield response.json();
     yield put({ type: UPDATE_'<NAMEOF>'_SUCCESS, payload: result})
   } catch (error) {
     yield put({ type: UPDATE_'<NAMEOF>'_FAILURE, error})
   }
}

function* create'<NameOf>'(action) {
  try {
     const response = yield call(axios.post, "'<BaseAPI>'/'<nameOf>'", action.payload);
     const result = yield response.json();
     yield put({ type: CREATE_'<NAMEOF>'_SUCCESS, payload: result})
   } catch (error) {
     yield put({ type: CREATE_'<NAMEOF>'_FAILURE, error})
   }
}

export default function* '<NameOf>'Saga() {
    yield all([
      takeEvery(FETCH_'<NAMEOF>', fetch'<NameOf>'),
      takeEvery(UPDATE_'<NAMEOF>', update'<NameOf>'),
      takeEvery(DELETE_'<NAMEOF>', delete'<NameOf>'),
      takeEvery(CREATE_'<NAMEOF>', create'<NameOf>')
    ])
}
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import _ from 'lodash'
import WebIM from "../common/WebIM";
import CommonActions from '@/redux/common'
import AppDB from '@/utils/AppDB';
/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
    setSessionList: ['sessionList'],
    setCurrentSession: ['userId'],
    topSession: ['sessionId', 'sessionType'],
    deleteSession: ['sessionId'],
    getSessionList: () => {
        return (dispatch, getState) => {
            AppDB.getSessionList().then((res) => {
                dispatch(Creators.setSessionList(res))
            })
        }
    }
})
export default Creators
export const INITIAL_STATE = Immutable({
    sessionList: [],
    currentSession: ''
})
/* ------------- Reducers ------------- */
export const setSessionList = (state, { sessionList }) => {
    console.log('sessionList ------', sessionList)
    return state.merge({ sessionList })
}

export const setCurrentSession = (state, { userId }) => {
    return state.merge({ currentSession: userId })
}

export const topSession = (state, { sessionId, sessionType }) => {
    const sessionList = state.getIn(['sessionList'], Immutable([])).asMutable()
    let topSession = { sessionId, sessionType }
    sessionList.forEach((element, index) => {
        if (sessionId === element.sessionId) {
            topSession = element;
            sessionList.splice(index, 1)
        }
    });
    sessionList.unshift(topSession)
    return state.merge({ sessionList })
}

export const deleteSession = (state, { sessionId }) => {
    let sessionList = state.sessionList.asMutable()
    sessionList = sessionList.filter((item) => {
        return item.sessionId !== sessionId
    })
    return state.setIn(['sessionList'], sessionList)
}

/* ------------- Hookup Reducers To Types ------------- */
export const sessionReducer = createReducer(INITIAL_STATE, {
    [Types.SET_SESSION_LIST]: setSessionList,
    [Types.SET_CURRENT_SESSION]: setCurrentSession,
    [Types.TOP_SESSION]: topSession,
    [Types.DELETE_SESSION]: deleteSession
})

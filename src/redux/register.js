import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import WebIM from "../common/WebIM";
import Cookie from 'js-cookie'

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
    setLoginInfo: ['username', 'password', 'token'],
    setLoading: ['fetching'],
    // async
    login: (username, password) => {
        return (dispatch, getState) => {
            const params = {
                user: username.trim().toLowerCase(),
                pwd: password,
                appKey: WebIM.config.appkey,
                success(token) {
                    dispatch(Creators.setLoginInfo(username, password, token.access_token))
                    Cookie.set('webim_' + username, token)
                },
                error: e => {
                    console.error(e)
                }
            }
            WebIM.conn.open(params)
        }
    },
})

const INITIAL_STATE = {
    username: null,
    password: null,
    fetching: false,
}
/* ------------- Reducers ------------- */
export const setLoginInfo = (state = INITIAL_STATE, { username, password, token }) => {
    return Immutable.merge(state, {
        username,
        password,
        token,
    })
}

export const setLoading = (state = INITIAL_STATE, { fetching }) => {
    return Immutable.merge(state, {
        fetching
    })
}

export const loginReducer = createReducer(INITIAL_STATE, {
    [Types.SET_LOGIN_INFO]: setLoginInfo,
    [Types.SET_LOADING]: setLoading
})

export default Creators


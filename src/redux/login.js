import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import WebIM from "../common/WebIM";
import Cookie from 'js-cookie'
import CommonActions from '@/redux/common'
import { history } from '@/common/routes'
import { message } from '@/components/common/Alert'
/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
    setLoginInfo: ['username', 'password', 'token'],
    setLoading: ['fetching'],
    setUserInfo: ['info'],
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
                    console.error('login fail:', e)
                    dispatch(CommonActions.setLoading(false))
                }
            }
            WebIM.conn.open(params)
        }
    },
    loginByToken: (username, token) => {
        return (dispatch, getState) => {
            dispatch(Creators.setLoginInfo(username, null, token))
            WebIM.conn.open({
                user: username.trim().toLowerCase(),
                pwd: token,
                accessToken: token,
                appKey: WebIM.config.appkey
            })
        }
    },

    getUserInfo: id => {
        return (dispatch, getState) => {
            WebIM.conn.fetchUserInfoById(id).then((res) => {
                dispatch(Creators.setUserInfo(res.data[id]))
            })
        }
    },

    updateOwnInfo: (key, value) => {
        return (dispatch, getState) => {
            WebIM.conn.updateOwnUserInfo(key, value).then((res) => {
                dispatch(Creators.setUserInfo(res.data))
            })
        }
    },

    logout: () => {
        return (dispatch, state) => {
            WebIM.conn.close('logout')
            history.push('/login')
        }
    },

    register: (username, password, nickname) => {
        return (dispatch, getState) => {
            let options = {
                username: username.trim().toLowerCase(),
                password: password,
                nickname: nickname || username,
                success: function () {
                    message.success('Registered successfully')
                    history.push('/login')
                },

                error: (err) => {
                    if (JSON.parse(err.data).error === 'duplicate_unique_property_exists') {

                    } else if (JSON.parse(err.data).error === 'illegal_argument') {
                        if (JSON.parse(err.data).error_description === 'USERNAME_TOO_LONG') {
                            return message.error('User name over 64 bytes!')
                        } else if (JSON.parse(err.data).error_description === 'password or pin must provided') {
                            return message.error('The password is not valid!')
                        }
                        message.error('用户名不合法！')
                    } else if (JSON.parse(err.data).error === 'unauthorized') {
                        message.error('Registration failed, no permissions!')
                    } else if (JSON.parse(err.data).error === 'resource_limited') {
                        message.error('Your APP user registration has reached the maximum number, please upgrade to the enterprise version!')
                    }
                }
            }
            // dispatch(Creators.registerRequest(username, password, nickname))
            WebIM.conn.registerUser(options)
        }
    },
})

const INITIAL_STATE = {
    username: null,
    password: null,
    token: null,
    fetching: false,
    isLogin: false,
    info: null
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

export const setUserInfo = (state, { info }) => {
    return state.setIn(['info'], info)
}

export const loginReducer = createReducer(INITIAL_STATE, {
    [Types.SET_LOGIN_INFO]: setLoginInfo,
    [Types.SET_LOADING]: setLoading,
    [Types.SET_USER_INFO]: setUserInfo
})

export default Creators


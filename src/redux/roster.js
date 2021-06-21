import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import _ from 'lodash'
import WebIM from "../common/WebIM";
import CommonActions from '@/redux/common'
/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
    updateRoster: ['roster'],
    // get contacts list
    getContacts: () => {
        return (dispatch, getState) => {
            dispatch(CommonActions.setLoading(true))
            WebIM.conn.getRoster({
                success: roster => {
                    let rosterNames = roster.map(item => item.name)
                    WebIM.conn.fetchUserInfoById(rosterNames).then((res) => {
                        let infos = res.data
                        roster.forEach((item) => {
                            item.info = infos[item.name]
                        })
                        dispatch(Creators.updateRoster(roster))
                        dispatch(CommonActions.setLoading(false))
                    })
                },
                error: error => {
                    dispatch(CommonActions.setLoading(false))
                }
            })
        }
    },
    // add contact
    addContact: to => {
        return (dispatch, getState) => {
            const username = WebIM.conn.context.userId
            WebIM.conn.subscribe({
                to: to,
                message: username + ' request to add friends'
            })
        }
    },
    removeContact: id => {
        return (dispatch, getState) => {
            WebIM.conn.removeRoster({
                to: id,
                success: function () {
                    dispatch(Creators.getContacts())
                },
                error: function () {
                    //TODO ERROR
                }
            })
        }
    },
})
/* ------------- Reducers ------------- */
function isFriend(v) {
    return v.subscription !== 'none'
}
export const updateRoster = (state, { roster }) => {
    let byName = {},
        names = [],
        friends = []
    roster.forEach(v => {
        byName[v.name] = v
        names = Object.keys(byName).sort()
        isFriend(v) && friends.push(v.name)
    })
    return state.merge({
        byName,
        names,
        friends
    })
}

/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({
    byName: null,
    names: [],
    friends: []
})

/* ------------- Hookup Reducers To Types ------------- */
export const rosterReducer = createReducer(INITIAL_STATE, {
    [Types.UPDATE_ROSTER]: updateRoster,
})

export default Creators
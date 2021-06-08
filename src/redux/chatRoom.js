import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import _ from 'lodash'
import WebIM from '@/common/WebIM';
import CommonActions from '@/redux/common'

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
    updateChatRooms: ['rooms'],
    getChatRooms: () => {
        return (dispatch, getState) => {
            let pagenum = 1
            let pagesize = 10
            dispatch(CommonActions.setLoading(true))
            WebIM.conn.getChatRooms({
                pagenum: pagenum,
                pagesize: pagesize,
                success: function (resp) {
                    dispatch(CommonActions.setLoading(false))
                    resp.data && dispatch(Creators.updateChatRooms(resp.data))
                },
                error: function (e) { }
            })
        }
    },
    joinChatRoom: roomId => {
        return (dispatch, getState) => {
            WebIM.conn.joinChatRoom({
                roomId: roomId
            })
        }
    },
    quitChatRoom: roomId => {
        return (dispatch, getState) => {
            WebIM.conn.quitChatRoom({
                roomId: roomId
            })
        }
    }
})

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    byId: {},
    names: []
})

/* ------------- Reducers ------------- */
export const updateChatRooms = (state, { rooms }) => {
    let byId = {}
    let names = []
    rooms.forEach(v => {
        byId[v.id] = v
        names.push(v.name + '_#-#_' + v.id)
    })
    return state.merge({
        byId: byId,
        names: names.sort()
    })
}

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
    [Types.UPDATE_CHAT_ROOMS]: updateChatRooms
})

export default Creators
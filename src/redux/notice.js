import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import WebIM from "../common/WebIM";
import Cookie from 'js-cookie'

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({

    addGroupRequest: ['msg'],
    addFriendRequest: ['msg'],
    disableStatus: ['msgId', 'actionType'],
    acceptFriendRequest: msg => {
        const name = msg.from
        const msgId = msg.id
        return (dispatch, getState) => {
            dispatch(Creators.disableStatus(msgId, 'Agreed'))
            WebIM.conn.acceptInvitation(name)
        }
    },
    declineFriendRequest: msg => {
        const name = msg.from
        const msgId = msg.id
        return (dispatch, getState) => {
            dispatch(Creators.disableStatus(msgId, 'Disagreed'))
            WebIM.conn.declineInvitation(name)
        }
    },

    agreeJoinGroup: (msg) => {
        const msgId = msg.id
        const name = msg.from
        const groupId = msg.gid
        return (dispatch, getState) => {
            dispatch(Creators.disableStatus(msgId, 'Agreed'))
            const options = {
                applicant: name, // The ID of the user who applied to join the group
                groupId: groupId
            };
            WebIM.conn.agreeJoinGroup(options)
        }
    },

    rejectJoinGroup: (msg) => {
        const msgId = msg.id
        const name = msg.from
        const groupId = msg.gid
        return (dispatch, getState) => {
            dispatch(Creators.disableStatus(msgId, 'Disagreed'))
            const options = {
                applicant: name, // The ID of the user who applied to join the group
                groupId: groupId, // group id
                reason: 'I do not like you'
            };
            WebIM.conn.rejectJoinGroup(options)
        }
    },
    agreeInviteIntoGroup: (gid, options) => {
        return (dispatch, getState) => {
            dispatch(Creators.disableStatus(options.id, 'Disagreed'))
            WebIM.conn.agreeInviteIntoGroup(options)
        }
    },
    rejectInviteIntoGroup: (gid, options) => {
        return (dispatch, getState) => {
            dispatch(Creators.disableStatus(options.id, 'Disagreed'))
            WebIM.conn.rejectInviteIntoGroup(options)
        }
    }

})

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    notices: [],
    // unread: 0
})

/* ------------- Reducers ------------- */

export const addGroupRequest = (state, { msg }) => {
    const notices = state.getIn(['notices']).asMutable()
    msg.id = Date.now()
    msg.disabled = false
    notices.unshift(msg)
    return state.setIn(['notices'], notices)
}

export const addFriendRequest = (state, { msg }) => {
    const notices = state.getIn(['notices']).asMutable()
    msg.id = Date.now()
    msg.disabled = false
    notices.unshift(msg)
    return state.setIn(['notices'], notices)
}

export const disableStatus = (state, { msgId, actionType }) => {
    const notices = state.getIn(['notices']).asMutable({ deep: true })
    notices.forEach(element => {
        if (element.id === msgId) {
            element.disabled = true
            element.actionType = actionType
        }
    });
    return state.setIn(['notices'], notices)
}

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
    [Types.ADD_GROUP_REQUEST]: addGroupRequest,
    [Types.ADD_FRIEND_REQUEST]: addFriendRequest,
    [Types.DISABLE_STATUS]: disableStatus
})

export default Creators
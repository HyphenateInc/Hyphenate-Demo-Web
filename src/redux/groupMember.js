import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import _ from 'lodash'
import WebIM from '@/common/WebIM';

const { Types, Creators } = createActions({
    setGroupMember: ['groupId', 'members'],
    getGroupMember: groupId => {
        return (dispatch, getState) => {
            // 废弃接口
            // WebIM.conn.queryRoomMember({
            //     roomId: groupId,
            //     success: function (members) {
            //         dispatch(Creators.setGroupMember(groupId, members))
            //     },
            //     error: function () { }
            // })
        }
    },
    joinGroup: options => {
        return (dispatch, getState) => {
            WebIM.conn.joinGroup(options)
        }
    },
})

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    groupMember: []
})


/* ------------- reducer ------------- */
export const setGroupMember = (state, { groupId, members }) => {
    const byName = _.reduce(
        members,
        (acc, val) => {
            const { member, owner, info } = val
            const name = member || owner
            const affiliation = owner ? 'owner' : 'member'
            acc[name] = { name, affiliation, info }
            return acc
        },
        {}
    )
    const group = state.getIn([groupId], Immutable({})).merge({ byName, names: Object.keys(byName).sort() })
    return state.merge({ [groupId]: group })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
    // [Types.SET_ADMINS]: setAdmins,
    // [Types.OPERATE_ADMIN]: operateAdmin,
    // [Types.SET_MUTED]: setMuted,
    // [Types.OPERATE_MUTED]: operateMuted,
    // [Types.SET_BLACKLIST]: setBlacklist,
    // [Types.OPERATE_BLACKLIST]: operateBlacklist,
    [Types.SET_GROUP_MEMBER]: setGroupMember,
    // [Types.OPERATE_GROUP_MEMBER]: operateGroupMember
    // [Types.REMOVE_GROUP_BLOCK_SINGLE]: removeGroupBlockSingle,
})

export default Creators
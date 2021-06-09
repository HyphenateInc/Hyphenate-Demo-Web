import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import _ from 'lodash'
import WebIM from '@/common/WebIM';
import CommonActions from '@/redux/common'
import { message } from '@/components/common/Alert'
const { Types, Creators } = createActions({
    updateGroup: ['groups'],
    dissolveGroup: ['group'],
    updateGroupInfo: ['info'],
    getGroupInfo: ['groupInfo'],
    updateGroupMemberInfo: ['groupId', 'memberInfo'],
    changeMemberRole: ['groupId', 'userId', 'role'],
    deleteMember: ['groupId', 'userId'],
    getGroups: () => {
        return (dispatch, getState) => {
            dispatch(CommonActions.setLoading(true))
            WebIM.conn.getGroup({
                success: function (response) {
                    dispatch(CommonActions.setLoading(false))
                    dispatch(Creators.updateGroup(response.data))
                },
                error: function (e) {
                    dispatch(CommonActions.setLoading(false))
                }
            })
        }
    },
    dissolveGroupAsync: ({ groupId, groupName }) => {
        return (dispatch, getState) => {
            WebIM.conn.dissolveGroup({
                groupId,
                success: () => {
                    dispatch(Creators.dissolveGroup({ groupId, groupName }))
                },
                error: e => {
                    if (e.type === 17) {
                        message.error('group owner permission is required');
                    }
                }
            })
        }
    },
    // modify group name
    updateGroupInfoAsync: info => {
        return (dispatch, getState) => {
            WebIM.conn.modifyGroup({
                groupId: info.groupId,
                groupName: info.groupName,
                // description: info.description,
                success: response => {
                    // const info = response.data // <-- !!!
                    dispatch(Creators.updateGroupInfo(info))
                },
                error: e => {
                }
            })
        }
    },
    getGroupInfoAsync: groupId => {
        return (dispatch, getState) => {
            WebIM.conn.getGroupInfo({
                groupId: groupId,
                success: response => {
                    let data = response.data[0]
                    let groupMember = data.affiliations || []
                    let groupMemberIds = []
                    groupMember.forEach(member => {
                        if (member.owner) {
                            member.role = 'owner'
                            member.id = member.owner
                            groupMemberIds.push(member.owner)
                        } else if (member.admin) {
                            member.role = 'admin'
                            member.id = member.role
                            groupMemberIds.push(member.admin)
                        } else {
                            member.role = 'member'
                            member.id = member.member
                            groupMemberIds.push(member.member)
                        }
                    });
                    let info = {
                        ...data,
                        affiliations: groupMember,
                        groupMemberIds
                    }
                    dispatch(Creators.getGroupInfo(info))
                    dispatch(Creators.getGroupMemberInfo(groupId, groupMemberIds))
                },
            })
        }
    },
    getGroupMemberInfo: (groupId, ids) => {
        return (dispatch, getState) => {
            WebIM.conn.fetchUserInfoById(ids).then((res) => {
                console.log(res)
                let infos = res.data
                dispatch(Creators.updateGroupMemberInfo(groupId, infos))
            })
        }
    },
    createGroup: (options) => {
        return (dispatch, getState) => {
            WebIM.conn.createGroupNew(options)
        }
    },
    joinGroup: (groupId) => {
        return (dispatch, getState) => {
            let options = {
                groupId: groupId,         // 群组ID
                message: "I want to join"         // 请求信息
            };
            WebIM.conn.joinGroup(options).then((res) => {
                console.log(res)
            })
        }
    }
})

/*---------------- reducer ------------------*/
export const updateGroup = (state, { groups }) => {
    let byId = {}
    let names = []
    groups.forEach(v => {
        byId[v.groupid] = {
            groupId: v.groupid,
            groupName: v.groupname
        }
        names.push(v.groupname + '_#-#_' + v.groupid)
    })
    return state.merge({
        byId,
        names: names.sort()
    })
}

export const dissolveGroup = (state, { group }) => {
    const { groupId, groupName } = group
    let byId = state.getIn(['byId']).without(groupId)
    const names = state.getIn(['names']).asMutable()
    names.splice(names.indexOf(`${groupName}_#-#_${groupId}`), 1)
    return state.merge({
        byId,
        names: names.sort()
    })
}

export const updateGroupInfo = (state, { info }) => {
    const group = state.getIn(['byId', info.groupId])
    const oldName = `${group.groupName}_#-#_${group.roomId || group.groupId}`
    const newName = `${info.groupName}_#-#_${group.roomId || group.groupId}`
    const names = state.getIn(['names']).asMutable()
    names.splice(names.indexOf(oldName), 1, newName)
    return state.setIn(['byId', info.groupId, 'groupName'], info.groupName).set('names', names.sort())
}

export const getGroupInfo = (state, { groupInfo }) => {
    return state.setIn(['byId', groupInfo.id, 'info'], groupInfo)
}

export const updateGroupMemberInfo = (state, { groupId, memberInfo }) => {
    return state.setIn(['byId', groupId, 'memberInfo'], memberInfo)
}
export const changeMemberRole = (state, { groupId, userId, role }) => {
    const affiliations = state.getIn(['byId', groupId, 'info', 'affiliations']).asMutable({ deep: true })
    affiliations.forEach((item) => {
        if (item.id === userId) {
            item.role = role
        }
    })
    return state.setIn(['byId', groupId, 'info', 'affiliations'], affiliations)
}
export const deleteMember = (state, { groupId, userId }) => {
    let affiliations = state.getIn(['byId', groupId, 'info', 'affiliations']).asMutable({ deep: true })
    affiliations = affiliations.filter((item) => {
        return item.id !== userId
    })
    return state.setIn(['byId', groupId, 'info', 'affiliations'], affiliations)
}
/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    byId: {},
    names: []
})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
    [Types.UPDATE_GROUP]: updateGroup,
    [Types.UPDATE_GROUP_INFO]: updateGroupInfo,
    [Types.DISSOLVE_GROUP]: dissolveGroup,
    [Types.GET_GROUP_INFO]: getGroupInfo,
    [Types.UPDATE_GROUP_MEMBER_INFO]: updateGroupMemberInfo,
    [Types.CHANGE_MEMBER_ROLE]: changeMemberRole,
    [Types.DELETE_MEMBER]: deleteMember
})


export default Creators
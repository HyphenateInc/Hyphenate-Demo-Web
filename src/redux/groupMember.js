import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import _ from 'lodash'
import WebIM from '@/common/WebIM';
import { message } from '@/components/common/Alert'
import GroupActions from '@/redux/group'
const { Types, Creators } = createActions({
    setAdmins: ['groupId', 'admins'],
    operateAdmin: ['groupId', 'admin', 'operation'],
    setMuted: ['groupId', 'muted'],
    operateMuted: ['groupId', 'muted', 'operation'],
    setBlacklist: ['groupId', 'blacklist'],
    operateBlacklist: ['groupId', 'username', 'operation'],
    setGroupMember: ['groupId', 'members'],
    operateGroupMember: ['groupId', 'username', 'operation'],

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

    quitGroupAsync: ({ groupId, username }) => {
        return (dispatch, getState) => {
            WebIM.conn.quitGroup({
                groupId,
                success: response => {
                    dispatch(Creators.operateGroupMember(groupId, username, 'del'))
                    dispatch(GroupActions.deleteGroup(groupId))
                },
                error: e => console.error(`an error found while invoking resultful quitGroup: ${e.message}`)
            })
        }
    },

    inviteToGroupAsync: (groupId, users) => {
        return (dispatch, getState) => {
            WebIM.conn.inviteToGroup({
                groupId,
                users,
                success: response => {
                    dispatch(Creators.listGroupMemberAsync({ groupId: groupId }))
                },
                error: e => {
                    if (e.type === 17) {
                        let errorData = JSON.parse(e.data)
                        message.error('no authorization:' + errorData.error_description);
                    }
                }
            })
        }
    },
    listGroupMemberAsync: opt => {
        let { groupId, pageNum, pageSize } = opt
        pageNum = pageNum || 1
        pageSize = pageSize || 1000
        return (dispatch, getState) => {
            WebIM.conn.listGroupMember({
                groupId,
                pageNum,
                pageSize,
                success: response => {
                    const members = response.data
                    let memberNames = members.map((item) => {
                        return item.member || item.owner
                    })
                    WebIM.conn.fetchUserInfoById(memberNames).then((res) => {
                        let infos = res.data
                        members.forEach((item) => {
                            item.info = infos[item.member || item.owner]
                        })
                        dispatch(Creators.setGroupMember(groupId, members))
                    })
                },
                error: e => console.log(e.message)
            })
        }
    },

    groupBlockSingleAsync: (groupId, username) => {
        return (dispatch, getState) => {
            WebIM.conn.groupBlockSingle({
                groupId,
                username,
                success: response => {
                    dispatch(Creators.operateGroupMember(groupId, username, 'del'))
                    dispatch(GroupActions.deleteMember(groupId, username))
                },
                error: e => {
                    if (e.type === 17) {
                        message.error('You have no permission to do this operation');
                    }
                    console.log(`an error found while invoking resultful mute: ${e.message}`)
                }
            })
        }
    },
    removeGroupBlockSingleAsync: (groupId, username) => {
        return (dispatch, getState) => {
            WebIM.conn.removeGroupBlockSingle({
                groupId,
                username,
                success: response => {
                    const { groupid, user } = response.data
                    const groupId = groupid
                    dispatch(Creators.operateBlacklist(groupId, user, 'del'))
                },
                error: e => {
                    // dispatch(Creators.setLoading(false))
                    // dispatch(Creators.setLoadingFailed(true))
                    if (e.type === 17) {
                        message.error('你没有权限做此操作');
                    }
                    console.log(`an error found while invoking resultful removeGroupBlockAsync: ${e.message}`)
                }
            })
        }
    },
    setAdminAsync: (groupId, username) => {
        return (dispatch, getState) => {
            WebIM.conn.setAdmin({
                groupId,
                username,
                success: response => {
                    dispatch(Creators.operateAdmin(groupId, response.data.newadmin, 'add'))
                    dispatch(GroupActions.changeMemberRole(groupId, username, 'admin'))
                },
                error: e => {
                    if (e.type === 17) {
                        message.error('你没有权限做此操作');
                    }
                    console.log(`an error found while invoking restful setAdmin: ${e}`)
                }
            })
        }
    },
    muteAsync: (groupId, username, mDuration) => {
        const muteDuration = mDuration || 886400000
        return (dispatch, getState) => {
            WebIM.conn.mute({
                groupId,
                username,
                muteDuration,
                success: response => {
                    dispatch(Creators.operateMuted(groupId, response.data, 'add'))
                },
                error: e => {
                    if (e.type === 17) {
                        message.error('你没有权限做此操作');
                    }
                    console.log(`an error found while invoking resultful mute: ${e}`)
                }
            })
        }
    },
    removeAdminAsync: (groupId, username) => {
        return (dispatch, getState) => {
            WebIM.conn.removeAdmin({
                groupId,
                username,
                success: response => {
                    dispatch(Creators.operateAdmin(groupId, response.data.oldadmin, 'del'))
                    dispatch(GroupActions.changeMemberRole(groupId, username, 'member'))
                },
                error: e => {
                    if (e.type === 17) {
                        message.error('你没有权限做此操作');
                    }
                    console.log(`an error found while invoking resultful removeAdmin: ${e}`)
                }
            })
        }
    },
    removeMuteAsync: (groupId, username) => {
        return (dispatch, getState) => {
            WebIM.conn.removeMute({
                groupId,
                username,
                success: response => dispatch(Creators.operateMuted(groupId, response.data, 'del')),
                error: e => {
                    if (e.type === 17) {
                        message.error('你没有权限做此操作');
                    }
                    console.log(`an error found while invoking resultful removeMute: ${e}`)
                }
            })
        }
    },
    removeSingleGroupMemberAsync: (groupId, username) => {
        return (dispatch, getState) => {
            WebIM.conn.removeSingleGroupMember({
                groupId,
                username,
                success: response => {
                    dispatch(Creators.operateGroupMember(groupId, username, 'del'))
                    dispatch(GroupActions.deleteMember(groupId, username))
                },
                error: e => {
                    if (e.type === 17) {
                        message.error('You have no permission to do this operation');
                    }
                    console.log(`an error found while invoking resultful removeSingleGroupMember: ${e}`)
                }
            })
        }
    },
    getMutedAsync: groupId => {
        return (dispatch, getState) => {
            WebIM.conn.getMuted({
                groupId,
                success: response => {
                    const muted = response.data
                    if (muted) dispatch(Creators.setMuted(groupId, muted))
                },
                error: e => console.log(`an error found while invoking resultful getMuted: ${e}`)
            })
        }
    },

    getGroupBlackListAsync: groupId => {
        return (dispatch, getState) => {
            WebIM.conn.getGroupBlacklistNew({
                groupId,
                success: response => {
                    const blacklist = response.data // <-- !!!
                    if (blacklist) dispatch(Creators.setBlacklist(groupId, blacklist))
                },
                error: e => {
                    if (e.type === 17) {
                        message.error('你没有权限做此操作');
                    }
                    console.log(`an error found while invoking resultful getGroupBlackList: ${e.message}`)
                }
            })
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

export const setAdmins = (state, { groupId, admins }) => {
    const group = state.getIn([groupId], Immutable({})).merge({ admins })
    // group = group.set("admins", admins)
    return state.merge({ [groupId]: group })
}

export const operateAdmin = (state, { groupId, admin, operation }) => {
    let admins = state.getIn([groupId, 'admins'], Immutable([])).asMutable()
    operation === 'add'
        ? admins = _.uniq(_.concat(admins, admin))
        : admins = _.without(admins, admin)
    const group = state.getIn([groupId]).merge({ admins })
    return state.merge({ [groupId]: group })
}

export const setMuted = (state, { groupId, muted }) => {
    const byName = _.chain(muted)
        .reduce((acc, val) => {
            acc[val.user] = val
            return acc
        }, {})
        .value()
    const group = state.getIn([groupId], Immutable({})).merge({ muted: { byName } })
    return state.merge({ [groupId]: group })
}

export const setBlacklist = (state, { groupId, blacklist }) => {
    return state.setIn([groupId, 'blacklist'], blacklist)
}

export const operateMuted = (state, { groupId, muted, operation }) => {
    let byName = state.getIn([groupId, 'muted', 'byName'], Immutable({}))
    operation === 'add'
        ? _.forEach(muted, val => (byName = byName.merge({ [val.user]: _.omit(val, 'result') })))
        : _.forEach(muted, val => (byName = byName.without(val.user)))
    return state.setIn([groupId, 'muted', 'byName'], byName)
}

export const operateBlacklist = (state, { groupId, username, operation }) => {
    let blacklist = state.getIn([groupId, 'blacklist'], Immutable([])).asMutable()
    operation === 'add'
        ? blacklist.push(username)
        : blacklist = _.without(blacklist, username)
    const group = state.getIn([groupId]).merge({ blacklist })
    return state.merge({ [groupId]: group })
}

export const operateGroupMember = (state, { groupId, username, operation }) => {
    if (operation === 'del') {
        let byName = state.getIn([groupId, 'byName'], Immutable({}))
        byName = byName.without(username)
        return state
            .setIn([groupId, 'byName'], byName)
            .setIn([groupId, 'names'], Object.keys(byName).sort())
    }
    return state
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
    [Types.SET_ADMINS]: setAdmins,
    [Types.OPERATE_ADMIN]: operateAdmin,
    [Types.SET_MUTED]: setMuted,
    [Types.OPERATE_MUTED]: operateMuted,
    [Types.SET_BLACKLIST]: setBlacklist,
    [Types.OPERATE_BLACKLIST]: operateBlacklist,
    [Types.SET_GROUP_MEMBER]: setGroupMember,
    [Types.OPERATE_GROUP_MEMBER]: operateGroupMember
})

export default Creators


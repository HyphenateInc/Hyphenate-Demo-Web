import { history } from '@/common/routes'
import store from '@/redux'
import WebIM from '@/common/WebIM'
import AppDB from '@/utils/AppDB'
import LoginActions from '@/redux/login'
import CommonActions from '@/redux/common'
import MessageActions from '@/redux/message'
import RosterActions from "@/redux/roster"
import SessionActions from "@/redux/session"
import GroupActions from '@/redux/group'
import GroupMemberActions from '@/redux/groupMember'
import NoticeActions from '@/redux/notice'
import ChatRoomActions from '@/redux/chatRoom'
import { message } from '@/components/common/Alert'
import i18next from "i18next";
const sessionType = {
    chat: 'singleChat',
    groupchat: 'groupChat',
    chatroom: 'chatRoom'
}
WebIM.conn.listen({
    // success connect
    onOpened: msg => {
        console.log('onOpened', msg)
        const userName = WebIM.conn.context.userId//store.getState().login.username
        // init DB
        AppDB.init(userName)
        // get session list
        store.dispatch(SessionActions.getSessionList())
        // get roster
        store.dispatch(RosterActions.getContacts())
        store.dispatch(GroupActions.getGroups())
        store.dispatch(ChatRoomActions.getChatRooms())
        const defaultSelected = store.getState().session?.sessionList[0]
        let redirectUrl
        if (defaultSelected) {
            const { sessionType, sessionId } = defaultSelected
            redirectUrl = `${sessionType}/${sessionId}?username=${userName}`
        } else {
            const path = history.location.pathname.indexOf('singleChat') === -1 ? '/singleChat' : history.location.pathname
            redirectUrl = `${path}?username=${userName}`
        }

        console.log('redirectUrl', redirectUrl)
        history.push(redirectUrl)
    },

    onTextMessage: message => {
        console.log("onTextMessage", message)
        const { type, from, to } = message
        const sessionId = type === 'chat' ? from : to
        store.dispatch(MessageActions.addMessage(message, 'txt'))
        store.dispatch(SessionActions.topSession(sessionId, sessionType[type]))
    },
    onFileMessage: message => {
        console.log("onFileMessage", message)
        const { type, from, to } = message
        const sessionId = type === 'chat' ? from : to
        store.dispatch(MessageActions.addMessage(message, 'file'))

        // type === 'chat' && store.dispatch(MessageActions.sendRead(message))
    },
    onPictureMessage: message => {
        console.log('onPictureMessage', message)
        const { type, from, to } = message
        const sessionId = type === 'chat' ? from : to
        store.dispatch(MessageActions.addMessage(message, 'img'))
        // type === 'chat' && store.dispatch(MessageActions.sendRead(message))
        store.dispatch(SessionActions.topSession(sessionId, sessionType[type]))
    },
    onAudioMessage: message => {
        console.log('onAudioMessage', message)
        const { type, from, to } = message
        const sessionId = type === 'chat' ? from : to
        store.dispatch(MessageActions.addMessage(message, 'audio'))
        store.dispatch(SessionActions.topSession(sessionId, sessionType[type]))
    },

    onRecallMessage: message => {
        console.log('onRecallMessage', message)
        store.dispatch(MessageActions.deleteMessage(message))
    },
    // The other has read the message
    onReadMessage: message => {
        console.log('onReadMessage', message)
        store.dispatch(MessageActions.updateMessageStatus(message, 'read'))
    },

    // Server received message
    onReceivedMessage: message => {
        console.log('onReceivedMessage', message)
        const { id, mid } = message
        store.dispatch(MessageActions.updateMessageMid(id, mid))
    },


    onContactInvited: function (msg) {
        store.dispatch(NoticeActions.addFriendRequest(msg))
    },
    onContactDeleted: function (msg) {
        store.dispatch(RosterActions.getContacts())
        store.dispatch(MessageActions.clearUnread('chat', msg.from))
        message.warning(msg.from + '' + i18next.t('Deleted'))
    },
    onContactAdded: function (msg) {
        store.dispatch(RosterActions.getContacts())
        message.warning(msg.from + '' + i18next.t('subscribed'))
    },
    onContactRefuse: function (msg) {
        message.warning(msg.from + '' + i18next.t('refuse'))
    },
    onContactAgreed: function (msg) {
        message.success(msg.from + '' + i18next.t('agreed'))
    },

    onPresence: msg => {
        console.log('onPresence', msg)
        switch (msg.type) {
            case 'joinGroupNotifications':
                store.dispatch(NoticeActions.addGroupRequest(msg))
                break;
            case 'deleteGroupChat':
                message.error(`group${msg.gid} was destroyed.`)
                store.dispatch(GroupActions.getGroups())
                store.dispatch(MessageActions.clearUnread('groupchat', msg.gid))
                break
            case 'leaveGroup': // 某人离开群
                message.error(
                    `${msg.from}${i18next.t('LeaveGroup')}${msg.gid}.`
                )
                break
            case 'removedFromGroup':
                message.error(
                    `${msg.kicked || i18next.t('you')} ${i18next.t('dismissed')}${i18next.t('by')}${msg.owner ||
                    i18next.t('admin')} .`
                )
                store.dispatch(GroupActions.getGroups())
                store.dispatch(MessageActions.clearUnread('groupchat', msg.gid))
                break
            case 'invite': //nvite you to group
                debugger
                msg.status = ''
                store.dispatch(NoticeActions.addGroupRequest(msg))
                break
            case 'direct_joined': //Dragged into the group
                message.success(`${msg.from}${i18next.t('invite')}${i18next.t('you')}${i18next.t('join')}${msg.gid}`)
                store.dispatch(GroupActions.getGroups())
                break
            case 'joinPublicGroupSuccess':
                message.success(`${i18next.t('joinGroup')} ${msg.from} ${i18next.t('successfully')}`)
                store.dispatch(GroupActions.getGroups())
                break
            case 'joinPublicGroupDeclined':
                message.error(
                    `${i18next.t('join')}${i18next.t('group')}${msg.gid}${i18next.t('refuse')}${i18next.t('by')}${msg.owner}`
                )
                break
            case 'joinChatRoomSuccess': // Join the chat room successfully
                message.success('Join the chat room successfully')
                break
            case 'reachChatRoomCapacity': // Failed to join the chat room
                message.error(`${i18next.t('joinGroup')}${i18next.t('failed')}`)
                break
            case 'memberJoinPublicGroupSuccess':
                message.success(`${msg.from}${i18next.t('join')}${i18next.t('group')}${msg.gid}${i18next.t('successfully')}`)
                store.dispatch(GroupMemberActions.listGroupMemberAsync({ groupId: msg.gid }))
                break
            case 'memberJoinChatRoomSuccess':
                message.success(`${msg.from}${i18next.t('join')}${i18next.t('chatroom')}${msg.gid}${i18next.t('successfully')}`)
                break
            case 'leaveChatRoom': // Leave the chat room
                message.warning(`${msg.from} left the chatroom: ${msg.gid}`)
                break
            case 'addMute':
                message.warning('you was muted')
                break
            case 'removeMute':
                message.success('you was unmuted')
                break
            case 'addAdmin':
                message.success('you were set to be an admin')
                break
            case 'removeAdmin':
                message.success('your admin has been canceled')
                break
            case 'changeOwner':
                message.success('You`ve become group managerd')
                break
            default:
                break
        }
    },
    onError: (error) => {
        console.log('onError', error)
        // 16: server-side close the websocket connection
        if (error.type === WebIM.statusCode.WEBIM_CONNCTION_DISCONNECTED) {
            if (WebIM.conn.autoReconnectNumTotal < WebIM.conn.autoReconnectNumMax) {
                return
            }
            message.error(`${i18next.t('serverSideCloseWebsocketConnection')} `)
            history.push('/login')
            return
        }
        // 2: login by token failed
        if (error.type === WebIM.statusCode.WEBIM_CONNCTION_AUTH_ERROR) {
            message.error(`${i18next.t('webIMConnectionAuthError')} `)
            return
        }
        // 8: offline by multi login
        if (error.type === WebIM.statusCode.WEBIM_CONNCTION_SERVER_ERROR) {
            message.error(i18next.t('offlineByMultiLogin'))
            history.push('/login')
            return
        }
        if (error.type === WebIM.statusCode.WEBIM_CONNCTION_USER_REMOVED) {
            message.error(i18next.t('userLogout'))
            history.push('/login')
            return
        }
        if (error.type === WebIM.statusCode.WEBIM_CONNCTION_USER_LOGIN_ANOTHER_DEVICE) {
            message.error(i18next.t('The account is logged in on a different device'))
            history.push('/login')
            return
        }
        if (error.type === WebIM.statusCode.WEBIM_CONNCTION_USER_KICKED_BY_CHANGE_PASSWORD) {
            message.error(i18next.t('User password has been changed'))
            history.push('/login')
            return
        }
        if (error.type === WebIM.statusCode.WEBIM_CONNCTION_USER_KICKED_BY_OTHER_DEVICE) {
            message.error(i18next.t('You are kicked out by other devices'))
            history.push('/login')
            return
        }
        if (error.type === 1) {
            let data = error.data ? JSON.parse(error.data.data) : {}
            if (data.error_description === "user not found") {
                message.error(i18next.t("The user name does not exist"))
            } else if (data.error_description === "invalid password") {
                message.error(i18next.t('Invalid password'))
            } else if (data.error_description === "user not activated") {
                message.error(i18next.t("The user has been banned"))
            }
        }
    },
    onClosed: msg => {
        console.warn('onClosed', msg)
        // history.push('/login')
        // store.dispatch(CommonActions.setLoading(false))
    },
})
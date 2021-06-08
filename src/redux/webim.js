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
import NoticeActions from '@/redux/notice'
const sessionType = {
    chat: 'singleChat',
    groupchat: 'groupChat',
    chatroom: 'chatRoom'
}
WebIM.conn.listen({
    // success connect
    onOpened: msg => {
        const userName = store.getState().login.username
        // init DB
        AppDB.init(userName)

        const path = history.location.pathname.indexOf('singleChat') === -1 ? '/singleChat' : history.location.pathname
        const redirectUrl = `${path}?username=${userName}`
        console.log('redirectUrl', redirectUrl)
        history.push(redirectUrl)

        // get session list
        store.dispatch(SessionActions.getSessionList())
        // get roster
        store.dispatch(RosterActions.getContacts())
        store.dispatch(GroupActions.getGroups())
        // store.dispatch(CommonActions.setLoading(false))
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

    onRecallMessage: message => {
        console.log('onRecallMessage', message)
        store.dispatch(MessageActions.deleteMessage(message))
    },

    onContactInvited: function (msg) {
        store.dispatch(NoticeActions.addFriendRequest(msg))
    },
    onContactDeleted: function () { },
    onContactAdded: function () { },
    onContactRefuse: function () { },
    onContactAgreed: function () { },

    onPresence: msg => {
        switch (msg.type) {
            case 'joinGroupNotifications':
                store.dispatch(NoticeActions.addGroupRequest(msg))
                break;
            default:
                break
        }
    },
    onError: (err) => {
        console.error(err)
    },
    onClosed: msg => {
        console.warn('onClosed', msg)
    },
})
import Cookie from 'js-cookie';
import qs from 'qs'
import WebIM from '@/common/WebIM'
import moment from 'moment'
const { username } = qs.parse(window.location.hash.split('?')[1]);

(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = "orientationchange" in window ? "orientationchange" : "resize",
        recalc = function () {
            // if (docEl.clientWidth > 750) {
            //     docEl.style.fontSize = "100px";
            // } else {
            //     var width = docEl.clientWidth / 7.5;
            //     docEl.style.fontSize = width + "px";
            // }
        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener("DOMContentLoaded", recalc, false);
})(document, window);

export function getToken() {
    return Cookie.get('webim_' + username);
}

export function getUserName() {
    return username
}

const msgTpl = {
    base: {
        error: false,
        errorCode: '',
        errorText: '',
        // if status is blank, it's treated as "sent" from server side
        status: 'sending', // [sending, sent ,fail, read]
        id: '',
        // from - room id need it,should not be deleted
        from: '',
        to: '',
        toJid: '',
        time: '',
        chatType: '', // chat / groupchat
        body: {},
        ext: {},
        bySelf: false
    },
    txt: {
        type: 'txt',
        msg: ''
    },
    img: {
        type: 'img',
        file_length: 0,
        filename: '',
        filetype: '',
        length: 0,
        secret: '',
        width: 0,
        height: 0,
        url: '',
        thumb: '',
        thumb_secret: ''
    },
    file: {
        type: 'file',
        file_length: 0,
        filename: '',
        filetype: '',
        length: 0,
        secret: '',
        width: 0,
        height: 0,
        url: '',
        thumb: '',
        thumb_secret: '',
        size: ''
    },
    video: {
        type: 'video',
        file_length: 0,
        filename: '',
        filetype: '',
        length: 0,
        secret: '',
        width: 0,
        height: 0,
        url: '',
        thumb: '',
        thumb_secret: ''
    },
    audio: {
        type: 'audio',
        file_length: 0,
        filename: '',
        filetype: '',
        length: 0,
        secret: '',
        width: 0,
        height: 0,
        url: '',
        thumb: '',
        thumb_secret: ''
    },
    custom: {
        type: 'custom',
        customEvent: '',
        customExts: {}
    }
}

export function formatLocalMessage(to, chatType, message = {}, messageType) {
    const ext = message.ext || {}
    const formatMsg = Object.assign(msgTpl.base, message)
    const body = Object.assign(msgTpl[messageType], message)
    if (messageType === 'file' || messageType === 'img') {
        body.size = message?.data.size
    }
    return {
        ...formatMsg,
        id: WebIM.conn.getUniqueId(),
        to,
        from: WebIM.conn.context.userId,
        chatType,
        session: to,
        body: {
            ...body,
            ...ext
        }
    }
}

export function formatServerMessage(message = {}, messageType) {
    const ext = message.ext || {}
    const formatMsg = Object.assign(msgTpl.base, message)
    const body = Object.assign(msgTpl[messageType], message)
    let chatType = message.type
    let session
    if (chatType === 'chat') {
        chatType = 'singleChat'
        session = message.from
    };
    if (chatType === 'groupchat') {
        chatType = 'groupChat'
        session = message.to
    }
    if (chatType === 'chatroom') {
        chatType = 'chatRoom'
        session = message.to
    }
    if (messageType === 'txt') {
        body.msg = message.data;
        body.type = 'txt'
    } else if (messageType === 'file') {
        body.type = 'file'
        body.size = body.file_length
    } else if (messageType === 'img') {
        body.type = 'img'
    } else if (messageType === 'audio') {
        body.type = 'audio'
    }
    return {
        ...formatMsg,
        status: 'sent',
        chatType,
        session: session,
        body: {
            ...body,
            ...ext,
            chatType
        }
    }
}

export function renderTime(time) {
    if (!time) return ''
    const localStr = new Date(time)
    const localMoment = moment(localStr)
    const localFormat = localMoment.format('MM-DD hh:mm')
    return localFormat
}

export function getGroupName(str) {
    const [name, id] = str.split("_#-#_")
    return name
}
export function getGroupId(str) {
    const [name, id] = str.split("_#-#_")
    return id
}

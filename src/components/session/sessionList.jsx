import React, { useEffect, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from "react-router-dom";
import { renderTime } from '@/utils'
import groupIcon from '@/assets/images/group@2x.png'
import chatRoomIcon from '@/assets/images/chatroom@2x.png'
import noticeIcon from '@/assets/images/notice@2x.png'
import GroupMemberActions from '@/redux/groupMember'
import ChatRoomActions from '@/redux/chatRoom'
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(206, 211, 217, 0.3)',
        margin: 0,
        padding: 0
    },
    listItem: {
        height: theme.spacing(18),
        padding: '0 14px'
    },
    itemBox: {
        display: 'flex',
        flex: 1,
        height: '100%',
        alignItems: 'center',
        borderBottom: '0.5px solid rgba(0, 0, 0, 0.1)',
        boxSizing: 'border-box',
    },
    avatar: {
        height: theme.spacing(12),
        width: theme.spacing(12)
    },
    MuiListItemTextSecondary: {
        color: 'red'
    },
    itemRightBox: {
        flex: 1,
    },
    itemName: {
        fontSize: '16px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    itemMsgBox: {
        position: 'relative',
        height: '20px',
        display: 'flex',
        alignItems: 'center'
    },
    time: {
        display: 'inline-block',
        height: '17px',
        fontSize: '12px',
        color: 'rgba(1, 1, 1, .6)',
        marginRight: '2px'
    },
    itemMsg: {
        display: 'inline-block',
        height: '20px',
        overflow: 'hidden',
        color: 'rgba(1, 1, 1, .6)',
        width: 'calc(100% - 18px)',
        fontSize: '14px',
        wordBreak: 'break-all'
    },
    unreadNum: {
        color: '#fff',
        background: 'rgba(245, 39, 0, 1)',
        display: 'inline-block',
        height: '16px',
        borderRadius: '8px',
        fontSize: '10px',
        minWidth: '16px',
        textAlign: 'center',
        position: 'absolute',
        right: '0'
    }
}));

export default function SessionList(props) {
    const classes = useStyles();
    const dispatch = useDispatch()
    const sessionList = useSelector(state => state.session.sessionList) || []
    const message = useSelector(state => state.message)
    const { unread } = message
    const currentSession = useSelector(state => state.session.currentSession)
    const groupMember = useSelector(state => state.group.groupMember)
    let currentSessionIndex = 0
    let { chatType, to } = useParams()

    // dealwith notice unread num 
    const notices = useSelector(state => state.notice.notices) || []
    let noticeUnreadNum = 0
    notices.forEach(item => {
        if (!item.disabled) {
            noticeUnreadNum++
        }
    })
    const renderSessionList = sessionList.asMutable({ deep: true })
        .map((session) => {
            const chatMsgs = message?.[session.sessionType]?.[session.sessionId] || []
            if (chatMsgs.length > 0) {
                session.lastMessage = chatMsgs[chatMsgs.length - 1]
                session.unreadNum = unread[session.sessionType][session.sessionId]
            }
            if (session.sessionType === 'notice') {
                if (notices.length) {
                    let msg
                    session.unreadNum = noticeUnreadNum
                    if (notices[notices.length - 1].type === 'joinGroupNotifications') {
                        msg = 'Request to join the group:' + notices[notices.length - 1].gid
                    } else {
                        msg = notices[notices.length - 1]?.status
                    }
                    session.lastMessage = {
                        time: notices[notices.length - 1].id,
                        body: {
                            msg: msg
                        }
                    }
                }
            }
            return session
        })
        .sort((a, b) => {
            if (!a?.lastMessage?.time) return 1
            if (!b?.lastMessage?.time) return -1
            return b?.lastMessage?.time - a?.lastMessage?.time
        })

    renderSessionList.forEach((element, index) => {
        if (element.sessionId === currentSession) {
            currentSessionIndex = index
        }
    });

    const handleListItemClick = (event, index, session) => {
        const { sessionId, sessionType } = session
        if (currentSessionIndex !== index) {
            props.onClickItem(session)
            if (chatType === 'chatRoom') {
                // quit pre room
                dispatch(ChatRoomActions.quitChatRoom(to))
            }
            if (sessionType === 'groupChat' && !groupMember[sessionId]) {
                dispatch(GroupMemberActions.listGroupMemberAsync({ groupId: sessionId }))
                dispatch(GroupMemberActions.getMutedAsync(sessionId))
                // dispatch(GroupMemberActions.getGroupAdminAsync(sessionId))
            }
            else if (sessionType === 'chatRoom') {
                // join room
                dispatch(ChatRoomActions.joinChatRoom(sessionId))
            }

        }
    };

    if (!currentSession && renderSessionList[0]) {
        props.onClickItem(renderSessionList[0])
    }
    return (
        <List dense className={classes.root}>
            {renderSessionList.map((session, index) => {
                let avatarSrc = ''
                if (session.sessionType === 'groupChat') {
                    avatarSrc = groupIcon
                }
                else if (session.sessionType === 'chatRoom') {
                    avatarSrc = chatRoomIcon
                }
                else if (session.sessionType === 'notice') {
                    avatarSrc = noticeIcon
                }
                return (
                    <ListItem key={session.sessionId}
                        selected={currentSessionIndex === index}
                        onClick={(event) => handleListItemClick(event, index, session)}
                        button className={classes.listItem}>
                        <Box className={classes.itemBox}>
                            <ListItemAvatar>
                                <Avatar
                                    className={classes.avatar}
                                    alt={`session.sessionId`}
                                    src={avatarSrc}
                                />
                            </ListItemAvatar>
                            <Box className={classes.itemRightBox}>
                                <Typography className={classes.itemName}>
                                    <span>{session.sessionId}</span>

                                    <span className={classes.time}>{renderTime(session?.lastMessage?.time)}</span>
                                </Typography>

                                <Typography className={classes.itemMsgBox}>
                                    <span className={classes.itemMsg}>{session?.lastMessage?.body?.msg}</span>

                                    <span className={classes.unreadNum} style={{ display: session.unreadNum ? 'inline-block' : 'none' }}>{session.unreadNum}</span>
                                </Typography>
                            </Box>
                        </Box>
                    </ListItem>
                );
            })}
        </List>
    );
}

SessionList.defaultProps = {
    haha: 11
};


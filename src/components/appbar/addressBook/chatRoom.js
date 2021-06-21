import React from 'react'
import CommonDialog from '@/components/common/dialog'
import i18next from "i18next";
import { Box, ListItemAvatar, Avatar, ListItem, List } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux'
import SessionActions from '@/redux/session'
import chatRoomIcon from '@/assets/images/chatroom@2x.png'
import { getGroupName, getGroupId } from '@/utils'
import ChatRoomActions from '@/redux/chatRoom'
import { history } from '@/common/routes'
import _ from 'lodash'
const useStyles = makeStyles((theme) => {
    return ({
        root: {
            width: theme.spacing(86),
            maxHeight: '70vh',
            minHeight: '35vh',
            margin: 0,
            padding: 0
        },
        listItem: {
            height: theme.spacing(14),
            width: theme.spacing(86),
            maxWidth: '100%',
            display: 'flex',
            alignItems: 'center',
            boxSizing: 'border-box',
            padding: '0 20px'
        },
        itemBox: {
            height: '100%',
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            borderBottom: '0.5px solid rgba(0, 0, 0, 0.1)',
            boxSizing: 'border-box',
        },
        avatar: {
            height: theme.spacing(10),
            width: theme.spacing(10)
        },
        MuiListItemTextSecondary: {
            color: 'red'
        },
        textBox: {
            display: 'flex',
            justifyContent: 'space-between',
            flex: '1'
        },
        itemName: {
            fontSize: '16px',
            overflow: 'hidden',
        },
    })
});

export default function ChatRoomList({ open, onClose }) {
    const classes = useStyles();
    const dispatch = useDispatch()
    const sessionList = useSelector(state => state.session.sessionList.asMutable()) || []
    const chatRoomList = useSelector(state => state.chatRoom.names) || []
    const handleClose = () => {
        onClose()
    }
    const handleClick = (roomId) => {
        const index = _.findIndex(sessionList, (item) => item.sessionId === roomId && item.sessionType === 'chatRoom');
        if (index < 0) {
            sessionList.unshift({ sessionId: roomId, sessionType: 'chatRoom' })
            dispatch(SessionActions.setSessionList(sessionList))
        }
        dispatch(SessionActions.setCurrentSession(roomId))

        const redirectPath = '/chatRoom/' + [roomId].join('/')
        history.push(redirectPath + window.location.search)
        dispatch(ChatRoomActions.joinChatRoom(roomId))
        onClose()
    }
    function renderContent() {
        return (
            <List dense className={classes.root}>
                {
                    chatRoomList.map((room) => {
                        return (
                            <ListItem key={getGroupId(room)}
                                onClick={() => { handleClick(getGroupId(room)) }}
                                button className={classes.listItem}>
                                <Box className={classes.itemBox}>
                                    <ListItemAvatar>
                                        <Avatar
                                            className={classes.avatar}
                                            alt={`group`}
                                            src={chatRoomIcon}
                                        />
                                    </ListItemAvatar>
                                    <Box className={classes.textBox}>
                                        <Typography className={classes.itemName}>
                                            {getGroupName(room)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </ListItem>
                        )
                    })
                }
            </List>
        )
    }

    return (
        <CommonDialog
            open={open}
            onClose={handleClose}
            title={i18next.t('Chat Room')}
            content={renderContent()}
        ></CommonDialog>
    )
}
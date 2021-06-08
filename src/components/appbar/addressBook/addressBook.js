import React, { useState } from 'react'
import CommonDialog from '@/components/common/dialog'
import i18next from "i18next";
import _ from 'lodash'
import { Box, TextField, Button, ListItemAvatar, Avatar, ListItem, List } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux'
import RosterActions from '@/redux/roster'
import SessionActions from '@/redux/session'
import { message } from '@/components/common/Alert'
import groupIcon from '@/assets/images/group@2x.png'
import chatRoomIcon from '@/assets/images/chatroom@2x.png'
import GroupList from './groupList'
import ChatRoomList from './chatRoom'
import GroupActions from '@/redux/group'
import ChatRoomActions from '@/redux/chatRoom'
const useStyles = makeStyles((theme) => {
    return ({
        root: {
            width: '100%',
            maxHeight: '70vh',
            minHeight: '35vh',
            margin: 0,
            padding: 0,
            overflowX: 'hidden'
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

export default function AddressBookDialog(props) {
    const { open, onClose, history, location } = props
    const classes = useStyles();
    const dispatch = useDispatch()
    const roster = useSelector(state => state.roster) || {}
    const friends = roster.friends || []
    const byName = roster.byName || {}
    const sessionList = useSelector(state => state.session.sessionList.asMutable())
    const groupList = useSelector(state => state.group.group.names)
    const chatRoomList = useSelector(state => state.chatRoom.names)
    const handleClick = (itemData) => {
        console.log('itemData', itemData)
        if (typeof itemData === 'string') {
            const index = _.findIndex(sessionList, item => item.sessionId === itemData);
            if (index < 0) {
                sessionList.unshift({ sessionId: itemData, sessionType: 'singleChat' })
                dispatch(SessionActions.setSessionList(sessionList))
            }
            dispatch(SessionActions.setCurrentSession(itemData))
            onClose();

            const redirectPath = '/singleChat/' + [itemData].join('/')
            history.push(redirectPath + location.search)
        } else {
            const { value } = itemData
            if (value === 'group') {
                if (!groupList.length) {
                    dispatch(GroupActions.getGroups())
                }
                setGroupOpen(true)
            }
            else if (value === 'chatroom') {
                if (!chatRoomList.length) {
                    dispatch(ChatRoomActions.getChatRooms())
                }
                setChatRoomOpen(true)
            }
        }
    }

    const [groupOpen, setGroupOpen] = useState(false)
    const [chatRoomOpen, setChatRoomOpen] = useState(false)

    const handleGroupClose = () => {
        setGroupOpen(false)
        onClose()
    }
    const handleChatRoomClose = () => {
        setChatRoomOpen(false)
        onClose()
    }
    function renderContent() {
        return (
            <List dense className={classes.root}>
                <ListItem key={'group'}
                    onClick={() => handleClick({ value: 'group' })}
                    button className={classes.listItem}>
                    <Box className={classes.itemBox}>
                        <ListItemAvatar>
                            <Avatar
                                className={classes.avatar}
                                alt={`group`}
                                src={groupIcon}
                            />
                        </ListItemAvatar>
                        <Box className={classes.textBox}>
                            <Typography className={classes.itemName}>{i18next.t('Group')}</Typography>
                            <Typography className={classes.itemName}>></Typography>
                        </Box>
                    </Box>
                </ListItem>
                <ListItem key={'chatroom'}
                    onClick={() => handleClick({ value: 'chatroom' })}
                    button className={classes.listItem}>
                    <Box className={classes.itemBox}>
                        <ListItemAvatar>
                            <Avatar
                                className={classes.avatar}
                                alt={`chatRoom`}
                                src={chatRoomIcon}
                            />
                        </ListItemAvatar>
                        <Box className={classes.textBox}>
                            <Typography className={classes.itemName}>{i18next.t('Chat Room')}</Typography>
                            <Typography className={classes.itemName}>></Typography>
                        </Box>
                    </Box>
                </ListItem>
                {friends.map((userId, index) => {
                    return (
                        <ListItem key={userId}
                            onClick={() => handleClick(userId)}
                            data={userId}
                            value={userId}
                            button className={classes.listItem}>
                            <Box className={classes.itemBox}>
                                <ListItemAvatar>
                                    <Avatar
                                        className={classes.avatar}
                                        alt={`${userId}`}
                                    >
                                    </Avatar>
                                </ListItemAvatar>
                                <Box>
                                    <Typography className={classes.itemName}>
                                        {byName[userId]?.info?.nickname || userId}</Typography>
                                </Box>
                            </Box>
                        </ListItem>
                    );
                })}

            </List>
        )
    }

    return (
        <>
            <CommonDialog
                open={open}
                onClose={onClose}
                title={i18next.t('Address Book')}
                content={renderContent()}
            ></CommonDialog>
            <GroupList open={groupOpen} onClose={handleGroupClose} />
            <ChatRoomList open={chatRoomOpen} onClose={handleChatRoomClose} />
        </>
    )
}
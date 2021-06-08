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
import { getGroupName, getGroupId } from '@/utils'
import { history } from '@/common/routes'
const useStyles = makeStyles((theme) => {
    return ({
        root: {
            width: '100%',
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

export default function GroupList({ open, onClose }) {
    const classes = useStyles();
    const dispatch = useDispatch()
    const sessionList = useSelector(state => state.session.sessionList.asMutable())
    const groupList = useSelector(state => state.group.group.names)
    const handleClose = () => {
        onClose()
    }
    const handleClick = (groupId) => {
        const index = _.findIndex(sessionList, (item) => item.sessionId === groupId && item.sessionType === 'groupChat');
        if (index < 0) {
            sessionList.unshift({ sessionId: groupId, sessionType: 'groupChat' })
            dispatch(SessionActions.setSessionList(sessionList))
        }
        dispatch(SessionActions.setCurrentSession(groupId))

        const redirectPath = '/groupChat/' + [groupId].join('/')
        history.push(redirectPath + window.location.search)
        onClose();
    }
    function renderContent() {
        return (
            <List dense className={classes.root}>
                {groupList.map((group) => {
                    return (
                        <ListItem key={getGroupId(group)}
                            onClick={() => { handleClick(getGroupId(group)) }}
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
                                    <Typography className={classes.itemName}>
                                        {getGroupName(group)}
                                    </Typography>
                                </Box>
                            </Box>
                        </ListItem>
                    )
                })}

            </List>
        )
    }

    return (
        <CommonDialog
            open={open}
            onClose={handleClose}
            title={i18next.t('Group')}
            content={renderContent()}
        ></CommonDialog>
    )
}
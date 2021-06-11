import React, { useRef, useState } from 'react'
import CommonDialog from '@/components/common/dialog'
import i18next from "i18next";
import _ from 'lodash'
import { Box, TextField, Button, ListItemAvatar, Avatar, ListItem, List } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux'
import GroupMemberActions from '@/redux/groupMember'
import GroupActions from '@/redux/group'
const useStyles = makeStyles((theme) => {
    return ({
        root: {
            width: theme.spacing(86),
            minHeight: '35vh',
            margin: 0,
            padding: 0,
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column'
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
        noData: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '-30px',
            flex: 1,
            color: 'rgba(0,0,0,.25)'
        }
    })
});

export default function BlackListDialog(props) {
    const { open, onClose, history, location } = props
    const classes = useStyles();
    const dispatch = useDispatch()
    const currentGroup = useSelector(state => state.session.currentSession)
    const blackList = useSelector(state => state.group.groupMember?.[currentGroup]?.blacklist) || []
    const byName = useSelector(state => state.group.groupMember?.[currentGroup]?.byName) || []
    const operateRef = useRef(null)
    const handleRemove = (userId) => {
        operateRef.current = true
        dispatch(GroupMemberActions.removeGroupBlockSingleAsync(currentGroup, userId))
    }
    const handleClose = () => {
        if (operateRef.current) {
            // No need to request friends
            //dispatch(GroupActions.getGroupInfoAsync(currentGroup))
        }
        onClose()
    }
    function renderContent() {
        return (
            <List dense className={classes.root}>
                {blackList.length ? blackList.map((userId, index) => {
                    return (
                        <ListItem key={userId}
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
                                        {byName?.[userId]?.info?.nickname || userId}</Typography>
                                </Box>
                            </Box>
                            <Button
                                onClick={() => { handleRemove(userId) }}
                                variant="outlined" color="primary" style={{ position: 'absolute', right: '18px' }}>
                                {i18next.t('remove')}
                            </Button>
                        </ListItem>
                    );
                }) : <div className={classes.noData}>no data</div>}
            </List>
        )
    }

    return (
        <>
            <CommonDialog
                open={open}
                onClose={handleClose}
                title={i18next.t('Black List')}
                content={renderContent()}
            ></CommonDialog>
        </>
    )
}
import React, { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Box, Avatar, Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux'
import NoticeActions from '@/redux/notice'
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(206, 211, 217, .15)',
        padding: '16px',
        boxSizing: 'border-box',
        overflowY: 'auto'
    },
    itemBox: {
        marginBottom: '15px'
    },
    header: {
        height: theme.spacing(13),
        borderBottom: '1px solid #f2f2f2',
        background: '#fff',
        lineHeight: theme.spacing(13),
        paddingLeft: '16px'
    },
    content: {
        height: theme.spacing(27.5),
        background: '#fff',
        display: 'flex',
        width: '100%',
        padding: '0 16px',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxSizing: 'border-box',
    },
    msgBox: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        '& span:last-child': {
            marginLeft: '12px'
        }
    },
    btnBox: {
        '& button': {
            margin: '0 5px'
        }
    },
    noData: {
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        color: 'rgba(0,0,0,.15)',
        fontSize: '28px'
    }
}))
function Notice() {
    const classes = useStyles();
    const dispatch = useDispatch()
    const notices = useSelector(state => state.notice.notices) || []
    const handleAgreeClick = (msg) => {
        if (msg.type === 'joinGroupNotifications') {
            dispatch(NoticeActions.agreeJoinGroup(msg))
        }
        else {
            dispatch(NoticeActions.acceptFriendRequest(msg))
        }
    }
    const handleDisagreeClick = (msg) => {
        if (msg.type === 'joinGroupNotifications') {
            dispatch(NoticeActions.rejectJoinGroup(msg))
        }
        dispatch(NoticeActions.declineFriendRequest(msg))
    }
    return (
        <div className={classes.root}>
            <div>
                {notices.length ? notices.map((msg, index) => {
                    const noticeType = msg.type === 'joinGroupNotifications' ? 'groupRequest' : 'friendRequest'
                    return <div className={classes.itemBox} key={msg.from + index}>
                        <div className={classes.header}>
                            {noticeType === 'friendRequest' ? 'Request add friend' :
                                'Request add group'
                            }
                        </div>
                        <div className={classes.content}>
                            <Box className={classes.msgBox}>
                                <Avatar></Avatar>
                                <span>{msg.status}</span>
                            </Box>
                            <Box className={classes.btnBox}>
                                <Button
                                    onClick={() => { handleAgreeClick(msg) }}
                                    disabled={msg.disabled}
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                >
                                    {msg?.actionType === 'Agreed' ? 'Agreed' : 'Agree'}
                                </Button>
                                <Button
                                    onClick={() => { handleDisagreeClick(msg) }}
                                    variant="contained"
                                    disabled={msg.disabled}
                                >
                                    {msg?.actionType === 'Disagreed' ? 'Disagreed' : 'Disagree'}
                                </Button>
                            </Box>
                        </div>
                    </div>
                }) : <div className={classes.noData}>no data</div>}
            </div>
        </div>
    )
}

export default memo(Notice)
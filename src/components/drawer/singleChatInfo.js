import React, { memo, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Menu, MenuItem, Typography, IconButton } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux'
import i18next from 'i18next';
import RosrerActions from '@/redux/roster'
import SessionActions from '@/redux/session'
import { history } from '@/common/routes'
import WebIM from '@/common/WebIM'
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: '100%'
    },
    header: {
        height: '52px',
        borderBottom: '1px solid rgba(206, 211, 217, .5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        '&:first-child': {
            fontSize: '20px',
            marginLeft: '17px'
        }
    },
    avatarBox: {
        height: '170px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: '88px',
        height: '88px'
    },
    main: {
        display: 'flex',
        flexDirection: 'column',
    },
    infoItem: {
        height: theme.spacing(13),
        padding: '0 17px',
        display: 'flex',
        flexDirection: 'column',
        '& div': {
            display: 'flex',
            flex: '1',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(206, 211, 217, .5)',
            '& span:last-child': {
                color: '#A6B4BF'
            }
        }

    }
}));
function SingleChatInfo({ onDelete }) {
    const classes = useStyles();
    const dispatch = useDispatch()
    const currentUser = useSelector(state => state.session.currentSession)
    const userInfo = useSelector(state => state.roster.byName[currentUser])
    const sessionList = useSelector(state => state.session.sessionList)
    const [addEl, setAddEl] = useState(null)
    const deleteFriend = () => {
        dispatch(RosrerActions.removeContact(currentUser))
        dispatch(SessionActions.deleteSession(currentUser))
        history.push(`/${sessionList[0].sessionType}/${sessionList[0].sessionId}?username=${WebIM.conn.context.userId}`)
        onDelete()
    }
    function renderMoreMenu() {
        return (
            <Menu
                id="simple-menu"
                anchorEl={addEl}
                keepMounted
                open={Boolean(addEl)}
                onClose={() => setAddEl(null)}
            >
                <MenuItem onClick={deleteFriend}>
                    <Typography variant="inherit" noWrap>
                        {i18next.t('Delete Friend')}
                    </Typography>
                </MenuItem>
            </Menu >
        )
    }

    const handleClickMoreAction = (e) => {
        setAddEl(e.currentTarget)
    }

    return (
        <div className={classes.root}>
            <header className={classes.header}>
                <span>{currentUser}</span>
                <IconButton onClick={handleClickMoreAction} className="iconfont icon-shezhi" />
            </header>
            <main className={classes.main}>
                <div className={classes.avatarBox}>
                    <Avatar className={classes.avatar}></Avatar>
                </div>
                <div>
                    <div className={classes.infoItem}>
                        <div>
                            <span>{i18next.t('User Id')}</span>
                            <span>{currentUser}</span>
                        </div>
                    </div>
                    {/* <div className={classes.infoItem}>
                        <div>
                            <span>User Name</span>
                            <span>{userInfo?.info?.nickname}</span>
                        </div>
                    </div> */}
                    {/* TODO: other infos*/}
                </div>
            </main>
            {renderMoreMenu()}
        </div>
    )
}

export default memo(SingleChatInfo)
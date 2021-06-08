import React, { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Avatar } from '@material-ui/core';
import { useSelector } from 'react-redux'
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: '100%'
    },
    header: {
        height: '59px',
        borderBottom: '1px solid rgba(206, 211, 217, .5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        '& span': {
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
function SingleChatInfo() {
    const classes = useStyles();
    const currentUser = useSelector(state => state.session.currentSession)
    const userInfo = useSelector(state => state.roster.byName[currentUser])
    return (
        <div className={classes.root}>
            <header className={classes.header}>
                <span>{currentUser}</span>
            </header>
            <main className={classes.main}>
                <div className={classes.avatarBox}>
                    <Avatar className={classes.avatar}></Avatar>
                </div>
                <div>
                    <div className={classes.infoItem}>
                        <div>
                            <span>User ID</span>
                            <span>{currentUser}</span>
                        </div>
                    </div>
                    <div className={classes.infoItem}>
                        <div>
                            <span>User Name</span>
                            <span>{userInfo?.info?.nickname}</span>
                        </div>
                    </div>
                    {/* TODO: other infos*/}
                </div>
            </main>
        </div>
    )
}

export default memo(SingleChatInfo)
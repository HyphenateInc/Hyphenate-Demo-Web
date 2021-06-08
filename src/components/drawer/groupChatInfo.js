import React, { memo, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemText, Tooltip, Switch } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux'
import clsx from 'clsx';
import i18next from 'i18next';
import GroupActions from '@/redux/group'
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: '100%',
        position: "relative"
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
        height: theme.spacing(40),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: theme.spacing(22),
        height: theme.spacing(22)
    },
    main: {
        display: 'flex',
        flexDirection: 'column',
        height: '368px'
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

    },
    itemToolbtn: {
        padding: '5px',
        fontSize: '14px'
    },
    listBox: {
        position: 'absolute',
        bottom: '0',
        top: '425px',
        overflowY: 'auto',
        width: '100%'
    },
    nembers: {
        height: '30px',
        lineHeight: '30px',
        paddingLeft: '17px'
    }
}));
// TODO: group description
function GroupChatInfo() {
    const classes = useStyles();
    const currentUser = useSelector(state => state.session.currentSession)
    const groupInfo = useSelector(state => state.group?.group?.byId[currentUser])?.info?.asMutable({ deep: true }) || {}
    const groupMember = groupInfo.affiliations || []
    const memberInfo = useSelector(state => state.group?.group?.byId[currentUser])?.memberInfo?.asMutable({ deep: true }) || {}
    const myUserName = useSelector(state => state.login.username)

    return (
        <div className={classes.root}>
            <header className={classes.header}>
                <span>{groupInfo?.name}</span>
                <IconButton className="iconfont icon-shezhi" />
            </header>
            <main className={classes.main}>
                <div className={classes.avatarBox}>
                    <Avatar className={classes.avatar}></Avatar>
                </div>
                <div>
                    <div className={classes.infoItem}>
                        <div>
                            <span>Group ID</span>
                            <span>{currentUser}</span>
                        </div>
                    </div>
                    <div className={classes.infoItem}>
                        <div>
                            <span>Appear in group search</span>
                            <span>{groupInfo.public ? 'Public' : 'Non public'}</span>
                        </div>
                    </div>
                    <div className={classes.infoItem}>
                        <div>
                            <span>Allow members to invite</span>
                            <span>{groupInfo.allowinvites ? 'Able' : 'Disable'}</span>
                        </div>
                    </div>
                    <div className={classes.infoItem}>
                        <div>
                            <span>Block group message</span>
                            <span>{groupInfo.mute}</span>
                        </div>
                    </div>
                </div>
                <div className={classes.nembers}>
                    {i18next.t('Numbers') + `(${groupInfo.affiliations_count})`}
                </div>
            </main>
            <div className={classes.listBox}>

                <List dense={true}>
                    {groupMember.map((member) => {
                        return (
                            <ListItem key={member.id}>
                                <ListItemAvatar>
                                    <Avatar>
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={memberInfo?.[member.id]?.nickname || member.id}
                                />

                                {/* <Tooltip title={i18next.t('Set as admin')}>
                                    <IconButton className={clsx(classes.itemToolbtn, "iconfont icon-shezhiguanliyuan")} />
                                </Tooltip> */}

                                <Tooltip title={i18next.t('Set as admin')}>
                                    <IconButton className={clsx(classes.itemToolbtn, "iconfont icon-guanliyuan")} />
                                </Tooltip>

                                {/* <Tooltip title={i18next.t('mute')}>
                                    <IconButton className={clsx(classes.itemToolbtn, "iconfont icon-wujinyanzhuangtai")} />
                                </Tooltip> */}
                                <Tooltip title={i18next.t('muted')}>
                                    <IconButton className={clsx(classes.itemToolbtn, "iconfont icon-jinyan2")} />
                                </Tooltip>


                                <Tooltip title={i18next.t('groupBlockSingle')}>
                                    <IconButton className={clsx(classes.itemToolbtn, "iconfont icon-heimingdan")} />
                                </Tooltip>

                                <Tooltip title={i18next.t('removeSingleGroupMember')}>
                                    <IconButton className={clsx(classes.itemToolbtn, "iconfont icon-shanchu")} />
                                </Tooltip>

                            </ListItem>
                        )
                    })}
                </List>
            </div>
            {/* TODO: other infos*/}

        </div>
    )
}

export default GroupChatInfo
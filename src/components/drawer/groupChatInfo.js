import React, { memo, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemText, Tooltip, Switch, Menu, MenuItem, Typography } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux'
import clsx from 'clsx';
import i18next from 'i18next';
import GroupMemberActions from '@/redux/groupMember'
import SessionActions from '@/redux/session'
import GroupActions from '@/redux/group'
import InviteDialog from './inviteMember'
import ModifyInfoDialog from './modifyInfo'
import BlackListDialog from './blackList'
import WebIM from '../../common/WebIM';
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
function GroupChatInfo({ onDissolve }) {
    const classes = useStyles();
    const dispatch = useDispatch()
    const currentGroup = useSelector(state => state.session.currentSession)
    const groupInfo = useSelector(state => state.group?.group?.byId[currentGroup])?.info?.asMutable({ deep: true }) || {}
    const groupMember = groupInfo.affiliations || []
    const memberInfo = useSelector(state => state.group?.group?.byId[currentGroup])?.memberInfo?.asMutable({ deep: true }) || {}
    const myUserName = useSelector(state => state.login.username)
    const mutedList = useSelector(state => state.group.groupMember?.[currentGroup]?.muted) || {}
    let myRole = 'member'

    const [addEl, setAddEl] = useState(null)
    const [showInvite, setShowInvite] = useState(false)
    const [showModify, setShowModify] = useState(false)
    const [showBlackList, setShowBlackList] = useState(false)
    const sessionList = useSelector(state => state.session.sessionList) || []
    groupMember.forEach(element => {
        if (element.id === myUserName) {
            myRole = element.role
        }
    });

    function renderTools(member) {
        const memberRole = member.role
        if (myRole === 'member') return null
        let RoleIcon = null
        let MuteIcon = null
        if (memberRole === 'owner') {
            RoleIcon = <Tooltip title={i18next.t('Owner')}>
                <IconButton className={clsx(classes.itemToolbtn, "iconfont icon-guanliyuan")} style={{ color: '#00BA6E' }} />
            </Tooltip>
        }
        else if (memberRole === 'admin') {
            RoleIcon = <Tooltip title={i18next.t('Remove admin')}>
                <IconButton
                    onClick={() => {
                        dispatch(GroupMemberActions.removeAdminAsync(currentGroup, member.id))
                    }}
                    className={clsx(classes.itemToolbtn, "iconfont icon-guanliyuan")} />
            </Tooltip>
        } else {
            RoleIcon = <Tooltip title={i18next.t('Set as admin')}>
                <IconButton
                    onClick={() => {
                        dispatch(GroupMemberActions.setAdminAsync(currentGroup, member.id))
                    }}
                    className={clsx(classes.itemToolbtn, "iconfont icon-shezhiguanliyuan")} />
            </Tooltip>
        }
        if (mutedList?.byName?.[member.id]) {
            MuteIcon = <Tooltip title={i18next.t('muted')}>
                <IconButton
                    onClick={() => { dispatch(GroupMemberActions.removeMuteAsync(currentGroup, member.id)) }}
                    className={clsx(classes.itemToolbtn, "iconfont icon-jinyan2")} />
            </Tooltip>
        } else {
            MuteIcon = <Tooltip title={i18next.t('mute')}>
                <IconButton
                    onClick={() => { dispatch(GroupMemberActions.muteAsync(currentGroup, member.id)) }}
                    className={clsx(classes.itemToolbtn, "iconfont icon-wujinyanzhuangtai")} />
            </Tooltip>
        }
        if (myRole === 'owner') {
            return (
                <>
                    {RoleIcon}
                    {MuteIcon}
                    <Tooltip title={i18next.t('groupBlockSingle')}>
                        <IconButton
                            onClick={() => {
                                dispatch(GroupMemberActions.groupBlockSingleAsync(currentGroup, member.id))
                            }}
                            className={clsx(classes.itemToolbtn, "iconfont icon-heimingdan")} />
                    </Tooltip>

                    <Tooltip title={i18next.t('removeSingleGroupMember')}>
                        <IconButton
                            onClick={() => { dispatch(GroupMemberActions.removeSingleGroupMemberAsync(currentGroup, member.id)) }}
                            className={clsx(classes.itemToolbtn, "iconfont icon-shanchu")} />
                    </Tooltip>
                </>
            )
        }
    }
    const handleClickMoreAction = (e) => {
        // if (myRole === 'member')
        setAddEl(e.currentTarget)
    }
    const handleBlackListClick = () => {
        dispatch(GroupMemberActions.getGroupBlackListAsync(currentGroup))
        setShowBlackList(true)
    }
    const handleDissolveClick = (type) => {
        if (type === 'dissolve') {
            dispatch(GroupActions.dissolveGroupAsync({
                groupId: groupInfo.id, groupName: groupInfo.name
            }))
        } else if (type === 'quit') {
            dispatch(GroupMemberActions.quitGroupAsync({
                groupId: currentGroup, username: WebIM.conn.context.userId
            }))
        }

        dispatch(SessionActions.deleteSession(groupInfo.id))
        // dispatch(SessionActions.setCurrentSession(sessionList[0].sessionId))
        onDissolve()
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
                <MenuItem onClick={() => { setShowInvite(true) }}>
                    <Typography variant="inherit" noWrap>
                        {i18next.t('Invite Member')}
                    </Typography>
                </MenuItem>
                {myRole === 'owner' && <MenuItem onClick={() => { setShowModify(true) }}>
                    <Typography variant="inherit" noWrap>
                        {i18next.t('Modify Information')}
                    </Typography>
                </MenuItem>}
                {myRole === 'owner' && < MenuItem onClick={handleBlackListClick}>
                    <Typography variant="inherit" noWrap>
                        {i18next.t('Blacklist')}
                    </Typography>
                </MenuItem>}
                <MenuItem onClick={() => { handleDissolveClick(myRole === 'owner' ? 'dissolve' : 'quit') }}>
                    <Typography variant="inherit" noWrap>
                        {myRole === 'owner' ? i18next.t('Dissolve Group') : i18next.t('Quit Group')}
                    </Typography>
                </MenuItem>
            </Menu >
        )
    }
    return (
        <div className={classes.root}>
            <header className={classes.header}>
                <span>{groupInfo?.name}</span>
                <IconButton onClick={handleClickMoreAction} className="iconfont icon-shezhi" />
            </header>
            <main className={classes.main}>
                <div className={classes.avatarBox}>
                    <Avatar className={classes.avatar}></Avatar>
                </div>
                <div>
                    <div className={classes.infoItem}>
                        <div>
                            <span>{i18next.t('Group ID')}</span>
                            <span>{currentGroup}</span>
                        </div>
                    </div>
                    <div className={classes.infoItem}>
                        <div>
                            <span>{i18next.t('Appear in group search')}</span>
                            <span>{groupInfo.public ? i18next.t('Public') : i18next.t('Non public')}</span>
                        </div>
                    </div>
                    <div className={classes.infoItem}>
                        <div>
                            <span>{i18next.t('Allow members to invite')}</span>
                            <span>{groupInfo.allowinvites ? i18next.t('Able') : i18next.t('Disable')}</span>
                        </div>
                    </div>
                    <div className={classes.infoItem}>
                        <div>
                            <span>{i18next.t('Block group message')}</span>
                            <span>{groupInfo.mute ? i18next.t('muted') : i18next.t('Unmute')}</span>
                        </div>
                    </div>
                </div>
                <div className={classes.nembers}>
                    {i18next.t('Numbers') + `(${groupMember.length || 1})`}
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
                                {renderTools(member)}
                                {/* <Tooltip title={i18next.t('Set as admin')}>
                                    <IconButton className={clsx(classes.itemToolbtn, "iconfont icon-shezhiguanliyuan")} />
                                </Tooltip> */}



                            </ListItem>
                        )
                    })}
                </List>
            </div>
            {renderMoreMenu()}
            <InviteDialog open={showInvite}
                onClose={() => { setShowInvite(false) }} />
            <ModifyInfoDialog open={showModify} onClose={() => { setShowModify(false) }} />

            <BlackListDialog open={showBlackList} onClose={() => { setShowBlackList(false) }} />
            {/* TODO: other infos*/}

        </div>
    )
}

export default memo(GroupChatInfo)

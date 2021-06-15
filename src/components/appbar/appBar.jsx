import React, { useEffect, useMemo, useRef, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { IconButton, Icon, InputBase } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles, fade } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import MoreIcon from '@material-ui/icons/MoreVert';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import agora from '@/assets/images/agora@2x.png'
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { useParams } from "react-router-dom";
import { Menu, MenuItem } from '@material-ui/core';
import i18next from "i18next";
import AddFriendDialog from '@/components/appbar/addFriend/addFriend'
import AddressBookDialog from '@/components/appbar/addressBook/addressBook'
import AddGroupDialog from '@/components/appbar/addGroup/addGroup'
import CreateGroupDialog from '@/components/appbar/createGroup/createGroup'
import CommonActions from '@/redux/common'
import GroupActions from '@/redux/group'
import MessageActions from '@/redux/message'
import SessionActions from '@/redux/session'
import RosterActions from '@/redux/roster'
import LoginActions from '@/redux/login'
import { useSelector, useDispatch } from 'react-redux'
import UserInfoDialog from '@/components/appbar/userInfo/index'
import UserSettingDialog from '@/components/appbar/userSetting/index'
import WebIM from '@/common/WebIM';
import SearchInput from '@/components/common/searchInput'
import _ from 'lodash'
import AppDB from '@/utils/AppDB';
const useStyles = makeStyles((theme) => {
    return ({
        root: {
            display: 'flex',
            flexGrow: 1,
            height: '6.67vh',
            background: theme.palette.primary.bg
        },
        leftBar: {
            width: '30vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            '& img': {
                width: '64px',
                marginLeft: theme.spacing(4),
            },
            '& .icon': {
                color: '#fff'
            }
        },
        rightBar: {
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#fff',
            '& .icon': {
                color: '#fff'
            }
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        toolbar: {
        },
        title: {
            flexGrow: 1,
            alignSelf: 'flex-end',
        },
        nameBox: {
            marginLeft: '14px'
        },

        menuItemIconBox: {
            marginRight: '5px',
            '& span': {
                color: '#00BA6E',
                fontWeight: 'bold'
            }
        },

        search: {
            position: 'relative',
            borderRadius: '15px',
            backgroundColor: fade(theme.palette.common.white, 0.15),
            '&:hover': {
                backgroundColor: fade(theme.palette.common.white, 0.25),
            },
            marginLeft: 0,
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(1),
                width: 'auto',
            },
        },
        searchIcon: {
            padding: theme.spacing(0, 2),
            height: '100%',
            position: 'absolute',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        inputRoot: {
            color: 'inherit',
        },
        inputInput: {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `30px`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                width: '0',
                '&:focus': {
                    width: '20ch',
                },
            },
        },


    })
});

function ProminentAppBar(props) {
    const classes = useStyles();
    const dispatch = useDispatch()
    const { to, chatType } = useParams()
    const groupById = useSelector(state => state.group.group.byId) || {}
    const { onGoBack, showLeft, showRight, isSmallScreen } = props
    const [settingEl, setSettingEl] = useState(null)
    const [addEl, setAddEl] = useState(null)
    const [sessionEl, setSessionEl] = useState(null)

    const [showAddFriend, setShowAddFriend] = useState(false) // show AddFriendDialog
    const [showAddressBook, setShowAddressBook] = useState(false) // show AddressBookDisalod
    const [showCreateGroup, setShowCreateGroup] = useState(false)
    const [showAddGroup, setShowAddGroup] = useState(false) // show AddGroupDialog
    const [showUserInfo, setShowUserInfo] = useState(false) // show UserInfoDialog
    const [showUserSetting, setShowUserSetting] = useState(false) // show UserSetting
    const [showSearch, setShowSearch] = useState(false)
    const ownInfo = useSelector(state => state.login.info)
    const messages = useSelector(state => state.message?.[chatType]?.[to])
    const handleClickAdd = (e) => {
        setAddEl(e.currentTarget)
    }
    const handleClickSetting = (e) => {
        setSettingEl(e.currentTarget)
    }
    const handleSessionInfoClick = (e) => {
        if (chatType === 'notice' || chatType === 'chatRoom') {
            return
        }
        setSessionEl(e.currentTarget)
    }

    const handleClose = () => { }

    /*********** first icon button: Add ***********/
    function renderAddMenu() {
        return (
            <Menu
                id="simple-menu"
                anchorEl={addEl}
                keepMounted
                open={Boolean(addEl)}
                onClose={() => setAddEl(null)}
            >
                <MenuItem onClick={getAdress}>
                    <Box className={classes.menuItemIconBox}>
                        <Icon className="iconfont icon-tongxunlu"></Icon>
                    </Box>
                    <Typography variant="inherit" noWrap>
                        {i18next.t('Address Book')}
                    </Typography>
                </MenuItem>
                <MenuItem onClick={createGroup}>
                    <Box className={classes.menuItemIconBox}>
                        <Icon className="iconfont icon-chuangjianqunzu"></Icon>
                    </Box>
                    <Typography variant="inherit" noWrap>
                        {i18next.t('Create Group')}
                    </Typography>
                </MenuItem>
                <MenuItem onClick={addFriend}>
                    <Box className={classes.menuItemIconBox}>
                        <Icon className="iconfont icon-tianjiahaoyou"></Icon>
                    </Box>
                    <Typography variant="inherit" noWrap>
                        {i18next.t('Add Friends')}
                    </Typography>
                </MenuItem>
                <MenuItem onClick={addGroup}>
                    <Box className={classes.menuItemIconBox}>
                        <Icon className="iconfont icon-qunhaoyou"></Icon>
                    </Box>
                    <Typography variant="inherit" noWrap>
                        {i18next.t('Add Groups')}
                    </Typography>
                </MenuItem>
            </Menu>
        )
    }
    // ------- 1th Add menu item -------
    function getAdress() {
        setShowAddressBook(true)
        dispatch(RosterActions.getContacts())
    }
    function handleAddressBookDialogClose() {
        setShowAddressBook(false)
    }

    // ------- 2th Add menu item -------
    function createGroup() {
        setShowCreateGroup(true)
    }
    function handleCreateGroupClose() {
        setShowCreateGroup(false)
    }
    // ------- 3th Add menu item -------
    function addFriend() {
        setShowAddFriend(true)
    }
    function handleAddFriendDialogClose() {
        setShowAddFriend(false)
    }

    // ------- 4th Add menu item -------
    function addGroup() {
        setShowAddGroup(true)
    }
    function handleAddGroupClose() {
        setShowAddGroup(false)
    }


    /*********** first icon button: Setting ***********/
    function renderSettingMenu() {
        return (
            <Menu
                id="simple-menu"
                anchorEl={settingEl}
                keepMounted
                open={Boolean(settingEl)}
                onClose={() => setSettingEl(null)}
            >
                <MenuItem onClick={handleInfoClick}>
                    <Box className={classes.menuItemIconBox}>
                        <Icon className="iconfont icon-gerenziliao"></Icon>
                    </Box>
                    <Typography variant="inherit" noWrap>
                        {i18next.t('Personal Data')}
                    </Typography>
                </MenuItem>
                <MenuItem onClick={() => setShowUserSetting(true)}>
                    <Box className={classes.menuItemIconBox}>
                        <Icon className="iconfont icon-shezhi"></Icon>
                    </Box>
                    <Typography variant="inherit" noWrap>
                        {i18next.t('Settings')}
                    </Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <Box className={classes.menuItemIconBox}>
                        <Icon className="iconfont icon-tuichu"></Icon>
                    </Box>
                    <Typography variant="inherit" noWrap>
                        {i18next.t('Log Out')}
                    </Typography>
                </MenuItem>
            </Menu>
        )
    }

    const handleInfoClick = () => {
        setShowUserInfo(true)
        if (!ownInfo) {
            dispatch(LoginActions.getUserInfo(WebIM.conn.context.userId))
        }
    }

    const handleLogout = () => {
        dispatch(LoginActions.logoutAsync())
    }

    function renderSessionInfoMenu() {
        return (
            <Menu
                id="simple-menu"
                anchorEl={sessionEl}
                keepMounted
                open={Boolean(sessionEl)}
                onClose={() => setSessionEl(null)}
            >
                <MenuItem onClick={handleClickSessionInfo}>
                    <Box className={classes.menuItemIconBox}>
                        <Icon className="iconfont icon-huihuaxinxi"></Icon>
                    </Box>
                    <Typography variant="inherit" noWrap>
                        {i18next.t('Session Info')}
                    </Typography>
                </MenuItem>
                <MenuItem onClick={handleClickClearMessage}>
                    <Box className={classes.menuItemIconBox}>
                        <Icon className="iconfont icon-qingkongxiaoxi"></Icon>
                    </Box>
                    <Typography variant="inherit" noWrap>
                        {i18next.t('Clear Message')}
                    </Typography>
                </MenuItem>
                <MenuItem onClick={handleClickDeleteSession}>
                    <Box className={classes.menuItemIconBox}>
                        <Icon className="iconfont icon-shanchuhuihua"></Icon>
                    </Box>
                    <Typography variant="inherit" noWrap>
                        {i18next.t('Delete Session')}
                    </Typography>
                </MenuItem>
            </Menu>
        )
    }
    const handleClickSessionInfo = () => {
        if (chatType === 'groupChat') {
            if (!groupById[to]?.info) {
                dispatch(GroupActions.getGroupInfoAsync(to))
            }
        }
        dispatch(CommonActions.setShowDrawer(true))
    }
    const handleClickClearMessage = () => {
        dispatch(MessageActions.clearMessage(chatType, to))
    }
    const handleClickDeleteSession = () => {
        dispatch(MessageActions.clearMessage(chatType, to))
        dispatch(SessionActions.deleteSession(to))
    }

    const handleSearchChange = _.debounce((e) => {
        if (e.target.value === '' || chatType === 'notice') {
            return
        }
        AppDB.fetchMessage(to, chatType, 0, 50).then((res) => {
            let searchMessages = res.filter(message => {
                return message.body?.msg?.indexOf(e.target.value) > -1
            })
            dispatch(MessageActions.updateMessages(chatType, to, searchMessages))
        })
    }, 300, { trailing: true })
    const handleSearchBlur = (e) => {
        if (e.target.value === '') {
            AppDB.fetchMessage(to, chatType, 0, 20).then((res) => {
                dispatch(MessageActions.updateMessages(chatType, to, res))
            })
            setShowSearch(false)
        }
    }
    return (
        <div className={classes.root}>
            <Box position="static" className={classes.leftBar}
                style={{ display: showLeft ? 'flex' : 'none', width: isSmallScreen ? '100vw' : '30vw' }}>
                <img src={agora} alt="agora" />
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        onClick={handleClickAdd}
                        className="iconfont icon-tianjia1 icon"
                    ></IconButton>
                    <IconButton
                        onClick={handleClickSetting}
                        className="iconfont icon-shezhi icon"
                    ></IconButton>
                </Toolbar>
            </Box>

            <Box position="static" className={classes.rightBar}
                style={{ display: showRight ? 'flex' : 'none' }}>
                <IconButton
                    onClick={onGoBack}
                    style={{ display: isSmallScreen ? 'flex' : 'none', color: '#bdbdbd' }}>
                    {'<'}
                </IconButton>

                <Typography className={classes.nameBox}>
                    {to}
                </Typography>
                <Toolbar className={classes.toolbar}>
                    <SearchInput
                        style={{ display: showSearch ? 'flex' : 'none' }}
                        onChange={handleSearchChange}
                        onBlur={handleSearchBlur}
                    />

                    <IconButton style={{ display: !showSearch ? 'block' : 'none' }}
                        onClick={() => { setShowSearch(true) }} className="iconfont icon-sousuo icon"></IconButton>
                    {/* <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <IconButton className="iconfont icon-sousuo icon"></IconButton>
                        </div>
                        <InputBase
                            placeholder=""
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </div> */}
                    <IconButton
                        onClick={handleSessionInfoClick}
                        className="iconfont icon-hanbaobao icon"
                    ></IconButton>
                </Toolbar>
            </Box>
            {renderAddMenu()}
            {renderSettingMenu()}
            {renderSessionInfoMenu()}
            <AddFriendDialog
                open={showAddFriend}
                onClose={handleAddFriendDialogClose} />
            <AddressBookDialog
                {...props}
                open={showAddressBook}
                onClose={handleAddressBookDialogClose} />
            <AddGroupDialog
                {...props}
                open={showAddGroup}
                onClose={handleAddGroupClose}
            />
            <CreateGroupDialog
                {...props}
                open={showCreateGroup}
                onClose={handleCreateGroupClose}
            />

            <UserInfoDialog
                open={showUserInfo}
                onClose={() => setShowUserInfo(false)}
            />
            <UserSettingDialog
                open={showUserSetting}
                onClose={() => setShowUserSetting(false)}
            />
        </div>
    );
}
export default withWidth()(ProminentAppBar);

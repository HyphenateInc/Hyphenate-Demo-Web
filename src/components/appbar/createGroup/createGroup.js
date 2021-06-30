import React, { memo, useEffect, useRef, useState } from 'react'
import CommonDialog from '@/components/common/dialog'
import { withStyles } from '@material-ui/core/styles';
import i18next from "i18next";
import _ from 'lodash'
import { Box, Checkbox, Button, ListItemAvatar, Avatar, ListItem, List, InputBase, Icon, InputLabel, Switch } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux'
import { message } from '@/components/common/Alert'
import GroupActions from '@/redux/group'
import SearchInput from '@/components/common/searchInput'
const BaseSwitch = withStyles({
    switchBase: {
        color: '#00ba6ed9',
        '&$checked': {
            color: '#00BA6E',
        },
        '&$checked + $track': {
            backgroundColor: '#00BA6E',
        },
    },
    checked: {},
    track: {},
})(Switch);
const useStyles = makeStyles((theme) => {
    return ({
        contentBox: {
            width: theme.spacing(100),
            position: 'relative',
        },
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
            width: theme.spacing(100),
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
        itemContent: {
            height: '100%',
            display: 'flex',
            flex: 1,
            alignItems: 'center',
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

        'icon-green': {
            color: '#00BA6E',
        },
        'icon-gray': {
            color: '#D8D8D8'
        },

        footer: {
            display: 'flex',
            height: '30px',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 19px 27px 19px'
        },
        footerText: {
            fontSize: '12px'
        },
        step2Content: {
            width: `calc(${theme.spacing(100)} - 54px)`,
            maxHeight: '70vh',
            minHeight: '35vh',
            margin: '0 27px',
            padding: 0,
            borderBottom: '0.5px solid rgba(206, 211, 217, 1)'
        },
        'step2-itemBox': {
            display: 'flex',
            margin: '12px 0px',
            alignItems: 'center',
            justifyContent: 'space-between',
            '& div': {
                flex: '1',
                marginLeft: '12px',
                '& input': {
                    border: '1px solid rgba(0,0,0,.15)',
                    padding: '0 8px',
                    height: '32px'
                }
            }
        }

    })
});

function CreateGroup(props) {
    const { open, onClose } = props
    const classes = useStyles();
    const dispatch = useDispatch()
    const roster = useSelector(state => state.roster) || {}
    const friends = roster.friends || []
    const byName = roster.byName || {}
    const [checkedFriend, setCheckedFriend] = useState([])
    const [step2open, setStep2open] = useState(false)
    const [step2state, serStep2state] = useState({
        checkedA: true,
        checkedB: true
    })
    const [step2value, setStep2value] = useState({
        name: '',
        about: ''
    })

    useEffect(() => {
        setRenderList([...friends])
    }, [friends])

    const [renderList, setRenderList] = useState([...friends])
    const handleSearchChange = _.debounce((e) => {
        if (e.target.value === '') {
            return setRenderList([...friends])
        }
        let searchList = renderList.filter((item) => {
            if (item.indexOf(e.target.value) !== -1) {
                return item
            }
            return false
        })
        setRenderList(searchList)
    }, 300, { trailing: true })

    const handleCheckBoxChange = (e) => {
        if (e.target.checked) {
            checkedFriend.push(e.target.value)
            setCheckedFriend([...checkedFriend])
        } else {
            setCheckedFriend(checkedFriend.filter(item => item !== e.target.value))
        }
    }

    const handleNextClick = () => {
        setStep2open(true)
    }
    const handleStep1Close = () => {
        setCheckedFriend([])
        onClose()
    }
    function renderContent() {
        return (
            <div className={classes.contentBox}>
                <SearchInput onChange={handleSearchChange} />

                <List dense className={classes.root}>
                    {renderList.map((userId, index) => {
                        return (
                            <ListItem key={userId}
                                data={userId}
                                value={userId}
                                button className={classes.listItem}>
                                <Box className={classes.itemBox}>
                                    <div className={classes.itemContent}>
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
                                    </div>
                                    <Checkbox
                                        onChange={handleCheckBoxChange}
                                        value={userId}
                                        icon={<Icon className={`iconfont icon-xuanze-xuanxiang ${classes['icon-gray']}`} />}
                                        checkedIcon={<Icon className={`iconfont icon-xuanze-xuanzhong ${classes['icon-green']}`} />}
                                        checked={checkedFriend.includes(userId)}
                                        name={userId} />
                                </Box>
                            </ListItem>
                        );
                    })}

                </List>
            </div>
        )
    }

    function footer() {
        return (
            <div className={classes.footer}>
                <p className={classes.footerText}>{checkedFriend.length + ' Members selected'}</p>
                <Button variant="outlined" color="primary" onClick={handleNextClick}>
                    Next
                </Button>
            </div>
        )
    }
    function step2footer() {
        return (
            <div className={classes.footer} style={{ justifyContent: 'center' }}>
                <Button color="primary" variant="contained" style={{ color: "#fff" }} onClick={handleCreateClick}>
                    Create
                </Button>
            </div>
        )
    }

    const handleStep2SwichChange = (e) => {
        serStep2state({ ...step2state, [e.target.name]: e.target.checked })
    }

    const handleCreateClick = () => {
        if (!step2value.name || !step2value.about) {
            return message.error('group name or about is required')
        }

        let options = {
            data: {
                groupname: step2value.name,
                desc: step2value.about,
                members: checkedFriend,
                public: step2state.checkedA,
                approval: true,  // Need approval
                allowinvites: step2state.checkedB, // True: allow group members to invite others to join the group. False: allow group members to invite others to join the group only if group manager is allowed (Note that public groups (public: true) do not allow group members to invite others to join the group)
                inviteNeedConfirm: true  // whether the invitee needs to confirm.
            },
            success(res) {
                serStep2state({ checkedA: true, checkedB: true })
                setStep2value({ name: '', about: '' })
                return message.success('create group success')
            },
            error(err) {
                return message.error('create group fail')
            },
        };
        dispatch(GroupActions.createGroup(options))
        setStep2open(false)
        onClose()
    }

    const handleStep2InputChange = (e) => {
        setStep2value({ ...step2value, [e.target.id]: e.target.value })
    }
    function renderGroupSetting() {
        return <div className={classes.step2Content}>
            <Box className={classes['step2-itemBox']}>
                <InputLabel htmlFor="my-input">Group Name</InputLabel>
                <InputBase onChange={handleStep2InputChange} value={step2value.name} id="name" aria-describedby="my-helper-text" />
            </Box>
            <Box className={classes['step2-itemBox']}>
                <InputLabel htmlFor="my-input">About Group</InputLabel>
                <InputBase onChange={handleStep2InputChange} value={step2value.about} id="about" aria-describedby="my-helper-text" />
            </Box>
            <Box className={classes['step2-itemBox']}>
                <InputLabel htmlFor="my-input">Group Numbers</InputLabel>
                <div style={{ height: '30px', lineHeight: '30px' }}>{checkedFriend.length}</div>
            </Box>
            <Box className={classes['step2-itemBox']}>
                <InputLabel htmlFor="my-input">Allow Search</InputLabel>
                <BaseSwitch
                    checked={step2state.checkedA}
                    onChange={handleStep2SwichChange}
                    name="checkedA"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
            </Box>
            <Box className={classes['step2-itemBox']}>
                <InputLabel htmlFor="my-input">Allow Members To Invite</InputLabel>
                <BaseSwitch
                    checked={step2state.checkedB}
                    onChange={handleStep2SwichChange}
                    name="checkedB"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
            </Box>

        </div>
    }
    return (
        <>
            <CommonDialog
                open={open}
                onClose={handleStep1Close}
                title={i18next.t('Create Group')}
                content={renderContent()}
                footer={footer()}
            ></CommonDialog>

            <CommonDialog
                open={step2open}
                onClose={() => { setStep2open(false) }}
                title={i18next.t('Create Group2')}
                content={renderGroupSetting()}
                footer={step2footer()}
            ></CommonDialog>
        </>
    )
}

export default memo(CreateGroup)


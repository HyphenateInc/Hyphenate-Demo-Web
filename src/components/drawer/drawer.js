import React, { memo } from 'react'
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import SingleChatInfo from './singleChatInfo'
import GroupChatInfo from './groupChatInfo'
import CommonActions from '@/redux/common'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from "react-router-dom";
const drawerWidth = 348
const useStyles = makeStyles((theme) => ({
    root: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        position: 'fixed',
        // top: '6.67vh'
    },
    drawerContent: {
        height: '100%'
    }
}));
function BaseDrawer({ open }) {
    const classes = useStyles();
    const dispatch = useDispatch()
    const { chatType } = useParams()
    const handleClose = () => {
        dispatch(CommonActions.setShowDrawer(false))
    }
    return (
        <Drawer
            className={classes.root}
            anchor={"right"}
            open={open}
            classes={{
                paper: classes.drawerPaper,
            }}
            onClose={handleClose}
        >
            <div className={classes.drawerContent}>
                {chatType === 'singleChat' && <SingleChatInfo onDelete={() => { handleClose() }} />}
                {chatType === 'groupChat' && <GroupChatInfo onDissolve={() => { handleClose() }} />}
            </div>
        </Drawer>
    )
}

export default memo(BaseDrawer)
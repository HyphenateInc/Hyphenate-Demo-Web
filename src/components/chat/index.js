import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MessageList from './messageList'
import SendBox from './sendBox'
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(206, 211, 217, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative'
    },
}));

function Chat({ messageList }) {
    const classes = useStyles();
    console.log('** Render Chat **')
    return (
        <div className={classes.root}>
            <MessageList messageList={messageList} />
            <SendBox />
        </div>
    );
}
export default memo(Chat)

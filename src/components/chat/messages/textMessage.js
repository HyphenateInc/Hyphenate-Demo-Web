import React, { memo, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import i18next from "i18next";
import { Menu, MenuItem } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import { emoji } from '@/common/emoji'
import { renderTime } from '@/utils'
import MessageStatus from '@/components/common/messageStatus'
const useStyles = makeStyles((theme) => ({
    pulldownListItem: {
        display: 'flex',
        padding: '10px 0',
        listStyle: 'none',
        marginBottom: '26px',
        position: 'relative',
        flexDirection: props =>
            props.bySelf ? 'row-reverse' : 'row',
    },
    userName: {
        padding: '0 10px 4px',
        color: '#8797A4',
        fontSize: '14px',
        display: props => (props.chatType !== 'singleChat' && !props.bySelf) ? 'inline-block' : 'none',
        textAlign: props => props.bySelf ? 'right' : 'left'
    },
    textBodyBox: {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '65%',
    },
    textBody: {
        display: 'flex',
        margin: props => props.bySelf ? '0 10px 26px 0' : '0 0 26px 10px',
        lineHeight: '20px',
        fontSize: '14px',
        background: props => props.bySelf ? '#23C381' : '#FFFFFF',
        color: props => props.bySelf ? '#fff' : '#000',
        border: '1px solid #fff',
        borderRadius: props => props.bySelf ? '4px 0 4px 4px' : '0px 4px 4px 4px',
        padding: '15px',
        // maxWidth: '65%',
        overflowWrap: 'break-word',
        wordBreak: 'break-all'
    },
    time: {
        position: 'absolute',
        fontSize: '11px',
        height: '16px',
        color: 'rgba(1, 1, 1, .2)',
        lineHeight: '16px',
        textAlign: 'center',
        top: '-18px',
        width: '100%'
    },
    read: {
        fontSize: '10px',
        color: 'rgba(0,0,0,.15)',
        margin: '3px'
    }
}))
const initialState = {
    mouseX: null,
    mouseY: null,
};
function TextMessage({ message, onRecallMessage }) {
    const classes = useStyles({ bySelf: message.bySelf, chatType: message.chatType });
    const [state, setState] = useState(initialState);
    const handleClick = (event) => {
        event.preventDefault();
        setState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    };
    const handleClose = () => {
        setState(initialState);
    };
    const recallMessage = () => {
        onRecallMessage(message)
        handleClose()
    }
    const renderTxt = txt => {
        if (txt === undefined) { return [] }
        let rnTxt = []
        let match = null
        const regex = /(\[.*?\])/g
        let start = 0
        let index = 0
        while ((match = regex.exec(txt))) {
            index = match.index
            if (index > start) {
                rnTxt.push(txt.substring(start, index))
            }
            if (match[1] in emoji.map) {
                const v = emoji.map[match[1]]
                rnTxt.push(
                    <img
                        key={v}
                        alt={v}
                        src={require(`../../../assets/faces/${v}`).default}
                        width={20}
                        height={20}
                    />
                )
            } else {
                rnTxt.push(match[1])
            }
            start = index + match[1].length
        }
        rnTxt.push(txt.substring(start, txt.length))

        return rnTxt
    }
    return (
        <li className={classes.pulldownListItem}>
            <div>
                <Avatar></Avatar>
            </div>
            <div className={classes.textBodyBox}>
                <span className={classes.userName}>{message.from}</span>
                <div className={classes.textBody} onContextMenu={handleClick}>
                    {renderTxt(message.body.msg)}
                </div>
            </div>
            <div className={classes.time}>
                {renderTime(message.time)}
            </div>
            <MessageStatus status={message.status} style={{ marginTop: message.chatType === 'singleChat' ? '0' : '22px' }} />
            {message.status === 'read' ? <div className={classes.read}>{i18next.t('Read')}</div> : null}

            {message.bySelf ?
                <Menu
                    keepMounted
                    open={state.mouseY !== null}
                    onClose={handleClose}
                    anchorReference="anchorPosition"
                    anchorPosition={
                        state.mouseY !== null && state.mouseX !== null
                            ? { top: state.mouseY, left: state.mouseX }
                            : undefined
                    }
                >
                    <MenuItem onClick={recallMessage}>{i18next.t("withdraw")}</MenuItem>
                </Menu> : null
            }

        </li>
    )
}

export default memo(TextMessage)


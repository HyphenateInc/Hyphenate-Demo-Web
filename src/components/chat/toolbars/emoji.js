import React, { memo, useEffect, lazy } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { emoji } from '@/common/emoji'
import { Button, Popover } from '@material-ui/core';

const useStyles = makeStyles((theme) => {
    return {
        emojiBox: {
            width: props => props.width + 'px',
            height: props => props.height + 'px',
            display: 'flex',
            flexWrap: 'wrap'
        }
    }
});
const lineNum = 10;
const emojiWidth = 25;
const emojiPadding = 5;
function Emoji({ anchorEl, onClose, onSelected }) {

    const emojisNum = Object.values(emoji.map).length
    const rows = Math.ceil(emojisNum / lineNum)
    const width = (emojiWidth + 2 * emojiPadding) * lineNum
    const height = (emojiWidth + 2 * emojiPadding) * rows
    const classes = useStyles({ width, height });
    function renderEmoji() {
        return Object.keys(emoji.map).map((k) => {
            const v = emoji.map[k]
            return (
                <Button
                    style={{ width: '35px', height: '35px', minHeight: '0', minWidth: '0' }}
                    key={k}
                >
                    <div
                        name={k}
                        style={{
                            width: emojiWidth,
                            height: emojiWidth,
                            padding: emojiPadding
                        }}
                    >
                        <img
                            src={require(`../../../assets/faces/${v}`).default}
                            alt={k}
                            name={k}
                            width={emojiWidth}
                            height={emojiWidth}
                        />
                    </div>
                </Button>
            )
        })
    }

    const handleEmojiClick = (e) => {
        const emoji = e.target.attributes.name.value
        if (!emoji) return
        onSelected(emoji)
    }
    return (
        <Popover
            keepMounted
            open={Boolean(anchorEl)}
            onClose={onClose}
            anchorEl={anchorEl}
            style={{ maxHeight: '500px' }}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
        >
            <div className={classes.emojiBox} onClick={handleEmojiClick}>
                {renderEmoji()}
            </div>
        </Popover>
    );
}
export default memo(Emoji)

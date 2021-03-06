import React, { memo, useEffect, useRef, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Icon } from '@material-ui/core';
import { renderTime } from '@/utils';
import clsx from 'clsx';
import msg_recv_audio from '@/assets/images/msg_recv_audio@2x.png'
import AudioPlayer from '@/components/common/audioPlayer'
const useStyles = makeStyles((theme) => ({
    pulldownListItem: {
        padding: '10px 0',
        listStyle: 'none',
        marginBottom: '26px',
        position: 'relative',
        display: 'flex',
        flexDirection: props => props.bySelf ? 'row-reverse' : 'row'
    },

    audioBox: {
        margin: props => props.bySelf ? '0 10px 26px 0' : '0 0 26px 10px',
        maxWidth: '50%',
        minWidth: '50px',
        width: props => `calc(208px * ${props.duration / 15})`,
        height: '34px',
        background: props => props.bySelf ? '#23C381' : '#FFFFFF',
        borderRadius: props => props.bySelf ? '4px 0 4px 4px' : '0px 4px 4px 4px',
        color: props => props.bySelf ? '#fff' : 'rgb(35, 195, 129)',
        textAlign: props => props.bySelf ? 'left' : 'right',
        flexDirection: props => props.bySelf ? 'row' : 'row-reverse',
        // justifyContent: props => props.bySelf ? 'flex-start' : 'flex-end',
        lineHeight: '34px',
        padding: '0 5px',
        display: 'flex',
        cursor: 'pointer'
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
    duration: {
        margin: '0 4px',
        position: 'relative',
        left: props => props.bySelf ? '-15px' : '15px'
    },
    icon: {
        transform: props => props.bySelf ? 'rotate(0deg)' : 'rotate(180deg)',
        display: 'block',
        height: '34px'
    }
}))

function AudioMessage({ message }) {
    const classes = useStyles({ bySelf: message.bySelf, duration: Math.round(message.body.length) });
    const url = message.body.url
    const audioRef = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)

    const play = () => {
        setIsPlaying(true)
        audioRef.current.play()
        const time = message.body.length * 1000
        setTimeout(() => {
            setIsPlaying(false)
        }, time)
    }

    return (
        <li className={classes.pulldownListItem}>
            <Avatar></Avatar>
            <div className={classes.audioBox} onClick={play}>
                <AudioPlayer play={isPlaying} reverse={message.bySelf} />
                {/* <img src={msg_recv_audio} alt=""></img> */}
                {/* <Icon className={clsx(classes.icon, "iconfont icon-yuyin1")} /> */}
                <span className={classes.duration}>
                    {Math.round(message.body.length) + "''"}
                </span>
                <audio src={url} ref={audioRef} />
            </div>
            <div className={classes.time}>
                {renderTime(message.time)}
            </div>
        </li>
    )
}

export default memo(AudioMessage)
import React, { useRef, memo, useState } from "react";
import AudioAnalyser from "react-audio-analyser"
import SettingsVoiceIcon from '@material-ui/icons/SettingsVoice';
import StopIcon from '@material-ui/icons/Stop';
import { IconButton, Dialog } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MessageActions from '@/redux/message'
import { useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";
import WebIM from '@/common/WebIM';
const audioType = 'audio/wav'
const useStyles = makeStyles((theme) => ({
    container: {
        width: '300px',
        overflowX: 'hidden',
        padding: '10px',
        '& canvas': {
            width: '300px !important',
        }
    },
    start: {
        color: '#23C381',
        border: '1px solid'
    },
    stop: {
        color: 'red',
        border: '1px solid'
    }
}))
function Recorder2({ open, onClose }) {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [status, setStatus] = useState('')
    const [audioSrc, setAudioSrc] = useState('')
    const { to, chatType } = useParams()
    let startTime = useRef(null)
    const audioProps = {
        audioType,
        // audioOptions: {sampleRate: 30000},
        status,
        // audioSrc,
        timeslice: 1000, //（https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/start#Parameters）
        startCallback: (e) => {
            console.log("succ start", e)
            // startTime = new Date().getTime()
            startTime.current = new Date().getTime()
            console.log('startTime', startTime)
        },
        pauseCallback: (e) => {
            console.log("succ pause", e)
        },
        stopCallback: (e) => {
            console.log("succ stop", e)
            let endTime = new Date().getTime()
            console.log('endTime', endTime)
            const duration = (endTime - startTime.current) / 1000
            const uri = {
                url: WebIM.utils.parseDownloadResponse.call(WebIM.conn, e),
                filename: 'audio-message.wav',
                filetype: 'audio',
                data: e,
                length: duration,
                duration: duration
            }
            //setAudioSrc(window.URL.createObjectURL(e))
            dispatch(MessageActions.sendRecorder(to, chatType, uri))
            onClose()
        },
        onRecordCallback: (e) => {
            console.log("recording", e)
        },
        errorCallback: (err) => {
            console.log("error", err)
        },

        backgroundColor: "#fff",
        strokeColor: 'green'
    }
    const handleClose = () => {
        if (status === "recording") {
            setStatus("inactive")
        }
        onClose()
    }
    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <div className={classes.container}>
                <AudioAnalyser {...audioProps}>
                    <div className="btn-box" style={{
                        textAlign: 'center',
                        padding: '8px'
                    }}>
                        {status !== "recording" &&
                            <IconButton className={classes.start} onClick={() => setStatus("recording")}>
                                <SettingsVoiceIcon />
                            </IconButton>}
                        {status === "recording" &&
                            <IconButton className={classes.stop} onClick={() => setStatus("inactive")}>
                                <StopIcon />
                            </IconButton>}
                    </div>
                </AudioAnalyser>
            </div>
        </Dialog>
    )
}

export default memo(Recorder2)


import React from 'react'
import './audioPlayer.css'

function AudioPlayer({ play, reverse }) {
    console.log('play', play)
    return (
        <div className="box">
            <div className={"wifi-symbol " + (reverse ? 'reverse' : '')}>
                <div className={"wifi-circle " + (reverse ? 'reverseColor' : '') + ' first'}></div>
                <div className={("wifi-circle second ") + (play ? 'secondPlay' : '') + (reverse ? ' reverseColor' : '')}></div>
                <div className={`wifi-circle third ${play ? ' thirdPlay' : ''} ${(reverse ? 'reverseColor' : '')}`}></div>
            </div>
        </div>
    )
}

export default AudioPlayer
import React from 'react';
import classes from './Tab.module.css'

import { AiOutlineAudioMuted } from 'react-icons/ai'
import { FcEndCall } from 'react-icons/fc'

const Tab = (props) => {

    const muteAudio = () => {
        props.change("audio")
    }

    const muteVideo = () => {
        props.change("video")
    }

    return (
        <div className={classes.Tab}>
            <div className={classes.IconOut} onClick={muteVideo}>
                <FcEndCall size="3em" />
            </div>
        </div>
    );
}

export default Tab;
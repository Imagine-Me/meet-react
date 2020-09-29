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
    const audioClass = [classes.IconOut]
    const videoClass = [classes.IconOut]

    if (!props.audio)
        audioClass.push(classes.Active)

    if (!props.video)
        videoClass.push(classes.Active)

    return (
        <div className={classes.Tab}>
            <div className={audioClass.join(" ")} onClick={muteAudio}>
                <AiOutlineAudioMuted size="3em" />
            </div>
            <div className={videoClass.join(" ")} onClick={muteVideo}>
                <FcEndCall size="3em" />
            </div>
        </div>
    );
}

export default Tab;
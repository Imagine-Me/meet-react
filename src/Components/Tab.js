import React from 'react';
import classes from './Tab.module.css'

import { AiOutlineAudioMuted } from 'react-icons/ai'
import { FcEndCall } from 'react-icons/fc'

const Tab = (props) => {
    return (
        <div className={classes.Tab}>
            <div className={classes.IconOut}>
                <AiOutlineAudioMuted size="3em" />
            </div>
            <div className={classes.IconOut}>
                <FcEndCall size="3em" />
            </div>
        </div>
    );
}

export default Tab;
import React, { useRef, useEffect, useState } from 'react';

import { useRecoilValue, useSetRecoilState } from 'recoil'
import { user } from '../Recoil/User'

import { initiatePeerConnection, createOffer, answerOffer } from '../Utils/Video'



import { withRouter, useHistory } from 'react-router'



const Meet = (props) => {
    const localVideo = useRef(null)
    const remoteVideo = useRef(null)


    const setUserData = useSetRecoilState(user)
    const userData = useRecoilValue(user)

    const history = useHistory()

    useEffect(() => {
        // IF THE SECOND USER COMES MOVE TO HOME LINK FOR REGISTERING NAME
        if (userData.name === "") {
            history.push({
                pathname: "/",
                search: 'link'
            })
            return
        }

        // CREATING PEER CONNECTION
        const pc = initiatePeerConnection()

        setUserData(old => {
            return {
                ...old,
                pc
            }
        })




    }, [])


    useEffect(() => {
        if (userData.pc !== null) {
            const database = userData.db.database()
            if (userData.host) {
                userData.pc.onicecandidate = (e) => {
                    if (e.candidate) {
                        const key = database.ref().child('room').child(userData.link).child('candidate').push().key
                        const data = {}
                        data[key] = e.candidate
                        database.ref().child('room').child(userData.link).child('candidate').update(data)
                    }
                }

                // CREATING OFFER
                createOffer(userData.pc, userData.db, userData.link)

            } else {
                
                answerOffer()
            }
        }

    }, [userData.pc])


    return (
        <>
            <video ref={localVideo} autoPlay></video>
            <video ref={remoteVideo} autoPlay></video>
        </>
    );
}

export default withRouter(Meet);
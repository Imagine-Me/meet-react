import React, { useRef, useEffect, useState } from 'react';

import { useRecoilValue, useSetRecoilState } from 'recoil'
import { user } from '../Recoil/User'

import { initiatePeerConnection, createOffer, answerOffer, addRemoteDescription, getUserStream, addICECandidate } from '../Utils/Video'
import { readData } from '../Utils/Firebase'


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
            setUserData(old => {
                return {
                    ...old,
                    link: props.match.params.link
                }
            })
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
                // ADDING STREAM TO LOCAL
                localVideo.current.srcObject = userData.stream


                userData.stream.getTracks().forEach(track => userData.pc.addTrack(track, userData.stream));
                userData.pc.onicecandidate = (e) => {
                    if (e.candidate) {
                        const key = database.ref().child('room').child(userData.link).child('candidate').push().key
                        const data = {}
                        data[key] = e.candidate
                        database.ref().child('room').child(userData.link).child('candidate').update(data)
                    }
                }
                userData.pc.ontrack = (e) => {
                    console.log("THERE IS AN INCOMING STREAM",e);
                    remoteVideo.current.srcObject = e.streams[0]
                }


                // CREATING OFFER
                userData.pc.onnegotiationneeded = createOffer(userData.pc, userData.db, userData.link)

                // ADD REMOTE DESCRIPTION
                database.ref().child('room').child(userData.link).on('value', snapshot => {
                    const value = snapshot.val()
                    if (value !== null && value !== undefined && value.answer !== undefined) {
                        if (userData.pc.remoteDescription === null || userData.pc.remoteDescription === undefined)
                            addRemoteDescription(userData.pc, userData.db, value.answer, userData.link, true)
                    }
                })

            } else {


                const getOffer = async () => {
                    // GET STREAM
                    const stream = await getUserStream()

                    setUserData(old => {
                        return {
                            ...old,
                            stream
                        }
                    })

                    localVideo.current.srcObject = stream

                    stream.getTracks().forEach(track => userData.pc.addTrack(track, stream));
                    userData.pc.ontrack = (e) => {
                        remoteVideo.current.srcObject = e.streams[0]
                    }

                    const data = await readData(userData.db, userData.link)
                    setUserData(old => {
                        return {
                            ...old,
                            candidate: data.candidate
                        }
                    })
                    const offer = data.offer
                    addRemoteDescription(userData.pc, userData.db, offer)
                    answerOffer(userData.pc, userData.db, userData.link)
                    database.ref().child('room').child(userData.link).on('value', snapshot => {
                        const value = snapshot.val()
                        if (value !== null && value !== undefined && value.candidateState) {
                            addICECandidate(userData.pc, data.candidate)
                        }
                    })
                }

                getOffer()
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
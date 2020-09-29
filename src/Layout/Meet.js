import React, { useRef, useEffect, useState } from 'react';

import { useRecoilValue, useSetRecoilState } from 'recoil'
import { user } from '../Recoil/User'

import Tab from '../Components/Tab'

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
                    console.log("THERE IS AN INCOMING STREAM", e);
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
                    if (value !== null && value !== undefined && userData.client === "") {
                        const users = value.users
                        console.log("USERS ", users, userData.id)
                        for (const key in users) {
                            if (key !== userData.id) {
                                setUserData(old => ({
                                    ...old,
                                    client: users[key]
                                }))
                                break
                            }
                        }
                    }

                })

            } else {


                const getOffer = async () => {
                    // GET STREAM
                    const stream = await getUserStream(userData.constraints)

                    setUserData(old => {
                        return {
                            ...old,
                            stream
                        }
                    })

                    localVideo.current.srcObject = userData.stream

                    userData.stream.getTracks().forEach(track => userData.pc.addTrack(track, stream));
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
                        if (value !== null && value !== undefined && userData.client === "") {
                            const users = value.users
                            console.log("USERS ", users, userData.id)
                            for (const key in users) {
                                if (key !== userData.id) {
                                    setUserData(old => ({
                                        ...old,
                                        client: users[key]
                                    }))
                                    break
                                }
                            }
                        }
                    })
                }

                getOffer()
            }
        }

    }, [userData.pc])

    


    const handleConstraints = (type) => {
        const constraints = { ...userData.constraints }
        if (type === "audio") {
            constraints.audio = !constraints.audio
        } else {
            constraints.video = !constraints.video
        }

        setUserData(old => ({
            ...old,
            constraints
        }))
        changeStream()
    }

    const changeStream = async () => {
        const d = {
            audio: true,
            video: false
        }
        const stream = await getUserStream(d)
        console.log("STREAM CHANGED..", userData)
        setUserData(old => {
            return {
                ...old,
                stream
            }
        })
        localVideo.current.srcObject=stream
    }



    return (
        <div className="Meet">
            <div className="VideoDiv">
                <div className="user-name">{userData.name}</div>
                <video ref={localVideo} autoPlay muted></video>
            </div>
            <div className="VideoDiv">
                <div className="user-name">{userData.client}</div>
                <video ref={remoteVideo} autoPlay></video>
            </div>
            <Tab change={handleConstraints} audio={userData.constraints.audio} video={userData.constraints.video} />
        </div>
    );
}

export default withRouter(Meet);
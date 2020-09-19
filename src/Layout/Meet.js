import React, { useEffect, useRef } from 'react';

import { useSetRecoilState, useRecoilValue } from 'recoil'
import { withRouter, useHistory } from 'react-router'


import { initiatePeerConnection, getUserStream, createOffer } from '../Utils/Video'

import { user } from '../Recoil/User'

const Meet = (props) => {

    const userState = useRecoilValue(user)
    const localVideo = useRef(null)
    const setUserState = useSetRecoilState(user)

    const history = useHistory()

    useEffect(() => {
        if (userState.name === "") {
            setUserState(old => {
                return {
                    ...old,
                    link: props.match.params.link
                }
            })
            history.push({
                pathname: '/',
                search: "type=join"
            })
            return
        }

        if (userState.stream == null) {
            const getUserStreamData = async () => {
                const stream = await getUserStream()
                localVideo.current.srcObject = stream
                setUserState(old => {
                    return {
                        ...old,
                        stream,
                        link: props.match.params.link
                    }
                })
            }
            getUserStreamData()
        } else {
            console.log("this sonewf")
            localVideo.current.srcObject = userState.stream
        }


        const connection = async () => {
            const pc = await initiatePeerConnection()
            setUserState(old => {
                return {
                    ...old,
                    pc
                }
            })
            pc.onicecandidate = (e) => {
                if (e.candidate) console.log(JSON.stringify(e.candidate))
                else console.log("error")
            }
            pc.oniceconnectionstatechange = (e) => {
                console.log(e)
            }
            pc.addEventListener("track", e => {
                console.log("new  Connection")
            })
            for (const track of userState.stream.getTracks()) {
                pc.addTrack(track);
            }


        }
        connection()
        return () => {

        }
    }, [])

    useEffect(() => {
        if (userState.pc !== null) {
            if (userState.host) {
                console.log("creating offer")
                createOffer(userState.pc, userState.db, userState.link)
            }else{
            }
        }
        return () => {

        }
    }, [userState.pc])

    return (
        <>
            <video ref={localVideo} autoPlay></video>
        </>
    );
}

export default withRouter(Meet);
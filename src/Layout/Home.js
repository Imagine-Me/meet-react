import React, { useEffect, useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { user } from '../Recoil/User'
import { getUserStream } from '../Utils/Video'

import { useHistory } from 'react-router'

const Home = (props) => {

    const videoRef = useRef(null)

    const history = useHistory()

    const userState = useRecoilValue(user);
    const setUserState = useSetRecoilState(user);

    const type = props.location.search ? true : false




    useEffect(() => {
        const streamData = async () => {
            const stream = await getUserStream(userState.constraints)
            videoRef.current.srcObject = stream
            setUserState(old => {
                return {
                    ...old,
                    stream
                }
            })
        }
        streamData()


        return () => {
        }
    }, [])

    const setName = (event) => {
        setUserState(old => {
            return {
                ...old,
                name: event.target.value
            }
        })
    }

    const submitForm = (event) => {
        event.preventDefault()
        const database = userState.db.database()
        if (type) {
            const userId = database.ref().child('room').push().key
            setUserState(old => {
                return {
                    ...old,
                    id: userId
                }
            })
            const data = {}
            data[userId] = userState.name
            database.ref().child('room').child(userState.link).child('users').update(data)
            history.push(userState.link)
        } else {

            const roomId = database.ref().child('room').push().key
            const userId = database.ref().child('room').child(roomId).push().key
            setUserState(old => {
                return {
                    ...old,
                    link: roomId,
                    id: userId,
                    host: true
                }
            })
            const data = {}
            data[userId] = userState.name
            database.ref().child('room').child(roomId).child('users').update(data)
            // redirect to the link
            history.push(roomId)
        }
    }



    return (
        <div className="padding">
            <h1>React Meet</h1>
            <div className="flex-form-container">
                <form onSubmit={submitForm}>
                    <input type="text" name="name" placeholder="Enter your name" value={userState.name} onChange={setName} />
                    <button type="submit">{type ? 'Join' : 'Host'}</button>
                </form>
                <div className="VideoContainer">
                    <video ref={videoRef} autoPlay playsInline muted>

                    </video>
                </div>
            </div>
        </div>
    );
}

export default Home;
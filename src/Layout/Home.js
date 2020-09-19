import React, { useEffect, useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { user } from '../Recoil/User'
import { getUserStream } from '../Utils/Video'

const Home = (props) => {

    const videoRef = useRef(null)

    const userState = useRecoilValue(user);
    const setUserState = useSetRecoilState(user);


    useEffect(() => {

        const streamData = async () => {
            const stream = await getUserStream()
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




    return (
        <div>
            <h1>React Meet</h1>
            <div className="flex-form-container">
                <form>
                    <input type="text" name="name" placeholder="Enter your name" />
                    <button type="submit">Host</button>
                </form>
                <div className="VideoContainer">
                    <video ref={videoRef} autoPlay playsInline>

                    </video>
                </div>
            </div>
        </div>
    );
}

export default Home;
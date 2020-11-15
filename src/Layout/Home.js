import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { user } from '../Recoil/User'
import { getUserStream } from '../Utils/Video'

import { useHistory } from 'react-router'
import { Button, Container, Grid, makeStyles, Slide, Snackbar, TextField, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';


const useStyle = makeStyles(theme => ({
    video: {
        borderRadius: 10,
    },
    padding: {
        padding: 10,
    },
    button: {
        display: 'block'
    },
    marginTop: {
        marginTop: 12,
    },
    textCenter: {
        textAlign: 'center'
    }
}))

function TransitionUp(props) {
    return <Slide {...props} direction="up" />;
}

const Home = (props) => {

    const [snack, setSnack] = useState(false)
    const [transition, setTransition] = useState(undefined)
    const [userStat, setUserStat] = useState(undefined)
    const [formState, setFormState] = useState(false)
    const videoRef = useRef(null)

    const history = useHistory()

    const userState = useRecoilValue(user);
    const setUserState = useSetRecoilState(user);

    const type = props.location.search ? true : false

    const classes = useStyle()



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


    useEffect(() => {
        if (userState.firebase !== null) {
            userState.firebase.auth().onAuthStateChanged((user) => {
                if (user != null) {
                    setUserState(old=>({
                        ...old,
                        email: userState.firebase.auth().currentUser.email
                    }))
                    setUserStat(true)
                }
                else {
                    setUserStat(false)
                }
                setFormState(true)
            })
        }
        return () => {

        }
    }, [userState.firebase])

    const setName = (event) => {
        setUserState(old => {
            return {
                ...old,
                email: event.target.value
            }
        })
    }
    const setPassword = (event) => {
        setUserState(old => {
            return {
                ...old,
                password: event.target.value
            }
        })
    }




    const submitForm = (event) => {
        event.preventDefault()
        if (userState.firebase.auth().currentUser === null) {
            userState.firebase.auth().createUserWithEmailAndPassword(userState.email, userState.password)
                .then((response) => handleHosting())
                .catch((err) => {
                    if (err.code == "auth/email-already-in-use") {
                        userState.firebase.auth().signInWithEmailAndPassword(userState.email, userState.password).catch(function (error) {
                            // Handle Errors here.
                            setTransition(() => TransitionUp);
                            setSnack(true)
                        });
                    } else {

                        setTransition(() => TransitionUp);
                        setSnack(true)
                    }
                })
        }else{
            handleHosting()
        }
    }

    const handleHosting = () => {
        const database = userState.firebase.database()
        
        if (type) {
            console.log(userState.firebase.auth().currentUser.id)
            const userId = database.ref().child('room').push().key
            setUserState(old => {
                return {
                    ...old,
                    id: userId
                }
            })
            const data = {}
            data[userId] = userState.email
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
            data[userId] = userState.email
            database.ref().child('room').child(roomId).child('users').update(data)
            // redirect to the link
            history.push(roomId)
        }
    }

    const handleCloseSnack = () => {
        setSnack(false)
    }


    let form_part = <Skeleton animation="wave" />
    if (userStat) {
        form_part = <Typography style={{ textAlign: 'center' }} variant="h6" component="h6">Hi, {userState.firebase.auth().currentUser.email}</Typography>
    } else if (!userStat && userStat !== undefined) {
        form_part = <div>
            <TextField
                name="email"
                type="email"
                label="Email"
                variant="outlined"
                size="small"
                fullWidth
                value={userState.email}
                onChange={setName} />
            <TextField
                className={classes.marginTop}
                name="password"
                type="password"
                label="Password"
                variant="outlined"
                size="small"
                fullWidth
                value={userState.password}
                onChange={setPassword} />

        </div>
    }

    return (
        <Container maxWidth="md">
            <Snackbar
                open={snack}
                onClose={handleCloseSnack}
                TransitionComponent={transition}
                message="Email/password incorrect"
                key="snack"
            />
            <Grid
                container
                spacing={0}
                alignItems="center"
                justify="center"
                style={{ minHeight: '100vh' }} >
                <Grid item xs={6} className={classes.padding}>
                    <div>
                        <video className={classes.video} ref={videoRef} autoPlay playsInline muted>

                        </video>
                    </div>
                </Grid>
                <Grid item xs={6} className={classes.padding}>
                    <form onSubmit={submitForm}>
                        {form_part}
                        <div className={classes.textCenter}>
                            <Button disabled={!formState} type="submit" className={classes.marginTop} variant="contained" color="primary">
                                {type ? 'Join' : 'Host'}
                            </Button>
                        </div>
                    </form>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Home;
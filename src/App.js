import React, { Suspense, useEffect } from 'react';
import { Switch, Route } from 'react-router'
import firebase from 'firebase/app'
import 'firebase/database'
import { firebaseConfig } from './Utils/Firebase'

import { useSetRecoilState } from 'recoil'
import { user } from './Recoil/User'

import "./App.css"

const HomeLayout = React.lazy(() => import('./Layout/Home'));
const MeetLayout = React.lazy(() => import('./Layout/Meet'));


function App() {
  const setUserState = useSetRecoilState(user)


  useEffect(() => {

    const database = firebase.apps && firebase.apps.length > 0 ? firebase.apps[0] : firebase.initializeApp(firebaseConfig)

    setUserState(old=>{
      return{
        ...old,
        db: database
      }
    })

    

    return () => {

    }
  }, [])

  return (
    <div className="app">
      <Suspense fallback={<h1>Loading</h1>}>
        <Switch>
          <Route path="/" exact component={HomeLayout} />
          <Route path="/:link" exact component={MeetLayout} />

        </Switch>
      </Suspense>
    </div>
  );
}

export default App;
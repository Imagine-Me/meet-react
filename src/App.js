import React, { Suspense, useEffect } from 'react';
import { Switch, Route } from 'react-router'
import Firebase from 'firebase'
import 'firebase/database'
import { firebaseConfig } from './Utils/FirebaseConfig'

import { useSetRecoilState } from 'recoil'
import { user } from './Recoil/User'

import "./App.css"

const HomeLayout = React.lazy(() => import('./Layout/Home'));
const MeetLayout = React.lazy(() => import('./Layout/Meet'));


function App() {
  const setUserState = useSetRecoilState(user)


  useEffect(() => {

    const firebase = Firebase.apps && Firebase.apps.length > 0 ? Firebase.apps[0] : Firebase.initializeApp(firebaseConfig)

    setUserState(old=>{
      return{
        ...old,
        firebase
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
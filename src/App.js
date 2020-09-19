import React, { Suspense } from 'react';
import { Switch, Route } from 'react-router'

import { RecoilRoot } from 'recoil'
import "./App.css"

const HomeLayout = React.lazy(() => import('./Layout/Home'));
const MeetLayout = React.lazy(() => import('./Layout/Meet'));


function App() {

  return (
    <div className="app">
      <RecoilRoot>
        <Suspense fallback={<h1>Loading</h1>}>
          <Switch>
            <Route path="/" exact component={HomeLayout} />
            <Route path="/:link" exact component={MeetLayout} />

          </Switch>
        </Suspense>
      </RecoilRoot>
    </div>
  );
}

export default App;
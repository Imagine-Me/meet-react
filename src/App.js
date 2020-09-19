import React, { Suspense } from 'react';
import { Switch, Route } from 'react-router'

const HomeLayout = React.lazy(() => import('./Layout/Home'));
const MeetLayout = React.lazy(() => import('./Layout/Meet'));

function App() {
  return (
    <div>
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
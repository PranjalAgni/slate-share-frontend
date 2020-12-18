import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { nanoid } from 'nanoid';
import GroupEditor from '../components/GroupEditor';

export default function AppRouter() {
  return (
    <Router>
      <Switch>
        <Route
          path="/"
          exact
          render={() => <Redirect to={`/group/${nanoid()}`} />}
        />
        <Route path="/group/:id" exact component={GroupEditor} />
      </Switch>
    </Router>
  );
}

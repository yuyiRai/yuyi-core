// import './App.css';
import 'antd/dist/antd.css';
import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
// import { DragUpload, ExaManagerRoute } from './views';
import { AppStore, store as app } from './App.store';
import { LayoutContainer } from './components/Layout';
import { RootRoute } from './route';

export const AppContext = React.createContext<AppStore>(app)
const App: React.FC = (props) => {
  const [store] = React.useState(app)
  return (
    <AppContext.Provider value={store}>
      <HashRouter>
        <Switch>
          <RootRoute container={LayoutContainer}/>
          <Route path='/404'>404, not found!</Route>
        </Switch>
      </HashRouter>
    </AppContext.Provider>
  );
}

export default App;

import * as React from 'react';
import './App.css';

import { RepoView } from './components/RepoView';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Eng Metrics</h1>
        </header>
        <RepoView />
      </div>
    );
  }
}

export default App;

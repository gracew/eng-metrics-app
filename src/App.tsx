import * as React from 'react';
import './App.css';

import { RepoView } from './components/RepoView';

class App extends React.Component {
  public render() {
    return (
      <div>
        <header className="App-header">
          <div className="App-title">
            <h1>Eng Metrics</h1>
          </div>
        </header>
        <div className="App">
          <RepoView />
        </div>
      </div>
    );
  }
}

export default App;

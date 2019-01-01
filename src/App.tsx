import { Alignment, AnchorButton, Navbar } from '@blueprintjs/core';
import * as React from 'react';
import { BrowserRouter as Router, Route, RouteComponentProps, Switch } from 'react-router-dom';
import './App.css';

import { RepoView } from './components/RepoView';
import { UserView } from './components/UserView';

interface IAppState {
    token: string | null;
}

class App extends React.Component<{}, IAppState> {

    constructor(props: {}) {
        super(props)
        this.state = {
            token: localStorage.getItem("accessToken"),
        }
    }

    public render() {
        return (
            <div>
                <Navbar className="bp3-dark">
                    <Navbar.Group align={Alignment.LEFT}>
                        <Navbar.Heading>Eng Metrics</Navbar.Heading>
                    </Navbar.Group>
                    {this.state.token !== null && <Navbar.Group align={Alignment.RIGHT}>
                        <AnchorButton
                            href={`https://github.com/settings/connections/applications/${process.env.REACT_APP_CLIENT_ID}`}
                            text="Review/revoke application"
                            minimal={true}
                        />
                    </Navbar.Group>}
                </Navbar>
                <div className="App">
                    <Router>
                        <Switch>
                            <Route path="/" exact={true} render={this.renderRepoView} />
                            <Route path="/user" exact={true} render={this.renderUserView} />
                        </Switch>
                    </Router>
                </div>
            </div>
        );
    }

    private renderRepoView = (props: RouteComponentProps<any>) =>
        <RepoView {...props} token={this.state.token} updateToken={this.updateToken} />
    private renderUserView = (props: RouteComponentProps<any>) =>
        <UserView {...props} token={this.state.token} />

    private updateToken = (token: string) => this.setState({ token })
}

export default App;

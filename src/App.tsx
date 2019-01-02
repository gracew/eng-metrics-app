import * as React from 'react';
import { BrowserRouter as Router, Route, RouteComponentProps, Switch } from 'react-router-dom';
import './App.css';

import { EmNavbar } from './components/EmNavbar';
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
            <Router>
                <div>
                    <Route path="/" render={this.renderNavbar} />
                    <div className="App">
                        <Switch>
                            <Route path="/" exact={true} component={this.renderRepoView} />
                            <Route path="/user" exact={true} render={this.renderUserView} />
                        </Switch>
                    </div>
                </div>
            </Router>
        );
    }

    private renderNavbar = (props: RouteComponentProps<any>) =>
        <EmNavbar {...props} token={this.state.token} />
    private renderRepoView = (props: RouteComponentProps<any>) =>
        <RepoView {...props} token={this.state.token} updateToken={this.updateToken} />
    private renderUserView = (props: RouteComponentProps<any>) =>
        <UserView {...props} token={this.state.token} />

    private updateToken = (token: string) => this.setState({ token })
}

export default App;

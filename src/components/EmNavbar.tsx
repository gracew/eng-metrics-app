import { Alignment, AnchorButton, Button, Navbar, Position, Tooltip } from '@blueprintjs/core';
import * as React from "react";
import { RouteComponentProps } from 'react-router-dom';
import { getGithubLoginUrl } from '../utils';

interface INavbarProps extends RouteComponentProps<any> {
    token: string | null
}

export class EmNavbar extends React.Component<INavbarProps> {

    public render() {
        return (
            <Navbar className="bp3-dark">
                <Navbar.Group align={Alignment.LEFT}>
                    <Navbar.Heading>Eng Metrics</Navbar.Heading>
                    <Navbar.Divider />
                    <Button
                        onClick={this.handleRepoSelection}
                        text="By Repository"
                        minimal={true}
                        active={this.props.location.pathname === "/"}
                    />
                    <Tooltip
                        content={<span><a href={getGithubLoginUrl()}> Login with Github</a> to access</span>}
                        position={Position.RIGHT}
                        disabled={this.props.token !== null}
                        usePortal={false}
                    >
                        <AnchorButton
                            onClick={this.handleUserSelection}
                            text="By User"
                            minimal={true}
                            active={this.props.location.pathname === "/user"}
                            disabled={this.props.token === null}
                        />
                    </Tooltip>
                </Navbar.Group>
                {this.props.token !== null && <Navbar.Group align={Alignment.RIGHT}>
                    <AnchorButton
                        href={`https://github.com/settings/connections/applications/${process.env.REACT_APP_CLIENT_ID}`}
                        text="Review/revoke application"
                        minimal={true}
                    />
                </Navbar.Group>}
            </Navbar>
        );
    }

    private handleRepoSelection = (_: React.MouseEvent<HTMLElement>) => this.props.history.push("/")
    private handleUserSelection = (_: React.MouseEvent<HTMLElement>) => this.props.history.push("/user")
}
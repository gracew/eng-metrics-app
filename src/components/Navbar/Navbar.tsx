import { Alignment, AnchorButton, Button, Navbar as BpNavbar, Popover, Position, Tooltip } from '@blueprintjs/core';
import * as React from "react";
import { RouteComponentProps } from 'react-router-dom';
import { getGithubLoginUrl } from '../../utils';
import './Navbar.css'

interface INavbarProps extends RouteComponentProps<any> {
    token: string | null
}

export class Navbar extends React.Component<INavbarProps> {

    public render() {
        return (
            <BpNavbar className="bp3-dark">
                <BpNavbar.Group align={Alignment.LEFT}>
                    <BpNavbar.Heading>Eng Metrics</BpNavbar.Heading>
                    <BpNavbar.Divider />
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
                </BpNavbar.Group>
                {this.props.token !== null && <BpNavbar.Group align={Alignment.RIGHT}>
                    <Popover className="mobile">
                        <Button icon="more" minimal={true} />
                        <AnchorButton
                            href={`https://github.com/settings/connections/applications/${process.env.REACT_APP_CLIENT_ID}`}
                            text="Review/revoke application"
                            minimal={true}
                        />
                    </Popover>
                    <AnchorButton
                        className="desktop"
                        href={`https://github.com/settings/connections/applications/${process.env.REACT_APP_CLIENT_ID}`}
                        text="Review/revoke application"
                        minimal={true}
                    />
                </BpNavbar.Group>}
            </BpNavbar>
        );
    }

    private handleRepoSelection = (_: React.MouseEvent<HTMLElement>) => this.props.history.push("/")
    private handleUserSelection = (_: React.MouseEvent<HTMLElement>) => this.props.history.push("/user")
}
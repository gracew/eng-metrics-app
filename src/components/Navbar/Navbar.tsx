import { Alignment, AnchorButton, Button, Navbar as BpNavbar, Popover } from '@blueprintjs/core';
import * as React from "react";
import { RouteComponentProps } from 'react-router-dom';
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
                    <Button
                        onClick={this.handleUserSelection}
                        text="By User"
                        minimal={true}
                        active={this.props.location.pathname === "/user"}
                    />
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

    private handleRepoSelection = (_: React.MouseEvent<HTMLElement>) => this.props.history.push("/");
    private handleUserSelection = (_: React.MouseEvent<HTMLElement>) => this.props.history.push("/user");
}
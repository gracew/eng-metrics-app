import { Alignment, AnchorButton, Button, Navbar as BpNavbar, Popover } from '@blueprintjs/core';
import * as queryString from 'query-string';
import * as React from "react";
import { RouteComponentProps } from 'react-router-dom';
import './Navbar.css'

interface INavbarProps extends RouteComponentProps<any> {
    updateToken: (token: string) => void
    token: string | null
}

export class Navbar extends React.Component<INavbarProps> {

    public componentDidMount() {
        if (this.props.location.search) {
            const queryValues = queryString.parse(this.props.location.search);
            const expectedState = localStorage.getItem("oauthState")
            if (queryValues.state !== expectedState) {
                // TODO(gracew): handle this better
                throw Error("unexpected oauth state")
            }
            fetch(`${process.env.REACT_APP_SERVER_URL}/login?state=${queryValues.state}&code=${queryValues.code}`, {
                mode: "cors",
            })
                .then(res => res.json())
                // TODO(gracew): make the local storage keys into constants
                .then(({ access_token }) => {
                    localStorage.setItem("accessToken", access_token)
                    this.props.updateToken(access_token)
                    this.props.history.push("/")
                });
            // TODO(gracew): handle failure case
        }
    }

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
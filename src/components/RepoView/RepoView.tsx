import { Button, FormGroup, InputGroup, Switch } from "@blueprintjs/core"
import * as React from "react";
import { RouteComponentProps } from 'react-router-dom';
import { getGithubLoginUrl } from '../../utils';
import { CIChartGroup } from '../CIChartGroup/CIChartGroup';
import { IssueChartGroup } from '../IssueChartGroup/IssueChartGroup';
import { PRChartGroup } from '../PRChartGroup/PRChartGroup';
import './Form.css'
import './RepoView.css'

export interface IRepoViewProps extends RouteComponentProps<any> {
    token: string | null,
}

interface IRepoViewState {
    repo: string
    weeks: string
    showBeta: boolean
    fetch: boolean
}

export class RepoView extends React.Component<IRepoViewProps, IRepoViewState> {

    constructor(props: IRepoViewProps) {
        super(props);
        this.state = {
            fetch: false,
            repo: "palantir/tslint",
            showBeta: false,
            weeks: "6",
        }
    }

    public render() {
        return (
            <div>
                <form className="em-form" onSubmit={this.handleSubmit}>
                    <FormGroup
                        label="Repository"
                        className="em-repo-input"
                        helperText={!this.validRepo() && "Repo name must be fully qualified (orgName/repoName)"}
                    >
                        <InputGroup
                            type="text"
                            value={this.state.repo}
                            onChange={this.handleRepoChange}
                            disabled={this.props.token === null}
                        />
                    </FormGroup>

                    <FormGroup
                        label="Weeks"
                        className="em-weeks-input"
                        helperText={!this.validWeeks() && "Value must be a positive integer"}
                    >
                        <InputGroup
                            type="text"
                            value={this.state.weeks}
                            onChange={this.handleWeeksChange}
                            disabled={this.props.token === null}
                        />
                    </FormGroup>

                    <FormGroup label="Submit" className="em-submit">
                        <Button type="submit" intent="primary" text="Go!" disabled={this.props.token === null} />
                    </FormGroup>

                    <FormGroup label="Beta" className="em-show-beta">
                        <Switch label="Show beta charts" onChange={this.handleBetaChange} />
                    </FormGroup>

                    {this.props.token === null && <div className="em-login-text">
                        Want to see data for another repository? <a href={getGithubLoginUrl()}>Login with Github</a>
                    </div>}

                </form>

                <PRChartGroup
                    token={this.props.token}
                    repo={this.state.repo}
                    weeks={this.state.weeks}
                    showBeta={this.state.showBeta}
                    fetch={this.state.fetch}
                />
                <IssueChartGroup
                    token={this.props.token}
                    repo={this.state.repo}
                    weeks={this.state.weeks}
                    showBeta={this.state.showBeta}
                    fetch={this.state.fetch}
                />
                <CIChartGroup
                    token={this.props.token}
                    repo={this.state.repo}
                    weeks={this.state.weeks}
                    showBeta={this.state.showBeta}
                    fetch={this.state.fetch}
                />
            </div>
        );
    }

    private validRepo = () => this.state.repo.includes("/")
    private validWeeks = () => {
        const value = parseInt(this.state.weeks, 10)
        return !isNaN(value) && value > 0;
    }

    private handleRepoChange = (event: React.ChangeEvent<HTMLInputElement>) =>
        this.setState({ fetch: false, repo: event.target.value })
    private handleWeeksChange = (event: React.ChangeEvent<HTMLInputElement>) =>
        this.setState({ fetch: false, weeks: event.target.value })

    private handleBetaChange = (event: React.FormEvent<HTMLElement>) =>
        this.setState({ showBeta: (event.target as HTMLInputElement).checked })

    private handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (this.validRepo() && this.validWeeks()) {
            this.setState({ fetch: true })
        }
    }
}

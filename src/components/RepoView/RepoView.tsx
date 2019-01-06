import { Button, FormGroup, InputGroup, Switch } from "@blueprintjs/core"
import * as queryString from 'query-string';
import * as React from "react";
import { RouteComponentProps } from 'react-router-dom';
import { ICIDetails, IIssueDetails, IPRDetails, IRepoData } from '../../models/RepoData';
import { getGithubLoginUrl, toDays, toMinutes } from '../../utils';
import { IssueActivityChart } from '../IssueActivityChart/IssueActivityChart';
import { IssueStatusChart } from '../IssueStatusChart/IssueStatusChart';
import { PRActivityChart } from '../PRActivityChart/PRActivityChart';
import { PRStatusChart } from '../PRStatusChart/PRStatusChart';
import { ResolutionChart } from '../ResolutionChart/ResolutionChart';
import './Form.css'
import { tslintData, tslintDataWeeks } from './initialData';
import './RepoView.css'

export interface IRepoViewProps extends RouteComponentProps<any> {
    // this is really gross... maybe it's time for redux
    updateToken: (token: string) => void
    token: string | null,
}

interface IRepoViewState {
    repo: string
    weeks: string
    data: IRepoData
    showBeta: boolean
    loading: boolean
}

export class RepoView extends React.Component<IRepoViewProps, IRepoViewState> {

    private prResolutionTimeDesc = `Percentiles for PR resolution times, grouped by the week that the PR was created. 
    PRs are considered resolved if they have been merged or rejected (closed).`

    private prReviewTimeDesc = `Percentiles for PR review times, grouped by the week that the PR was created. Only the
    first PR by a user other than the PR author is considered.`

    private prReviewDesc = `Percentiles for reviews per PR, grouped by the week that the PR was created.`

    private issueResolutionTimeDesc = `Percentiles for issue resolution times, grouped by the week that the issue was 
    created. Issues are considered resolved if they have been closed.`

    private ciTimeDesc = `Percentiles for CI times. Only the CI checks for the latest commit in each PR are included. 
    They are grouped by the later of the commit push date and the PR creation date. If the PR was made from a fork, then
    the commit date is substituted for the push date.`

    constructor(props: IRepoViewProps) {
        super(props);
        this.state = {
            data: tslintData,
            loading: false,
            repo: "palantir/tslint",
            showBeta: false,
            weeks: tslintDataWeeks,
        }
    }

    public componentWillMount() {
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
                });
            // TODO(gracew): handle failure case
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
                <PRStatusChart items={this.state.data.prs} loading={this.state.loading} />
                {this.state.showBeta && <PRActivityChart items={this.state.data.prs} loading={this.state.loading} />}
                <ResolutionChart
                    items={this.state.data.prs}
                    loading={this.state.loading}
                    chartTitle="PR Resolution Time"
                    chartDesc={this.prResolutionTimeDesc}
                    linkSelector={this.titleSelector}
                    linkLabel="PR"
                    valueSelector={this.resolutionTimeSelector}
                    valueLabel="Resolution Time"
                    unitConverter={toDays}
                    unitLabel="days"
                />
                <ResolutionChart
                    items={this.state.data.prs}
                    loading={this.state.loading}
                    chartTitle="PR Review Time"
                    chartDesc={this.prReviewTimeDesc}
                    linkSelector={this.titleSelector}
                    linkLabel="PR"
                    valueSelector={this.reviewTimeSelector}
                    valueLabel="Review Time"
                    unitConverter={toDays}
                    unitLabel="days"
                />
                <ResolutionChart
                    items={this.state.data.prs}
                    loading={this.state.loading}
                    chartTitle="PR Reviews"
                    chartDesc={this.prReviewDesc}
                    linkSelector={this.titleSelector}
                    linkLabel="PR"
                    valueSelector={this.reviewSelector}
                    valueLabel="Number of Reviews"
                />

                <IssueStatusChart items={this.state.data.issues} loading={this.state.loading} />
                {this.state.showBeta && <IssueActivityChart items={this.state.data.issues} loading={this.state.loading} />}
                <ResolutionChart
                    items={this.state.data.issues}
                    loading={this.state.loading}
                    chartTitle="Issue Resolution Time"
                    chartDesc={this.issueResolutionTimeDesc}
                    linkSelector={this.titleSelector}
                    linkLabel="Issue"
                    valueSelector={this.resolutionTimeSelector}
                    valueLabel="Resolution Time"
                    unitConverter={toDays}
                    unitLabel="days"
                />
                <ResolutionChart
                    items={this.state.data.ci}
                    loading={this.state.loading}
                    chartTitle="CI Time"
                    chartDesc={this.ciTimeDesc}
                    linkSelector={this.ciTitleSelector}
                    linkLabel="PR & Check"
                    valueSelector={this.ciValueSelector}
                    valueLabel="CI Time"
                    unitConverter={toMinutes}
                    unitLabel="min"
                />
            </div>
        );
    }

    private titleSelector = (d: IIssueDetails | IPRDetails) => (<a href={d.url}>#{d.number}: {d.title}</a>)
    private resolutionTimeSelector = (d: IIssueDetails | IPRDetails) => d.resolutionTime
    private reviewTimeSelector = (d: IPRDetails) => d.reviewTime
    private reviewSelector = (d: IPRDetails) => d.reviews
    private ciTitleSelector = (d: ICIDetails) => (
        <div>
            <a href={d.prUrl}>#{d.pr}</a>: <a href={d.maxCheckUrl}>{d.maxCheckName}</a>
        </div>
    )
    private ciValueSelector = (d: ICIDetails) => d.maxCheckDuration

    private validRepo = () => this.state.repo.includes("/")
    private validWeeks = () => {
        const value = parseInt(this.state.weeks, 10)
        return !isNaN(value) && value > 0;
    }

    private handleRepoChange = (event: React.ChangeEvent<HTMLInputElement>) =>
        this.setState({ repo: event.target.value })
    private handleWeeksChange = (event: React.ChangeEvent<HTMLInputElement>) =>
        this.setState({ weeks: event.target.value })
    private handleBetaChange = (event: React.FormEvent<HTMLElement>) =>
        this.setState({ showBeta: (event.target as HTMLInputElement).checked })

    private handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (this.validRepo() && this.validWeeks()) {
            this.setState({ loading: true })
            fetch(`${process.env.REACT_APP_SERVER_URL}/repos/${this.state.repo}?weeks=${this.state.weeks}`, {
                headers: {
                    Authorization: `token ${this.props.token}`,
                },
                mode: "cors"
            })
                .then(res => res.json())
                .then(data => this.setState({ data, loading: false }))
            // TODO(gracew): handle failure case...
        }
    }
}

import { Button, FormGroup, InputGroup, Switch } from "@blueprintjs/core"
import * as React from "react";
import { ICIDetails, IIssueDetails, IPRDetails, IRepoData } from '../models/RepoData';
import { toDays, toMinutes } from '../utils';
import { tslintData, tslintDataWeeks } from './initialData';
import { IssueActivityChart } from './IssueActivityChart';
import { IssueStatusChart } from './IssueStatusChart';
import { PRActivityChart } from './PRActivityChart';
import { PRStatusChart } from './PRStatusChart';
import './RepoView.css'
import { ResolutionChart } from './ResolutionChart';

interface IRepoViewState {
    repo: string
    weeks: string
    data: IRepoData
    showBeta: boolean
    loading: boolean
}

export class RepoView extends React.Component<{}, IRepoViewState> {

    private prResolutionChartDesc = `Percentiles for PR resolution times, grouped by the week that the PR was created. 
    PRs are considered resolved if they have been merged or rejected (closed).`

    private issueResolutionChartDesc = `Percentiles for issue resolution times, grouped by the week that the issue was 
    created. Issues are considered resolved if they have been closed.`

    private ciChartDesc=`Percentiles for CI times. Only the CI checks for the latest commit in each PR are included. 
    They are grouped by the later of the commit push date and the PR creation date. If the PR was made from a fork, then
    the commit date is substituted for the push date.`

    constructor(props: {}) {
        super(props);
        this.state = {
            data: tslintData,
            loading: false,
            repo: "palantir/tslint",
            showBeta: false,
            weeks: tslintDataWeeks,
        }
    }

    public render() {
        return (
            <div className="RepoView">
                <form className="RepoSelector" onSubmit={this.handleSubmit}>
                    <FormGroup
                        label="Repository"
                        className="em-repo-input"
                        helperText={!this.validRepo() && "Repo name must be fully qualified (orgName/repoName)"}
                    >
                        <InputGroup type="text" value={this.state.repo} onChange={this.handleRepoChange} />
                    </FormGroup>

                    <FormGroup
                        label="Weeks"
                        className="em-weeks-input"
                        helperText={!this.validWeeks() && "Value must be a positive integer"}
                    >
                        <InputGroup type="text" value={this.state.weeks} onChange={this.handleWeeksChange} />
                    </FormGroup>

                    <FormGroup label="Submit" className="em-submit">
                        <Button type="submit" intent="primary" text="Go!" />
                    </FormGroup>

                    <FormGroup label="Beta" className="em-show-beta">
                        <Switch label="Show beta charts" onChange={this.handleBetaChange} />
                    </FormGroup>
                </form>
                <PRStatusChart items={this.state.data.prs} loading={this.state.loading} />
                {this.state.showBeta && <PRActivityChart items={this.state.data.prs} loading={this.state.loading} />}
                <ResolutionChart
                    items={this.state.data.prs}
                    loading={this.state.loading}
                    chartTitle="PR Resolution Time"
                    chartDesc={this.prResolutionChartDesc}
                    linkSelector={this.titleSelector}
                    linkLabel="PR"
                    valueSelector={this.valueSelector}
                    valueLabel="Resolution Time"
                    unitConverter={toDays}
                    unitLabel="days"
                />
                <IssueStatusChart items={this.state.data.issues} loading={this.state.loading} />
                {this.state.showBeta && <IssueActivityChart items={this.state.data.issues} loading={this.state.loading} />}
                <ResolutionChart
                    items={this.state.data.issues}
                    loading={this.state.loading}
                    chartTitle="Issue Resolution Time"
                    chartDesc={this.issueResolutionChartDesc}
                    linkSelector={this.titleSelector}
                    linkLabel="Issue"
                    valueSelector={this.valueSelector}
                    valueLabel="Resolution Time"
                    unitConverter={toDays}
                    unitLabel="days"
                />
                <ResolutionChart
                    items={this.state.data.ci}
                    loading={this.state.loading}
                    chartTitle="CI Time"
                    chartDesc={this.ciChartDesc}
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
    private valueSelector = (d: IIssueDetails | IPRDetails) => d.resolutionTime
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
            fetch(`http://localhost:8080/repos/${this.state.repo}?weeks=${this.state.weeks}`, { mode: "cors" })
                .then(res => res.json())
                .then(data => this.setState({ data, loading: false }))
            // TODO(gracew): handle failure case...
        }
    }
}

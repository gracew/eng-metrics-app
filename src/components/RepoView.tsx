import { Button, FormGroup, InputGroup } from "@blueprintjs/core"
import * as React from "react";
import { IRepoData } from '../models/RepoData';
import { CIChart } from './CIChart';
import { tslintData, tslintDataWeeks } from './initialData';
import { IssueActivityChart } from './IssueActivityChart';
import { IssueResolutionChart } from './IssueResolutionChart';
import { PRActivityChart } from './PRActivityChart';
import { PRResolutionChart } from './PRResolutionChart';
import './RepoView.css'

interface IRepoViewState {
    repo: string
    weeks: string
    data: IRepoData
    loading: boolean
}

export class RepoView extends React.Component<{}, IRepoViewState> {

    constructor(props: {}) {
        super(props);
        this.state = { repo: "palantir/tslint", weeks: tslintDataWeeks, data: tslintData, loading: false }
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
                </form>
                <PRActivityChart repo={this.state.repo} items={this.state.data.prs} loading={this.state.loading} />
                <PRResolutionChart repo={this.state.repo} items={this.state.data.prs} loading={this.state.loading} />
                <IssueActivityChart repo={this.state.repo} items={this.state.data.issues} loading={this.state.loading} />
                <IssueResolutionChart repo={this.state.repo} items={this.state.data.issues} loading={this.state.loading} />
                <CIChart repo={this.state.repo} items={this.state.data.ci} loading={this.state.loading} />
            </div>
        );
    }

    private validRepo = () => this.state.repo.includes("/")
    private validWeeks = () => {
        const value = parseInt(this.state.weeks, 10)
        return !isNaN(value) && value > 0;
    }

    private handleRepoChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({ repo: event.target.value })
    private handleWeeksChange = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({ weeks: event.target.value })

    private handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (this.validRepo() && this.validWeeks()) {
            this.setState({ loading: true })
            fetch(`http://localhost:8080/${this.state.repo}/score?weeks=${this.state.weeks}`, { mode: "cors" })
                .then(res => res.json())
                .then(data => this.setState({ data, loading: false }))
            // TODO(gracew): handle failure case...
        }
    }
}

import * as React from "react";
import { IRepoData } from '../models/RepoData';
import { CIChart } from './CIChart';
import { tslintData } from './initialData';
import { IssueActivityChart } from './IssueActivityChart';
import { IssueResolutionChart } from './IssueResolutionChart';
import { PRActivityChart } from './PRActivityChart';
import { PRResolutionChart } from './PRResolutionChart';

interface IRepoViewState {
    repo?: string
    data: IRepoData
}

export class RepoView extends React.Component<{}, IRepoViewState> {

    constructor(props: {}) {
        super(props);
        this.state = { repo: "palantir/tslint", data: tslintData }

    }

    public render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>Repository:</label>
                    <input type="text" name="repository" value={this.state.repo} onChange={this.handleChange} />
                    <input type="submit" value="Submit" />
                </form>
                <PRActivityChart repo={this.state.repo} items={this.state.data.prs} />
                <PRResolutionChart repo={this.state.repo} items={this.state.data.prs} />
                <IssueActivityChart repo={this.state.repo} items={this.state.data.issues} />
                <IssueResolutionChart repo={this.state.repo} items={this.state.data.issues} />
                <CIChart repo={this.state.repo} items={this.state.data.ci} />
            </div>
        );
    }

    private handleChange = (event: any) => this.setState({ repo: event.target.value })

    private handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (this.state.repo && this.state.repo.includes('/')) {
            fetch(`http://localhost:8080/${this.state.repo}/score?weeks=6`, { mode: "cors" })
                .then(res => res.json())
                .then(data => this.setState({ data }))
            // TODO(gracew): handle failure case...
        }
    }
}

import * as React from "react";
import { IRepoData } from '../models/RepoData';
import { CIChart } from './CIChart';
import { RepoForm } from './RepoForm';

interface IRepoViewState {
    repo?: string
    data: IRepoData
}

export class RepoView extends React.Component<{}, IRepoViewState> {

    constructor(props: {}) {
        super(props);
        this.state = { data: { ci: [] } }
    }

    public render() {
        return (
            <div>
                <RepoForm handler={this.handler} />
                <CIChart repo={this.state.repo} items={this.state.data.ci} />
            </div>
        );
    }

    private handler = (repo?: string) => {
        this.setState({ repo })
        fetch(`http://localhost:8080/${repo}/score?weeks=6`, { mode: "cors" })
            .then(res => res.json())
            .then(data => this.setState({ data }))
        // TODO(gracew): handle failure case...
    }
}

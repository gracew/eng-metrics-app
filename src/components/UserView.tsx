import { Button, FormGroup, InputGroup, Switch } from "@blueprintjs/core"
import * as React from "react";
import { IPRDetails, IRepoData } from '../models/RepoData';
import { toDays } from '../utils';
import { tslintData, tslintDataWeeks } from './initialData';
import { PRActivityChart } from './PRActivityChart';
import { PRStatusChart } from './PRStatusChart';
import './RepoView.css'
import { ResolutionChart } from './ResolutionChart';

interface IUserViewProps {
    token: string | null
}

interface IUserViewState {
    user: string
    weeks: string
    data: IRepoData
    showBeta: boolean
    loading: boolean
}

export class UserView extends React.Component<IUserViewProps, IUserViewState> {

    private prResolutionChartDesc = `Percentiles for PR resolution times, grouped by the week that the PR was created. 
    PRs are considered resolved if they have been merged or rejected (closed).`

    constructor(props: IUserViewProps) {
        super(props);
        this.state = {
            data: tslintData,
            loading: false,
            showBeta: false,
            user: "palantir/tslint",
            weeks: tslintDataWeeks,
        }
    }

    public render() {
        return (
            <div>
                <form className="em-user-form" onSubmit={this.handleSubmit}>
                    <FormGroup
                        label="User"
                        className="em-user-input"
                    >
                        <InputGroup
                            type="text"
                            value={this.state.user}
                            onChange={this.handleUserChange}
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
                        />
                    </FormGroup>

                    <FormGroup label="Submit" className="em-submit">
                        <Button type="submit" intent="primary" text="Go!" disabled={this.props.token === null} />
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
            </div>
        );
    }

    private titleSelector = (d: IPRDetails) => (<a href={d.url}>#{d.number}: {d.title}</a>)
    private valueSelector = (d: IPRDetails) => d.resolutionTime

    private validWeeks = () => {
        const value = parseInt(this.state.weeks, 10)
        return !isNaN(value) && value > 0;
    }

    private handleUserChange = (event: React.ChangeEvent<HTMLInputElement>) =>
        this.setState({ user: event.target.value })
    private handleWeeksChange = (event: React.ChangeEvent<HTMLInputElement>) =>
        this.setState({ weeks: event.target.value })
    private handleBetaChange = (event: React.FormEvent<HTMLElement>) =>
        this.setState({ showBeta: (event.target as HTMLInputElement).checked })

    private handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (this.validWeeks()) {
            this.setState({ loading: true })
            fetch(`${process.env.REACT_APP_SERVER_URL}/users/${this.state.user}?weeks=${this.state.weeks}`, {
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

import { Button, FormGroup, InputGroup, Switch } from "@blueprintjs/core"
import * as React from "react";
import { IPRDetails, IUserData } from '../models/RepoData';
import { toDays } from '../utils';
import './Form.css'
import { tslintDataWeeks } from './initialData';
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
    data: IUserData
    showBeta: boolean
    loading: boolean
}

export class UserView extends React.Component<IUserViewProps, IUserViewState> {

    private prResolutionDesc = `Percentiles for PR resolution times, grouped by the week that the PR was created. 
    PRs are considered resolved if they have been merged or rejected (closed).`

    private prReviewDesc = `Percentiles for reviews received per PR (including self-reviews), grouped by the week that 
    the PR was created.`

    constructor(props: IUserViewProps) {
        super(props);
        this.state = {
            data: { prs: [] },
            loading: false,
            showBeta: false,
            user: "",
            weeks: tslintDataWeeks,
        }
    }

    public render() {
        return (
            <div>
                <form className="em-form" onSubmit={this.handleSubmit}>
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
                    chartDesc={this.prResolutionDesc}
                    linkSelector={this.titleSelector}
                    linkLabel="PR"
                    valueSelector={this.valueSelector}
                    valueLabel="Resolution Time"
                    unitConverter={toDays}
                    unitLabel="days"
                />
                <ResolutionChart
                    items={this.state.data.prs}
                    loading={this.state.loading}
                    chartTitle="PR Reviews Received"
                    chartDesc={this.prReviewDesc}
                    linkSelector={this.titleSelector}
                    linkLabel="PR"
                    valueSelector={this.reviewSelector}
                    valueLabel="Number of Reviews"
                />
            </div>
        );
    }

    private titleSelector = (d: IPRDetails) => (<a href={d.url}>#{d.number}: {d.title}</a>)
    private valueSelector = (d: IPRDetails) => d.resolutionTime
    private reviewSelector = (d: IPRDetails) => d.reviews

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

import * as React from "react";

import { IPRData, IPRDetails } from '../../models/RepoData';
import { toDays } from '../../utils';
import { PRActivityChart } from '../PRActivityChart/PRActivityChart';
import { PRStatusChart } from '../PRStatusChart/PRStatusChart';
import { ResolutionChart } from '../ResolutionChart/ResolutionChart';
import { tslintData } from './initialData';

interface IPRChartGroupProps {
    token: string | null
    repo: string
    weeks: string
    showBeta: boolean
    fetch: boolean
}

interface IPRChartGroupState {
    data: IPRData[]
    loading: boolean
}

export class PRChartGroup extends React.Component<IPRChartGroupProps, IPRChartGroupState> {

    private prResolutionTimeDesc = `Percentiles for PR resolution times, grouped by the week that the PR was created. 
    PRs are considered resolved if they have been merged or rejected (closed).`

    private prReviewTimeDesc = `Percentiles for PR review times, grouped by the week that the PR was created. Only the
    first PR by a user other than the PR author is considered.`

    private prReviewDesc = `Percentiles for reviews per PR, grouped by the week that the PR was created.`

    constructor(props: IPRChartGroupProps) {
        super(props);
        this.state = { data: tslintData, loading: false }
    }

    public componentDidUpdate(prevProps: IPRChartGroupProps) {
        if (this.props.fetch && !prevProps.fetch) {
            this.setState({ loading: true })
            fetch(`${process.env.REACT_APP_SERVER_URL}/repos/${this.props.repo}/prs?weeks=${this.props.weeks}`, {
                headers: {
                    Authorization: `token ${this.props.token}`,
                },
                mode: "cors"
            })
                .then(res => res.json())
                .then(data => this.setState({ data, loading: false }))
        }
    }

    public render() {
        return (
            <div>
                <PRStatusChart items={this.state.data} loading={this.state.loading} />
                {this.props.showBeta && <PRActivityChart items={this.state.data} loading={this.state.loading} />}
                <ResolutionChart
                    items={this.state.data}
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
                    items={this.state.data}
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
                    items={this.state.data}
                    loading={this.state.loading}
                    chartTitle="PR Reviews"
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
    private resolutionTimeSelector = (d: IPRDetails) => d.resolutionTime
    private reviewTimeSelector = (d: IPRDetails) => d.reviewTime
    private reviewSelector = (d: IPRDetails) => d.reviews
}

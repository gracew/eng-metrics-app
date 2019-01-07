import * as React from "react";

import { IIssueData, IIssueDetails } from '../../models/RepoData';
import { toDays } from '../../utils';
import { IssueActivityChart } from '../IssueActivityChart/IssueActivityChart';
import { IssueStatusChart } from '../IssueStatusChart/IssueStatusChart';
import { ResolutionChart } from '../ResolutionChart/ResolutionChart';
import { tslintData } from './initialData';

interface IIssueChartGroupProps {
    token: string | null
    repo: string
    weeks: string
    showBeta: boolean
    fetch: boolean
}

interface IIssueChartGroupState {
    data: IIssueData[]
    loading: boolean
}

export class IssueChartGroup extends React.Component<IIssueChartGroupProps, IIssueChartGroupState> {

    private issueResolutionTimeDesc = `Percentiles for issue resolution times, grouped by the week that the issue was 
    created. Issues are considered resolved if they have been closed.`

    constructor(props: IIssueChartGroupProps) {
        super(props);
        this.state = { data: tslintData, loading: false }
    }

    public componentDidUpdate(prevProps: IIssueChartGroupProps) {
        if (this.props.fetch && !prevProps.fetch) {
            this.setState({ loading: true })
            fetch(`${process.env.REACT_APP_SERVER_URL}/repos/${this.props.repo}/issues?weeks=${this.props.weeks}`, {
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
                <IssueStatusChart items={this.state.data} loading={this.state.loading} />
                {this.props.showBeta && <IssueActivityChart items={this.state.data} loading={this.state.loading} />}
                <ResolutionChart
                    items={this.state.data}
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
            </div>
        );
    }

    private titleSelector = (d: IIssueDetails) => (<a href={d.url}>#{d.number}: {d.title}</a>)
    private resolutionTimeSelector = (d: IIssueDetails) => d.resolutionTime
}

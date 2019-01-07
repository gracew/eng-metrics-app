import * as React from "react";

import { ICIData, ICIDetails } from '../../models/RepoData';
import { toMinutes } from '../../utils';
import { ResolutionChart } from '../ResolutionChart/ResolutionChart';
import { tslintData } from './initialData';

interface ICIChartGroupProps {
    token: string | null
    repo: string
    weeks: string
    showBeta: boolean
    fetch: boolean
}

interface ICIChartGroupState {
    data: ICIData[]
    loading: boolean
}

export class CIChartGroup extends React.Component<ICIChartGroupProps, ICIChartGroupState> {

    private ciTimeDesc = `Percentiles for CI times. Only the CI checks for the latest commit in each PR are included. 
    They are grouped by the later of the commit push date and the PR creation date. If the PR was made from a fork, then
    the commit date is substituted for the push date.`

    constructor(props: ICIChartGroupProps) {
        super(props);
        this.state = { data: tslintData, loading: false }
    }

    public componentDidUpdate(prevProps: ICIChartGroupProps) {
        if (this.props.fetch && !prevProps.fetch) {
            this.setState({ loading: true })
            fetch(`${process.env.REACT_APP_SERVER_URL}/repos/${this.props.repo}/ci?weeks=${this.props.weeks}`, {
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
            <ResolutionChart
                items={this.state.data}
                loading={this.state.loading}
                chartTitle="CI Time"
                chartDesc={this.ciTimeDesc}
                linkSelector={this.titleSelector}
                linkLabel="PR & Check"
                valueSelector={this.valueSelector}
                valueLabel="CI Time"
                unitConverter={toMinutes}
                unitLabel="min"
            />
        );
    }

    private titleSelector = (d: ICIDetails) => (
        <div>
            <a href={d.prUrl}>#{d.pr}</a>: <a href={d.maxCheckUrl}>{d.maxCheckName}</a>
        </div>
    )
    private valueSelector = (d: ICIDetails) => d.maxCheckDuration

}

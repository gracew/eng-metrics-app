import { Button, ButtonGroup } from '@blueprintjs/core';
import * as React from "react";

import ReactEcharts from "echarts-for-react";
import { IIssueData } from '../../models/RepoData';
import { chartOptions } from '../../utils';

interface IIssueActivityChartProps {
    items: IIssueData[]
    loading: boolean
}

export class IssueActivityChart extends React.Component<IIssueActivityChartProps> {

    private chartDesc = "Opened and closed PRs, grouped by week that the activity occurred."

    public render() {
        return (
            <div className="em-chart-group">
                <ReactEcharts showLoading={this.props.loading} option={this.getOption()} />
                <div className="em-chart-details">
                    <ButtonGroup className="em-dummy-button"><Button /></ButtonGroup>
                    <div className="em-chart-desc">{this.chartDesc}</div>
                </div>
            </div>
        );
    }

    private getOption = () => {
        return {
            ...chartOptions,
            series: [
                {
                    areaStyle: { color: '#28a745' },
                    data: this.props.items.map(({ week, opened }) => [week, opened]),
                    itemStyle: { color: '#28a745' },
                    lineStyle: { color: '#28a745' },
                    name: 'opened',
                    type: 'line',
                },
                {
                    areaStyle: { color: '#cb2431' },
                    data: this.props.items.map(({ week, closed }) => [week, closed]),
                    itemStyle: { color: '#cb2431' },
                    lineStyle: { color: '#cb2431' },
                    name: 'closed',
                    type: 'line',
                },
            ],
            title: {
                text: 'Issue Activity'
            },
            xAxis: [
                {
                    type: 'time',
                }
            ],
            yAxis: [
                {
                    name: 'Number of Issues',
                    type: 'value'
                }
            ],
        };
    }
}

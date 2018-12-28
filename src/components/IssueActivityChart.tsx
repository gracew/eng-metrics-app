import * as React from "react";

import ReactEcharts from "echarts-for-react";
import { IIssueData} from '../models/RepoData';

interface IIssueActivityChartProps {
    repo?: string
    items: IIssueData[]
}

export class IssueActivityChart extends React.Component<IIssueActivityChartProps> {

    public render() {
        return (
            <ReactEcharts option={this.getOption()} />
        );
    }

    private getOption = () => {
        return {
            legend: {
                data: ['opened', 'closed']
            },
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
            tooltip: {
                trigger: 'axis'
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

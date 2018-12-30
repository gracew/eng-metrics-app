import * as React from "react";

import ReactEcharts from "echarts-for-react";
import { IIssueData } from '../models/RepoData';
import { green, red } from '../utils';

interface IIssueStatusChartProps {
    items: IIssueData[]
    loading: boolean
}

export class IssueStatusChart extends React.Component<IIssueStatusChartProps> {

    public render() {
        const data = this.props.items.filter(({ details }) => details !== null)
            .map(({ week, opened, details }) => {
                const remainingOpen = opened - details!.length
                const closed = details!.length
                return { week, opened: remainingOpen, closed, details: null };
            })
        return (
            <ReactEcharts showLoading={this.props.loading} option={this.getOption(data)} />
        );
    }

    private getOption = (data: IIssueData[]) => {
        return {
            legend: {},
            series: [
                {
                    areaStyle: { color: red },
                    data: data.map(({ week, closed}) => [week, closed]),
                    itemStyle: { color: red },
                    lineStyle: { color: red },
                    name: 'closed',
                    stack: 'stack',
                    type: 'line',
                },
                {
                    areaStyle: { color: green },
                    data: data.map(({ week, opened }) => [week, opened]),
                    itemStyle: { color: green },
                    lineStyle: { color: green },
                    name: 'open',
                    stack: 'stack',
                    type: 'line',
                },
            ],
            title: {
                text: 'Issue Status'
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

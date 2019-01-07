import { Button, ButtonGroup } from '@blueprintjs/core';
import * as React from "react";

import ReactEcharts from "echarts-for-react";
import { IIssueData } from '../../models/RepoData';
import { green, red } from '../../utils';

interface IIssueStatusChartProps {
    items: IIssueData[]
    loading: boolean
}

export class IssueStatusChart extends React.Component<IIssueStatusChartProps> {

    private chartDesc = "Closed and still open issues, grouped by created week."

    public render() {
        const data = this.props.items.filter(({ details }) => details !== null)
            .map(({ week, opened, details }) => {
                const remainingOpen = opened - details!.length
                const closed = details!.length
                return { week, opened: remainingOpen, closed, details: null };
            })
        return (
            <div className="em-chart-group">
                <ReactEcharts showLoading={this.props.loading} option={this.getOption(data)} />
                <div className="em-chart-details">
                    <ButtonGroup className="em-dummy-button"><Button /></ButtonGroup>
                    <div className="em-chart-desc">{this.chartDesc}</div>
                </div>
            </div>
        );
    }

    private getOption = (data: IIssueData[]) => {
        return {
            legend: { top: "bottom" },
            series: [
                {
                    areaStyle: { color: red },
                    data: data.map(({ week, closed }) => [week, closed]),
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

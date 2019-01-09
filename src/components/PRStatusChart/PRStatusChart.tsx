import { Button, ButtonGroup } from '@blueprintjs/core';
import * as React from "react";

import ReactEcharts from "echarts-for-react";
import { IPRData, PRState } from '../../models/RepoData';
import { chartOptions, green, purple, red } from '../../utils';

interface IPRStatusChartProps {
    items: IPRData[]
    loading: boolean
}

export class PRStatusChart extends React.Component<IPRStatusChartProps> {

    private chartDesc = "Merged, rejected (closed) and still open PRs, grouped by created week."

    public render() {
        const data = this.props.items.filter(({ details }) => details !== null)
            .map(({ week, opened, details }) => {
                const remainingOpen = opened - details!.length
                const rejected = details!.filter(d => d.state === PRState.CLOSED).length
                const merged = details!.filter(d => d.state === PRState.MERGED).length
                return { week, opened: remainingOpen, rejected, merged, details: null };
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

    private getOption = (data: IPRData[]) => {
        return {
            ...chartOptions,
            series: [
                {
                    areaStyle: { color: purple },
                    data: data.map(({ week, merged }) => [week, merged]),
                    itemStyle: { color: purple },
                    lineStyle: { color: purple },
                    name: 'merged',
                    stack: 'stack',
                    type: 'line',
                },
                {
                    areaStyle: { color: red },
                    data: data.map(({ week, rejected }) => [week, rejected]),
                    itemStyle: { color: red },
                    lineStyle: { color: red },
                    name: 'rejected',
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
                text: 'PR Status'
            },
            xAxis: [
                {
                    type: 'time',
                }
            ],
            yAxis: [
                {
                    name: 'Number of PRs',
                    type: 'value'
                }
            ],
        };
    }
}

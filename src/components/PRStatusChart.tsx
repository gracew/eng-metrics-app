import * as React from "react";

import ReactEcharts from "echarts-for-react";
import { IPRData, PRState } from '../models/RepoData';
import { green, purple, red } from '../utils';

interface IPRStatusChartProps {
    items: IPRData[]
    loading: boolean
}

export class PRStatusChart extends React.Component<IPRStatusChartProps> {

    public render() {
        const data = this.props.items.filter(({ details }) => details !== null)
            .map(({ week, opened, details }) => {
                const remainingOpen = opened - details!.length
                const rejected = details!.filter(d => d.state === PRState.CLOSED).length
                const merged = details!.filter(d => d.state === PRState.MERGED).length
                return { week, opened: remainingOpen, rejected, merged, details: null };
            })
        return (
            <ReactEcharts showLoading={this.props.loading} option={this.getOption(data)} />
        );
    }

    private getOption = (data: IPRData[]) => {
        return {
            legend: {},
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
                    name: 'Number of PRs',
                    type: 'value'
                }
            ],
        };
    }
}

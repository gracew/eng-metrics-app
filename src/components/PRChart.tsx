import * as React from "react";

import ReactEcharts from "echarts-for-react";
import { IPRData } from '../models/RepoData';

interface IPRChartProps {
    repo?: string
    items: IPRData[]
}

export class PRChart extends React.Component<IPRChartProps> {

    public render() {
        return (
            <ReactEcharts option={this.getOption()} />
        );
    }

    private getOption = () => {
        return {
            legend: {
                data:['opened', 'merged', 'rejected']
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
                    areaStyle: { color: '#6f42c1' },
                    data: this.props.items.map(({ week, merged}) => [week, merged]),
                    itemStyle: { color: '#6f42c1' },
                    lineStyle: { color: '#6f42c1' },
                    name: 'merged',
                    type: 'line',
                },
                {
                    areaStyle: { color: '#cb2431' },
                    data: this.props.items.map(({ week, rejected}) => [week, rejected]),
                    itemStyle: { color: '#cb2431' },
                    lineStyle: { color: '#cb2431' },
                    name: 'rejected',
                    type: 'line',
                },
            ],
            title: {
                text: 'PR Activity'
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

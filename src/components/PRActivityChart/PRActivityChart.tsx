import { Button, ButtonGroup } from '@blueprintjs/core';
import * as React from "react";

import ReactEcharts from "echarts-for-react";
import { IPRData } from '../../models/RepoData';
import { green, purple, red } from '../../utils';

interface IPRActivityChartProps {
    items: IPRData[]
    loading: boolean
}

export class PRActivityChart extends React.Component<IPRActivityChartProps> {

    private chartDesc = "Opened, merged, and rejected (closed) PRs, grouped by week that the activity occurred."

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
            legend: {},
            series: [
                {
                    areaStyle: { color: green },
                    data: this.props.items.map(({ week, opened }) => [week, opened]),
                    itemStyle: { color: green },
                    lineStyle: { color: green },
                    name: 'opened',
                    type: 'line',
                },
                {
                    areaStyle: { color: purple },
                    data: this.props.items.map(({ week, merged }) => [week, merged]),
                    itemStyle: { color: purple },
                    lineStyle: { color: purple },
                    name: 'merged',
                    type: 'line',
                },
                {
                    areaStyle: { color: red },
                    data: this.props.items.map(({ week, rejected }) => [week, rejected]),
                    itemStyle: { color: red },
                    lineStyle: { color: red },
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

import * as React from "react";

import ReactEcharts from "echarts-for-react";
import percentile from 'percentile';
import { IIssueData, IIssueDetails } from '../models/RepoData';
import { toHours } from '../utils';

interface IIssueResolutionChartProps {
    repo?: string
    items: IIssueData[]
}

interface IWeekAndDetails {
    week: string
    details: IIssueDetails
}

export class IssueResolutionChart extends React.Component<IIssueResolutionChartProps> {

    public render() {
        const items = this.props.items.filter(({ details }) => details !== null);
        const p50 = items.map(({ week, details }) =>
            ({week, details: percentile(50, details!, (item: IIssueDetails) => item.resolutionTime)}))
        const p90 = items.map(({ week, details }) =>
            ({week, details: percentile(90, details!, (item: IIssueDetails) => item.resolutionTime)}))
        return (
            <div>
                <ReactEcharts option={this.getOption(p50, p90)} />
            </div>
        );
    }

    private getOption = (p50: IWeekAndDetails[], p90: IWeekAndDetails[]) => {
        return {
            legend: {
                data: ['p50', 'p90']
            },
            series: [
                {
                    areaStyle: { normal: {} },
                    data: p50.map(({ week, details }) => [week, toHours(details.resolutionTime)]),
                    name: 'p50',
                    type: 'line',
                },
                {
                    areaStyle: { normal: {} },
                    data: p90.map(({ week, details }) => [week, toHours(details.resolutionTime)]),
                    name: 'p90',
                    type: 'line',
                },
            ],
            title: {
                text: 'Issue Resolution Time'
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
                    name: 'Resolution Time (hrs)',
                    type: 'value'
                }
            ],
        };
    }
}

import * as React from "react";

import ReactEcharts from "echarts-for-react";
import percentile from 'percentile';
import { IIssueData, IIssueDetails, IPRData, IPRDetails } from '../models/RepoData';
import { toDays } from '../utils';
import { PercentileLinks } from './PercentileLinks';

type Data = IIssueData | IPRData
type Details = IIssueDetails | IPRDetails

interface IResolutionChartProps {
    title: string
    items: Data[]
    loading: boolean
}

interface IWeekAndDetails {
    week: string
    details: Details
}

export class ResolutionChart extends React.Component<IResolutionChartProps> {

    public render() {
        const items = this.props.items.filter(({ details }) => details !== null);
        const p50 = items.map(({ week, details }) =>
            ({ week, details: percentile(50, details!, (item: Details) => item.resolutionTime) }))
        const p75 = items.map(({ week, details }) =>
            ({ week, details: percentile(75, details!, (item: Details) => item.resolutionTime) }))
        const p90 = items.map(({ week, details }) =>
            ({ week, details: percentile(90, details!, (item: Details) => item.resolutionTime) }))
        const data = { p50, p75, p90 }
        return (
            <div className="em-chart-group">
                <ReactEcharts showLoading={this.props.loading} option={this.getOption(data)} />
                <PercentileLinks
                    data={data}
                    initialPercentile="p50"
                    titleLabel={this.props.title}
                    valueLabel="Resolution Time"
                    titleSelector={this.titleSelector}
                    valueSelector={this.valueSelector}
                    unitLabel="days"
                    unitConverter={toDays}
                />
            </div>
        );
    }


    private titleSelector = (d: Details) => (<a href={d.url}>#{d.number}: ${d.title}</a>)
    private valueSelector = (d: Details) => d.resolutionTime

    private getOption = (data: { [percentile: string]: IWeekAndDetails[] }) => {
        return {
            legend: {},
            series: Object.keys(data).map(p => ({
                data: data[p].map(({ week, details }) => [week, toDays(details.resolutionTime)]),
                name: p,
                type: 'line',
                yAxisIndex: 0
            })),
            title: {
                text: `${this.props.title} Resolution Time`
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
                    name: `Resolution Time (days)`,
                    type: 'value'
                },
            ],
        };
    }
}

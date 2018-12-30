import * as React from "react";

import ReactEcharts from "echarts-for-react";
import percentile from "percentile";
import { ICIData, ICIDetails } from '../models/RepoData';
import { toMinutes } from '../utils';
import { PercentileLinks } from './PercentileLinks';

interface ICIChartProps {
    items: ICIData[]
    loading: boolean
}

interface IWeekAndDetails {
    week: string
    details: ICIDetails
}

export class CIChart extends React.Component<ICIChartProps> {

    public render() {
        const items = this.props.items.filter(({ details }) => details !== null)
        const p50 = items.map(({ week, details }) =>
            ({ week, details: percentile(50, details!, (item: ICIDetails) => item.maxCheckDuration) }))
        const p75 = items.map(({ week, details }) =>
            ({ week, details: percentile(75, details!, (item: ICIDetails) => item.maxCheckDuration) }))
        const p90 = items.map(({ week, details }) =>
            ({ week, details: percentile(90, details!, (item: ICIDetails) => item.maxCheckDuration) }))
        const data = { p50, p75, p90 }
        return (
            <div className="em-chart-group">
                <ReactEcharts showLoading={this.props.loading} option={this.getOption(data)} />
                <PercentileLinks
                    data={data}
                    initialPercentile="p50"
                    titleLabel="PR & Check"
                    valueLabel="CI Time"
                    titleSelector={this.titleSelector}
                    valueSelector={this.valueSelector}
                    unitLabel="min"
                    unitConverter={toMinutes}
                />
            </div>
        );
    }

    private titleSelector = (d: ICIDetails) => (
        <div>
            <a href={d.prUrl}>#{d.pr}</a>: <a href={d.maxCheckUrl}>{d.maxCheckName}</a>
        </div>
    )
    private valueSelector = (d: ICIDetails) => d.maxCheckDuration

    private getOption = (data: { [percentile: string]: IWeekAndDetails[] }) => {
        return {
            legend: {},
            series: Object.keys(data).map(p => ({
                data: data[p].map(({ week, details }) => [week, toMinutes(details.maxCheckDuration)]),
                name: p,
                type: 'line'
            })),
            title: {
                text: 'CI Time'
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
                    name: 'CI Time (minutes)',
                    type: 'value'
                }
            ],
        };
    }
}

import * as React from "react";

import ReactEcharts from "echarts-for-react";
import percentile from "percentile";
import { ICIData, ICIDetails } from '../models/RepoData';
import { toMinutes } from '../utils';
import { PercentileLinks } from './PercentileLinks';

interface ICIChartProps {
    repo: string
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
        const p90 = items.map(({ week, details }) =>
            ({ week, details: percentile(90, details!, (item: ICIDetails) => item.maxCheckDuration) }))
        return (
            <div className="em-chart-group">
                <ReactEcharts showLoading={this.props.loading} option={this.getOption(p50, p90)} />
                <PercentileLinks
                    data={{ p50, p90 }}
                    initialPercentile="p50"
                    titleLabel="PR & Check"
                    valueLabel="CI Time (min)"
                    titleSelector={this.titleSelector}
                    valueSelector={this.valueSelector}
                />
            </div>
        );
    }

    private titleSelector = (d: ICIDetails) => `#${d.pr}: ${d.maxCheckName}`
    private valueSelector = (d: ICIDetails) => d.maxCheckDuration

    private getOption = (p50: IWeekAndDetails[], p90: IWeekAndDetails[]) => {
        return {
            legend: {
                data: ['p50', 'p90']
            },
            series: [
                {
                    areaStyle: { normal: {} },
                    data: p50.map(({ week, details }) => [week, toMinutes(details.maxCheckDuration)]),
                    name: 'p50',
                    type: 'line'
                },
                {
                    areaStyle: { normal: {} },
                    data: p90.map(({ week, details }) => [week, toMinutes(details.maxCheckDuration)]),
                    name: 'p90',
                    type: 'line',
                },
            ],
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

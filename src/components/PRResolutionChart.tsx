import * as React from "react";

import ReactEcharts from "echarts-for-react";
import percentile from 'percentile';
import { IPRData, IPRDetails } from '../models/RepoData';
import { toHours } from '../utils';

interface IPRResolutionChartProps {
    repo?: string
    items: IPRData[]
}

interface IWeekAndDetails {
    week: string
    details: IPRDetails
}

export class PRResolutionChart extends React.Component<IPRResolutionChartProps> {

    public render() {
        const items = this.props.items.filter(({ details }) => details !== null)
        const resolutionP50 = items.map(({ week, details }) =>
            ({ week, details: percentile(50, details!, (item: IPRDetails) => item.resolutionTime) }))
        const resolutionP90 = items.map(({ week, details }) =>
            ({ week, details: percentile(90, details!, (item: IPRDetails) => item.resolutionTime) }))
        const reviewsP50 = items.map(({ week, details }) =>
            ({ week, details: percentile(50, details!, (item: IPRDetails) => item.reviews) }))
        const reviewsP90 = items.map(({ week, details }) =>
            ({ week, details: percentile(90, details!, (item: IPRDetails) => item.reviews) }))

        return (
            <div>
                <ReactEcharts option={this.getReviewOption(resolutionP50, resolutionP90, reviewsP50, reviewsP90)} />
            </div>
        );
    }

    private getReviewOption = (
        resolutionP50: IWeekAndDetails[],
        resolutionP90: IWeekAndDetails[],
        reviewsP50: IWeekAndDetails[],
        reviewsP90: IWeekAndDetails[],
    ) => {
        return {
            legend: {
                data: ['resolutionP50', 'resolutionP90', 'reviewsP50', 'reviewsP90']
            },
            series: [
                {
                    data: resolutionP50.map(({ week, details }) => [week, toHours(details.resolutionTime)]),
                    name: 'resolutionP50',
                    type: 'line',
                    yAxisIndex: 0,
                },
                {
                    data: resolutionP90.map(({ week, details }) => [week, toHours(details.resolutionTime)]),
                    name: 'resolutionP90',
                    type: 'line',
                    yAxisIndex: 0,
                },
                {
                    data: reviewsP50.map(({ week, details }) => [week, details.reviews]),
                    name: 'reviewsP50',
                    type: 'line',
                    yAxisIndex: 1,
                },
                {
                    data: reviewsP90.map(({ week, details }) => [week, details.reviews]),
                    name: 'reviewsP90',
                    type: 'line',
                    yAxisIndex: 1,
                },
            ],
            title: {
                text: 'PR Reviews'
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
                    name: 'Time to Resolution (hrs)',
                    type: 'value'
                },
                {
                    name: 'Number of Reviews',
                    type: 'value'
                },
            ],
        };
    }
}

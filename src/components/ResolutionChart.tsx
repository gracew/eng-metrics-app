import { HTMLSelect, HTMLTable } from '@blueprintjs/core';
import * as React from "react";

import ReactEcharts from "echarts-for-react";
import percentile from 'percentile';
import { ICIData, ICIDetails, IIssueData, IIssueDetails, IPRData, IPRDetails } from '../models/RepoData';
import './ResolutionChart.css'

type Data = ICIData | IIssueData | IPRData
type Details = ICIDetails | IIssueDetails | IPRDetails

interface IResolutionChartProps {
    chartTitle: string
    items: Data[]
    loading: boolean
    linkSelector: (d: Details) => React.ReactNode
    linkLabel: string
    valueSelector: (d: Details) => number
    valueLabel: string
    unitConverter: (n: number) => string
    unitLabel: string
}

interface IWeekAndDetails {
    week: string
    details: Details
}

interface IResolutionChartState {
    selectedPercentile: string
}

export class ResolutionChart extends React.Component<IResolutionChartProps, IResolutionChartState> {

    constructor(props: IResolutionChartProps) {
        super(props);
        this.state = { selectedPercentile: "p50" }
    }

    public render() {
        const items = this.props.items.filter(({ details }) => details !== null);
        const p50 = items.map(({ week, details }) =>
            ({ week, details: percentile(50, details!, this.props.valueSelector) }))
        const p75 = items.map(({ week, details }) =>
            ({ week, details: percentile(75, details!, this.props.valueSelector) }))
        const p90 = items.map(({ week, details }) =>
            ({ week, details: percentile(90, details!, this.props.valueSelector) }))
        const data: {[p: string]: IWeekAndDetails[]} = { p50, p75, p90 }
        return (
            <div className="em-chart-group">
                <ReactEcharts showLoading={this.props.loading} option={this.getOption(data)} />
                <div className="em-chart-details">
                    <div className="em-percentile-links">
                        View details for:
                        <HTMLSelect onChange={this.handleChange}>
                            {Object.keys(data).map(p => (<option key={p} value={p}>{p}</option>))}
                        </HTMLSelect>
                        <HTMLTable condensed={true}>
                            <thead>
                                <tr>
                                    <th>Week</th>
                                    <th>{this.props.linkLabel}</th>
                                    <th>{this.props.valueLabel} ({this.props.unitLabel})</th>
                                </tr>
                            </thead>
                            <tbody className={this.props.loading ? "loading" : undefined}>
                                {data[this.state.selectedPercentile].map(({ week, details }) => (
                                    <tr key={week}>
                                        <td>{this.stripYear(week)}</td>
                                        <td>{this.props.linkSelector(details)}</td>
                                        <td>{this.props.unitConverter(this.props.valueSelector(details))}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </HTMLTable>
                    </div>
                </div>
            </div>
        );
    }

    private stripYear = (date: string) => {
        return date.match(/\d{4}-\d{2}-\d{2}/) ? date.substr(5) : date;
    }

    private handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => this.setState({ selectedPercentile: event.target.value })


    private getOption = (data: { [percentile: string]: IWeekAndDetails[] }) => {
        return {
            legend: {},
            series: Object.keys(data).map(p => ({
                data: data[p].map(({ week, details }) => [week, this.props.unitConverter(this.props.valueSelector(details))]),
                name: p,
                type: 'line',
            })),
            title: {
                text: this.props.chartTitle
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
                    name: `${this.props.valueLabel} (${this.props.unitLabel})`,
                    type: 'value'
                },
            ],
        };
    }
}

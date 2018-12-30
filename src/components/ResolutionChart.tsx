import { Button, ButtonGroup, HTMLTable } from '@blueprintjs/core';
import * as React from "react";

import ReactEcharts from "echarts-for-react";
import percentile from 'percentile';
import { ICIData, ICIDetails, IIssueData, IIssueDetails, IPRData, IPRDetails } from '../models/RepoData';
import './ResolutionChart.css'

type Data = ICIData | IIssueData | IPRData
type Details = ICIDetails | IIssueDetails | IPRDetails

interface IResolutionChartProps {
    chartTitle: string
    chartDesc: string
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

enum Display {
    description = "description",
    p50 = "p50",
    p75 = "p75",
    p90 = "p90"
}

interface IResolutionChartState {
    display: Display
}

export class ResolutionChart extends React.Component<IResolutionChartProps, IResolutionChartState> {

    constructor(props: IResolutionChartProps) {
        super(props);
        this.state = { display: Display.description }
    }

    public render() {
        const items = this.props.items.filter(({ details }) => details !== null);
        const p50 = items.map(({ week, details }) =>
            ({ week, details: percentile(50, details!, this.props.valueSelector) }))
        const p75 = items.map(({ week, details }) =>
            ({ week, details: percentile(75, details!, this.props.valueSelector) }))
        const p90 = items.map(({ week, details }) =>
            ({ week, details: percentile(90, details!, this.props.valueSelector) }))
        const data: { [p: string]: IWeekAndDetails[] } = { p50, p75, p90 }
        return (
            <div className="em-chart-group">
                <ReactEcharts showLoading={this.props.loading} option={this.getOption(data)} />
                <div className="em-chart-details">
                    <ButtonGroup className="em-display-selector">
                        <Button
                            text="Description"
                            active={this.state.display === Display.description}
                            onClick={this.handleDescSelection}
                        />
                        <Button
                            text="p50 Details"
                            active={this.state.display === Display.p50}
                            onClick={this.handleP50Selection}
                        />
                        <Button
                            text="p75 Details"
                            active={this.state.display === Display.p75}
                            onClick={this.handleP75Selection}
                        />
                        <Button
                            text="p90 Details"
                            active={this.state.display === Display.p90}
                            onClick={this.handleP90Selection}
                        />
                    </ButtonGroup>
                    {this.state.display === Display.description &&
                        <div className="em-chart-desc">{this.props.chartDesc}</div>
                    }
                    {this.state.display !== Display.description &&
                        <div className="em-percentile-links">
                            <HTMLTable condensed={true}>
                                <thead>
                                    <tr>
                                        <th>Week</th>
                                        <th>{this.props.linkLabel}</th>
                                        <th>{this.props.valueLabel} ({this.props.unitLabel})</th>
                                    </tr>
                                </thead>
                                <tbody className={this.props.loading ? "loading" : undefined}>
                                    {data[Display[this.state.display]].map(({ week, details }) => (
                                        <tr key={week}>
                                            <td>{this.stripYear(week)}</td>
                                            <td>{this.props.linkSelector(details)}</td>
                                            <td>{this.props.unitConverter(this.props.valueSelector(details))}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </HTMLTable>
                        </div>
                    }
                </div>
            </div>
        );
    }

    private stripYear = (date: string) => {
        return date.match(/\d{4}-\d{2}-\d{2}/) ? date.substr(5) : date;
    }

    private handleDescSelection = (_: React.MouseEvent<HTMLElement>) => this.setState({ display: Display.description })
    private handleP50Selection = (_: React.MouseEvent<HTMLElement>) => this.setState({ display: Display.p50 })
    private handleP75Selection = (_: React.MouseEvent<HTMLElement>) => this.setState({ display: Display.p75 })
    private handleP90Selection = (_: React.MouseEvent<HTMLElement>) => this.setState({ display: Display.p90 })

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

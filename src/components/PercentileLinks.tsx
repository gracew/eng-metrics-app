import { HTMLSelect, HTMLTable } from '@blueprintjs/core';
import * as React from "react";
import { ICIDetails, IIssueDetails, IPRDetails } from '../models/RepoData';

type Details = ICIDetails | IIssueDetails | IPRDetails

interface IWeekAndDetails {
    week: string
    details: Details
}

interface IPercentileLinksProps {
    data: { [percentile: string]: IWeekAndDetails[] }
    initialPercentile: string
    titleLabel: string
    valueLabel: string
    titleSelector: (d: Details) => React.ReactNode
    valueSelector: (d: Details) => number
    unitLabel: string
    unitConverter: (n: number) => string
}

interface IPercentileLinksState {
    selectedPercentile: string
}

export class PercentileLinks extends React.Component<IPercentileLinksProps, IPercentileLinksState> {

    constructor(props: IPercentileLinksProps) {
        super(props);
        this.state = { selectedPercentile: this.props.initialPercentile }
    }

    public render() {
        return (
            <div className="em-percentile-links">
                <HTMLSelect onChange={this.handleChange}>
                    {Object.keys(this.props.data).map(p => (<option key={p} value={p}>{p}</option>))}
                </HTMLSelect>
                <HTMLTable condensed={true}>
                    <thead>
                        <tr>
                            <th>Week</th>
                            <th>{this.props.titleLabel}</th>
                            <th>{this.props.valueLabel} ({this.props.unitLabel})</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.data[this.state.selectedPercentile].map(({ week, details }) => (
                            <tr key={week}>
                                <td>{this.stripYear(week)}</td>
                                <td>{this.props.titleSelector(details)}</td>
                                <td>{this.props.unitConverter(this.props.valueSelector(details))}</td>
                            </tr>
                        ))}
                    </tbody>
                </HTMLTable>
            </div>
        );
    }

    private stripYear = (date: string) => {
        return date.match(/\d{4}-\d{2}-\d{2}/) ? date.substr(5) : date;
    }

    private handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => this.setState({ selectedPercentile: event.target.value })

}
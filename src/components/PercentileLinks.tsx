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
    titleSelector: (d: Details) => string
    valueSelector: (d: Details) => number
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
            <div>
                <select onChange={this.handleChange}>
                    {Object.keys(this.props.data).map(p => (<option value={p}>{p}</option>))}
                </select>
                <table>
                    {this.props.data[this.state.selectedPercentile].map(({ week, details }) => (
                        <tr>
                            <td>{week}</td>
                            <td><a href={details.url}>{this.props.titleSelector(details)}</a></td>
                            <td>{this.props.valueSelector(details)}</td>
                        </tr>
                    ))}
                </table>
            </div>
        );
    }

    private handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => this.setState({ selectedPercentile: event.target.value })

}
import * as React from "react";

import ReactEcharts from "echarts-for-react";
import { connect } from 'react-redux'
import { fetchItems } from './actions';

export class CIChart extends React.Component {

    /*constructor() {
        super({})
        this.state = {
            "items": []
        }
    }*/

    public componentDidMount() {
        /*fetch('http://localhost:8080/PrimerAI/disco/score?weeks=6', { mode: "cors" })
            .then(res => res.json())
            .then(({ ci }) => ci.map(({ week, buildTime50 }: { week: string, buildTime50: number }) => [week, buildTime50]))
            .then(items => this.setState({ items }))*/
        // tslint:disable:all
        console.log(this.props['fetchData'])
        // tslint:disable:no-string-literal
        this.props['fetchData']()
    }
    public render() {
        return (
            <ReactEcharts option={this.getOption()} />
        );
    }

    private getOption = () => {
        return {
            series: [
                {
                    areaStyle: { normal: {} },
                    // tslint:disable:no-string-literal
                    data: this.props['items'],
                    name: 'build time',
                    type: 'line',
                },
            ],
            title: {
                left: 'center',
                text: 'Median CI Time'
            },
            xAxis: [
                {
                    type: 'time',
                }
            ],
            yAxis: [
                {
                    name: 'CI Time (seconds)',
                    type: 'value'
                }
            ],
        };
    }
}

const mapStateToProps = (state: any) => {
    return {
        items: state.items,
        repo: state.repo,
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        fetchData: () => dispatch(fetchItems())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CIChart)
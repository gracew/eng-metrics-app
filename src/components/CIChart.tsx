import * as React from "react";
import * as Redux from "redux";

import ReactEcharts from "echarts-for-react";
import { connect } from 'react-redux'
import { ICIData } from '../models/ci';
import { fetchRepoData } from '../redux/actions';

interface ICIChartState {
    items: ICIData[]
    repo: string
}

interface ICIChartProps {
    items: ICIData[]
    repo: string
}

class CIChart extends React.Component<ICIChartProps> {

    public componentDidMount() {
        // use string literal instead of adding adding fetchRepoData to props and calling this.props.fetchRepoData
        // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/16990
        // tslint:disable:no-string-literal
        this.props['fetchRepoData']()
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
                    data: this.props.items.map(({ week, buildTime50 }) => [week, buildTime50]),
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

const mapStateToProps = (state: ICIChartState) => {
    return {
        items: state.items,
        repo: state.repo,
    }
}

const mapDispatchToProps = (dispatch: Redux.Dispatch<any>, props: ICIChartProps) => {
    return {
        fetchRepoData: () => dispatch(fetchRepoData(props.repo))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CIChart)
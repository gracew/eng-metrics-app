import * as React from "react";

import ReactEcharts from "echarts-for-react";
import { ICIData } from '../models/RepoData';

interface ICIChartProps {
    repo?: string
    items: ICIData[]
}

export class CIChart extends React.Component<ICIChartProps> {

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
                    data: this.props.items.map(({ week, buildTime50 }) => [week, buildTime50 / 60]),
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
                    name: 'CI Time (minutes)',
                    type: 'value'
                }
            ],
        };
    }
}

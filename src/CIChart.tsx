import * as React from "react";

import ReactEcharts from "echarts-for-react";

export class CIChart extends React.Component {

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
                    data: [
                        ["2018-11-12", 1050],
                        ["2018-11-19", 1204],
                        ["2018-11-26", 840],
                        ["2018-12-03", 159],
                        ["2018-12-10", 166],
                        ["2018-12-17", 172],
                    ],
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
                    data: ['2018-11-12', '2018-11-19', '2018-11-26', '2018-12-03', '2018-12-10', '2018-12-17'],
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

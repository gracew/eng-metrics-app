import * as React from "react";

import ReactEcharts from "echarts-for-react";

interface ICIData {
    week: string
    buildTime50: number
}

interface ICIChartState {
    items: ICIData[]
}

export class CIChart extends React.Component<{}, ICIChartState> {

    constructor(props: {}) {
        super(props);
        this.state = { items: [] }
    }

    public componentDidMount() {
        fetch(`http://localhost:8080/Microsoft/typescript/score?weeks=6`, { mode: "cors" })
            .then(res => res.json())
            .then(({ ci }) => this.setState({ items: ci }))
        // TODO(gracew): handle failure case...
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
                    data: this.state.items.map(({ week, buildTime50 }) => [week, buildTime50 / 60]),
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

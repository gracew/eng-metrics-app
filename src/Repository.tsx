import * as React from 'react';

import { Index, TimeSeries } from "pondjs";
import {
    BarChart,
    ChartContainer,
    ChartRow,
    Charts,
    YAxis,
} from "react-timeseries-charts";

export class Repository extends React.Component {

    public render() {
        const data = [
                ["2018-12-03 16:43:48.95787642", 159],
                ["2018-12-10 16:43:48.95787642", 166],
                ["2018-12-17 16:43:48.95787642", 172],
            ]
        const series = new TimeSeries({
            columns: ["index", "value"],
            name: "myseries",
            points: data.map(([d, value]) => [
                Index.getIndexString("7d", new Date(d)),
                value
            ])
          })
        return (
            <ChartContainer timeRange={series.range()}>
                <ChartRow height="200">
                    <YAxis id="axis1" label="Build time (seconds)" min={0} max={series.max("value")*1.2} type="linear" />
                    <Charts>
                        <BarChart axis="axis1" series={series} column={["value"]} />
                    </Charts>
                </ChartRow>
            </ChartContainer>
        );
    }
}

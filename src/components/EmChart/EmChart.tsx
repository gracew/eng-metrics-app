import * as React from "react";

import ReactEcharts, { ReactEchartsPropsTypes } from "echarts-for-react";

export class EmChart extends React.Component<ReactEchartsPropsTypes> {

    private echartsReact: any;

    constructor(props: ReactEchartsPropsTypes) {
        super(props);
        this.echartsReact = React.createRef()
    }

    public componentDidMount() {
        const echarts = this.echartsReact.current.getEchartsInstance()
        // from https://stackoverflow.com/questions/44941586/brush-by-default-active-on-scatter-chart
        echarts._componentsViews[Object.keys(echarts._componentsViews)[0]]._features.dataZoom.model.iconPaths.zoom.trigger('click');
    }

    public render() {
        const option = {
            dataZoom: [{
                filterMode: "none",
                type: "inside",
                zoomOnMouseWheel: false
            }],
            legend: { top: "bottom" },
            toolbox: {
                feature: {
                    dataZoom: {
                        title: {
                            back: 'reset',
                            zoom: 'select',
                        },
                        yAxisIndex: false
                    }
                },
                right: 50
            },
            tooltip: { trigger: "axis" },
            ...this.props.option
        }

        return (
            <ReactEcharts ref={this.echartsReact} {...this.props} option={option} />
        );
    }

}

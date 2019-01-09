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
                        icon: {
                            // dummy image to effectively hide the icon
                            // https://stackoverflow.com/questions/6018611/smallest-data-uri-image-possible-for-a-transparent-image
                            back: 'image://data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP'
                        },
                        title: {
                            zoom: 'select',
                        },
                        yAxisIndex: false
                    },
                    restore: {
                        title: 'reset'
                    }
                },
                right: '5%'
            },
            tooltip: { trigger: "axis" },
            ...this.props.option
        }

        return (
            <ReactEcharts ref={this.echartsReact} {...this.props} option={option} />
        );
    }

}

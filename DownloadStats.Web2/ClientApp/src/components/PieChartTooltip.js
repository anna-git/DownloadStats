import * as React from "react";
import * as Plotly from "plotly.js";
export default class PieChartTooltip extends React.Component {
    constructor(props) {
        super(props);
        this.stats = this.props.Stats;
    }
    componentDidUpdate() {
    }
    componentDidMount() {
        if (this.stats == null)
            return;
        var data = [{
                values: [16, 15, 12, 6, 5, 4, 42],
                labels: ['Morning', 'Afternoon', 'Evening'],
                domain: { column: 0 },
                name: `Downloads Stats total${this.stats.Total}`,
                hoverinfo: 'label+percent+name',
                hole: .4,
                type: 'pie'
            }];
        var layout = {
            title: {
                text: `Stats for ${this.stats.Country}`
            },
            annotations: [
                {
                    font: {
                        size: 20
                    },
                    showarrow: false,
                    text: `total${this.stats.Total}`,
                    x: 0.17,
                    y: 0.5
                }
            ],
            height: 400,
            width: 600,
            showlegend: false
        };
        Plotly.newPlot(`#${this.props}`, data, layout);
    }
    render() {
        return (React.createElement("div", { id: this.props.Stats.CountryCode, className: "tooltip" }));
    }
}
//# sourceMappingURL=PieChartTooltip.js.map
var scenario2Data = [];
var scenario2ChartHolder = d3.select("#scenario2Graph");

function set_scenario2graph(data) {
    var arr = new Array();
    for (var i = 0; i < 5; i++) {
        arr[i] = new Array();
        for (var j = 0; j < 4; j++) {
            arr[i][j] = 0;
        }
    }

    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 4; j++) {
            arr[i][j] = Number(data[i * 4 + j]);
            if(arr[i][j] < 0) arr[i][j] = 0
        }
    }
    scenario2Data = [
        {
            key: "4",
            values: [
                { key: "R4_2XLARGE", value: arr[0][0] },
                { key: "M4_4XLARGE", value: arr[1][0] },
                { key: "C4_8XLARGE", value: arr[2][0] },
                { key: "I3_2XLARGE", value: arr[3][0] },
                { key: "D2_2XLARGE", value: arr[4][0] }
            ]
        },
        {
            key: "9",
            values: [
                { key: "R4_2XLARGE", value: arr[0][1] },
                { key: "M4_4XLARGE", value: arr[1][1] },
                { key: "C4_8XLARGE", value: arr[2][1] },
                { key: "I3_2XLARGE", value: arr[3][1] },
                { key: "D2_2XLARGE", value: arr[4][1] }
            ]
        },
        {
            key: "16",
            values: [
                { key: "R4_2XLARGE", value: arr[0][2] },
                { key: "M4_4XLARGE", value: arr[1][2] },
                { key: "C4_8XLARGE", value: arr[2][2] },
                { key: "I3_2XLARGE", value: arr[3][2] },
                { key: "D2_2XLARGE", value: arr[4][2] }
            ]
        },
        {
            key: "25",
            values: [
                { key: "R4_2XLARGE", value: arr[0][3] },
                { key: "M4_4XLARGE", value: arr[1][3] },
                { key: "C4_8XLARGE", value: arr[2][3] },
                { key: "I3_2XLARGE", value: arr[3][3] },
                { key: "D2_2XLARGE", value: arr[4][3] }
            ]
        }
    ];
    scenario2ChartHolder
        .datum(scenario2Data)
        .call(scenario2Chart);
}
var scenario2Chart = d3.x3d.chart.barChartMultiSeries();

scenario2ChartHolder
    .datum(scenario2Data)
    .call(scenario2Chart);

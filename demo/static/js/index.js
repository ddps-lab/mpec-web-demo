function addJavascript(jsname) {
	var th = document.getElementsByTagName('head')[0];
	var s = document.createElement('script');
	s.setAttribute('type','text/javascript');
	s.setAttribute('src',jsname);
	th.appendChild(s);
}
addJavascript('../static/js/graph/timegraph.js');
addJavascript('../static/js/graph/costgraph.js');
addJavascript('../static/js/graph/scenario1graph.js');
addJavascript('../static/js/graph/scenario2graph.js');
addJavascript('../static/js/graph/scenario3graph.js');

function get_time(pred_1, pred_2, pred_3) {
    var time = new Array();
    for (var i = 0; i < 20; i++)
        time[i] = Number(pred_1[i]) + Number(pred_2[i]) + Number(pred_3[i]);
    return time;
};

function get_cost(time) {
    var price = [0.014777778, 0.02222222, 0.044194444, 0.01733333, 0.0383333333]; // 100 times
    var numMachines = [5, 10, 17, 26]; // num_worker_nodes + 1
    var cost = new Array();
    for (var i = 0; i < 5; i++)
        for (var j = 0; j < 4; j++) {
            if (Number(time[4 * i + j]) > 0 )
                cost[4 * i + j] = parseInt(time[4 * i + j] * price[i] * numMachines[j]);
            else
                cost[4 * i + j] = -1;
        }
    return cost;
};

function set_table(table_id, data, symbol) {
    var minVal = [86400, 86400, 86400, 86400];
    var maxVal = [0, 0, 0, 0];

    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 4; j++) {
            if (Number(data[i * 4 + j]) < minVal[j] && Number(data[i * 4 + j]) > 0)
                minVal[j] = Number(data[i * 4 + j]);
            if (Number(data[i * 4 + j]) > maxVal[j] && Number(data[i * 4 + j]) > 0)
                maxVal[j] = Number(data[i * 4 + j]);
        }
    }

    var table = document.getElementById(table_id);
    var numRows = table.rows.length;
    var idx = 0;
    for (var i = 2; i < numRows; i++) {
        var row = table.rows[i];
        var numCols = row.cells.length;
        for (var j = 1; j < numCols; j++) {
            if (Number(data[idx]) == minVal[j - 1])
                row.cells[j].style.backgroundColor = '#E0F2F7';
            else if (Number(data[idx]) == maxVal[j - 1])
                row.cells[j].style.backgroundColor = '#F8E0E0';
            else
                row.cells[j].style.backgroundColor = '';

            if (Number(data[idx]) < 0 || String(data[idx]).indexOf('-') >= 0 || isNaN(data[idx])) {
                row.cells[j].textContent = 'NA';
                row.cells[j].style.color = 'red';
            }
            else
                row.cells[j].textContent = data[idx] + symbol;
            idx++;
            //row.cells[j].textContent = data[idx++] + symbol;
        }
    }
};

$(document).ready(function(){
    $('#Progress_Loading').hide();
 })

$("#submitBtn").on('click', function () {
    $('#Progress_Loading').show();
    var startTime = performance.now();

    params = {
        'lr': document.getElementById("lr").value,
        'lc': document.getElementById("lc").value,
        'rc': document.getElementById("rc").value
    };
    port = ':80';
    url = 'http://ec2-54-165-62-210.compute-1.amazonaws.com' + port + '/mpec/predict/';

    $.get(url, params).done(function (data) {
        $('#Progress_Loading').hide();
        var endTime = performance.now();
        console.log('exec time: ' + (endTime - startTime) * 0.001 + 's');
        console.log(data)
        if (data['status'])
            console.log('fail')
        else {
            console.log('success');

            var time = get_time(data['pred_1'], data['pred_2'], data['pred_3']);
            var cost = get_cost(time);

            set_table('timeTab', time, ' s');
            set_table('costTab', cost, ' USD');
            set_table('scenario_1', data['pred_1'], ' s');
            set_table('scenario_2', data['pred_2'], ' s');
            set_table('scenario_3', data['pred_3'], ' s');
            set_timegraph(time);
            set_costgraph(cost);
            set_scenario1graph(data['pred_1']);
            set_scenario2graph(data['pred_2']);
            set_scenario3graph(data['pred_3']);
        }
    });
});

$(function() {
    /**
     * Init Data from Local Storage
     */
    var temperatureData = localStorage.getItem("temperatureData") == null ? [] : JSON.parse(localStorage.getItem('temperatureData'));
    var controlTemperatureData = localStorage.getItem("controlTemperatureData") == null ? [] : JSON.parse(localStorage.getItem('controlTemperatureData'));
    var pidKpData = localStorage.getItem("pidKpData") == null ? [] : JSON.parse(localStorage.getItem('pidKpData'));
    var pidKiData = localStorage.getItem("pidKiData") == null ? [] : JSON.parse(localStorage.getItem('pidKiData'));
    var pidKdData = localStorage.getItem("pidKdData") == null ? [] : JSON.parse(localStorage.getItem('pidKdData'));
    var outputData = localStorage.getItem("outputData") == null ? [] : JSON.parse(localStorage.getItem('outputData'));

    removeOldEntries(60);

    /**
     * Init Chart
     */
    var ctx = document.getElementById('chart').getContext('2d');
    var data = {
        "datasets": [{
                "label": "Ist Temperatur",
                "backgroundColor": "rgba(81, 196, 197,0.3)",
                "borderColor": "rgb(81, 196, 197)",
                "fill": false,
                "data": temperatureData,
                yAxisID: 'tempAxis',
            },
            {
                "label": "Soll Temperatur",
                "backgroundColor": "rgba(0,0,0,0.3)",
                "borderColor": "#000",
                "fill": false,
                "data": controlTemperatureData,
                yAxisID: 'tempAxis',
            },
            {
                "label": "P",
                "backgroundColor": "rgba(23,55,83,0.3)",
                "borderColor": "rgba(23,55,83,0.3)",
                "fill": false,
                "data": pidKpData,
                steppedLine: true,
                yAxisID: 'pidAxis',
                hidden: true,
            },
            {
                "label": "I",
                "backgroundColor": "rgba(40,146,215,0.3)",
                "borderColor": "rgba(40,146,215,0.3)",
                "fill": false,
                "data": pidKiData,
                steppedLine: true,
                yAxisID: 'pidAxis',
                hidden: true,
            },
            {
                "label": "D",
                "backgroundColor": "rgba(109,174,219,0.5)",
                "borderColor": "rgba(109,174,219,0.5)",
                "fill": false,
                "data": pidKdData,
                steppedLine: true,
                yAxisID: 'pidAxis',
                hidden: true,
            },
            {
                "label": "output",
                "backgroundColor": "rgba(255,0,0,0.5)",
                "borderColor": "rgba(255,0,0,0.5)",
                "fill": false,
                "data": outputData,
                yAxisID: 'outputAxis',
                hidden: true,
            },
        ]
    };
    var options = {
        "scales": {
            yAxes: [{
                    id: 'tempAxis',
                    position: 'left',
                    ticks: {
                        "beginAtZero": true,
                        suggestedMax: 100
                    }
                },
                {
                    id: 'pidAxis',
                    position: 'right',
                    ticks: {
                        beginAtZero: true
                    }
                },
                {
                    id: 'outputAxis',
                    position: 'right',
                    ticks: {
                        beginAtZero: true,
                        suggestedMax: 900
                    }
                }
            ],
            xAxes: [{
                type: 'time',
                time: {
                    unit: 'month'
                }
            }]
        }
    };
    var myChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });

    var socket = new WebSocket("ws://192.168.0.17:81");
    socket.onmessage = function(event) {
        try {
            var msg = JSON.parse(event.data);
            if (msg.cmd == "post") {
                if (msg.id == "chartData") {
                    console.log(msg.data);
                    updateChartAndData(msg.data);
                    removeOldEntries(60 * 5); // 30 minutes
                    myChart.update();
                }
            }
        } catch (e) {
            console.log(e);
            //console.log(event.data);
        }
    }

    setInterval(function() {
        var msg = {
            "cmd": "get",
            "id": "chartData"
        }
        socket.send(JSON.stringify(msg));
    }, 3000);

    function updateChartAndData(data) {
        var date = new Date();
        var temperature = {
            x: date,
            y: data.temperature
        };
        var controlTemperature = {
            x: date,
            y: data.controlTemperature
        };
        var pidKp = {
            x: date,
            y: data.p
        };
        var pidKi = {
            x: date,
            y: data.i
        };
        var pidKd = {
            x: date,
            y: data.d
        };
        var output = {
            x: date,
            y: data.output
        };

        myChart.data["datasets"][0].data.push(temperature);
        myChart.data["datasets"][1].data.push(controlTemperature);

        myChart.data["datasets"][2].data.push(pidKp);
        myChart.data["datasets"][3].data.push(pidKi);
        myChart.data["datasets"][4].data.push(pidKd);

        myChart.data["datasets"][5].data.push(output);

        localStorage.setItem("temperatureData", JSON.stringify(temperatureData));
        localStorage.setItem("controlTemperatureData", JSON.stringify(controlTemperatureData));
        localStorage.setItem("pidKpData", JSON.stringify(pidKpData));
        localStorage.setItem("pidKiData", JSON.stringify(pidKiData));
        localStorage.setItem("pidKdData", JSON.stringify(pidKdData));
        localStorage.setItem("outputData", JSON.stringify(outputData));
    }

    /**
     * Returns random int number for dummy data.
     * @param {int} max 
     */
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    /**
     * Removes entries which are older than x seconds.
     * @param {int} seconds
     */
    function removeOldEntries(seconds) {
        var now = (new Date()).getTime();
        while (temperatureData.length > 0) {
            var time = Date.parse(temperatureData[0].x);
            if ((now - time) > seconds * 1000) {
                temperatureData.shift();
                controlTemperatureData.shift();
                pidKpData.shift();
                pidKiData.shift();
                pidKdData.shift();
                outputData.shift();
            } else
                break;
        }
    }
});
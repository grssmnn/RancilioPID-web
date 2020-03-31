$(function() {
    /**
     * Init Data from Local Storage
     */
    var temperatureData = localStorage.getItem("temperatureData") == null ? [] : JSON.parse(localStorage.getItem('temperatureData'));
    var controlTemperatureData = localStorage.getItem("controlTemperatureData") == null ? [] : JSON.parse(localStorage.getItem('controlTemperatureData'));
    var pidKpData = localStorage.getItem("pidKpData") == null ? [] : JSON.parse(localStorage.getItem('pidKpData'));
    var pidKiData = localStorage.getItem("pidKiData") == null ? [] : JSON.parse(localStorage.getItem('pidKiData'));
    var pidKdData = localStorage.getItem("pidKdData") == null ? [] : JSON.parse(localStorage.getItem('pidKdData'));

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
        ]
    };
    var options = {
        "scales": {
            yAxes: [{
                    id: 'tempAxis',
                    position: 'left',
                    ticks: {
                        "beginAtZero": true
                    }
                },
                {
                    id: 'pidAxis',
                    position: 'right',
                    ticks: {
                        beginAtZero: true
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



    /**
     * Add randomly dummy data
     */
    var last = 100;
    setInterval(function() {
        var date = new Date();
        var a = {
            x: date,
            y: last * (getRandomInt(10) + 96) / 100
        };
        var b = {
            x: date,
            y: 100
        };
        var p = {
            x: date,
            y: getRandomInt(10) + 10
        }
        var i = {
            x: date,
            y: getRandomInt(10) + 10
        }
        var d = {
            x: date,
            y: getRandomInt(10) + 10
        }

        myChart.data["datasets"][0].data.push(a);
        myChart.data["datasets"][1].data.push(b);

        myChart.data["datasets"][2].data.push(p);
        myChart.data["datasets"][3].data.push(i);
        myChart.data["datasets"][4].data.push(d);


        localStorage.setItem("temperatureData", JSON.stringify(temperatureData));
        localStorage.setItem("controlTemperatureData", JSON.stringify(controlTemperatureData));
        localStorage.setItem("pidKpData", JSON.stringify(pidKpData));
        localStorage.setItem("pidKiData", JSON.stringify(pidKiData));
        localStorage.setItem("pidKdData", JSON.stringify(pidKdData));

        removeOldEntries(60);

        myChart.update();
    }, 3000);

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
            } else
                break;
        }
    }
});
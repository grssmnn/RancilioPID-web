$(function() {
    var temperatureData = localStorage.getItem("temperatureData") == null ? [] : JSON.parse(localStorage.getItem('temperatureData'));
    var controlTemperatureData = localStorage.getItem("controlTemperatureData") == null ? [] : JSON.parse(localStorage.getItem('controlTemperatureData'));


    console.log(temperatureData);

    var now = (new Date()).getTime();
    while (temperatureData.length > 0) {
        var time = Date.parse(temperatureData[0].x);
        if ((now - time) > 60 * 1000) {
            temperatureData.shift();
            controlTemperatureData.shift();
        } else
            break;
    }

    var ctx = document.getElementById('chart').getContext('2d');
    var data = {
        "datasets": [{
                "label": "Ist Temperatur",
                "backgroundColor": "rgba(81, 196, 197,0.3)",
                "borderColor": "rgb(81, 196, 197)",
                "fill": false,
                "data": temperatureData
            },
            {
                "label": "Soll Temperatur",
                "backgroundColor": "rgba(0,0,0,0.3)",
                "borderColor": "#000",
                "fill": false,
                "data": controlTemperatureData
            }
        ]
    };
    var options = {
        "scales": {
            yAxes: [{
                "ticks": {
                    "beginAtZero": true
                }
            }],
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

        myChart.data["datasets"][0].data.push(a);
        myChart.data["datasets"][1].data.push(b);

        localStorage.setItem("temperatureData", JSON.stringify(temperatureData));
        localStorage.setItem("controlTemperatureData", JSON.stringify(controlTemperatureData));
        console.log(myChart.data["datasets"][1].data);
        myChart.update();
        //addData(myChart, a, b);
    }, 3000);

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }



    function addData(chart, a, b) {
        temperatureData.push(a);
        controlTemperatureData.push(b);

        localStorage.setItem("temperatureData", JSON.stringify(temperatureData));
        localStorage.setItem("controlTemperatureData", JSON.stringify(controlTemperatureData));

        chart.data[0].push(a);
        chart.data[1].push(b);

        chart.update();
    }
});
import Tile from './Tile';
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

const dataTemp = {
    // labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        // label: false,
        // fill: false,
        // lineTension: 0.4,
        // backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        // borderCapStyle: 'butt',
        // borderDash: [],
        // borderDashOffset: 0.0,
        // borderJoinStyle: 'miter',
        // pointBorderColor: 'rgba(75,192,192,1)',
        // pointBackgroundColor: '#fff',
        // pointBorderWidth: 1,
        // pointHoverRadius: 5,
        // pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        // pointHoverBorderColor: 'rgba(220,220,220,1)',
        // pointHoverBorderWidth: 2,
        pointRadius: 1,
        // pointHitRadius: 10,
        data: [65, 59, 80, 81, 56, 55, 40],
        // title: { display: false },
        // legend: {display: false }
        // annotation: {
        //     annotations: [
        //       {
        //         type: "line",
        //         mode: "vertical",
        //         scaleID: "x-axis-0",
        //         value: "10:32am",
        //         borderColor: "white",
        //         label: {
        //           content: "now",
        //           enabled: true,
        //           position: "top"
        //         }
        //       }
        //     ]
        //   }
      }
    ]
  };

function getDate(dateString) {
    return new Date(dateString.replace(/\s/g, 'T'));
}

function formatTime(dateString) {
    return getDate(dateString)
            .toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
            .toLowerCase()
            .replace(/\s/g, '');
}

function TideChartTile() {
    const placeholder = '--';
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [data, setData] = useState({});
    const [meta, setMeta] = useState(placeholder);
    const name = "Tide";
    const description = "Conimicut";
    const options = {
        animation: {
            duration: 0
        },
        legend: {
           display: false
        },
        // scales: {
        //     xAxes: [{
        //         type: 'linear',
        //         position: 'bottom'
        //     }]
        // },
        scales: {
            xAxes: [{
                ticks: {
                    maxTicksLimit: 9
                    // source: 'labels'
                },
                type: 'time',
                time: {
                    displayFormats: {
                        hour: 'ha'
                    }
                }
            }]
        },
        // ticks: {
        //     source: 'labels'
        // },
        tooltips: {
           enabled: false
        }
    };

    useEffect(() => {
        fetch ("https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=today&product=predictions&datum=mllw&format=json&units=english&time_zone=lst_ldt&station=8452944")
        .then(res => res.json())
        .then((result) => {
            setIsLoaded(true);
            let now = new Date();
            setMeta((now.getMonth() + 1)  + "/" + now.getDate());
            // dataTemp.datasets[0].data = result.predictions.map(p => parseFloat(p.v));
            dataTemp.labels = result.predictions.map(p => getDate(p.t).getTime());
            let firstEpochTime = getDate(result.predictions[0].t).getTime() / 10000;
            dataTemp.datasets[0].data = result.predictions.map(p => {
                return {
                    x: getDate(p.t),
                    y: parseFloat(p.v)
                };
            });
            setData(dataTemp);
            
        }, (error) => {
          setIsLoaded(true);
          setError(error);
        }

      )

        // fetch ("https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=today&product=predictions&datum=mllw&interval=hilo&format=json&units=english&time_zone=lst_ldt&station=8452944")
        //     .then(res => res.json())
        //     .then((result) => {
                
        //         dataTemp.labels = result.predictions.map(p => getDate(p.t));
                
        //     }, (error) => {
        //         setIsLoaded(true);
        //         setError(error);
        //     }
            
        // )
        // setData(dataTemp);
    }, [])

    return (
        <Tile name={name} 
            meta={meta} 
            value={<Line data={data} options={options} />} 
            description={description} />
    )

}

export default TideChartTile;

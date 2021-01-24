import React, { useState, useEffect } from 'react';

function formatTime(date) {
    return date
            .toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
            .toLowerCase()
            .replace(/\s/g, '');
}

function predictionList(predictions) {
    let now = new Date();
    let nowItem = (<li className='dark' key={now.toString()}>{formatTime(now)}</li>);
    const listItems = predictions.map(p => {
        const date = new Date(p.t.replace(/\s/g, 'T'));
        let tide = Math.round(p.v * 10) / 10;
        tide = tide > 0 ? "+" + tide : tide;
        tide = tide + "ft";
        const type = p.type == 'H' ? '↑' : '↓';
        return (<li key={date.toString()}>{formatTime(date)} {tide} {type}</li>);
    });
    return <ul>{nowItem}{listItems}</ul>;
}

function TideTile() {
    const placeholder = '--';
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [predictions, setPredictions] = useState([]);
    const [meta, setMeta] = useState(placeholder);
    const name = "Tide";
    const description = "Conimicut";

    useEffect(() => {
        fetch ("https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=today&product=predictions&datum=mllw&interval=hilo&format=json&units=english&time_zone=lst_ldt&station=8452944")
        .then(res => res.json())
        .then((result) => {
            setIsLoaded(true);
            let now = new Date();
            setMeta((now.getMonth() + 1)  + "/" + now.getDate());
            setPredictions(predictionList(result.predictions));
        }, (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
    }, [])
    
    return (
        <div className="tile">
            <div className="tile-name">{name}</div>
            <div className="tile-meta">{meta}</div>
            <div className="tile-tide">{predictions}</div>
            <div className="tile-description">{description}</div>
        </div>
    )

}

export default TideTile;

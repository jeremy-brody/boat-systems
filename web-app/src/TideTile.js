import Tile from './Tile';
import React, { useState, useEffect } from 'react';

function formatTime(dateString) {
    const date = new Date(dateString.replace(/\s/g, 'T'));
    return date
            .toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
            .toLowerCase()
            .replace(/\s/g, '');
}

function predictionList(predictions) {
    const listItems = predictions.map(p => {
        let tide = Math.round(p.v * 10) / 10;
        tide = tide > 0 ? "+" + tide : tide;
        tide = tide + "ft";
        const type = p.type == 'H' ? '↑' : '↓';
        return (<li key={p.t}>{formatTime(p.t)} {tide} {type}</li>);
    });
    return <ul>{listItems}</ul>;
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
    
    const Value = () =>
        <div className="tile-tide">{predictions}</div>

    
    return (
        <Tile name={name} 
            meta={meta} 
            value={<Value />} 
            description={description} />
    )

}

export default TideTile;

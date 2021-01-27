import Tile from './Tile';
import React, { useState, useEffect } from 'react';

function reload() {
    window.location.reload(true);
}

function ReloadTile() {
    
    const Value = () => 
        <span onClick={reload} className="tile-value-text">Go</span>

    return (
        <Tile name={'Reload'} 
            value={<Value />} />
    )

}

export default ReloadTile;

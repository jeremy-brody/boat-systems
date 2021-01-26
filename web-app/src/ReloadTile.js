import React, { useState, useEffect } from 'react';

function reload() {
    window.location.reload(true);
}

function ReloadTile() {
    
    return (
        <div className="tile">
            <div className="tile-name">Reload</div>
            <div className="tile-value">
                <span onClick={reload} className="tile-value-text">Go</span>
            </div>
            <div className="tile-description">From server</div>
        </div>
    )

}

export default ReloadTile;

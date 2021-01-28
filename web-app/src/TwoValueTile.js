import './Tile.css';
import './TwoValueTile.css';

function TwoValueTile({ description, value1, value1Unit, value2, value2Unit }) {
    
    return (
        <div className="tile two-value-tile">
            <div className="tile-value-1">
                {value1}<span className='tile-value-1-unit'>{value1Unit}</span>
            </div>
            <div className="tile-value-2">
                {value2}<span className='tile-value-2-unit'>{value2Unit}</span>
            </div>
            <div className="tile-description">{description}</div>
        </div>
    )
}

export default TwoValueTile;

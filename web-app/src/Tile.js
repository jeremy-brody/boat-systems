import './Tile.css';

function Tile({ name, meta, value, description, secondValue }) {
    return (
        <div className="tile">
            <div className="tile-name">{name}</div>
            <div className="tile-meta">{meta}</div>
            <div className="tile-value">{value}</div>
            <div className="tile-description">{description}</div>
            <div className="tile-second-value">{secondValue}</div>
        </div>
    )
}

export default Tile;

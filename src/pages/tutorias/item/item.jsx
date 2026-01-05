import './item.css';

export default function Item({title, qty, description, instructor, current}) {
    return (
        <div className="card">
            <div className="titleBox">
                <h1 className="title">{title}</h1>
                <div className="underline"></div>
            </div>
            <div className="contentBox">
                <div className="count">{qty} espacios disponibles</div>
                <p className="description">{description}</p>
                <div className="instructor">Impartida por {instructor}</div>
                <div className="currentCount">{current} alumnos inscritos</div>
            </div>
        </div>
    )
}
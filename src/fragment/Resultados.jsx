import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { peticionGet} from "../utilities/hooks/Conexion";
import { borrarSesion, getToken } from "../utilities/Sessionutil";

const Resultados = () => {
    const { external_id } = useParams();
    const [resultadosCategoria, setResultadosCategoria] = useState([]);
    const [nivelMadurez, setNivelMadurez] = useState(null);

    useEffect(() => {
        // Obtener resultados de categoría
        peticionGet(getToken(), `/resultado_categoria/obtener/${external_id}`)
            .then((response) => {
                if (response.code === 200) {
                    setResultadosCategoria(response.info);
                } else {
                    console.error("Error al obtener resultados de categoría:", response.msg);
                }
            });

        // Obtener nivel de madurez general
        peticionGet(getToken(), `/nivel_madurez_general/calcular/${external_id}`)
            .then((response) => {
                if (response.code === 200) {
                    setNivelMadurez(response.data);
                } else {
                    console.error("Error al obtener nivel de madurez general:", response.msg);
                }
            });
    }, [external_id]);

    return (
        <div className="container mt-5">
            <h2 className="text-center">Resultados de Evaluación</h2>

            <h3 className="mt-4">Porcentaje de Cumplimiento por Categoría</h3>
            <ul className="list-group">
                {resultadosCategoria.map((resultado, index) => (
                    <li key={index} className="list-group-item">
                        <strong>{resultado.categoria.titulo}:</strong> {resultado.porcentaje_cumplimiento}%
                    </li>
                ))}
            </ul>

            <h3 className="mt-4">Nivel General de Madurez</h3>
            {nivelMadurez ? (
                <div className="alert alert-info">
                    <h4>{nivelMadurez.nivel_madurez}</h4>
                    <p>{nivelMadurez.descripcion}</p>
                    <p><strong>Porcentaje Total:</strong> {nivelMadurez.nivel_general}%</p>
                </div>
            ) : (
                <p>Cargando nivel de madurez...</p>
            )}
        </div>
    );
};

export default Resultados;

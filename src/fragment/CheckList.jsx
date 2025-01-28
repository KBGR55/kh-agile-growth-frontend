import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../css/style.css";
import MenuBar from "./MenuBar";
import { useNavigate } from "react-router-dom";
import { borrarSesion, getToken } from "../utilities/Sessionutil";
import { peticionGet, peticionPost } from "../utilities/hooks/Conexion";
import swal from "sweetalert";

const CheckList = () => {
    const project = "Proyecto X";
    const projectExternalId = "0caf1c30-9337-4e53-9fe7-7698d1522019";

    const [data, setData] = useState([]);
    const [selectedResponses, setSelectedResponses] = useState({});
    const navigate = useNavigate();

    const colors = {
        "Cobertura del Ciclo de Vida": "#2E5077",
        "Trazabilidad": "#3B5F87",
        "Cumplimiento de Requisitos": "#49709A",
        "Gestión de Riesgos": "#5881AD",
        "Calidad del Producto": "#6993C1",
        "Seguridad": "#7AA5D4",
        "Tiempo de Respuesta": "#8CB7E8",
        "Adaptabilidad y Flexibilidad": "#9FC9FB",
        "Automatización": "#B2DCFF",
        "Mejora Continua": "#C6EFFF",
    };


    const titleColors = {
        "Cobertura del Ciclo de Vida": "#fff",
        "Trazabilidad": "#fff",
        "Cumplimiento de Requisitos": "#fff",
        "Gestión de Riesgos": "#fff",
        "Calidad del Producto": "#000",
        "Seguridad": "#000",
        "Tiempo de Respuesta": "#000",
        "Adaptabilidad y Flexibilidad": "#000",
        "Automatización": "#000",
        "Mejora Continua": "#000",
    };

    useEffect(() => {
        peticionGet(getToken(), "/preguntas/checklist")
            .then((response) => {
                if (response.code === 200) {
                    const mappedData = response.info.map((section) => ({
                        ...section,
                        color: colors[section.titulo] || "#f7f9f9",
                        titleColor: titleColors[section.titulo] || "#000",
                    }));
                    setData(mappedData);

                    const initialResponses = {};
                    mappedData.forEach((section) => {
                        section.preguntas.forEach((pregunta) => {
                            initialResponses[pregunta.id] = false;
                        });
                    });
                    setSelectedResponses(initialResponses);
                } else {
                    console.error("Error al cargar datos:", response.msg);
                }
            })
            .catch((error) => console.error("Error en la petición:", error));
    }, []);

    const handleSelectionChange = (preguntaId, isChecked) => {
        setSelectedResponses((prevResponses) => ({
            ...prevResponses,
            [preguntaId]: isChecked,
        }));
    };

    const handleSubmit = () => {
        const respuestas = Object.keys(selectedResponses).map((idPregunta) => ({
            idPregunta: parseInt(idPregunta, 10),
            respuestaSeleccionada: selectedResponses[idPregunta],
        }));

        const requestData = {
            idProyecto: projectExternalId,
            respuestas,
        };

        peticionPost(getToken(), "/resultados/checklist", requestData)
            .then((response) => {
                if (response.code === 201) {
                    swal("¡Éxito!", "Las respuestas se guardaron correctamente.", "success");
                } else {
                    swal("Error", response.msg || "Hubo un problema al guardar las respuestas.", "error");
                }
            })
            .catch((error) => {
                swal("Error crítico", "No se pudo establecer conexión con el servidor.", "error");
            });
    };

    return (
        <div>
            <MenuBar />
            <div className="contenedor-centro">
                <div className="contenedor-carta">
                    <p className="titulo-primario">Evaluación del nivel de madurez de {project}</p>
                    <div className="accordion" id="accordionChecklist">
                        {data.map((section, index) => (
                            <div className="accordion-item" key={index}>
                                <h2 className="accordion-header" id={`heading${index}`}>
                                    <button
                                        className="accordion-button collapsed"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target={`#collapse${index}`}
                                        aria-expanded="false"
                                        aria-controls={`collapse${index}`}
                                        style={{
                                            backgroundColor: section.color,
                                            color: section.titleColor,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {section.titulo}
                                    </button>
                                </h2>
                                <div
                                    id={`collapse${index}`}
                                    className="accordion-collapse collapse"
                                    aria-labelledby={`heading${index}`}
                                    data-bs-parent="#accordionChecklist"
                                >
                                    <div className="accordion-body">
                                        {section.preguntas && section.preguntas.length > 0 ? (
                                            <ul>
                                                {section.preguntas.map((pregunta) => (
                                                    <li key={pregunta.id}>
                                                        <input
                                                            type="checkbox"
                                                            id={`pregunta-${pregunta.id}`}
                                                            checked={selectedResponses[pregunta.id] || false}
                                                            onChange={(e) =>
                                                                handleSelectionChange(
                                                                    pregunta.id,
                                                                    e.target.checked
                                                                )
                                                            }
                                                        />
                                                        <label htmlFor={`pregunta-${pregunta.id}`}>
                                                            {pregunta.pregunta}
                                                        </label>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>No hay preguntas disponibles para esta categoría.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="contenedor-filo">
                        <button className="btn-positivo" onClick={handleSubmit}>
                            Enviar Respuestas
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckList;

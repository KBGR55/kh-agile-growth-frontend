import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../css/style.css";
import MenuBar from "./MenuBar";
import { useNavigate, useParams } from "react-router-dom";
import { getToken } from "../utilities/Sessionutil";
import { peticionGet, peticionPost } from "../utilities/hooks/Conexion";
import swal from "sweetalert";
import { mensajes } from "../utilities/Mensajes";

const CheckList = () => {
    const [data, setData] = useState([]);
    const [selectedResponses, setSelectedResponses] = useState({});
    const [counters, setCounters] = useState({});
    const [descriptions, setDescriptions] = useState({});
    const [proyecto, setProyecto] = useState({});
    const navigate = useNavigate();
    const { external_id } = useParams();

    const colors = {
        "Cobertura del Ciclo de Vida": "#5A799E",
        "Trazabilidad": "#6C8BAF",
        "Cumplimiento de Requisitos": "#7E9DC1",
        "Gestión de Riesgos": "#91AED3",
        "Calidad del Producto": "#A3C0E5",
        "Seguridad": "#B5D1F7",
        "Tiempo de Respuesta": "#C7E3FF",
        "Adaptabilidad y Flexibilidad": "#D9F4FF",
        "Automatización": "#E5F9FF",
        "Mejora Continua": "#F0FDFF",
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

        peticionGet(getToken(), `proyecto/obtener/${external_id}`)
            .then((response) => {
                if (response.code === 200) {
                    setProyecto(response.info);
                } else {
                    mensajes(response.msg, "error", "Error");
                }
            })
            .catch((error) => console.error("Error en la petición:", error));

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
                    const initialCounters = {};
                    mappedData.forEach((section) => {
                        initialCounters[section.id] = 0;
                        section.preguntas.forEach((pregunta) => {
                            initialResponses[pregunta.id] = false;
                        });
                    });
                    setSelectedResponses(initialResponses);
                    setCounters(initialCounters);
                } else {
                    console.error("Error al cargar datos:", response.msg);
                }
            })
            .catch((error) => console.error("Error en la petición:", error));

        peticionGet(getToken(), "/checklist/listar")
            .then((response) => {
                if (response.code === 200) {
                    const descriptionsMap = {};
                    response.info.forEach((item) => {
                        descriptionsMap[item.titulo] = item.descripcion;
                    });
                    setDescriptions(descriptionsMap);
                    console.log("Descripciones cargadas:", response.info);

                } else {
                    console.error("Error al cargar descripciones:", response.msg);
                }
            })
            .catch((error) => console.error("Error al obtener descripciones:", error));
    }, []);

    const handleSelectionChange = (preguntaId, sectionId, isChecked) => {
        setSelectedResponses((prevResponses) => {
            const updatedResponses = {
                ...prevResponses,
                [preguntaId]: isChecked,
            };

            setCounters((prevCounters) => {
                const updatedCount = Object.keys(updatedResponses)
                    .filter((id) => data.find((section) => section.id === sectionId)?.preguntas.some((p) => p.id.toString() === id) && updatedResponses[id])
                    .length;
                return { ...prevCounters, [sectionId]: updatedCount };
            });

            return updatedResponses;
        });
    };

    const handleSubmit = () => {
        const resumen = data.map(
            (section) => `${section.titulo}: ${counters[section.id] || 0}/${section.preguntas.length}`
        ).join("\n");

        swal({
            title: "¿Está seguro de enviar las respuestas?",
            text: `Resumen de las respuestas seleccionadas:\n${resumen}`,
            icon: "info",
            buttons: ["Cancelar", "Confirmar"],
        }).then((confirm) => {
            if (confirm) {
                const respuestas = Object.keys(selectedResponses).map((idPregunta) => ({
                    idPregunta: parseInt(idPregunta, 10),
                    respuestaSeleccionada: selectedResponses[idPregunta],
                }));

                const requestData = {
                    idProyecto: external_id,
                    respuestas,
                };

                peticionPost(getToken(), "/resultados/checklist", requestData)
                    .then((response) => {
                        if (response.code === 201) {
                            // Llamar a las rutas para calcular resultados después de enviar respuestas
                            Promise.all([
                                peticionGet(getToken(), `/resultado_categoria/calcular/${external_id}`),
                                peticionGet(getToken(), `/nivel_madurez_general/calcular/${external_id}`)
                            ])
                                .then(([resCategoria, resMadurez]) => {
                                    console.log("Respuesta de resultado_categoria:", resCategoria);
                                    console.log("Respuesta de nivel_madurez_general:", resMadurez);

                                    if (resCategoria.code === 200 && resMadurez.code === 200) {
                                        swal("¡Éxito!", "Las respuestas se guardaron y los cálculos se han realizado.", "success")
                                            .then(() => {
                                                navigate(`/resultados/${external_id}`); // Redirigir a la vista de resultados
                                            });
                                    } else {
                                        swal("Advertencia", "Respuestas guardadas, pero hubo un error en los cálculos.", "warning");
                                    }
                                })
                                .catch((error) => {
                                    console.error("Error en las peticiones de cálculo:", error);
                                    swal("Error crítico", "No se pudo calcular los resultados.", "error");
                                });

                        } else {
                            swal("Error", response.msg || "Hubo un problema al guardar las respuestas.", "error");
                        }
                    })
                    .catch((error) => {
                        swal("Error crítico", "No se pudo establecer conexión con el servidor.", "error");
                    });
            }
        });
    };

    return (
        <div>
            <MenuBar />
            <div className="contenedor-centro">
                <div className="contenedor-carta">
                    <p className="titulo-primario">Evaluación del nivel de madurez de {proyecto.nombre}</p>
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
                                        <span
                                            title={descriptions[section.titulo]}
                                            style={{
                                                marginLeft: "10px",
                                                fontSize: "14px",
                                                cursor: "pointer",
                                                color: "#555",
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16" style={{ marginRight: "5px", color: section.titleColor }}>
                                                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
                                            </svg>
                                        </span>

                                        {section.titulo} ({counters[section.id] || 0}/{section.preguntas.length}){" "}

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
                                                    <p key={pregunta.id}>
                                                        <input
                                                            type="checkbox"
                                                            id={`pregunta-${pregunta.id}`}
                                                            checked={selectedResponses[pregunta.id] || false}
                                                            onChange={(e) =>
                                                                handleSelectionChange(
                                                                    pregunta.id,
                                                                    section.id,
                                                                    e.target.checked
                                                                )
                                                            }
                                                        />
                                                        <label htmlFor={`pregunta-${pregunta.id}`}>
                                                            {pregunta.pregunta}
                                                        </label>
                                                    </p>
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
                        <button className="btn-normal" onClick={handleSubmit}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16" style={{ marginRight: "5px" }}>
                                <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                            </svg>
                            Enviar Respuestas
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckList;

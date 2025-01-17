import React, { useEffect, useState } from "react";
import "../css/style.css";
import MenuBar from "./MenuBar";
import { useNavigate } from "react-router-dom";
import { borrarSesion, getToken } from "../utilities/Sessionutil";
import { peticionGet, peticionPost } from "../utilities/hooks/Conexion";
import swal from 'sweetalert';

const CheckList = () => {
    const project = "Proyecto X";
    const projectExternalId = "0caf1c30-9337-4e53-9fe7-7698d1522019";

    const [data, setData] = useState([]);
    const [selectedCounts, setSelectedCounts] = useState([]);
    const [selectedResponses, setSelectedResponses] = useState({});
    const navigate = useNavigate();

    const colors = {
        "Cobertura del Ciclo de Vida": 'var(--azul-oscuro)',
        "Trazabilidad": 'var(--azul-intermedio)',
        "Cumplimiento de Requisitos": '#2E79BA',
        "Gestión de Riesgos": '#3282B8',
        "Calidad del Producto": '#0A81AB',
        "Seguridad": '#4592AF',
        "Tiempo de Respuesta": '#83B4FF',
        "Adaptabilidad y Flexibilidad": '#8DC6FF',
        "Automatización": '#41AAA8',
        "Mejora Continua": '#3DD2CC',
    };

    useEffect(() => {
        peticionGet(getToken(), '/preguntas/checklist')
            .then((response) => {
                if (response.code === 200) {
                    const mappedData = response.info.map((section) => ({
                        ...section,
                        color: colors[section.titulo] || "#ccc",
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

    const criteria = [
        {
            level: "Nivel 5 - Optimizado",
            color: "#4caf50",
            description: "Cumplimiento Total: Todas las preguntas marcadas como cumplidas.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" class="bi bi-emoji-sunglasses" viewBox="0 0 16 16" style={{ color: "#4caf50", margin: "10px" }}>
                    <path d="M4.968 9.75a.5.5 0 1 0-.866.5A4.5 4.5 0 0 0 8 12.5a4.5 4.5 0 0 0 3.898-2.25.5.5 0 1 0-.866-.5A3.5 3.5 0 0 1 8 11.5a3.5 3.5 0 0 1-3.032-1.75M7 5.116V5a1 1 0 0 0-1-1H3.28a1 1 0 0 0-.97 1.243l.311 1.242A2 2 0 0 0 4.561 8H5a2 2 0 0 0 1.994-1.839A3 3 0 0 1 8 6c.393 0 .74.064 1.006.161A2 2 0 0 0 11 8h.438a2 2 0 0 0 1.94-1.515l.311-1.242A1 1 0 0 0 12.72 4H10a1 1 0 0 0-1 1v.116A4.2 4.2 0 0 0 8 5c-.35 0-.69.04-1 .116" />
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-1 0A7 7 0 1 0 1 8a7 7 0 0 0 14 0" />
                </svg>
            ),
        },
        {
            level: "Nivel 4 - Gestionado",
            color: "#8bc34a",
            description: "Cumplimiento Alto: Más del 80% de las preguntas marcadas como cumplidas.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" class="bi bi-emoji-laughing" viewBox="0 0 16 16" style={{ color: "#8bc34a", margin: "10px" }}>
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                    <path d="M12.331 9.5a1 1 0 0 1 0 1A5 5 0 0 1 8 13a5 5 0 0 1-4.33-2.5A1 1 0 0 1 4.535 9h6.93a1 1 0 0 1 .866.5M7 6.5c0 .828-.448 0-1 0s-1 .828-1 0S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 0-1 0s-1 .828-1 0S9.448 5 10 5s1 .672 1 1.5" />
                </svg>
            ),
        },
        {
            level: "Nivel 3 - Definido",
            color: "#ffc107",
            description: "Cumplimiento Moderado: Entre el 60% y el 80% de las preguntas marcadas como cumplidas.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" class="bi bi-emoji-wink" viewBox="0 0 16 16" style={{ color: "#ffc107", margin: "10px" }}>
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                    <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.5 3.5 0 0 0 8 11.5a3.5 3.5 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m1.757-.437a.5.5 0 0 1 .68.194.93.93 0 0 0 .813.493c.339 0 .645-.19.813-.493a.5.5 0 1 1 .874.486A1.93 1.93 0 0 1 10.25 7.75c-.73 0-1.356-.412-1.687-1.007a.5.5 0 0 1 .194-.68" />
                </svg>
            ),
        },
        {
            level: "Nivel 2 - Repetible",
            color: "#ff9800",
            description: "Cumplimiento Bajo: Entre el 40% y el 60% de las preguntas marcadas como cumplidas.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" className="bi bi-emoji-grimace" viewBox="0 0 16 16" style={{ color: "#ff9800", margin: "10px" }}>
                    <path d="M7 6.25c0 .69-.448 1.25-1 1.25s-1-.56-1-1.25S5.448 5 6 5s1 .56 1 1.25m3 1.25c.552 0 1-.56 1-1.25S10.552 5 10 5s-1 .56-1 1.25.448 1.25 1 1.25m2.98 3.25A1.5 1.5 0 0 1 11.5 12h-7a1.5 1.5 0 0 1-1.48-1.747v-.003A1.5 1.5 0 0 1 4.5 9h7a1.5 1.5 0 0 1 1.48 1.747zm-8.48.75h.25v-.75H3.531a1 1 0 0 0 .969.75m7 0a1 1 0 0 0 .969-.75H11.25v.75zm.969-1.25a1 1 0 0 0-.969-.75h-.25v.75zM4.5 9.5a1 1 0 0 0-.969.75H4.75V9.5zm1.75 2v-.75h-1v.75zm.5 0h1v-.75h-1zm1.5 0h1v-.75h-1zm1.5 0h1v-.75h-1zm1-2h-1v.75h1zm-1.5 0h-1v.75h1zm-1.5 0h-1v.75h1zm-1.5 0h-1v.75h1z" />
                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m0-1A7 7 0 1 1 8 1a7 7 0 0 1 0 14" />
                </svg>
            ),
        },
        {
            level: "Nivel 1 - Inicial",
            color: "#f44336",
            description: "Cumplimiento Muy Bajo: Menos del 40% de las preguntas marcadas como cumplidas.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" class="bi bi-emoji-surprise" viewBox="0 0 16 16" style={{ color: "#f44336", margin: "5px" }}>
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                    <path d="M7 5.5C7 6.328 6.552 7 6 7s-1-.672-1-1.5S5.448 4 6 4s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 4 10 4s1 .672 1 1.5M10 11a2 2 0 1 1-4 0 2 2 0 0 1 4 0" />
                </svg>
            ),
        },
    ];

    // Manejar el cambio en las selecciones
    const handleSelectionChange = (preguntaId, sectionIndex, isChecked) => {
        setSelectedResponses((prevResponses) => {
            const updatedResponses = {
                ...prevResponses,
                [preguntaId]: isChecked,
            };

            // Actualizar el contador dinámicamente
            const updatedSelectedCounts = data.map((section, idx) => {
                if (idx === sectionIndex) {
                    return section.preguntas.filter((pregunta) => updatedResponses[pregunta.id]).length;
                }
                return section.preguntas.filter((pregunta) => selectedResponses[pregunta.id]).length;
            });

            setData((prevData) => {
                const updatedData = [...prevData];
                updatedData[sectionIndex].selectedCount = updatedSelectedCounts[sectionIndex];
                return updatedData;
            });

            return updatedResponses;
        });
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

        peticionPost(getToken(), '/resultados/checklist', requestData)
            .then((response) => {
                if (response.code === 201) {
                    console.log("Respuestas guardadas con éxito:", response.info);
                    swal("¡Éxito!", "Las respuestas se guardaron correctamente.", "success");
                } else {
                    console.error("Error al guardar respuestas:", response.msg);
                    swal("Error", response.msg || "Hubo un problema al guardar las respuestas.", "error");
                }
            })
            .catch((error) => {
                console.error("Error en la petición:", error);
                swal("Error crítico", "No se pudo establecer conexión con el servidor.", "error");
            });
    };

    return (
        <div>
            <MenuBar />
            <div className="contenedor-centro ">
                <div className="contenedor-carta">
                    <p className="titulo-primario">Evaluación del nivel de madurez de {project}</p>
                    <div className="checklist-grid">
                        {data.map((section, index) => (
                            <div
                                key={index}
                                className="checklist-card"
                                style={{ borderLeft: `10px solid ${section.color}` }}
                            >
                                <h2 style={{ color: section.color }}>{section.titulo}</h2>
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
                                                        index,
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
                                <div className="counter">
                                    {section.preguntas.filter((pregunta) => selectedResponses[pregunta.id]).length} / {section.preguntas.length} seleccionados
                                </div>
                            </div>

                        ))}
                    </div>
                    <div className="contenedor-centro">
                        <button className="boton-primario" onClick={handleSubmit}>
                            Enviar Respuestas
                        </button>
                    </div>
                </div>
            </div>

            <div className="contenedor-centro">
                <div className="contenedor-carta">
                    <p className="titulo-primario">Criterios de Evaluación</p>
                    <div className="criteria-grid">
                        {criteria.map((criterion, idx) => (
                            <div
                                key={idx}
                                className="criteria-card"
                                style={{ borderColor: criterion.color }}
                            >
                                <div
                                    className="criteria-header"
                                    style={{ backgroundColor: criterion.color }}
                                >
                                    {criterion.level}
                                </div>
                                <div className="criteria-content">
                                    {criterion.icon && <div className="criteria-icon">{criterion.icon}</div>}
                                    <p>{criterion.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


        </div>


    );
};

export default CheckList;

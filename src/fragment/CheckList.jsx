import React, { useState } from "react";
import "../css/style.css";
import MenuBar from "./MenuBar";

const CheckList = () => {
    const project = "Proyecto X";

    const [selectedCounts, setSelectedCounts] = useState(
        Array(10).fill(0)
    );

    const sections = [
        {
            title: "Cobertura del Ciclo de Vida",
            color: 'var(--azul-oscuro)',
            items: [
                "¿Se definen objetivos claros en la etapa de planificación?",
                "¿Se documenta el análisis de requisitos?",
                "¿Se elabora un diseño técnico detallado?",
                "¿Se realizan revisiones técnicas durante cada fase del ciclo de vida?",
                "¿Se ejecutan pruebas de integración para asegurar la interoperabilidad entre componentes?",
                "¿Se realizan pruebas de aceptación por parte del cliente?",
                "¿Se implementan protocolos de mantenimiento post-entrega?",
            ],
        },
        {
            title: "Trazabilidad",
            color: 'var(--azul-intermedio)',
            items: [
                "¿Los requisitos cuentan con identificadores únicos?",
                "¿Se mantienen actualizados los registros de cambios en los requisitos?",
                "¿Existe una relación clara entre los casos de prueba y los requisitos?",
                "¿Se rastrea cada defecto detectado hasta su causa raíz?",
                "¿Se documentan las versiones del producto con los cambios asociados?",
                "¿Se utilizan herramientas especializadas para la trazabilidad (ej., JIRA, Azure DevOps)?",
            ],
        },
        {
            title: "Cumplimiento de Requisitos",
            color: '#2E79BA',
            items: [
                "¿Se establecen criterios claros de aceptación para cada requisito?",
                "¿Se revisan los requisitos con los stakeholders antes de comenzar el desarrollo?",
                "¿Se validan los requisitos funcionales a través de prototipos o pruebas iniciales?",
                "¿Se verifican los requisitos no funcionales, como rendimiento y escalabilidad?",
                "¿Se utilizan métricas para evaluar el grado de cumplimiento de los requisitos?",
            ],
        },
        {
            title: "Gestión de Riesgos",
            color: '#3282B8',
            items: [
                "¿Se elabora un registro inicial de riesgos antes de iniciar el proyecto?",
                "¿Se priorizan los riesgos en función de su probabilidad e impacto?",
                "¿Se asignan responsables específicos para cada riesgo identificado?",
                "¿Se implementan controles preventivos para mitigar riesgos críticos?",
                "¿Se realiza un monitoreo continuo de los riesgos durante todo el proyecto?",
                "¿Se documentan lecciones aprendidas para evitar riesgos similares en futuros proyectos?",
            ],
        },
        {
            title: "Calidad del Producto",
            color: '#0A81AB',
            items: [
                "¿Se realizan revisiones de código antes de la integración?",
                "¿Se implementan pruebas unitarias para cada módulo desarrollado?",
                "¿Se ejecutan pruebas de estrés para evaluar la capacidad del software bajo alta carga?",
                "¿Se mide la usabilidad del software a través de pruebas con usuarios finales?",
                "¿Se analiza la eficiencia del código para reducir el consumo de recursos?",
                "¿Se validan los resultados obtenidos frente a los estándares de calidad definidos (ISO/IEC 25010)?",
            ],
        },
        {
            title: "Seguridad",
            color: '#4592AF',
            items: [
                "¿Se realiza un análisis de vulnerabilidades durante la etapa de desarrollo?",
                "¿Se aplican prácticas seguras de codificación para prevenir inyecciones SQL, XSS, entre otros?",
                "¿Se incluyen autenticación y autorización para controlar el acceso al sistema?",
                "¿Se utiliza encriptación para datos sensibles en tránsito y en reposo?",
                "¿Se ejecutan pruebas de penetración para identificar posibles brechas de seguridad?",
                "¿El equipo recibe capacitación en seguridad informática?",
            ],
        },
        {
            title: "Tiempo de Respuesta",
            color: '#83B4FF',
            items: [
                "¿Se define un tiempo máximo aceptable de respuesta para las principales funciones del software?",
                "¿Se realizan pruebas de rendimiento bajo diferentes escenarios de carga?",
                "¿Se optimiza el uso de recursos como memoria y CPU para mejorar los tiempos de respuesta?",
                "¿Se registran y analizan los tiempos de respuesta en el entorno de producción?",
                "¿Se optimizan consultas a la base de datos para reducir los tiempos de ejecución?",
            ],
        },
        {
            title: "Adaptabilidad y Flexibilidad",
            color: '#8DC6FF',
            items: [
                "¿Se pueden realizar modificaciones en el software sin afectar otros módulos?",
                "¿El diseño del software permite la incorporación de nuevas funcionalidades fácilmente?",
                "¿Se documentan las dependencias entre componentes para facilitar los cambios?",
                "¿El software puede escalar horizontal o verticalmente para manejar más usuarios o datos?",
                "¿Se realizan pruebas de regresión para asegurar que los cambios no introducen nuevos defectos?",
                "¿Se utiliza una arquitectura basada en microservicios o modularidad para facilitar la adaptabilidad?",
            ],
        },
        {
            title: "Automatización",
            color: '#41AAA8',
            items: [
                "¿Se automatizan las pruebas unitarias, de integración y de regresión?",
                "¿Se implementa un pipeline de integración y despliegue continuo (CI/CD)?",
                "¿Se automatizan procesos de generación de documentación?",
                "¿Se utilizan scripts para configurar entornos de desarrollo, prueba y producción?",
                "¿Se monitorizan automáticamente los sistemas en producción para detectar fallos o anomalías?",
                "¿Se realizan auditorías automáticas de seguridad y calidad del código?",
            ],
        },
        {
            title: "Mejora Continua",
            color: '#3DD2CC',
            items: [
                "¿El equipo realiza reuniones de retrospectiva al final de cada sprint o iteración?",
                "¿Se implementan mejoras sugeridas por el equipo o clientes en ciclos posteriores?",
                "¿Se utilizan indicadores clave de desempeño (KPIs) para evaluar el progreso del proyecto?",
                "¿El equipo participa en capacitaciones regulares para mejorar sus habilidades?",
                "¿Se adoptan nuevas herramientas o metodologías para mejorar la eficiencia y calidad?",
                "¿Se registra un historial de todas las mejoras implementadas para futuros proyectos?",
            ],
        },
    ];

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
    const handleSelectionChange = (sectionIndex, isChecked) => {
        setSelectedCounts((prevCounts) => {
            const newCounts = [...prevCounts];
            newCounts[sectionIndex] += isChecked ? 1 : -1;
            return newCounts;
        });
    };

    return (
        <div>
            <MenuBar />
            <div className="contenedor-centro ">
                <div className="contenedor-carta">
                    <p className="titulo-primario">Evaluación del nivel de madurez de {project}</p>
                    <div className="checklist-grid">
                        {sections.map((section, index) => (
                            <div
                                key={index}
                                className="checklist-card"
                                style={{ borderLeft: `10px solid ${section.color}` }}
                            >
                                <h2 style={{ color: section.color }}>{section.title}</h2>
                                <ul>
                                    {section.items.map((item, idx) => (
                                        <li key={idx}>
                                            <input type="checkbox" id={`${section.title}-${idx}`} onChange={(e) =>
                                                handleSelectionChange(index, e.target.checked)
                                            } />
                                            <label htmlFor={`${section.title}-${idx}`}>{item}</label>
                                        </li>
                                    ))}
                                </ul>
                                <div className="counter">
                                    {selectedCounts[index]} / {section.items.length} seleccionados
                                </div>
                            </div>

                        ))}
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

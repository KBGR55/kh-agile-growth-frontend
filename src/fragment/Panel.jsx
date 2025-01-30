import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, Drawer, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { useParams } from 'react-router-dom';
import '../css/style.css';
import { peticionGet } from '../utilities/hooks/Conexion';
import { getToken } from '../utilities/Sessionutil';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuBar from './MenuBar';

const LEVEL_COLORS = {
    'Exploratorio': '#F5004F',
    'Emergente': '#FFAF00',
    'Estandarizado': '#D22779',
    'Optimizado Avanzado': '#7149C6',
    'Excelencia Innovadora': '#54B435',
};

const COLORS = ['#2E5077', '#365E87', '#457896', '#5A9FA0', '#6AB8A9', '#3D8E91', '#51908D', '#468084', '#1679AB', '#7AB2D3'];

const MEASURES_BY_LEVEL = {
    "Exploratorio": [
        "Diseñar un esquema básico para identificar las fases del ciclo de vida del software, asegurando que cada etapa tenga objetivos claros.",
        "Asignar roles específicos dentro del equipo para mejorar la trazabilidad y responsabilidad.",
        "Implementar reuniones semanales para evaluar el progreso y detectar bloqueos.",
        "Documentar los requisitos esenciales del cliente en un repositorio centralizado, aunque sea manual.",
        "Crear una lista simple de riesgos con acciones preventivas básicas para mitigarlos.",
        "Introducir herramientas básicas como Google Drive para centralizar la documentación.",
        "Realizar capacitaciones iniciales en el uso de herramientas de control de versiones como Git o GitHub.",
        "Asegurar que los entregables se validen al menos una vez por un estudiante no involucrado directamente en su desarrollo.",
        "Fomentar la práctica de pruebas funcionales manuales al final de cada entrega.",
        "Iniciar conversaciones sobre la importancia de la seguridad, aunque sea a un nivel conceptual."
    ],
    "Emergente": [
        "Adoptar un modelo de desarrollo formal, como Scrum, con roles claros y un backlog básico.",
        "Introducir herramientas de seguimiento de tareas como Jira, Trello o ClickUp para gestionar requisitos y entregables.",
        "Crear un manual de estándares básicos de codificación para el equipo.",
        "Implementar revisiones de código en equipo, enfocándose en detectar errores comunes.",
        "Elaborar un plan detallado de gestión de riesgos que incluya categorías como técnicos, operativos y organizacionales.",
        "Realizar retrospectivas al final de cada iteración para identificar mejoras en el proceso.",
        "Centralizar los documentos de proyectos en un repositorio organizado, accesible para todo el equipo.",
        "Establecer criterios claros para la aceptación de entregables, incluyendo pruebas funcionales y revisión del cliente.",
        "Configurar un entorno de pruebas básico donde se realicen validaciones regulares.",
        "Aumentar la frecuencia de discusiones sobre calidad y trazabilidad en reuniones de equipo."
    ],
    "Estandarizado": [
        "Integrar herramientas avanzadas de trazabilidad, como Azure DevOps o Redmine, para vincular requisitos, pruebas y entregables.",
        "Introducir pruebas automatizadas utilizando frameworks como Selenium, JUnit o Jest.",
        "Implementar métricas específicas como cobertura de pruebas, defectos detectados y tiempo de respuesta por módulo.",
        "Adoptar el uso de CI/CD (Integración y Despliegue Continuos) con herramientas como Jenkins o GitHub Actions.",
        "Realizar capacitaciones regulares en temas específicos como gestión de riesgos y calidad del producto.",
        "Automatizar pruebas de carga y estrés utilizando herramientas como Apache JMeter o Gatling.",
        "Garantizar que las pruebas de seguridad se realicen antes de cada despliegue utilizando herramientas como OWASP ZAP.",
        "Diseñar planes de contingencia más sofisticados para mitigar riesgos que impacten la continuidad del proyecto.",
        "Mejorar los sistemas de monitoreo de desempeño para anticipar problemas antes de que afecten la entrega.",
        "Estandarizar la arquitectura del sistema para facilitar la escalabilidad y el mantenimiento."
    ],
    "Optimizado Avanzado": [
        "Dedicar tiempo a investigar y aplicar innovaciones tecnológicas como inteligencia artificial o blockchain en proyectos estudiantiles.",
        "Introducir el uso de herramientas de monitoreo en tiempo real como Grafana o Elastic Stack para analizar datos del sistema.",
        "Proponer la creación de un equipo de calidad dedicado a auditar procesos y productos.",
        "Promover la participación en competencias de software, donde los estudiantes puedan validar sus proyectos en escenarios reales.",
        "Organizar hackatones internos para encontrar soluciones innovadoras a problemas técnicos o del proceso.",
        "Ampliar la cobertura de pruebas automatizadas a escenarios más complejos y en dispositivos diferentes.",
        "Crear métricas avanzadas de mejora continua, como satisfacción del cliente y porcentaje de retroalimentación implementada.",
        "Utilizar herramientas de big data o machine learning para analizar patrones y proponer optimizaciones.",
        "Publicar resultados y buenas prácticas en congresos o revistas universitarias para posicionar al grupo como referente.",
        "Establecer alianzas con empresas de software para validar los proyectos en contextos reales y obtener retroalimentación directa."
    ]
};


function Panel() {
    const { external_id_proyecto } = useParams();
    const [nivelGeneral, setNivelGeneral] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [categoriasInfo, setCategoriasInfo] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        const fetchNivelMadurezGeneral = async () => {
            const info = await peticionGet(getToken(), `nivel_madurez_general/obtener/${external_id_proyecto}`);
            if (info.code === 200) setNivelGeneral(info.info);
        };

        const fetchCategorias = async () => {
            const info = await peticionGet(getToken(), `resultado_categoria/obtener/${external_id_proyecto}`);
            if (info.code === 200) setCategorias(info.info);
        };

        const fetchNivelesMadurez = async () => {
            const info = await peticionGet(getToken(), 'checklist/listar');
            if (info.code === 200) setCategoriasInfo(info.info);
        };

        fetchNivelMadurezGeneral();
        fetchCategorias();
        fetchNivelesMadurez();
    }, [external_id_proyecto]);

    const categoriaData = categorias.map(categoria => ({
        name: categoria.categoria,
        porcentaje: parseFloat(categoria.porcentaje),
    }));

    const nivelColor = nivelGeneral ? LEVEL_COLORS[nivelGeneral.nivel_madurez] || '#2196F3' : '#2196F3';

    return (
        <div>
            <MenuBar />
            <div style={{ padding: '20px' }}>
                {nivelGeneral || categoriasInfo.length > 0 ? (
                    <>
                        {/* Nivel General */}
                        {nivelGeneral && (
                            <>
                                <Card style={{ marginBottom: '20px', padding: '20px', color: nivelColor, borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', position: 'relative' }}>
                                    <CardContent>
                                        <Typography variant="h5" style={{ textAlign: 'center', fontWeight: '600', fontFamily: 'Popins, sans-serif' }}>
                                            Nivel de Madurez General
                                        </Typography>
                                        <Typography variant="h6" style={{ textAlign: 'center', margin: '10px 0', fontSize: '60px', fontWeight: 'bold', fontFamily: 'Popins, sans-serif' }}>
                                            {nivelGeneral.nivel_madurez}
                                        </Typography>
                                        <Typography variant="body1" style={{ textAlign: 'center', fontSize: '25px', fontFamily: 'Popins, sans-serif' }}>
                                            Porcentaje: {nivelGeneral.nivel_general}%
                                        </Typography>
                                        <Typography variant="body2" style={{ textAlign: 'center', marginTop: '10px', fontFamily: 'Popins, sans-serif' }}>
                                            {nivelGeneral.descripcion}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            style={{
                                                position: 'absolute',
                                                top: '10px',
                                                right: '10px',
                                                backgroundColor: nivelColor,
                                            }}
                                            onClick={() => setDrawerOpen(true)}
                                            startIcon={<ChevronLeftIcon />}
                                        >
                                            Ver medidas correctivas
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Drawer
                                    anchor="right"
                                    open={drawerOpen}
                                    onClose={() => setDrawerOpen(false)}
                                    style={{ width: '400px' }}
                                >
                                    <div style={{ width: '400px', padding: '20px' }}>
                                        <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '10px', color: nivelColor }}>
                                            Medidas Correctivas ({nivelGeneral.nivel_madurez})
                                        </Typography>
                                        <Typography variant="body2" style={{ marginBottom: '15px', fontStyle: 'italic', fontFamily: 'Popins, sans-serif' }}>
                                            Estas medidas son sugerencias prácticas para implementar y avanzar al siguiente nivel de madurez.
                                        </Typography>
                                        <ul style={{ paddingLeft: '20px' }}>
                                            {MEASURES_BY_LEVEL[nivelGeneral.nivel_madurez]?.map((medida, index) => (
                                                <li key={index} style={{ marginBottom: '10px', fontFamily: 'Popins, sans-serif' }}>
                                                    {medida}
                                                </li>
                                            ))}
                                        </ul>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => setDrawerOpen(false)}
                                            style={{ marginTop: '20px' }}
                                        >
                                            Cerrar
                                        </Button>
                                    </div>
                                </Drawer>

                            </>
                        )}

                        {/* Análisis por Categoría */}
                        <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                            <Grid item xs={12} md={6}>
                                <Card style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                                    <CardContent>
                                        <Typography variant="h6" style={{ marginBottom: '10px', textAlign: 'center', fontWeight: 'bold', color: 'var(--color-cuarto)', fontFamily: 'Popins, sans-serif' }}>
                                            Porcentaje por Categoría
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={350}>
                                            <BarChart data={categoriaData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="porcentaje">
                                                    {categoriaData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Card style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                                    <CardContent>
                                        <Typography variant="h6" style={{ marginBottom: '10px', textAlign: 'center', fontWeight: 'bold', color: 'var(--color-cuarto)', fontFamily: 'Popins, sans-serif' }}>
                                            Distribución de Niveles
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={350}>
                                            <PieChart>
                                                <Pie
                                                    data={categoriaData}
                                                    dataKey="porcentaje"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={100}
                                                    fill="#8884d8"
                                                    label
                                                >
                                                    {categoriaData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Desglose de Niveles */}
                        <Card style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '20px' }}>
                            <Typography style={{ marginBottom: '10px', textAlign: 'center', fontWeight: 'bold', fontSize: '20px', fontWeight: 'bold', color: 'var(--color-cuarto)', fontFamily: 'Popins, sans-serif' }}>
                                Lista de Categorías
                            </Typography>
                            {categoriasInfo.map((categoria, index) => (
                                <Accordion
                                    key={categoria.external_id}
                                    style={{
                                        marginBottom: '10px',
                                        borderRadius: '10px',
                                        border: '1px solid #ddd',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        style={{
                                            backgroundColor: COLORS[index % COLORS.length],
                                            color: '#fff',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {categoria.titulo} (Peso: {categoria.peso})
                                    </AccordionSummary>
                                    <AccordionDetails style={{ backgroundColor: '#fff', color: '#000' }}>
                                        <Typography variant="body1" style={{ marginBottom: '10px' }}>
                                            <strong>Descripción:</strong> {categoria.descripcion}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Justificación del Peso:</strong> {categoria.justificacion_peso}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </Card>
                    </>
                ) : (
                    <Typography style={{ textAlign: 'center', marginTop: '20px', fontSize: '18px', color: 'var(--color-cuarto)' }}>
                        No hay información disponible porque no se ha realizado el checklist.
                    </Typography>
                )}
            </div>
        </div>
    );

}

export default Panel;
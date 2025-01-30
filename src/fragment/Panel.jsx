import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { useParams } from 'react-router-dom';
import '../css/style.css';
import { peticionGet } from '../utilities/hooks/Conexion';
import { getToken } from '../utilities/Sessionutil';
import MenuBar from './MenuBar';

const LEVEL_COLORS = {
    'Exploratorio': '#F5004F',
    'Emergente': '#FFAF00',
    'Estandarizado': '#D22779',
    'Optimizado Avanzado': '#7149C6',
    'Excelencia Innovadora': '#54B435',
};

const COLORS = ['#2E5077', '#365E87', '#457896', '#5A9FA0', '#6AB8A9', '#3D8E91', '#51908D', '#468084', '#1679AB', '#7AB2D3'];

function Panel() {
    const { external_id_proyecto } = useParams();
    const [nivelGeneral, setNivelGeneral] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [categoriasInfo, setCategoriasInfo] = useState([]);

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
                            <Card style={{ marginBottom: '20px', padding: '20px', color: nivelColor, borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
                                <CardContent>
                                    <Typography variant="h5" style={{ textAlign: 'center', fontWeight: '600', fontFamily: 'Popins, sans-serif' }}>Nivel de Madurez General</Typography>
                                    <Typography variant="h6" style={{ textAlign: 'center', margin: '10px 0', fontSize: '60px', fontWeight: 'bold', fontFamily: 'Popins, sans-serif' }}>
                                        {nivelGeneral.nivel_madurez}
                                    </Typography>
                                    <Typography variant="body1" style={{ textAlign: 'center', fontSize: '25px', fontFamily: 'Popins, sans-serif' }}>
                                        Porcentaje: {nivelGeneral.nivel_general}%
                                    </Typography>
                                    <Typography variant="body2" style={{ textAlign: 'center', marginTop: '10px', fontFamily: 'Popins, sans-serif' }}>
                                        {nivelGeneral.descripcion}
                                    </Typography>
                                </CardContent>
                            </Card>
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
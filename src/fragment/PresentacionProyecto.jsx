import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { peticionGet } from '../utilities/hooks/Conexion';
import '../css/style.css';
import { getToken, getUser, borrarSesion } from '../utilities/Sessionutil';
import mensajes from '../utilities/Mensajes';
import imagen from "../img/fondo.jpeg";
import MenuBar from './MenuBar';

const PresentacionProyecto = () => {
    const { external_id } = useParams();
    const [proyecto, setProyecto] = useState(null);
    const [proyectoEntidad, setProyectoEntidad] = useState(null);
    const [roles, setRoles] = useState([]);
    const [rolAdministrador, setRolAdministrador] = useState('');
    const [rolesEntida, setRolesEntidad] = useState([]);
    const [selectedRoleId, setSelectedRoleId] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [showNewProjectModal, setShowNewProjectModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const info = await peticionGet(
                    getToken(),
                    `rol_proyecto/listar/entidad?id_entidad=${getUser().user.id}&external_id_proyecto=${external_id}`
                );
                if (info.code !== 200 && info.msg === 'Acceso denegado. Token ha expirado') {
                    borrarSesion();
                    mensajes(info.mensajes);
                    navigate("/main");
                } else if (info.code === 200) {
                    setRoles(info.info.roles);
                    setProyecto(info.info.proyecto);
                } else {
                    console.error('Error al obtener roles:', info.msg);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
        };
        const fetchRolAdministrador = async () => {
            try {
                const info = await peticionGet(
                    getToken(),
                    `rol/entidad/obtener/administrador?id_entidad=${getUser().user.id}`
                );
                if (info.code !== 200 && info.msg === 'Acceso denegado. Token ha expirado') {
                    borrarSesion();
                    mensajes(info.mensajes);
                    navigate("/main");
                } else if (info.code === 200) {
                    setRolAdministrador(info.code);
                } else {
                    setRolAdministrador(info.code);
                    console.error('Error al obtener roles:', info.msg);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
        };

        const fetchRolesEntidad = async () => {
            try {
                const info = await peticionGet(
                    getToken(),
                    `rol/entidad/listar?id_entidad=${getUser().user.id}`
                );
                if (info.code !== 200 && info.msg === 'Acceso denegado. Token ha expirado') {
                    borrarSesion();
                    mensajes(info.mensajes);
                    navigate("/main");
                } else if (info.code === 200) {
                    setRolesEntidad(info.info);
                } else {
                    console.error('Error al obtener roles:', info.msg);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
        };

        fetchRoles();
        fetchRolAdministrador();
        fetchRolesEntidad();
    }, [external_id, navigate]);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const info = await peticionGet(getToken(), `proyecto/${external_id}`);
                if (info.code === 200) {
                    setProyectoEntidad(info.info);
                } else {
                    console.error('Error al obtener proyecto:', info.msg);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
        };

        fetchProject();
    }, [external_id]);

    const roleOptions = {
        'ADMIN_PROYECTO': ['Asignar equipo', 'Casos de prueba', 'Casos de prueba asignados', 'Generar reportes', 'Miembros'],
        'EQUIPO DE DESARROLLO': ['Casos de prueba', 'Lista de casos de prueba asignados'],
        'TESTER': ['Casos de prueba', 'Registrar errores', 'Asignar desarrolladores'],
        'DESARROLLADOR': ['Errores asigandos', 'Consultar errores asignados']
    };

    const roleIcons = {
        'ADMIN_PROYECTO': 'bi bi-briefcase-fill',
        'EQUIPO DE DESARROLLO': 'bi bi-card-checklist',
        'TESTER': 'bi bi-bug-fill',
        'DESARROLLADOR': 'bi bi-code-slash'
    };

    const handleOptionClick = (option, roleId, event) => {
        event.preventDefault();
        setSelectedRoleId(roleId);
        setSelectedOption(option);

        if (option === 'Casos de prueba') {
            navigate(`/casos/prueba/${proyecto.external_id}`, { state: { proyecto } });
        } else if (option === 'Editar proyecto') {
            setShowNewProjectModal(true);
        } else if (option === 'Miembros') {
            navigate(`/proyecto/usuarios/${proyecto.external_id}`, { state: { proyecto } });
        } else if (option === 'Asignar equipo') {
            navigate(`/asignar/tester/${proyecto.external_id}`, { state: { selectedRoleId: roleId } });
        } else if (option === 'Casos de prueba asignados') {
            navigate(`/casos/prueba/asignados/${proyecto.external_id}`, { state: { proyecto } });
        } else if (option === 'Asignar desarrolladores') {
            navigate(`/asignar/desarrollador/${proyecto.external_id}`, { state: { selectedRoleId: roleId } });
        } else if (option === 'Errores asigandos') {
            navigate(`/errores/asignados/${proyecto.external_id}`);
        };
    }
    const handleCloseNewProjectModal = () => {
        setShowNewProjectModal(false);
    };

    if (!proyecto) return <p>Cargando...</p>;

    return (
        <div >
            <MenuBar />
            <div className="project-page">
                <div className="header-section">
                    <img src={imagen} alt="Project Background" className="background-image" />
                    <div className="header-overlay">
                        <h1 className="project-title">{proyectoEntidad[0].proyecto_rol.nombre}</h1>
                        <p>{proyectoEntidad[0].proyecto_rol.descripcion || 'Descripción del proyecto.'}</p>
                    </div>
                </div>

                {/* Sección de contenido */}
                <div className="contenedor-carta">
                    <div className="fila-opciones">
                        <div className="g-1">
                            <p className="titulo-primario">Opciones permitidas</p>

                            {roles.length > 0 && roles.map((role, index) => (
                                <div key={index} className="col-md-4">
                                    <h3 className="titulo-secundario">
                                        <i className={roleIcons[role.nombre] || 'bi bi-person'}></i> {role.nombre}
                                    </h3>
                                    <ul className="role-options-list">
                                        {roleOptions[role.nombre] &&
                                            roleOptions[role.nombre].map((option, optionIndex) => (
                                                <li key={optionIndex} className="role-option-item">
                                                    <button
                                                        onClick={(event) => handleOptionClick(option, role.id, event)}
                                                        className="option-button"
                                                    >
                                                        {option}
                                                    </button>
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="project-team">
                        <p className="titulo-primario">Equipo del proyecto</p>
                            <ul>
                                {proyectoEntidad && proyectoEntidad.length > 0 ? (
                                    proyectoEntidad.map((miembro, index) => (
                                        <li key={index}>
                                            {miembro.rol_entidad.entidad.nombres}{' '}
                                            {miembro.rol_entidad.entidad.apellidos} -{' '}
                                            <strong>{miembro.rol_entidad.rol.nombre}</strong>
                                        </li>
                                    ))
                                ) : (
                                    <li>No hay miembros del equipo registrados</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default PresentacionProyecto;
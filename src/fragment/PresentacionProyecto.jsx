import React, { useEffect, useState } from 'react';
import swal from 'sweetalert';
import { Modal} from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router';
import { peticionGet } from '../utilities/hooks/Conexion';
import { getToken, getUser } from '../utilities/Sessionutil';
import { mensajesSinRecargar } from '../utilities/Mensajes';
import imagen from "../img/fondo.jpeg";
import MenuBar from './MenuBar';
import NuevoProyecto from './NuevoProyecto';
import TerminarProyecto from './TerminarProyecto';
import '../css/style.css';

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
    const [showEditProjectModal, setShowEditProjectModal] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [showTerminarProjectModal, setShowTerminarProjectModal] = useState(false);
    const navigate = useNavigate();

    const handleCloseModal = () => {
        setShowEditProjectModal(false);
        setSelectedProjectId(null);
    };
    const handleCloseNewProjectModal = () => setShowNewProjectModal(false);
    const handleEditClick = (externalId) => {
        setSelectedProjectId(externalId);
        setShowEditProjectModal(true);
    };

    const handleTerminarClick = (externalId) => {
        swal({
            title: "¿Está seguro?",
            text: "Una vez terminado, no podrá modificar ni agregar nada a este proyecto.",
            icon: "warning",
            buttons: ["Cancelar", "Confirmar"],
            dangerMode: true,
        }).then((confirmacion) => {
            if (confirmacion) {
                setSelectedProjectId(externalId);
                setShowTerminarProjectModal(true);
            }
        });
    };
    const handleTerminarModal = () => {
        setShowTerminarProjectModal(true);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Iniciando fetchData...');
                const [rolesRes, adminRes, rolesEntidadRes, proyectoRes] = await Promise.all([
                    peticionGet(getToken(), `rol_proyecto/listar/entidad?id_entidad=${getUser().user.id}&external_id_proyecto=${external_id}`),
                    peticionGet(getToken(), `rol/entidad/obtener/administrador?id_entidad=${getUser().user.id}`),
                    peticionGet(getToken(), `rol/entidad/listar?id_entidad=${getUser().user.id}`),
                    peticionGet(getToken(), `proyecto/${external_id}`)
                ]);
                console.log('rolesRes:', rolesRes);

                if (rolesRes.code === 200) {
                    setRoles(rolesRes.info.roles);
                    setProyecto(rolesRes.info.proyecto);
                }
                console.log('adminRes:', adminRes);
                if (adminRes.code === 200) {
                    setRolAdministrador(adminRes.info);
                }
                console.log('rolesEntidadRes:', rolesEntidadRes);
                if (rolesEntidadRes.code === 200) {
                    setRolesEntidad(rolesEntidadRes.info);
                }
                console.log('proyectoRes:', proyectoRes);
                if (proyectoRes.code === 200 && proyectoRes.info.length > 0) {
                    setProyectoEntidad(proyectoRes.info[0]);
                }
            } catch (error) {
                console.error('Error en fetchData:', error);
            }
        };

        fetchData();
    }, [external_id]);

    const roleOptions = {
        'ADMIN_PROYECTO': ['Asignar equipo', 'Editar proyecto', 'Miembros', 'Panel', 'Terminar proyecto'],
        'EQUIPO DE DESARROLLO': ['Casos de prueba', 'Lista de casos de prueba asignados'],
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

        if (option === 'Panel') {
            navigate(`/proyecto/panel/${proyecto.external_id}`, { state: { proyecto } });
        } if (option === 'Casos de prueba') {
            navigate(`/casos/prueba/${proyecto.external_id}`, { state: { proyecto } });
        } else if (option === 'Editar proyecto') {
            handleEditClick(proyecto.external_id);
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
        } else if (option === 'Terminar proyecto') {
            handleTerminarClick(proyecto.external_id);
        } else {
            mensajesSinRecargar('Esta funcionalidad está en desarrollo de desarrollo.', 'info', 'Próximamente');
        }
    }

    if (!proyecto) return <p>Cargando...</p>;

    return (
        <div >
            <MenuBar />
            <div className="project-page">
                <div className="header-section">
                    <img src={imagen} alt="Project Background" className="background-image" />
                    <div className="header-overlay">
                        <h1 className="project-title">{proyectoEntidad.proyecto_rol.nombre}</h1>
                        <p>{proyectoEntidad.proyecto_rol.descripcion || 'Descripción del proyecto.'}</p>
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
            {/* Modal para crear/editar proyecto */}
            <Modal show={showEditProjectModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="titulo-primario">Editar Proyecto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <NuevoProyecto external_id_proyecto={selectedProjectId} onClose={handleCloseNewProjectModal} />
                </Modal.Body>
            </Modal>
            {/* Modal para terminar proyecto */}
            <Modal show={showTerminarProjectModal} onHide={handleTerminarModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="titulo-primario">Terminar Proyecto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TerminarProyecto external_id_proyecto={selectedProjectId} onClose={handleTerminarModal} />
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default PresentacionProyecto;
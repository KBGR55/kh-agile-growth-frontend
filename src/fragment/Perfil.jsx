import { getToken, getUser } from '../utilities/Sessionutil';
import React, { useEffect, useState } from 'react';
import { peticionGet, URLBASE } from '../utilities/hooks/Conexion';
import { useNavigate, useParams } from 'react-router-dom';
import MenuBar from './MenuBar';
import '../css/style.css';
import { mensajes } from '../utilities/Mensajes';


const Perfil = () => {
    const navigate = useNavigate();
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [entidadInfo, setEntidadInfo] = useState(null);
    const [correoInfo, setCorreoInfo] = useState(null);
    const { external_id_proyecto, external_id_entidad } = useParams();

    useEffect(() => {
        if (external_id_entidad) {
            peticionGet(getToken(), `/obtener/entidad/${external_id_entidad}`)
                .then((info) => {
                    if (info.code === 200) {
                        console.log(info.info);
                        setEntidadInfo(info.info); 
                        setNombreUsuario(info.info.nombres + " " + info.info.apellidos);
                        setCorreoInfo(info.info.correo);
                    } else {
                        mensajes(info.msg, 'error', 'Error');
                    }
                })
                .catch((error) => {
                    mensajes('Error al cargar la información de la entidad', 'error', 'Error');
                    console.error(error);
                });
        } else {
            const usuario = getUser();
            setEntidadInfo(usuario.user);  
            setNombreUsuario(usuario.user.nombres + " " + usuario.user.apellidos);
            setCorreoInfo(usuario.correo);
        }
    }, [external_id_entidad]);  
    

    const obtenerFechaFormateada = (fechaString) => {
        const fecha = new Date(fechaString);
        fecha.setDate(fecha.getDate() + 1);
        const year = fecha.getFullYear();
        const month = ('0' + (fecha.getMonth() + 1)).slice(-2);
        const day = ('0' + fecha.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    };

    return (
        <div>
            <MenuBar />
            <div className='container-fluid'>
                <div className='contenedor-centro '>
                    <div className="contenedor-carta">
                        <div className="row gutters-sm">
                            <div className="col-md-4 mb-3">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="d-flex flex-column align-items-center text-center">
                                            <img
                                                src={entidadInfo?.foto ? `${URLBASE}/images/users/${entidadInfo.foto}` : '/img/logo512.png'}
                                                alt="FotoEntidad"
                                                className="img-fluid"
                                                style={{
                                                    width: '100%',
                                                    height: 'auto',
                                                    maxWidth: '300px',
                                                    maxHeight: '300px',
                                                    objectFit: 'cover',
                                                    borderRadius: '0.2rem'
                                                }}
                                            />
                                            <div className="mt-3">
                                                <h4 style={{ fontWeight: 'bold' }}>{nombreUsuario}</h4>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="card mt-3">
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                            <h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-globe mr-2 icon-inline"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>Proyecto de Software Security</h6>
                                        </li>
                                        {entidadInfo?.external_id === getUser()?.external_id && (  // Condición para mostrar el botón solo si los IDs coinciden
                                            <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                                <button
                                                    className="btn btn-link p-0"
                                                    onClick={() => navigate('/cambio/clave')}
                                                    style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold', border: 'none', background: 'none' }}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="feather feather-key mr-2 icon-inline"
                                                    >
                                                        <circle cx="12" cy="12" r="10"></circle>
                                                        <line x1="2" y1="12" x2="22" y2="12"></line>
                                                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                                    </svg>
                                                    Cambiar Clave
                                                </button>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                            <div className="col-md-8" style={{ marginTop: '85px' }}>
                                <div className="card-body p-4">
                                    <h6 style={{ fontWeight: 'bold' }}>Información personal</h6>
                                    <hr className="mt-0 mb-4" />
                                    <div className="row pt-1">
                                        <div className="col-6 mb-3">
                                            <h6>Correo electrónico</h6>
                                            <p className="text-muted">{correoInfo}</p>
                                        </div>
                                        <div className="col-6 mb-3">
                                            <h6>Fecha de nacimiento</h6>
                                            <p className="text-muted">{obtenerFechaFormateada(entidadInfo?.fecha_nacimiento)}</p>
                                        </div>
                                    </div>
                                    <hr className="mt-0 mb-4" />
                                    <div className="row pt-1">
                                        <div className="col-6 mb-3">
                                            <h6>Número de contacto</h6>
                                            <p className="text-muted">{entidadInfo?.telefono}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Perfil;

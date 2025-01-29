import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/style.css';
import { GuardarImages } from '../utilities/hooks/Conexion';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { borrarSesion, getToken } from '../utilities/Sessionutil';
import { mensajes } from '../utilities/Mensajes';
import swal from 'sweetalert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const Registrar = () => {
    const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(null);
    const [uploadedPhoto, setUploadedPhoto] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [horasDiarias, setHorasDiarias] = useState(2);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        setPasswordMatch(confirmPassword === watch('clave'));
    }, [confirmPassword, watch('clave')]);

    const onSubmit = data => {
        if (!passwordMatch) {
            mensajes('Las contraseñas no coinciden', 'error', 'Error');
            return;
        }
        const formData = new FormData();
        formData.append('nombres', data.nombres.toUpperCase());
        formData.append('apellidos', data.apellidos.toUpperCase());
        formData.append('correo', data.correo);
        formData.append('fecha_nacimiento', data.fecha_nacimiento);
        formData.append('telefono', data.telefono);
        formData.append('clave', data.clave);
        formData.append('peticion', data.peticion);
        formData.append('horasDisponibles', horasDiarias);
        if (data.foto && data.foto.length > 0) {
            formData.append('foto', data.foto[0]);
        } else {
            const defaultPhotoUrl = `${process.env.PUBLIC_URL}/img/USUARIO_ICONO.png`;
            formData.append('foto', defaultPhotoUrl);
        }

        GuardarImages(formData, getToken(), "/entidad/guardar").then(info => {
            if (info.code !== 200) {
                mensajes(info.msg, 'error', 'Error');
                borrarSesion();
            } else {
                mensajes(info.msg);
                navigate('/login')
            }
        });
    };

    const handleCancelClick = () => {
        swal({
            title: "¿Está seguro de cancelar el registro?",
            text: "Una vez cancelado, no podrá revertir esta acción",
            icon: "warning",
            buttons: ["No", "Sí"],
            dangerMode: true,
        }).then((willCancel) => {
            if (willCancel) {
                mensajes("Registro cancelado", "info", "Información");
                navigate('/login')
            }
        });
    };

    const handlePhotoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setUploadedPhoto(file);
        }
    };

    const handleRemovePhoto = () => {
        setUploadedPhoto(null);
        setValue("foto", null);
    };

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    return (
        <div className="container-fluid custom-container-register">
            <div className="register-container">
                <div className="text-center mb-4" >
                    <img src="/logo192.png" alt="RunQA" style={{ width: '150px' }} />
                </div>
                <h2 className="text-center mb-4 titulo-primario">RunQA</h2>
                <form className="row g-3 p-2" onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                    <div className="col-md-6">
                        <label htmlFor="nombres" className="form-label d-flex align-items-center">
                            Ingrese sus nombres *
                            <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Este campo debe llenarse con mayúsculas</Tooltip>}
                            >
                                <FontAwesomeIcon icon={faQuestionCircle} className="ms-2 text-info" />
                            </OverlayTrigger>
                        </label>
                        <input
                            type="text"
                            {...register("nombres", {
                                required: {
                                    value: true,
                                    message: "Ingrese sus nombres"
                                },
                                pattern: {
                                    value: /^(?!\s*$)[a-zA-Z\s]+$/,
                                    message: "Ingrese un nombre correcto"
                                }
                            })}
                            className="form-control"
                        />
                        {errors.nombres && <span className='mensajeerror'>{errors.nombres.message}</span>}
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="apellidos" className="form-label d-flex align-items-center">
                            Ingrese sus apellidos *
                            <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Este campo debe llenarse con mayúsculas</Tooltip>}
                            >
                                <FontAwesomeIcon icon={faQuestionCircle} className="ms-2 text-info" />
                            </OverlayTrigger>
                        </label>
                        <input
                            type="text"
                            {...register("apellidos", {
                                required: {
                                    value: true,
                                    message: "Ingrese sus apellidos"
                                },
                                pattern: {
                                    value: /^(?!\s*$)[a-zA-Z\s]+$/,
                                    message: "Ingrese un apellido correcto"
                                }
                            })}
                            className="form-control"
                        />
                        {errors.apellidos && <span className='mensajeerror'>{errors.apellidos.message}</span>}
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="fecha_nacimiento" className="form-label">Ingrese su fecha de nacimiento*</label>
                        <input type="date"
                            {...register("fecha_nacimiento", {
                                required: {
                                    value: true,
                                    message: "Ingrese su fecha de nacimiento"
                                },
                                validate: (value) => {
                                    const fechaNacimiento = new Date(value);
                                    const fechaActual = new Date();
                                    const edad =
                                        fechaActual.getFullYear() - fechaNacimiento.getFullYear();
                                    return edad >= 16 || "Debe ser mayor de 16 años"
                                }
                            })}
                            className="form-control"
                        />
                        {errors.fecha_nacimiento && <span className='mensajeerror'>{errors.fecha_nacimiento.message}</span>}
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="telefono" className="form-label d-flex align-items-center">Ingrese su telefono *</label>
                        <input type="text"
                            {...register("telefono", {
                                required: {
                                    value: true,
                                    message: "Ingrese su telefono"
                                },
                                pattern: {
                                    value: /^[0-9]+$/,
                                    message: "Ingrese su telefono correctamente"
                                },
                                minLength: {
                                    value: 5,
                                    message: "El teléfono debe tener mínimo 5 caracteres"
                                },
                                maxLength: {
                                    value: 10,
                                    message: "El teléfono debe tener máximo 10 caracteres"
                                }
                            })}
                            className="form-control"
                        />
                        {errors.telefono && <span className='mensajeerror'>{errors.telefono.message}</span>}
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="foto" className="form-label d-flex align-items-center">Foto</label>
                        <input
                            type="file"
                            {...register("foto")}
                            onChange={handlePhotoChange}
                            className="form-control"
                            accept="image/*"
                        />
                        {uploadedPhoto && (
                            <div className="d-flex align-items-center mt-3 justify-content-center">
                                <button
                                    type="button"
                                    className="btn btn-info btn-sm me-2 btn-mini"
                                    onClick={toggleModal}
                                >
                                    <FontAwesomeIcon icon={faEye} /> Previsualizar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger btn-sm btn-mini"
                                    onClick={handleRemovePhoto}
                                >
                                    <FontAwesomeIcon icon={faTrash} /> Eliminar foto
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Modal de Previsualización */}
                    {showModal && (
                        <div className="modal show" tabIndex="-1" style={{ display: 'block' }}>
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title titulo-secundario">Previsualización de la Foto</h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={toggleModal}
                                            aria-label="Close"
                                        ></button>
                                    </div>
                                    <div className="modal-body text-center">
                                        <img
                                            src={URL.createObjectURL(uploadedPhoto)}
                                            alt="Vista previa"
                                            className="img-fluid"
                                            style={{ maxWidth: '100%' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="col-md-6">
                        <label htmlFor="correo" className="form-label d-flex align-items-center">
                            Ingrese su correo electrónico *
                        </label>
                        <input
                            type="text"
                            {...register("correo", {
                                required: {
                                    value: true,
                                    message: "Ingrese un correo"
                                },
                                validate: {
                                    isEmail: (value) => {
                                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                        return emailRegex.test(value) || "Ingrese un correo válido";
                                    },
                                    isInstitutionalEmail: (value) => {
                                        const institutionalEmailRegex = /^[a-zA-Z0-9._%+-]+@unl\.edu\.ec$/;
                                        return institutionalEmailRegex.test(value) || "Ingrese un correo válido institucional UNL (@unl.edu.ec)";
                                    }
                                }
                            })}
                            className="form-control"
                        />
                        {errors.correo && <span className="mensajeerror">{errors.correo.message}</span>}
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="clave" className="form-label d-flex align-items-center">Ingrese su clave *</label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("clave", {
                                    required: {
                                        value: true,
                                        message: "Ingrese una clave"
                                    },
                                    minLength: {
                                        value: 5,
                                        message: "La contraseña debe tener al menos 5 caracteres"
                                    },
                                    pattern: {
                                        value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=[\]{}|\\:";'?/.,`~]+$/,
                                        message: "La clave debe contener al menos una letra, un número y puede incluir caracteres especiales, excepto < y >"
                                    }

                                })}
                                className="form-control"
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <i className="bi bi-eye-fill"></i> : <i className="bi bi-eye-slash-fill"></i>}
                            </button>
                        </div>
                        {errors.clave && <span className='mensajeerror'>{errors.clave.message}</span>}
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="confirmPassword" className="form-label d-flex align-items-center">Confirme su clave *</label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="form-control"
                            />
                            <span className="input-group-text">
                                {passwordMatch === null ? '' : passwordMatch ? <i class="bi bi-check2"></i> : <i class="bi bi-x-lg"></i>}
                            </span>
                        </div>
                        {confirmPassword && !passwordMatch && (
                            <span className='mensajeerror'>Las claves no coinciden</span>
                        )}
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="horasDiarias" className="form-label d-flex align-items-center">
                            Horas diarias a trabajar*
                            <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Este campo debe contener un número entre 2 y 12</Tooltip>}
                            >
                                <FontAwesomeIcon icon={faQuestionCircle} className="ms-2 text-info" />
                            </OverlayTrigger>
                        </label>
                        <input
                            type="number"
                            id="horasDiarias"
                            value={horasDiarias}
                            onChange={(e) => setHorasDiarias(Number(e.target.value))}
                            min="2"
                            max="12"
                            className="form-control"
                        />
                        {horasDiarias < 2 || horasDiarias > 12 ? (
                            <span className="mensajeerror">Debe ingresar un valor entre 2 y 12</span>
                        ) : null}
                    </div>
                    <div className="registro-row">
                        <div className="registro-col">
                            <label className="form-label d-flex align-items-center" htmlFor="peticion">Petición *</label>
                            <div className="input-group">
                                <textarea
                                    className="registro-input registro-peticion input-group-text form-control"
                                    name='peticion'
                                    id="peticion"
                                    placeholder="Petición..."
                                    {...register("peticion", {
                                        required: {
                                            value: true,
                                            message: "Petición es requerida"
                                        },
                                        maxLength: {
                                            value: 300,
                                            message: "Este campo debe tener un máximo de 300 caracteres"
                                        }
                                    })}
                                    style={{ width: '100%' }}
                                />
                            </div>
                            {errors.peticion && <span className="mensajeerror">{errors.peticion.message}</span>}
                        </div>
                    </div>
                    <div className="contenedor-filo">
                        <button type="button" onClick={handleCancelClick} className="btn-negativo">Cancelar</button>
                        <button type="submit" className="btn-positivo">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Registrar;

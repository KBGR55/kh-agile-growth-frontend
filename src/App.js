import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './fragment/Login';
import Registrar from './fragment/Registrar';
import Perfil from './fragment/Perfil';
import VerPeticion from './fragment/VerPeticion';
import VerPeticionesClave from './fragment/VerPeticionesClave';
import Principal from './fragment/Principal';
import OlvidoClave from './fragment/OlvidoClave';
import CambioClave from './fragment/CambioClave';
import { getToken } from './utilities/Sessionutil';
import ListaUsuarios from './fragment/ListaUsuarios';
import ListaProyectos from './fragment/ListaProyectos';
import Checklist from './fragment/CheckList';
import PresentacionProyecto from './fragment/PresentacionProyecto';
import UsuarioProyecto from './fragment/UsuarioProyecto';
import Panel from './fragment/Panel';
import TerminarProyecto from './fragment/TerminarProyecto';
import Resultados from './fragment/Resultados';

function App() {
  const MiddewareSesion = ({ children }) => {
    const autenticado = getToken();
    if (autenticado) {
      return children;
    } else {
      return <Navigate to="/login" />;
    }
  };

  return (
    <div className="App">
      <Routes>        
        <Route path='*' element={<Navigate to='/login' />} />  
        <Route path='/' element={<Principal />} />
        <Route path='/login' element={<Login />} />
        <Route path='/presentacion/:external_id' element={<PresentacionProyecto />} />
        <Route path='/proyecto/panel/:external_id_proyecto' element={<MiddewareSesion><Panel/></MiddewareSesion>} />
        <Route path='/proyecto/usuarios/:external_id_proyecto' element={<MiddewareSesion><UsuarioProyecto /></MiddewareSesion>} />
        <Route path='/proyecto/terminar/:external_id_proyecto' element={<MiddewareSesion><TerminarProyecto/></MiddewareSesion>} />
        <Route path='/checklist' element={<Checklist />} />
        <Route path='/checklist/:external_id' element={<Checklist />} />
        <Route path='/registrarse' element={<Registrar />} />
        <Route path='/olvidar/clave' element={<OlvidoClave />} />
        <Route path='/cambio/clave/restablecer/:external_id/:token' element={<CambioClave />} />
        <Route path='/proyectos' element={<ListaProyectos />} />
        <Route path='/usuarios' element={<MiddewareSesion><ListaUsuarios /></MiddewareSesion>} />
        <Route path='/peticiones/registro' element={<MiddewareSesion><VerPeticion /></MiddewareSesion>} />
        <Route path='/peticiones/clave' element={<MiddewareSesion><VerPeticionesClave /></MiddewareSesion>} />
        <Route path='/perfil' element={<MiddewareSesion><Perfil /></MiddewareSesion>} />
        <Route path='/cambio/clave' element={<MiddewareSesion><CambioClave /></MiddewareSesion>} />
        <Route path="/resultados/:external_id" element={<Resultados />} />
      </Routes>
    </div>
  );
}

export default App;

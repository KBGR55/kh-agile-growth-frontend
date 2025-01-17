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
        <Route path='/checklist' element={<Checklist />} />
        <Route path='/registrarse' element={<Registrar />} />
        <Route path='/olvidar/clave' element={<OlvidoClave />} />
        <Route path='/cambio/clave/restablecer/:external_id/:token' element={<CambioClave />} />
        <Route path='/proyectos' element={<ListaProyectos />} />
        <Route path='/usuarios' element={<MiddewareSesion><ListaUsuarios /></MiddewareSesion>} />
        <Route path='/peticiones/registro' element={<MiddewareSesion><VerPeticion /></MiddewareSesion>} />
        <Route path='/peticiones/clave' element={<MiddewareSesion><VerPeticionesClave /></MiddewareSesion>} />
        <Route path='/perfil' element={<MiddewareSesion><Perfil /></MiddewareSesion>} />
        <Route path='/cambio/clave' element={<MiddewareSesion><CambioClave /></MiddewareSesion>} />
      </Routes>
    </div>
  );
}

export default App;

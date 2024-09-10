import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Crear la raíz para renderizar la aplicación principal
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Definir un componente adicional
// const Li = ({children, estado, casa, edad }) => {
//   console.log(casa, edad);
//   return (
//     <li>{children} estoy { estado}</li>
//   );
// };

// const X = () => (
//   <ul>
//     <Li estado={'feliz'} casa={false} edad={24}>
//       Chanchito 
//     </Li>
//     <Li estado={'triste'}>Chanchito</Li>
//     <Li estado={'emocionado'}>Felipe</Li>
//   </ul>
// );

// Renderizar el componente adicional usando la misma raíz
root.render(
  <React.StrictMode>
    <div>
      <App />
    </div>
  </React.StrictMode>
);

// Para medir el rendimiento en tu aplicación
reportWebVitals();




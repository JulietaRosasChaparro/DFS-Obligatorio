import { Link } from 'react-router-dom'

const NoEncontrado = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      textAlign: 'center'
    }}>
      <h1>404 - Página no encontrada</h1>
      <p>La página que buscas no existe.</p>
      <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>
        Volver al inicio
      </Link>
    </div>
  )
}

export default NoEncontrado
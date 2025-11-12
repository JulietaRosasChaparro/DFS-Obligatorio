import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './layout/DashboardLayout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/responsive.css';
import NoEncontrado from './componentes/NoEncontrado';
import { Provider } from 'react-redux';
import store from './store/store';
import ProtectedRoute from './componentes/ProtectedRoute';

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas*/}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rutas protegidas*/}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
            </Route>
          </Route>
          
          {/* Ruta 404 */}
          <Route path="*" element={<NoEncontrado />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
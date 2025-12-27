import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from './routes/AppRoutes'
import './App.css'

function App() {

  return <>
    <div className="background-container">
      <div className="glow-lines"></div>
      <div className="grid-pattern"></div>
    </div>

    <div className="position-relative" style={{ zIndex: 1 }}>
      <AppRoutes />
    </div>
    <ToastContainer position="top-right" autoClose={5000} />
  </>
}

export default App



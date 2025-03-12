import RoutesComponent from "./routes";
import "./index.css";
import Sidebar from "./components/Sidebar";
import { useAuth } from "./context/AuthContext";


const App = () => {
  const { user } = useAuth();

  return (
  <div className="bg-gray-100 h-screen flex overflow-hidden">
    {user && <Sidebar />} 
    <div className="flex-1 p-6">
      <RoutesComponent />
      </div>
  </div>

  );
};


export default App;


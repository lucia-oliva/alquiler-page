import {Routes, Route} from "react-router-dom";
import Register from "./pages/register";
import {AuthProvider} from "./utils/useAuth";
import { LoginPage } from "./pages/login";
import { Secret } from "./pages/secret";
import { ProtectedRoute } from "./utils/ProtectedRoute";


function App(){
    return(
        <AuthProvider>
        <Routes>
            <Route path="/register" element={<Register/>}/>
            <Route path="/login" element={<LoginPage/>}/>

            <Route path="/secret" element={<ProtectedRoute> <Secret/> </ProtectedRoute>}/>

        </Routes>
        </AuthProvider>
    );
}

export default App;
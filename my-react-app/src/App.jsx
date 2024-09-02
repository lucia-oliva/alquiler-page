import {Routes, Route} from "react-router-dom";
import Register from "./register";
import {AuthProvider} from "./useAuth";
import { LoginPage } from "./login";
import { Secret } from "./secret";
import { ProtectedRoute } from "./ProtectedRoute";


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
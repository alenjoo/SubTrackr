import React from 'react';
import UserRegister from './components/UserReg/UserReg';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import UserLogin from './components/UserReg/UserLog';
import AdminPlans from './components/Admin/admin-home';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<UserRegister />}/>
                <Route path="/login" element={<UserLogin />}/>
                <Route path="/admin" element={<AdminPlans />}/>
                

            </Routes>
            
         </Router>
        
    )
}
export default App;

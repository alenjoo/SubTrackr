import React from 'react';
import UserRegister from './components/UserReg/UserReg';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import UserLogin from './components/UserReg/UserLog';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<UserRegister />}/>
                <Route path="/login" element={<UserLogin />}/>
                

            </Routes>
            
         </Router>
        
    )
}
export default App;

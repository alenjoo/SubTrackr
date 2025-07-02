import React from 'react';
import UserRegister from './components/UserReg/UserReg';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<UserRegister />}/>
                

            </Routes>
            
         </Router>
        
    )
}
export default App;

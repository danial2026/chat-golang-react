import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import DarkHeader from './header';

import ChatRoomsPage from './chat/listrooms';
import RoomPage from './chat/room';
import LoginPage from './auth/login';
import LogoutPage from './auth/logout';

function App() {
  return (
    <div className="App">
      <nav>
        <DarkHeader />
      </nav>

      <Router>
        <Routes>
          <Route path='/' element={ <ChatRoomsPage /> } />
          <Route path='/rooms' element={ <ChatRoomsPage /> } />
          <Route path='/room' element={ <RoomPage /> } />
          <Route path='/login' element={ <LoginPage /> } />
          <Route path='/logout' element={ <LogoutPage /> } />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

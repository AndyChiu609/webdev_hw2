//import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css"

import HeadBar from "./component/HeadBar";
import MainComponent from "./component/MainComponent"; // 確保這個路徑是正確的
import PlaylistCardContent from "./component/PlaylistCardContent"; // 記得導入新的組件

function App() {
  return (
    <Router>
      <HeadBar />
      <Routes>
        <Route path="/playlist/:id" element={<PlaylistCardContent />} />
        <Route path="/" element={<MainComponent />} />
      </Routes>
    </Router>
  );
}

export default App;

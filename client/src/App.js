import {Routes, Route } from 'react-router-dom'
import "./App.css"
import Home from "./page/home"
import Blog from './page/Blog';
function App() {
  
  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/Blog/:id' element={<Blog/>}/>
    </Routes>
  );
}

export default App;

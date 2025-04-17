import { Routes, Route } from 'react-router-dom'
import "./App.css"
import Home from "./page/home"
import Blog from './page/Blog';
import AddPost from './page/AddPost';
import EditPost from './page/EditPost';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/blog/:id' element={<Blog />} />
      <Route path='/add-post' element={<AddPost />} />
      <Route path='/edit-post/:id' element={<EditPost />} />
    </Routes>
  );
}

export default App;
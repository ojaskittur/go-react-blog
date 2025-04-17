import axios from 'axios';
import { useEffect, useState } from "react";
import { Col, Container, Row, Button } from "react-bootstrap"
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const [apiData, setApiData] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState({ loading: false, error: null });
  const navigate = useNavigate();
  
  const fetchData = async () => {
    try {
      const apiUrl = "http://localhost:8000";
      const response = await axios.get(apiUrl);
      if (response.status === 200) {
        setApiData(response?.data.blog_records);
      }
    } catch (error) {
      console.log(error.response);
    }
  };
  
  useEffect(() => {
    fetchData();
    return () => { };
  }, []);
  
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setDeleteStatus({ loading: true, error: null });
      try {
        const apiUrl = `http://localhost:8000/${id}`;
        const response = await axios.delete(apiUrl);
        
        if (response.status === 200) {
          // Refresh the data after successful deletion
          fetchData();
        }
      } catch (error) {
        console.error("Error deleting post:", error);
        setDeleteStatus({ 
          loading: false, 
          error: "Failed to delete post. Please try again." 
        });
      } finally {
        setDeleteStatus({ loading: false, error: null });
      }
    }
  };
  
  return (
    <Container>
      <Row>
        <Col xs='12' className="py-2">
          <h1 className="text-center">React application with Go Fiber backend</h1>
        </Col>
        <Col xs='12' className="text-end mb-3">
          <Link to="/add-post">
            <Button variant="primary">Add New Post</Button>
          </Link>
        </Col>
        
        {deleteStatus.error && (
          <Col xs='12'>
            <div className="alert alert-danger">{deleteStatus.error}</div>
          </Col>
        )}
        
        {apiData && (
          apiData.map((record, index) => (
            <Col key={index} xs="4" className="py-5 box">
              <div className="title">
                <Link to={`blog/${record.id}`}>{record.title}</Link>
              </div>
              <div className="mb-3">{record.post}</div>
              <div className="d-flex justify-content-between gap-2">
                <Link to={`blog/${record.id}`}>
                  <Button variant="info" size="sm">View</Button>
                </Link>
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={() => navigate(`/edit-post/${record.id}`)}
                >
                  Edit
                </Button>
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={() => handleDelete(record.id)}
                  disabled={deleteStatus.loading}
                >
                  {deleteStatus.loading ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default Home;
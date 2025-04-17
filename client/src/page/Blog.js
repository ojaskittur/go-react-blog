import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Col, Row, Container, Button } from 'react-bootstrap';
import { useParams, useNavigate } from "react-router-dom";

const Blog = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [apiData, setApiData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [deleteStatus, setDeleteStatus] = useState({ loading: false, error: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `http://localhost:8000/${params.id}`;
        const response = await axios.get(apiUrl);
        if (response.status === 200) {
          setApiData(response?.data?.record);
        }
      } catch (error) {
        console.log(error.response);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    return () => { };
  }, [params.id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setDeleteStatus({ loading: true, error: null });
      try {
        const apiUrl = `http://localhost:8000/${params.id}`;
        const response = await axios.delete(apiUrl);
        
        if (response.status === 200) {
          // Redirect to home page after successful deletion
          navigate('/');
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

  if (isLoading) {
    return (
      <Container>
        <Row>
          <Col xs='12' className="py-3 text-center">
            Loading post...
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      <Row>
        <Col xs='12' className="py-3">
          <h1>{apiData.title}</h1>
        </Col>
        
        {deleteStatus.error && (
          <Col xs='12'>
            <div className="alert alert-danger">{deleteStatus.error}</div>
          </Col>
        )}
        
        <Col xs='12' className="mb-4">
          <p>{apiData.post}</p>
        </Col>
        
        <Col xs='12' className="d-flex gap-2">
          <Button 
            variant="secondary" 
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
          <Button 
            variant="primary" 
            onClick={() => navigate(`/edit-post/${params.id}`)}
          >
            Edit Post
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDelete}
            disabled={deleteStatus.loading}
          >
            {deleteStatus.loading ? 'Deleting...' : 'Delete Post'}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Blog;
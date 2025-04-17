import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Col, Row, Container, Button, Spinner, Navbar } from 'react-bootstrap';
import { useParams, useNavigate, Link } from "react-router-dom";
import '../App.css';
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

  // Format date function (you'll need to ensure your API returns a date)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <>
      <Navbar className="app-navbar">
        <Container>
          <Link to="/">
            <Navbar.Brand>Blog Explorer</Navbar.Brand>
          </Link>
          <Link to="/add-post">
            <Button variant="primary">Create New Post</Button>
          </Link>
        </Container>
      </Navbar>

      <Container>
        {isLoading ? (
          <Row className="justify-content-center">
            <Col xs="12" className="loading-spinner">
              <Spinner animation="border" role="status" variant="light">
                <span className="visually-hidden">Loading post...</span>
              </Spinner>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col xs="12" lg={{ span: 8, offset: 2 }}>
              {deleteStatus.error && (
                <div className="alert alert-danger mb-4">{deleteStatus.error}</div>
              )}

              <div className="mb-4 d-flex justify-content-between align-items-center">
                <Button
                  variant="secondary"
                  onClick={() => navigate('/')}
                >
                  <i className="bi bi-arrow-left me-2"></i> Back
                </Button>
                <div>
                  <Button
                    variant="primary"
                    className="me-2"
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
                </div>
              </div>

              <article>
                <h1 className="mb-4">{apiData.title}</h1>
                
                {apiData.created_at && (
                  <div className="text-secondary mb-4">
                    Published on {formatDate(apiData.created_at)}
                  </div>
                )}

                {apiData.image_path && (
                  <div className="image-preview mb-4">
                    <img
                      src={`http://localhost:8000${apiData.image_path}`}
                      alt={apiData.title}
                      style={{ width: '100%', borderRadius: 'var(--border-radius)' }}
                    />
                  </div>
                )}
                
                <div className="blog-content">
                  {apiData.post.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </article>
            </Col>
          </Row>
        )}
        
        <footer className="app-footer">
          <p>© {new Date().getFullYear()} Blog Explorer • Built with React & Go Fiber</p>
        </footer>
      </Container>
    </>
  );
};

export default Blog;
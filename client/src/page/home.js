import axios from 'axios';
import { useEffect, useState } from "react";
import { Col, Container, Row, Button } from "react-bootstrap"
import { Link } from 'react-router-dom';

const Home = () => {
  const [apiData, setApiData] = useState(false)
  
  useEffect(() => {
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
    fetchData();
    return () => { };
  }, []);
  
  console.log(apiData);
  
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
        {apiData && (
          apiData.map((record, index) => (
            <Col key={index} xs="4" className="py-5 box">
              <div className="title">
                <Link to={`blog/${record.id}`}>{record.title}</Link>
              </div>
              <div>{record.post}</div>
            </Col>
          ))
        )}
      </Row>
    </Container>
  )
}

export default Home;
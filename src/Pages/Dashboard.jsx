import { Container, Row, Col } from "react-bootstrap";

import Announcements from "../components/dashboardComponents/Announcements";
import CourseCard from "../components/dashboardComponents/CourseCard";
import PlantStatus from "../components/dashboardComponents/PlantStatus";
import Todo from "../components/dashboardComponents/ToDo";
import { useUser } from "../components/provider/useUser";



const Dashboard = () => {
  const { user } = useUser();

  return (
    <Container>
      <Row>
        <Col lg={8}>
      {/* TODO: this HI can be positioned somewhere else */}
          <h1>Dashboard {`(Hi, ${user})`}</h1>
          <hr />
          <CourseCard />
        </Col>
        <Col>
          <Todo />
        </Col>
      </Row>
      <Row style={{ marginTop: 20 }}>
        <Col lg={8}>
          <PlantStatus />
        </Col>
        <Col>
          <Announcements />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;

import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { ListGroup, Container, Row, Col } from "react-bootstrap";

import { getData } from "../../scripts/jsonHelpers";
import { useUser } from "../provider/useUser";

const Grades = ({ courseID }) => {
  const { user } = useUser();
  const [thisUsersGrades, setThisUsersGrades] = useState(null);
  const [assignmentsGrade, setAssignmentsGrade] = useState(null);
  const [participationGrade, setParticipationGrade] = useState(null);
  const [projectsGrade, setProjectsGrade] = useState(null);
  const [examGrade, setExamGrade] = useState(null);
  const [courseGrade, setCourseGrade] = useState(null);
  const [gardenPic, setGardenPic] = useState();

  useEffect(() => {
    async function getUserData() {
      if (user) {
        const names = user.split(" ");
        const firstName = names[0];
        const lastName = names[1];
        const userData = await getData(
          `http://localhost:3030/students?name=${firstName}+${lastName}`
        );

        setGardenPic(userData[0].currentGardenImage);
      }
    }

    getUserData();
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const names = user.split(" ");
        const firstName = names[0];
        const lastName = names[1];
        const allGradesData = await getData(
          `http://localhost:3030/students?name=${firstName}+${lastName}`
        );

        setThisUsersGrades(
          allGradesData[0].courses.find((course) => course.key === courseID)
            .tabs.grades
        );
      }
    };

    fetchData();

    const calculateSectionGrade = (arrayOfGrades) => {
      let earnedPoints = 0;
      let totalPoints = 0;
      let nullValues = 0;

      arrayOfGrades.forEach((grade) => {
        totalPoints += grade.totalPoints;
        if (grade.pointsObtained !== null) {
          earnedPoints += grade.pointsObtained;
        } else {
          nullValues++;
        }
      });

      return {
        // If all of the assignments for the section are ungraded, return null for the earnedPoints
        // We don't want the ungraded assignments hurting the user's grades
        earnedPoints: nullValues === arrayOfGrades.length ? null : earnedPoints,
        totalPoints: totalPoints,
      };
    };

    // Calculate the grades for each section of the course
    if (thisUsersGrades) {
      // Get the total Assignments grade
      if (thisUsersGrades.assignments) {
        setAssignmentsGrade(calculateSectionGrade(thisUsersGrades.assignments));
      }
      // Get the total Participation grade
      if (thisUsersGrades.participation) {
        setParticipationGrade(
          calculateSectionGrade(thisUsersGrades.participation)
        );
      }
      // Get the total Projects grade
      if (thisUsersGrades.projects) {
        setProjectsGrade(calculateSectionGrade(thisUsersGrades.projects));
      }
      // Get the total Exam grade
      if (thisUsersGrades.exam) {
        setExamGrade(calculateSectionGrade(thisUsersGrades.exam));
      }
    }
  }, [user, courseID, thisUsersGrades]);

  useEffect(() => {
    const getEarnedSectionPercentOfCourse = (sectionGrade, weightage) => {
      if (sectionGrade && sectionGrade.earnedPoints !== null) {
        return {
          earnedPercent:
            (sectionGrade.earnedPoints / sectionGrade.totalPoints) * weightage,
          totalPercent: weightage,
        };
      } else {
        return {
          earnedPercent: 0,
          totalPercent: 0,
        };
      }
    };

    // Calculate the overall course grade
    const calculateOverallGrade = () => {
      const assignmentPercents = getEarnedSectionPercentOfCourse(
        assignmentsGrade,
        thisUsersGrades.assignmentWeightage
      );
      const participationPercents = getEarnedSectionPercentOfCourse(
        participationGrade,
        thisUsersGrades.participationWeightage
      );
      const projectPercents = getEarnedSectionPercentOfCourse(
        projectsGrade,
        thisUsersGrades.projectWeightage
      );
      const examPercents = getEarnedSectionPercentOfCourse(
        examGrade,
        thisUsersGrades.examWeightage
      );

      const earnedPercent =
        assignmentPercents.earnedPercent +
        participationPercents.earnedPercent +
        projectPercents.earnedPercent +
        examPercents.earnedPercent;
      const totalPercent =
        assignmentPercents.totalPercent +
        participationPercents.totalPercent +
        projectPercents.totalPercent +
        examPercents.totalPercent;

      return (earnedPercent / totalPercent) * 100;
    };
    if (user && thisUsersGrades) {
      // Get the user's grade in the course
      setCourseGrade(calculateOverallGrade());
    }
  }, [
    assignmentsGrade,
    examGrade,
    projectsGrade,
    participationGrade,
    user,
    thisUsersGrades,
  ]);

  const displaySectionDetails = (gradeType, sectionGrade) => {
    if (sectionGrade) {
      return (
        <div style={{ margin: "20px 0" }}>
          <h5 style={{ color: "grey" }}>
            {gradeType.charAt(0).toUpperCase() + gradeType.slice(1)} —
            {sectionGrade.earnedPoints === null && " Nothing graded yet"}
            {sectionGrade.earnedPoints && (
              <>
                {" "}
                {sectionGrade.earnedPoints}/{sectionGrade.totalPoints} (
                {(
                  (sectionGrade.earnedPoints / sectionGrade.totalPoints) *
                  100
                ).toFixed(2)}
                %)
              </>
            )}
          </h5>
          <ListGroup>
            {thisUsersGrades[gradeType].map((type, typeIndex) => {
              return (
                <ListGroup.Item
                  key={`type${typeIndex}`}
                  style={{ padding: "20px" }}
                >
                  <Container>
                    <Row>
                      <Col>
                        <h5>{type.title}</h5>
                        <p style={{ margin: "5px" }}>Due {type.dueDate}</p>
                      </Col>
                      <Col
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "end",
                        }}
                      >
                        <p>
                          <b>
                            {sectionGrade.earnedPoints === null &&
                              "Not yet graded"}
                          </b>
                          {sectionGrade.earnedPoints && (
                            <>
                              <b>Grade:</b> {type.pointsObtained}/
                              {type.totalPoints} (
                              {Math.round(
                                (type.pointsObtained / type.totalPoints) * 100
                              )}
                              %)
                            </>
                          )}
                        </p>
                      </Col>
                    </Row>
                  </Container>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </div>
      );
    }
  };

  return (
    <>
      {courseGrade && (
        <h3>
          <br></br>Course Grade: {courseGrade.toFixed(2)}%
        </h3>
      )}
      {user && thisUsersGrades && (
        <>
          {displaySectionDetails("assignments", assignmentsGrade)}
          {displaySectionDetails("participation", participationGrade)}
          {displaySectionDetails("projects", projectsGrade)}
          {displaySectionDetails("exam", examGrade)}
        </>
      )}
      {!user && <p>You are not currently logged in.</p>}
      {user && !thisUsersGrades && (
        <p>Sorry, no grades were found for you, {user}.</p>
      )}
      <img
        src={gardenPic}
        style={{ width: "40%", marginLeft: "auto", marginRight: "auto" }}
      ></img>
    </>
  );
};

Grades.propTypes = {
  courseID: PropTypes.string,
};

export default Grades;

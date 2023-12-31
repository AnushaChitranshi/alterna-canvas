import { List } from "antd";
import { useEffect, useState } from "react";

import CourseIcons from "../components/CourseIcons";
import { useUser } from "../components/provider/useUser";
import { getData } from "../scripts/jsonHelpers";

function ToDo() {
  const { user } = useUser();
  const [assignmentsMeta, setAssignmentsMeta] = useState([]);
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

        const courses = userData[0].courses;
        setGardenPic(userData[0].currentGardenImage);

        const assignmentsNotSubmitted = courses
          .map((course) => course.tabs.assignments.assignmentsNotSubmitted)
          .flat();

        // Sort the assignments in order of the due date
        assignmentsNotSubmitted.sort((a, b) =>
          a.dueDate > b.dueDate ? 1 : b.dueDate > a.dueDate ? -1 : 0
        );

        setAssignmentsMeta(assignmentsNotSubmitted);
      }
    }

    getUserData();
  }, [user]);

  return (
    <>
      <h2>To Do List</h2>
      <hr style={{ width: "100%" }} />
      <List
        itemLayout="horizontal"
        dataSource={assignmentsMeta}
        renderItem={(item, index) => (
          <List.Item key={index}>
            <List.Item.Meta
              avatar={CourseIcons[item.class]}
              title={
                <>
                  {item.class}: {item.name}
                </>
              }
              description={item.dueDate}
            />
          </List.Item>
        )}
      />
      <img
        src={gardenPic}
        style={{ width: "40%", marginLeft: "auto", marginRight: "auto" }}
      ></img>
    </>
  );
}

export default ToDo;

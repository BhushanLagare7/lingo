"use client";

import { Admin, Resource } from "react-admin";

import simpleRestProvider from "ra-data-simple-rest";

import { ChallengeCreate } from "./challenge/create";
import { ChallengeEdit } from "./challenge/edit";
import { ChallengeList } from "./challenge/list";
import { ChallengeOptionCreate } from "./challengeOption/create";
import { ChallengeOptionEdit } from "./challengeOption/edit";
import { ChallengeOptionList } from "./challengeOption/list";
import { CourseCreate } from "./course/create";
import { CourseEdit } from "./course/edit";
import { CourseList } from "./course/list";
import { LessonCreate } from "./lesson/create";
import { LessonEdit } from "./lesson/edit";
import { LessonList } from "./lesson/list";
import { UnitCreate } from "./unit/create";
import { UnitEdit } from "./unit/edit";
import { UnitList } from "./unit/list";

const dataProvider = simpleRestProvider("/api");

const App = () => {
  return (
    <Admin dataProvider={dataProvider}>
      <Resource
        create={CourseCreate}
        edit={CourseEdit}
        list={CourseList}
        name="courses"
        recordRepresentation="title"
      />
      <Resource
        create={UnitCreate}
        edit={UnitEdit}
        list={UnitList}
        name="units"
        recordRepresentation="title"
      />
      <Resource
        create={LessonCreate}
        edit={LessonEdit}
        list={LessonList}
        name="lessons"
        recordRepresentation="title"
      />
      <Resource
        create={ChallengeCreate}
        edit={ChallengeEdit}
        list={ChallengeList}
        name="challenges"
        recordRepresentation="question"
      />
      <Resource
        create={ChallengeOptionCreate}
        edit={ChallengeOptionEdit}
        list={ChallengeOptionList}
        name="challengeOptions"
        options={{ label: "Challenge Options" }}
        recordRepresentation="text"
      />
    </Admin>
  );
};

export default App;

import React, { useEffect, useState } from "react";
import Head from "next/head";
import { GetStaticProps, GetStaticPropsContext } from "next";
import { NextRouter, useRouter } from "next/router";
import { redirect } from "next/navigation";
import { Lesson, getLessonPlans } from "@/lib/database";
import styles from "@/styles/List.module.css";
import Button from "@mui/material/Button";
import useUser from "@/lib/useUser";
interface LessonListProps {
  lessons: Lesson[];
  undefined: boolean;
}

const GradeMapping = [
  "Pre-K",
  "Kindergarten",
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "6th",
  "7th",
  "8th",
  "9th",
  "10th",
  "11th",
  "12th",
  "College",
];

const LessonList: React.FC<LessonListProps> = (props: LessonListProps) => {
  const router = useRouter();
  const { user, mutateUser } = useUser();
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);
  if (user) {
    return (
      <>
        <Head>
          <title>Lesson Plans - SciREN</title>
          <meta name="description" content="SciREN Lesson Plan List" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.mainContainer}>
          <h1 className={styles.listTitle}>SciREN Lesson Plans - Alabama</h1>
          <LessonFragment lessons={props.lessons} />
          <Footer />
        </main>
      </>
    );
  } else {
    return (
      <>
        <h1>Loading...</h1>
      </>
    );
  }
};

const Footer: React.FC = () => {
  return (
    <>
      <div className={styles.lessonFooter}>
        <text>
          For more information on lesson plans, contact your region&apos;s
          SciREN Organization.
        </text>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const lessons: Lesson[] | undefined = await getLessonPlans().catch(
    (reason) => undefined
  );
  const notFound = !lessons;
  return { props: { lessons, notFound } };
};

const LessonCard: React.FC<Lesson> = (lesson: Lesson) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  return (
    <div>
      <div className={styles.lessonContainer}>
        <h2 className="lessonTitle">
          {lesson.title}
          {lesson.year ? " - " + lesson.year : ""}
        </h2>

        <text className={styles.authorText}>
          {lesson.authors.map((author, i) => (
            <a href={`mailto:${author.contact}`} key={author.contact}>
              {author.name}
              {i < lesson.authors.length - 1 ? ", " : ""}
            </a>
          ))}
        </text>

        <hr className={styles.divider} />
        <div
          onMouseEnter={() => setIsCollapsed(false)}
          onMouseLeave={() => setIsCollapsed(true)}
          className={`${styles.lessonAbstract} ${
            isCollapsed ? styles.lessonAbstractCollapsed : ""
          }`}
        >
          {lesson.abstract}
        </div>

        <div className={styles.gradeBox}>
          <p className={styles.categoryText}>
            Grades: {lesson.gradeLevel.map((gi) => GradeMapping[gi]).join(", ")}
          </p>
          <p className={styles.categoryText}>Subject: {lesson.subject}</p>
        </div>

        <div className={styles.linkContainer}>
          {lesson.mediaLinks[0] ? (
            <Button
              variant="contained"
              color="primary"
              className={styles.mediaLink}
              href={lesson.mediaLinks[0].href}
            >
              View PDF
            </Button>
          ) : (
            <></>
          )}
          {lesson.contentLinks[0] ? (
            <Button
              variant="contained"
              color="primary"
              className={styles.optionalLink}
              href={lesson.contentLinks[0].href}
            >
              Author Bio
            </Button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

const LessonFragment: React.FC<{
  lessons: Lesson[];
}> = (props) => {
  return (
    <>
      {
        // Wrapped in a fragment to satisfy type checks
        props.lessons.map((lesson: Lesson) => (
          <LessonCard key={lesson._id} {...lesson} />
        ))
      }
    </>
  );
};

export default LessonList;

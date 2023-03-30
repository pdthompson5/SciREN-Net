import React from "react";
import Head from "next/head";
import { GetStaticProps, GetStaticPropsContext } from "next";
import { LessonLink, Author, Lesson, getLessonPlans } from "@/lib/database";
import styles from "@/styles/List.module.css";
import Button from "@mui/material/Button";
interface LessonListProps {
  lessons: Lesson[];
  undefined: boolean;
}

const LessonList: React.FC<LessonListProps> = (props: LessonListProps) => {
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

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const lessons: Lesson[] | undefined = await getLessonPlans().catch(
    (reason) => undefined
  );
  const notFound = !lessons;
  return { props: { lessons, notFound } };
};

const LessonFragment: React.FC<{
  lessons: Lesson[];
}> = (props) => {
  return (
    <>
      {" "}
      {
        // Wrapped in a fragment to satisfy type checks
        props.lessons.map((lesson: Lesson) => (
          <React.Fragment key={lesson._id}>
            <div className={styles.lessonContainer}>
              <h2 className="lessonTitle">
                {lesson.title}
                {lesson.year ? " - " + lesson.year : ""}
              </h2>

              <text className={styles.authorText}>
                {lesson.authors.map((author: Author) => author.name).join(", ")}
              </text>

              <hr className={styles.divider} />
              {/* TODO: Expand expands the abstract  */}
              <p className={styles.lessonAbstract}>
                {lesson.abstract}
                {/* {lesson.abstract.slice(0, 200)}... Expand */}
              </p>
              <div className={styles.linkContainer}>
                {lesson.mediaLinks[0] ? (
                  <Button
                    variant="contained"
                    color="primary"
                    className={styles.mediaLink}
                    href={lesson.mediaLinks[0].href}
                  >
                    Read More
                  </Button>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </React.Fragment>
        ))
      }{" "}
    </>
  );
};

export default LessonList;

import React from "react";
import Head from "next/head";
import { GetStaticProps, GetStaticPropsContext } from "next";
import { LessonLink, Author, Lesson, getLessonPlans } from "@/lib/database";
import styles from "@/styles/List.module.css";

const LessonList: React.FC<Lesson[]> = (props: Lesson[]) => {
  return (
    <>
      <Head>
        <title>Lesson Plans - SciREN</title>
        <meta name="description" content="SciREN Lesson Plan List" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <LessonFragment lessons={[]} />
      </main>
    </>
  );
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const lessons = await getLessonPlans().catch((reason) => undefined);
  const notFound = !lessons;
  return { props: { notFound } };
};

const LessonFragment: React.FC<{
  lessons: Lesson[];
}> = (props) => {
  return (
    <>
      {" "}
      {
        // Wrapped in a fragment to satisfy type checks
        props.lessons.map((chp: Lesson) => (
          <React.Fragment key={chp._id}>
            <div className={styles.lessonContainer}>
              <h2 className="lessonTitle">{chp.title}</h2>
            </div>
          </React.Fragment>
        ))
      }{" "}
    </>
  );
};

export default LessonList;

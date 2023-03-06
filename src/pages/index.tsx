import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import logo from '../../public/cropped-SciREN-Pen-W.png'
import { useRef } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const abt = useRef(null);
  const scrollDown = (elementRef) => {
    window.scrollTo({
      top: elementRef.current.offsetTop,
      behavior: "smooth",
    })
  }
  const scrollUp = (elementRef) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }
  return (
    <>
      <Head>
        <title>Welcome to SciREN</title>
        <meta name="description" content="Welcome" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.bggradient}>
        <div className={styles.App}>
          <div>
            <p style={{color: "white", fontSize: 200, textAlign: "center"}}>
              Welcome
            </p>
            <p style={{color: "white",fontSize: 200, textAlign: "center"}}>
              To
            </p>
            <div className={styles.center}>
              <Image
                src={logo}
                alt="SciRen Logo"
                width={1000}
                height={320}
                priority
              />
            </div>
          </div>
          <div ref={abt} className={styles.welcome}>
          </div>
  
          <div className={styles.App}>
            <ul>
              <li onClick={() => scrollDown(abt)} className={styles.link}> About Us Page</li>
            </ul>
          </div>
          <div ref={abt} className={styles.about}>
          </div>
          

          <div className={styles.App}>
            <ul>
              <li onClick={() => scrollUp(abt)} className={styles.link}> Welcome Page</li>
            </ul>
          </div>
          <div ref={abt} className={styles.welcome}>
          </div>
          <div className={styles.abouttext}>
            <p style={{color: "white", fontSize: 40, textAlign: "center", padding: 20}}>
            What is SciREN?
            </p>
            <p style={{color: "white", fontSize: 20, textAlign: "center", padding: 8}}>
            SciREN is a graduate student-led network that connects educators and researchers.  
            The strength of the network builds on the passion of educators and researchers, 
            the generosity of sponsors, and the commitment of the SciREN leadership team.  
            </p>
            <p style={{color: "white", fontSize: 40, textAlign: "center", padding: 20}}>
            Our Goals
            </p>
            <p style={{color: "white", fontSize: 20, textAlign: "center", padding: 8}}>
            Establish a lasting network of researchers and educators.
            Facilitate cooperation and collaboration between members of the network.
            Bring current research and researchers into local communities and classrooms.
            Support researchers in developing broader impacts, strengthening outreach efforts, and improving communication skills.
            </p>
            <p style={{color: "white", fontSize: 40, textAlign: "center", padding: 20}}>
            Our Approach
            </p>
            <p style={{color: "white", fontSize: 20, textAlign: "center", padding: 8}}>
            SciREN aims to achieve our goals and mission through annual networking events and lesson plan workshops. 
            The networking events bring researchers and teachers to the table for face-to-face interaction and exchange of ideas and materials. 
            The lesson plan workshops help researchers translate their work into classroom-ready exercises that meet state and national standards.
            </p>
        
          </div>
        </div>
      </main>
    </>
  )
}

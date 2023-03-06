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
      <main>
        <div className='App'>
          {/* <body style={{backgroundColor: "lightblue"}}> */}
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
          {/* </body> */}
          <div className={styles.App}>
            <ul>
              <li onClick={() => scrollDown(abt)} className={styles.link}> About us</li>
            </ul>
          </div>
          <div ref={abt} className={styles.about}>
          </div>

          <div className={styles.App}>
            <ul>
              <li onClick={() => scrollUp(abt)} className={styles.link}> Welcome</li>
            </ul>
          </div>
          <div ref={abt} className={styles.welcome}>
          </div>
          {/* <body style={{backgroundColor: "lightblue"}}> */}
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
          {/* </body> */}
        </div>
      </main>
    </>
  )
}

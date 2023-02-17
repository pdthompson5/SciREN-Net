import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Profile.module.css'

const inter = Inter({ subsets: ['cyrillic'] })

/*
Created by Stephen on 02/16/23
Skeleton of a profile page to re-learn tsx + css. 
I added some notes below for the boys for creating a simple page and 

Next.js does some fancy routing in the compilation of the website, 
making it easier to create and organize pages.

To create a new page, just add a {pagename}.tsx file under '.src/pages/' 
and create a default export like below.



*/

export default function Profile() {
  return (
    <>
      <Head>
        <title>SciREN Profile Example</title>
        <meta name="description" content="Created by Stephen Kirby" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.topbar}>
          <h1>
            YOU SHOULD NOT BE HERE.
          </h1>
        </div>
      </main>
    </>
  )
}

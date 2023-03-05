import Head from 'next/head'
import styles from '@/styles/Profile.module.css'

export default function ProfileNotFound() {
  return (
    <>
      <Head>
        <title>SciREN-Net Profile Not Found</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.topbar}>
          <h1>
            Profile not found.
          </h1>
        </div>
        <div className={styles.main}>
          <p>
            If you believe this to be a mistake, please contact your administrator.
          </p>
        </div>
      </main>
    </>
  )
}

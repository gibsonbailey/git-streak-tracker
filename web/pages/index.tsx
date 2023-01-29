import Image from 'next/image'
import styles from './index.module.css'

export const HomePage = () => (
  <>
    <div
      className={styles.container}
    >
      <h1
        className={styles.title}
      >Git Streak Tracker</h1>
    </div>
    <Image
      alt='fire'
      src='/copper.svg'
      layout='fill'
      objectFit='contain'
      className={styles.backgroundImage}
    />
  </>
)

export default HomePage
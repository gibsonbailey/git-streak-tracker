import Image from 'next/image'
import styles from './index.module.css'

export const HomePage = () => (
  <>
    <div
      className={styles.container}
    >
      <div className="mr-6">
        <h1
          className="text-3xl font-bold text-white mb-8"
        >
          Git Streak Tracker
        </h1>
        <a>
          <button className="border-white border-2 rounded-xl cursor-pointer">
            <Image
              alt='Iphone outline'
              src='/App-Store-Button.png'
              width="200"
              height="50"
            />
          </button>
        </a>
      </div>
      <div className={styles.iphoneContainer}>
        <Image
          alt='Iphone outline'
          src='/iphone-14-outline.svg'
          fill
        />
        <Image
          alt='Iphone outline'
          src='/profile-screen.png'
          width={100}
          height={100}
          priority
          unoptimized={true}
          className={styles.profileScreen}
        />
      </div>
    </div>
    <Image
      alt='fire'
      src='/copper.svg'
      fill
      className={styles.backgroundImage}
    />
  </>
)

export default HomePage
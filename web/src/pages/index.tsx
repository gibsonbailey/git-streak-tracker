import Image from 'next/image'
import Terminal from '../components/terminal'
import styles from './index.module.css'
import PhoneAnimation from '../components/PhoneAnimation/'
import Laser from '../components/Laser'
import { useEffect, useRef, useState } from 'react'

export const HomePage = () => {
  const iPhoneFrameRef = useRef<HTMLDivElement>(null)
  const [iPhoneXPosition, setiPhoneXPosition] = useState(0)

  useEffect(() => {
    setTimeout(() => {
      if (iPhoneFrameRef.current) {
        setiPhoneXPosition(iPhoneFrameRef.current.getBoundingClientRect().x)
      } else {
        console.log('no ref still in home')
      }
    }, 1000)
  }, [])

  return (
    <>
      <div className="flex h-full w-full absolute justify-center items-center z-10">
        <div className="w-1/2 flex flex-col items-end mr-40">
          <h1 className="text-3xl font-bold mb-8">Git Streak Tracker</h1>
          <Terminal />
          <a>
            <button className="mt-8 border-white border-2 rounded-xl cursor-pointer">
              <Image
                alt="Iphone outline"
                src="/App-Store-Button.png"
                width="200"
                height="50"
              />
            </button>
          </a>
        </div>
        <div className={styles.iphoneContainer}>
          <PhoneAnimation ref={iPhoneFrameRef}/>
        </div>
      </div>
      <Laser iPhoneXPosition={iPhoneXPosition} iPhoneFrameRef={iPhoneFrameRef}/>
      <Image
        alt="fire"
        src="/copper.svg"
        fill
        className="opacity-10 absolute"
      />
    </>
  )
}

export default HomePage

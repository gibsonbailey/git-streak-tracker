import Image from 'next/image'
import Terminal from '../components/terminal'
import styles from './index.module.css'
import PhoneAnimation from '../components/PhoneAnimation/'
import Laser from '../components/Laser'
import { useRef } from 'react'
import clsx from 'clsx'

export const HomePage = () => {
  const iPhoneFrameRef = useRef<HTMLDivElement>(null)
  const TerminalFrameRef = useRef<HTMLDivElement>(null)

  const laserMethodsRef = useRef(null)

  const animationFinished = () => {
    laserMethodsRef.current.triggerAnimation()
  }

  return (
    <>
      <div className="flex h-full w-full absolute justify-center items-center z-10">
        <div className="w-1/2 flex flex-col items-end mr-40">
          <h1 className="text-3xl font-bold mb-8">Git Streak Tracker</h1>
          <Terminal
            ref={TerminalFrameRef}
            animationFinished={animationFinished}
          />
          <a>
            <button className="mt-8 border-white border-2 rounded-xl cursor-pointer">
              <Image
                alt="App store button"
                src="/App-Store-Button.png"
                width="200"
                height="50"
              />
            </button>
          </a>
        </div>
        <div className={clsx('w-1/2', styles.iphoneContainer)}>
          <PhoneAnimation ref={iPhoneFrameRef} />
        </div>
      </div>
      <Laser
        ref={laserMethodsRef}
        iPhoneFrameRef={iPhoneFrameRef}
        TerminalFrameRef={TerminalFrameRef}
      />
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

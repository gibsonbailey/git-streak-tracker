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
      <div className="flex flex-col items-center">

        <h1 className="text-3xl font-bold my-8">Git Streak Tracker</h1>
        <div>
          <div className="flex relative justify-center items-center z-10">

            {/* <a>
            <button className="mt-8 border-white border-2 rounded-xl cursor-pointer">
            <Image
            alt="App store button"
            src="/App-Store-Button.png"
            width="200"
            height="50"
            />
            </button>
          </a> */}
            <div className={clsx('flex items-center')}>
              <Terminal
                ref={TerminalFrameRef}
                animationFinished={animationFinished}
              />
              <PhoneAnimation ref={iPhoneFrameRef} />
            </div>
          </div>
          
          <Laser
            ref={laserMethodsRef}
            iPhoneFrameRef={iPhoneFrameRef}
            TerminalFrameRef={TerminalFrameRef}
          />
        </div>
        <Image
          alt="fire"
          src="/copper.svg"
          fill
          className="opacity-10 absolute"
        />
      </div>

    </>
  )
}

export default HomePage

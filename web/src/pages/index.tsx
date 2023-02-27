import Image from 'next/image'
import Terminal from '../components/terminal'
import PhoneAnimation from '../components/PhoneAnimation/'
import Laser from '../components/Laser'
import { useEffect, useRef, useState } from 'react'
import Sparks from '../components/Laser/Sparks'
import styles from './index.module.css'
import clsx from 'clsx'

export const HomePage = () => {
  const iPhoneFrameRef = useRef<HTMLDivElement>(null)
  const TerminalFrameRef = useRef<HTMLDivElement>(null)
  const LaserBeamRef = useRef<HTMLDivElement>(null)

  const sparkControl = useRef<'stop' | 'run' | 'finish'>('stop')

  const [particleAnimationFinished, setParticleAnimationFinished] =
    useState(false)
  const [activateLaserBeam, setActivateLaserBeam] = useState(false)

  const startTimeDelay = 800

  const animationFinished = () => {
    setTimeout(() => {
      setActivateLaserBeam(true)
    }, startTimeDelay - 150)

    setTimeout(() => {
      sparkControl.current = 'run'
    }, startTimeDelay)

    setTimeout(() => {
      sparkControl.current = 'finish'
    }, startTimeDelay + 1800)

    setTimeout(() => {
      setParticleAnimationFinished(true)
    }, startTimeDelay + 6000)
  }

  return (
    <>
      <div className="flex h-full w-full flex-col justify-center items-center mt-6 sm:mt-0">
        <h1 className="text-3xl font-bold my-8 hidden sm:block">
          Git Streak Tracker
        </h1>
        <div className="w-full sm:w-auto">
          <div className="flex justify-center items-center relative z-20">
            <div className="flex flex-col md:flex-row items-center justify-center w-full">
              <div className="flex flex-col items-center sm:items-end w-full sm:w-auto">
                <Terminal
                  ref={TerminalFrameRef}
                  animationFinished={animationFinished}
                />
              </div>
              <Laser ref={LaserBeamRef} activateBeam={activateLaserBeam} />
              <PhoneAnimation ref={iPhoneFrameRef} />
            </div>
          </div>
        </div>

        <div className="absolute top-4 right-4 z-50 hidden sm:flex">
          <div className="mr-4">
            <GitHubButton />
          </div>
          <div className="">
            <AppStoreButton />
          </div>
        </div>

        <Image
          alt="fire"
          src="/copper.svg"
          fill
          className="opacity-10 absolute z-10"
        />

        <div className="sm:hidden flex mt-10 pb-5">
          <div className="mr-4">
            <GitHubButton small />
          </div>
          <div className="">
            <AppStoreButton small />
          </div>
        </div>

        {particleAnimationFinished ? null : (
          <Sparks
            ref={sparkControl}
            iPhoneFrameRef={iPhoneFrameRef}
            TerminalFrameRef={TerminalFrameRef}
            LaserBeamRef={LaserBeamRef}
          />
        )}
      </div>
    </>
  )
}

const AppStoreButton = ({ small }: { small?: boolean }) => {
  const width = small ? 150 : 154
  const height = small ? 40 : 57

  const [bounce, setBounce] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setBounce(true)
    }, 17000)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <a>
      <button
        className={clsx(
          'border-white border-2 rounded-lg sm:rounded-xl cursor-pointer overflow-hidden',
          {
            [styles.bounce]: bounce && small,
          },
        )}
      >
        <Image
          alt="App store button"
          src="/App-Store-Button.png"
          width={width}
          height={height}
        />
      </button>
    </a>
  )
}

const GitHubButton = ({ small }: { small?: boolean }) => {
  const width = small ? 150 : 154
  const height = small ? 40 : 57

  const [bounce, setBounce] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setBounce(true)
    }, 17000)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <a href="https://github.com/gibsonbailey/git-streak-tracker" target="_blank" rel="noopener">
      <button className="bg-black border-2 rounded-xl cursor-pointer flex items-center px-3 w-[154px] h-[57px]">
        <Image
          alt="Github Logo Button"
          src="/gh-logo.png"
          width="36"
          height="36"
          className="mr-3"
        />
        <div className="flex flex-col justify-center items-center w-full">
          <div className="text-xs">
            View on
          </div>
          <div className="text-lg leading-6 font-medium">
            GitHub
          </div>
        </div>
      </button>
    </a>
  )
}

export default HomePage

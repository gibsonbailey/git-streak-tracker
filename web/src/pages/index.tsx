import Image from 'next/image'
import Terminal from '../components/terminal'
import PhoneAnimation from '../components/PhoneAnimation/'
import Laser from '../components/Laser'
import { useRef, useState } from 'react'
import clsx from 'clsx'
import Sparks from '../components/Laser/Sparks'

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
        <h1 className="text-3xl font-bold my-8 hidden sm:block">Git Streak Tracker</h1>
        <div>
          <div className="flex justify-center items-center relative z-20">
            <div className="flex flex-col md:flex-row items-center">
              <div className="flex flex-col items-end">
                <Terminal
                  ref={TerminalFrameRef}
                  animationFinished={animationFinished}
                />
                <a>
                  <button className="mt-8 border-white border-2 rounded-xl cursor-pointer absolute z-50 top-0 right-0 sm:relative">
                    <Image
                      alt="App store button"
                      src="/App-Store-Button.png"
                      width="200"
                      height="50"
                    />
                  </button>
                </a>
              </div>
              <Laser
                ref={LaserBeamRef}
                activateBeam={activateLaserBeam}
              />
              <PhoneAnimation ref={iPhoneFrameRef} />
            </div>
          </div>
        </div>
        <Image
          alt="fire"
          src="/copper.svg"
          fill
          className="opacity-10 absolute z-10"
        />
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

export default HomePage

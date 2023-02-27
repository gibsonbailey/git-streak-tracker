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
      <div className="flex h-full w-full flex-col justify-center items-center">
        <h1 className="text-3xl font-bold my-8">Git Streak Tracker</h1>
        <div>
          <div className="flex justify-center items-center relative z-20">
            <div className={clsx('flex items-center')}>
              <div className="flex flex-col items-end">
                <Terminal
                  ref={TerminalFrameRef}
                  animationFinished={animationFinished}
                />
              </div>
              <Laser
                ref={LaserBeamRef}
                activateBeam={activateLaserBeam}
              />
              <PhoneAnimation ref={iPhoneFrameRef} />
            </div>
          </div>
        </div>

        <div className="flex absolute top-4 right-4 z-50">

          <a href="https://github.com/gibsonbailey/git-streak-tracker" target="_blank" rel="noopener" className="mr-6">
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

          <a href="https://apps.apple.com/us/app/git-streak-tracker/id1663708723" target="_blank" rel="noopener">
            <button className="border-white border-2 rounded-xl cursor-pointer overflow-hidden w-[154px] h-[57px]">
              <Image
                alt="App store button"
                src="/App-Store-Button.png"
                width="150"
                height="30"
              />
            </button>
          </a>

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

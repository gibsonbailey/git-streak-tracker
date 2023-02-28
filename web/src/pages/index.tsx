import Image from 'next/image'
import Terminal from '../components/terminal'
import PhoneAnimation from '../components/PhoneAnimation/'
import Laser from '../components/Laser'
import { useRef, useState } from 'react'
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
      <div className="flex h-full w-full flex-col justify-center items-center mt-12 sm:mt-0">
        <h1 className="text-3xl font-bold my-8 hidden sm:block">
          Git Streak Tracker
        </h1>

        <div className="sm:hidden flex mt-10 p-5 relative z-50">
          <div className="mr-4">
            <GitHubButton small />
          </div>
          <div className="">
            <AppStoreButton small />
          </div>
        </div>

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

  return (
    <a
      href="https://apps.apple.com/us/app/git-streak-tracker/id1663708723"
      target="_blank"
      rel="noopener"
    >
      <button className="border-white border-2 rounded-lg sm:rounded-xl cursor-pointer overflow-hidden max-w-[137px] sm:max-w-none">
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
  const size = small ? 30 : 34

  return (
    <a
      href="https://github.com/gibsonbailey/git-streak-tracker"
      target="_blank"
      rel="noopener"
    >
      <button className="bg-black border-2 rounded-lg sm:rounded-xl cursor-pointer flex items-center px-3 w-[120px] sm:w-[154px] h-[48px] sm:h-[55px]">
        <Image
          alt="Github Logo Button"
          src="/gh-logo.png"
          width={size}
          height={size}
          className="mr-3"
        />
        <div className="flex flex-col justify-center items-center">
          <div className="text-[8px] sm:text-xs">View on</div>
          <div className="text-xs sm:text-lg leading-6 font-medium">GitHub</div>
        </div>
      </button>
    </a>
  )
}

export default HomePage

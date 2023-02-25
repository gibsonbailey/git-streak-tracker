import React, { useState, useRef, useEffect } from 'react';
import styles from './app.module.css'
import clsx from 'clsx'
import Image from 'next/image'
import useTypingText from '../../utils/useTypingText';


const Cube: React.FC<{ dropIntoGraph: boolean }> = ({ dropIntoGraph }) => {
  return (
    <>
      <div className={styles.scene}>
        <div className={clsx(styles.cube, dropIntoGraph && styles.dropToGraph)}>
          <div className={clsx(styles.cubeFace, styles.cubeFace__front, dropIntoGraph && styles.solidBg)}></div>
          <div className={clsx(styles.cubeFace, styles.cubeFace__back, dropIntoGraph && 'hidden')}></div>
          <div className={clsx(styles.cubeFace, styles.cubeFace__right, dropIntoGraph && 'hidden')}></div>
          <div className={clsx(styles.cubeFace, styles.cubeFace__left, dropIntoGraph && 'hidden')}></div>
          <div className={clsx(styles.cubeFace, styles.cubeFace__top, dropIntoGraph && 'hidden')}></div>
          <div className={clsx(styles.cubeFace, styles.cubeFace__bottom, dropIntoGraph && 'hidden')}></div>
        </div>
      </div>
    </>
  )
}

const StreakDialog: React.FC<{ streakLength: number }> = ({ streakLength }) => {
  const [hideDialog, setHideDialog] = useState(false)
  const [dropCubeIntoGraph, setDropCubeIntoGraph] = useState(false)
  const message = "Congratulations"
  const { showCursor, cursorIndex, outputText } = useTypingText({ text: message })

  useEffect(() => {

    setTimeout(() => {
      setHideDialog(true)
    }, 4500)

    setTimeout(() => {
      setDropCubeIntoGraph(true)
    }, 5000)

  }, [])

  return (
    <div className='absolute top-0 left-0 z-10 w-full h-full'>
      <Cube dropIntoGraph={dropCubeIntoGraph} />

      <div className={
        clsx(
          'flex justify-center items-center w-full h-full',
          styles.dialogOverlay,
          hideDialog && styles.fadeOut
        )
      }>
        <div className={clsx('p-4 relative flex flex-col items-center justify-end', styles.streakDialog)}>


          {/* <figure className={styles.platform}></figure> */}

          <div className="green w-full">

            <div>
              <div className={clsx("font-bold text-center", styles.streakLength)}>{streakLength}</div>
              <div className={clsx("uppercase text-center", styles.dayLabel)}>days</div>
            </div>
            <div className="text-xs text-center relative flex mt-2">

              {outputText}

              {cursorIndex >= message.length && <span className='ml-1'>🎉</span>}

              {
                <div className='whitespace-pre bg-white' style={{ width: 1, height: 15, opacity: showCursor ? 1 : 0 }} />
              }
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

const SimulatedAppView: React.FC = () => {
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [todayComplete, setTodayComplete] = useState<boolean>(false)
  const [streakLength, setStreakLength] = useState<number>(10)

  useEffect(() => {
    setTimeout(() => {
      // don't show streak dialog until 1 sec after mount
      setShowDialog(true)
    }, 1000)

    setTimeout(() => {
      // When cube drops into graph
      setStreakLength(streakLength + 1)
      setTodayComplete(true)
    }, 9500)
  }, [])

  return (
    <div className={clsx("h-full w-full absolute z-20 bg-white pt-10 px-6 flex align-center flex-col", styles.container)}>
      {showDialog && <StreakDialog streakLength={streakLength + 1} />}

      <Image src="/OpaqueFlame.png" alt="Flame background image" width={153} height={227} className={styles.opaqueFlame} />

      <div className="text-white text-sm text-center">Github Streak Tracker</div>

      <div className={"flex justify-space-between mt-8"}>
        <div
          className={
            clsx(
              "overflow-hidden rounded-full",
              todayComplete && styles.avatarShadow
            )
          }
        >
          <img
            src="https://avatars.githubusercontent.com/u/27198821?v=4"
            alt="Sw00d User Avatar"
            width={70}
            height={70}
          />
        </div>

        <div className="flex justify-end flex-1">
          <div
            className={
              clsx(
                "text-white transition-opacity flex flex-col justify-center align-center",
                !todayComplete && 'opacity-40'
              )
            }
          >
            <div className={clsx("font-bold text-center", styles.streakLength)}>{streakLength}</div>
            <div className={clsx("uppercase text-center", styles.dayLabel)}>days</div>
          </div>
        </div>

      </div>

      <div className="mt-6">
        <div className="text-lg text-white">
          Samuel Wood
        </div>
        <div className="text-sm opacity-40 text-white">
          @sw00d
        </div>
      </div>

      <div className='mt-5 relative'>
        <div className='text-xs white-text mb-1'>
          Contributions
        </div>
        <Image
          src="/simulate-app-assets/fake-graph.png"
          alt="Fake streak graph"
          width={148}
          height={55}
        />
        <div className={styles.animatedStreakDay} />
      </div>
    </div>
  );
};

export default SimulatedAppView;

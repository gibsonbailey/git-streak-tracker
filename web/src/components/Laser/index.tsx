import clsx from 'clsx'
import Sparks from './Sparks'
import styles from './laser.module.css'
import { useEffect, useRef, useState } from 'react'

export default ({
  iPhoneFrameRef,
  TerminalFrameRef,
}: {
  iPhoneFrameRef: React.RefObject<HTMLDivElement>
  TerminalFrameRef: React.RefObject<HTMLDivElement>
}) => {
  const sparkControl = useRef('stop')
  const [showParticles, setShowParticles] = useState(false)
  const [ particleAnimationFinished, setParticleAnimationFinished ] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      sparkControl.current = 'run'
      setShowParticles(true)
    }, 1550)

    setTimeout(() => {
      sparkControl.current = 'finish'
    }, 4000)

    setTimeout(() => {
      setParticleAnimationFinished(true)
    }, 8000)

  }, [])

  if (particleAnimationFinished) {
    return null
  }

  return (
    <div
      className={clsx(
        'h-full w-full flex flex-col justify-center absolute z-5',
      )}
    >
      <div
        className={clsx('w-60 absolute right-[26.2%]', styles.beamTiming)}
        style={{
          boxShadow: '0 3px 30px #04ff04',
        }}
      >
        <div className={clsx('bg-lime-300 w-full h-1', styles.outerBeam)}></div>
        <div className={clsx('bg-lime-500 w-full h-1', styles.midBeam)}></div>
        <div
          className={clsx('bg-lime-400 w-full h-1', styles.centerBeam)}
        ></div>
        <div className={clsx('bg-lime-500 w-full h-1', styles.midBeam2)}></div>
        <div className={clsx('bg-lime-300 w-full h-1', styles.outerBeam)}></div>
      </div>
      <Sparks
        ref={sparkControl}
        sparksXPosition={0}
        iPhoneFrameRef={iPhoneFrameRef}
        TerminalFrameRef={TerminalFrameRef}
      />
    </div>
  )
}

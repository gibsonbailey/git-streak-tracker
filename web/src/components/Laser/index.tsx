import clsx from 'clsx'
import Sparks from './Sparks'
import styles from './laser.module.css'
import { useEffect, useRef } from 'react'

export default () => {
  const sparkControl = useRef(false)

  useEffect(() => {
    setTimeout(() => {
      sparkControl.current = true
    }, 12250)
  })

  return (
    <div className="h-full w-full flex flex-col justify-center absolute z-5">
      <div
        className={clsx("w-60 absolute right-[26.2%]", styles.beamTiming)}
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
      <Sparks ref={sparkControl} />
    </div>
  )
}

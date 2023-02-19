import clsx from 'clsx'
import styles from './laser.module.css'

export default () => {
  return (
    <div
      className="w-full h-4 w-40"
      style={{
        boxShadow: '0 3px 30px #04ff04',
      }}
    >
      <div className={clsx('bg-lime-300 w-full h-1', styles.outerBeam)}></div>
      <div className={clsx('bg-lime-500 w-full h-1', styles.midBeam)}></div>
      <div className={clsx('bg-lime-400 w-full h-1', styles.centerBeam)}></div>
      <div className={clsx('bg-lime-500 w-full h-1', styles.midBeam2)}></div>
      <div className={clsx('bg-lime-300 w-full h-1', styles.outerBeam)}></div>
    </div>
  )
}

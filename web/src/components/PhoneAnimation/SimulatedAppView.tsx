import * as React from 'react';
import styles from './app.module.css'
import clsx from 'clsx'
import Image from 'next/image'

type SimulatedAppPropsprops = {
  todayComplete: boolean,
  streakLength: number,
}

const SimulatedAppView: React.FC<SimulatedAppPropsprops> = ({ todayComplete, streakLength }) => {

  return (
    <div className={clsx("h-full w-full absolute z-20 bg-white pt-10 px-6 flex align-center flex-col", styles.container)}>
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
        <div className={styles.animatedStreakDay}/>
      </div>
    </div>
  );
};

export default SimulatedAppView;

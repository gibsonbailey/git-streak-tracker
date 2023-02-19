import * as React from 'react';
import styles from './app.module.css'
import clsx from 'clsx'
import Image from 'next/image'

const SimulatedAppView: React.FC = (props) => {
  return (
    <div className={clsx("h-full w-full absolute z-20 bg-white pt-10 px-4 flex justify-center", styles.container)}>
      <div className="text-white text-sm text-center">Github Streak Tracker</div>
      <Image src="/OpaqueFlame.png"  alt="Flame background image" width={170} height={100} className={styles.opaqueFlame}/>
    </div>    
  );
};

export default SimulatedAppView;

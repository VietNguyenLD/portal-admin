import { ReactNode } from 'react';
import styles from './index.module.scss';
import clsx from 'clsx';

interface IListButtonFooter {
  buttons: React.ReactNode[];
  custonClass?: string;
}

export const ListButtonFooter: React.FC<IListButtonFooter> = ({ buttons, custonClass }) => {
  return (
    <div className={clsx(styles.list_btn_footer, custonClass)}>
      {buttons.map((item: ReactNode, index: number) => (
        <div key={index}>{item}</div>
      ))}
    </div>
  );
};

import clsx from 'clsx';
import styles from './index.module.scss';

interface IBorderText {
  title: string;
  children?: React.ReactNode;
  className?: string;
}

export const BorderText: React.FC<IBorderText> = ({ title, children, className }) => {
  return (
    <fieldset className={clsx(styles.fieldset_wrapper, className)}>
      <legend>{title}</legend>
      {children}
    </fieldset>
  );
};

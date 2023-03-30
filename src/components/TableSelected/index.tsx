import { Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import styles from './index.module.scss';

export interface IDataTable {
  text: string;
  checked: boolean;
  disabled: boolean;
  value: number;
}

export interface ITableSelected {
  columns: string[];
  data?: IDataTable[];
  onChange?: (e: CheckboxChangeEvent, index: number) => void;
  onCheckAllChange?: ((e: CheckboxChangeEvent) => void) | undefined;
  isCheckAll?: boolean;
}

const TableSelected: React.FC<ITableSelected> = ({
  columns,
  data,
  onChange,
  onCheckAllChange,
  isCheckAll,
}) => {
  return (
    <table className={styles.table_selected}>
      <thead>
        <tr>
          {columns?.map((item: string, index: number) => (
            <th key={item}>
              {index === 0 && onCheckAllChange && (
                <Checkbox checked={isCheckAll} onChange={onCheckAllChange} />
              )}{' '}
              {item}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data?.map((item: IDataTable, index: number) => (
          <tr key={index}>
            <td>
              <Checkbox
                checked={item.checked}
                onChange={(e) => onChange && onChange(e, index)}
                disabled={item.disabled}
              />
            </td>
            <td>{item.text}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableSelected;

import { Table } from 'antd';

export function BaseTable({ ...theArgs }) {
  return <Table {...theArgs} bordered scroll={{ x: 'max-content' }} />;
}

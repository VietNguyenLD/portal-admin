import { Spin, Table } from 'antd';
import axiosClient from 'api/axiosClient';
import { Format } from 'constants/date';
import useLoading from 'hooks/useLoading';
import { useEffect, useState } from 'react';
import { formatDateFromIso } from 'utils';

const columns = [
  {
    title: 'STT',
    render: (value: any, record: any, index: number) => {
      return index + 1;
    },
  },
  {
    title: 'Thời Gian',
    dataIndex: 'created_at',
    render: (value: string) => {
      return formatDateFromIso(value, Format.DATE_TIME);
    },
  },
  {
    title: 'Người Thực Hiện',
    dataIndex: 'created_by',
  },
  {
    title: 'Hành Động',
    dataIndex: 'message',
  },
  {
    title: 'Nội Dung',
    dataIndex: 'extra_data',
  },
];

function RequestChangeSIMHistory() {
  const { loading, toggleLoading } = useLoading();
  const [historyData, setHistoryData] = useState();

  async function getRequestChangeSimHistory() {
    try {
      toggleLoading(true);
      const url = `/sim/change-sim/${184}/histories`;
      const { status, data } = await axiosClient.get(url);
      toggleLoading(false);

      if (status === 200) {
        setHistoryData(data?.data);
      }
    } catch (error) {
      toggleLoading(false);
      console.log('Error: ', error);
    }
  }

  useEffect(() => {
    getRequestChangeSimHistory();
  }, []);
  return (
    <Spin spinning={loading}>
      <div className='request-newsim-history'>
        <Table
          bordered
          columns={columns}
          dataSource={historyData}
          rowKey={(value) => {
            return value?.id;
          }}
        />
      </div>
    </Spin>
  );
}

export default RequestChangeSIMHistory;

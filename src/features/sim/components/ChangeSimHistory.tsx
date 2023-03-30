import { Spin, Table } from 'antd';
import axiosClient from 'api/axiosClient';
import { Format } from 'constants/date';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { formatDateFromIso } from 'utils';

const columns = [
  {
    title: 'STT',
    render: (text: string, record: any, index: number) => {
      return index + 1;
    },
  },
  {
    title: 'Thời gian',
    dataIndex: 'created_at',
    key: 'created_at',
    render: (text: string) => {
      return formatDateFromIso(text, Format.DATE_TIME);
    },
  },
  {
    title: 'Người thực hiện',
    dataIndex: 'created_by'
  },
  {
    title: 'Hành động',
    dataIndex: 'message',
  },
  {
    title: 'Nội dung',
    width: 400,
    dataIndex: 'extra_data',
    key: 'extra_data',
    render: (record: any) => {
      const messageList = record?.split(';');
      return {
        props: {
          className: 'pre-wrap',
        },
        children: messageList?.join('\n'),
      };
    },
  },
];

function ChangeSimHistory(props: any) {
  const { simId } = props;
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const dataSource = history.filter((item: any) => {
    return _.isEmpty(item) === false;
  });

  useEffect(() => {
    const getSimHistory = async (simId: number) => {
      try {
        const url = `/sim/change-sim/${simId}/histories`
        setLoading(true);
        const response = await axiosClient.get(url);
        setLoading(false);
        const { status, data } = response;
        if (status === 200) {
        }
        setHistory(data.data);
      } catch (error) {
        setLoading(false);
      }
    };

    if (simId) {
      getSimHistory(simId);
    }
  }, [simId]);

  return (
    <Spin spinning={loading}>
      <div className='sim-history'>
        {history ? (
          <Table
            bordered
            columns={columns}
            dataSource={dataSource}
            rowKey={(record) => {
              return record.id;
            }}
          />
        ) : (
          <span>Chưa có lịch sử thay đổi</span>
        )}
      </div>
    </Spin>
  );
}

export default ChangeSimHistory;

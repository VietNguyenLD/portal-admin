import { Spin, Table } from 'antd';
import batchApi from 'api/batchApi';
import BaseModal from 'components/Modal/BaseModal';
import useLoading from 'hooks/useLoading';
import { useEffect, useState } from 'react';
import { showNumberOrderTable } from 'share/helper';

function BatchSendNotiDetail(props: any) {
  const { id, onCancelModal } = props;
  const { loading, toggleLoading } = useLoading();

  const [listItem, setListItem] = useState<any>();
  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
  });

  const columns = [
    {
      title: 'STT',
      render: (value: any, record: any, index: number) => {
        return showNumberOrderTable(query?.page, index);
      },
    },
    {
      title: 'Ngày Thực Hiện',
      dataIndex: 'date',
    },
    {
      title: 'Thời Gian Chạy',
      dataIndex: 'sms_start_time',
    },
    {
      title: 'Batch ID',
      dataIndex: 'code',
    },
    {
      title: 'Tên File',
      dataIndex: 'files_name',
    },
    {
      title: 'STB Gửi SMS Thành Công',
      dataIndex: 'sms_success',
    },
    {
      title: 'STB Gửi SMS Thất Bại',
      dataIndex: 'sms_fail',
    },
    {
      title: 'STB Gửi Noti Thành Công',
      dataIndex: 'notification_success',
    },
    {
      title: 'STB Gửi Noti Thất Bại',
      dataIndex: 'notification_fail',
    },
  ];

  function handleCancelModal() {
    onCancelModal();
  }

  async function getSendActionDetail() {
    try {
      toggleLoading(true);
      const { status, data } = await batchApi.getSendActionDetail(id);
      toggleLoading(false);

      if (status === 200) {
        setListItem(data?.data);
      }
    } catch (error) {
      toggleLoading(false);
      console.log('Error:', error);
    }
  }

  const handlePageChange = (pagination: any) => {
    const params = {
      ...query,
      page: pagination.current,
      limit: pagination.pageSize,
    };
    setQuery(params);
  };

  useEffect(() => {
    getSendActionDetail();
    // eslint-disable-next-line
  }, [query]);

  return (
    <BaseModal title='Chi Tiết Gửi SMS/Noti' onCancelModal={handleCancelModal}>
      <Spin spinning={loading}>
        <Table
          bordered
          scroll={{ x: 'max-content' }}
          columns={columns}
          dataSource={listItem}
          onChange={handlePageChange}
          rowKey={(value, index) => {
            return `${index}`;
          }}
        />
      </Spin>
    </BaseModal>
  );
}

export default BatchSendNotiDetail;

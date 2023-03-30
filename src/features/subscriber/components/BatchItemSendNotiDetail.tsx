import { Spin, Table } from 'antd';
import axiosClient from 'api/axiosClient';
import batchApi from 'api/batchApi';
import BaseModal from 'components/Modal/BaseModal';
import { Format } from 'constants/date';
import useLoading from 'hooks/useLoading';
import { useEffect, useState } from 'react';
import { showNumberOrderTable } from 'share/helper';
import { formatDateFromIso } from 'utils';

function BatchItemSendNotiDetail(props: any) {
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
      title: 'Ngày Chạy',
      dataIndex: 'created_at',
      render: (value: string) => {
        return formatDateFromIso(value, Format.DATE);
      },
    },
    {
      title: 'Serial',
      dataIndex: 'serial_number',
    },
    {
      title: 'Số Điện Thoại',
      dataIndex: 'phone_number',
    },
    {
      title: 'Họ Và Tên',
      dataIndex: 'full_name',
    },
    {
      title: 'Được Gửi SMS Thành Công',
      dataIndex: 'sms_status',
      render: (value: string) => {
        return renderCheckboxStatus(value);
      },
    },
    {
      title: 'Được Gửi Noti Thành Công',
      dataIndex: 'notification_status',
      render: (value: string) => {
        return renderCheckboxStatus(value);
      },
    },
  ];

  function renderCheckboxStatus(status: string) {
    switch (status) {
      case 'success':
        return 'Thành công';
      case 'failed':
        return 'Thất bại';
    }
  }

  function handleCancelModal() {
    onCancelModal();
  }

  async function getSendActionDetail() {
    try {
      toggleLoading(true);
      const url = `/send-batch/request-batch/item-detail/${id}`;
      const { status, data } = await axiosClient.get(url);
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

export default BatchItemSendNotiDetail;

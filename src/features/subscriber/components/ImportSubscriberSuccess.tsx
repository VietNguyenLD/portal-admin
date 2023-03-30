import { Button, Col, Form, Input, Row, Select, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import sendBatchApi from 'api/sendBatchApi';
import { SubscriptionStatus } from 'constants/kyc.enum';
import _ from 'lodash';
import { ResetSubscriberFiltersType } from 'models/filters';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { showNumberOrderTable } from 'share/helper';
import { exportExcel } from 'utils';
import { subscriptionStatusText } from 'utils/kyc';

interface DataType {
  id: number;
}

interface ImportSubscriberSuccessProps {
  onLoading: (flag: boolean) => void;
}

const ImportSubscriberSuccess = forwardRef((props: ImportSubscriberSuccessProps, ref) => {
  const { onLoading } = props;
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const btnSearchRef = useRef<HTMLElement>(null);
  const [listItemData, setListItemData] = useState<any>();
  const [query, setQuery] = useState<ResetSubscriberFiltersType>({
    page: 1,
    limit: 10,
    search: '',
    'filter.status': 3,
    'filter.kycStatus': '',
    'filter.unsubscription_status': '',
    'filter.recall_status': '',
  });

  const columns: ColumnsType<DataType> = [
    {
      title: 'STT',
      render: (value, record, index) => {
        return showNumberOrderTable(query.page, index);
      },
    },
    {
      title: 'SIM Serial',
      dataIndex: 'serial_number',
    },
    {
      title: 'Số Thuê Bao',
      dataIndex: 'phone_number',
    },
    {
      title: 'Tên Thuê Bao',
      dataIndex: 'extra_data',
      render(value) {
        return value?.full_name;
      },
    },
    {
      title: 'Trạng Thái Thuê Bao',
      dataIndex: 'extra_data',
      render(value) {
        return subscriptionStatusText(value?.kycStatus);
      },
    },
    {
      title: 'Kết Quả Hủy Dịch Vụ',
      dataIndex: 'extra_data',
      render(value) {
        const status = value?.unsubscription_status;
        return _.isUndefined(status) ? '' : status ? 'Thành công' : 'Lỗi';
      },
    },
    {
      title: 'Nội Dung',
      dataIndex: 'extra_data',
      render(value) {
        return value?.reasonIsNotUnsubscription;
      },
    },
    {
      title: 'Kết Quả Thu Hồi',
      dataIndex: 'extra_data',
      render(value) {
        const status = value?.recall_status;
        return _.isUndefined(status) ? '' : status ? 'Thành công' : 'Lỗi';
      },
    },
    {
      title: 'Nội Dung',
    },
  ];

  useImperativeHandle(ref, () => ({
    exportExcel: () => handleExportExcel(listItemData?.meta?.totalItems),
  }));

  async function handleExportExcel(totalItems: number) {
    if (!totalItems) {
      toast.error('Không có dữ liệu export');
      return;
    }

    const numberPgae = totalItems < 100 ? 1 : Math.ceil(totalItems / 100);
    const promises: any = [];

    for (let index = 0; index < numberPgae; index++) {
      promises.push(
        sendBatchApi.getResetBatchListItem({
          id: id,
          query: {
            ...query,
            page: index + 1,
            limit: 100,
          },
        }),
      );
    }

    const newColumns = [...columns];
    newColumns[0] = {
      title: 'STT',
      render: (_value: any, _record: any, index: number) => {
        return index + 1;
      },
    };

    exportExcel('reset_subscriber_success', newColumns, promises);
  }

  function handleFormSubmit(values: any) {
    setQuery({
      ...query,
      search: values.search,
      'filter.kycStatus': values.kyc_status,
      'filter.unsubscription_status': values.unsubscription_status,
      'filter.recall_status': values.recall_status,
    });
  }
  function handleReset() {
    form.setFieldsValue({
      search: '',
      kyc_status: '',
      unsubscription_status: '',
      recall_status: '',
    });
    btnSearchRef?.current?.click();
  }
  useEffect(() => {
    async function getResetBatchListItem() {
      const params: any = {
        id,
        query: {
          ...query,
        },
      };
      try {
        onLoading(true);
        const { status, data } = await sendBatchApi.getResetBatchListItem(params);
        onLoading(false);
        if (status === 200) {
          setListItemData(data.data);
        }
      } catch (error) {
        onLoading(false);
      }
    }
    getResetBatchListItem();
    // eslint-disable-next-line
  }, [query]);

  return (
    <div className='subscriber-success'>
      <Form form={form} onFinish={handleFormSubmit}>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name='search'>
              <Input placeholder='Số thuê bao, tên thuê bao, sim serial' />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label='Trạng thái thuê bao' name='kyc_status'>
              <Select
                defaultValue=''
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={[
                  {
                    label: 'Tất cả',
                    value: '',
                  },
                  {
                    label: subscriptionStatusText(1),
                    value: SubscriptionStatus.BLOCK_1_WAY,
                  },
                  {
                    label: subscriptionStatusText(2),
                    value: SubscriptionStatus.BLOCK_2_WAY,
                  },
                  {
                    label: subscriptionStatusText(3),
                    value: SubscriptionStatus.UNSUBSCRIPTION,
                  },
                  {
                    label: subscriptionStatusText(4),
                    value: SubscriptionStatus.UNLOCK,
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label='Kết quả hủy dịch vụ' name='unsubscription_status'>
              <Select
                defaultValue=''
                showSearch
                options={[
                  {
                    label: 'Tất cả',
                    value: '',
                  },
                  {
                    label: 'Thành công',
                    value: 1,
                  },
                  {
                    label: 'Lỗi',
                    value: 0,
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label='Kết quả thu hồi' name='recall_status'>
              <Select
                defaultValue=''
                showSearch
                options={[
                  {
                    label: 'Tất cả',
                    value: '',
                  },
                  {
                    label: 'Thành công',
                    value: 1,
                  },
                  {
                    label: 'Lỗi',
                    value: 0,
                  },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row className='search-btn'>
          <Button onClick={handleReset}>Reset</Button>
          <Button htmlType='submit' ref={btnSearchRef}>
            Tìm kiếm
          </Button>
        </Row>
      </Form>
      <Table
        bordered
        scroll={{ x: 'max-content' }}
        columns={columns}
        dataSource={listItemData?.data}
        rowKey={(item) => {
          return item?.id;
        }}
      />
    </div>
  );
});

export default ImportSubscriberSuccess;

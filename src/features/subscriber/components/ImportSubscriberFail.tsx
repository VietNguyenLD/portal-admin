import { Button, Col, Form, Input, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import sendBatchApi from 'api/sendBatchApi';
import { ResetSubscriberFiltersType } from 'models/filters';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { showNumberOrderTable } from 'share/helper';
import { exportExcel } from 'utils';
import PaginationConfig from 'utils/panigationConfig';

interface DataType {
  id: number;
}

interface ImportSubscriberFailProps {
  onLoading: (flag: boolean) => void;
}

const ImportSubscriberFail = forwardRef((props: ImportSubscriberFailProps, ref) => {
  const { onLoading } = props;
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [listItemData, setListItemData] = useState<any>();
  const btnSearchRef = useRef<HTMLElement>(null);
  const [query, setQuery] = useState<ResetSubscriberFiltersType>({
    page: 1,
    limit: 10,
    search: '',
    'filter.status': 4,
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
      dataIndex: '',
    },
    {
      title: 'Nội Dung',
      dataIndex: 'extra_data',
      render(value) {
        return value?.failedReason;
      },
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

    exportExcel('reset_subscriber_fail', newColumns, promises);
  }

  function handleFormSubmit(values: any) {
    setQuery({
      ...query,
      search: values.search,
    });
  }

  function handleReset() {
    form.setFieldsValue({
      search: '',
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
    <div className='subscriber-fail'>
      <Form form={form} onFinish={handleFormSubmit}>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name='search'>
              <Input placeholder='Số thuê bao, tên thuê bao, sim serial' />
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
        pagination={PaginationConfig(listItemData)}
        rowKey={(item) => {
          return item?.id;
        }}
      />
    </div>
  );
});

export default ImportSubscriberFail;

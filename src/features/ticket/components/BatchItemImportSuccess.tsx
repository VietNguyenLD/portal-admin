import { DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Checkbox, Popconfirm, Table, TablePaginationConfig, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import sendBatchApi from 'api/sendBatchApi';
import CreateTicketModal from 'components/CreateTicketModal';
import { BatchStatus } from 'constants/batch.enum';
import { ActionText, Feature } from 'constants/permission';
import { TicketStatus } from 'constants/ticket.enum';
import useCan from 'hooks/useCan';
import useModal from 'hooks/useModal';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { showNumberOrderTable } from 'share/helper';
import { exportExcel } from 'utils';
import PaginationConfig from 'utils/panigationConfig';
import { itemTypeToText } from 'utils/setting';

const BatchItemImportSuccess = forwardRef((props: any, ref) => {
  const { onLoading, batchStatus, reRender, onReRender } = props;

  const { id } = useParams<{ id: string }>();
  const { isCan } = useCan();
  const createTicketModal = useModal();
  const history = useHistory();

  const [listItem, setListItem] = useState<any>();
  const [statusModal, setStatusModal] = useState<string>();
  const [serial, setSerial] = useState<string>();
  const [extraDataItems, setExtraDataItems] = useState([]);
  const [reasonItems, setReasonItems] = useState([]);
  const [query, setQuery] = useState<any>({
    page: 1,
    limit: 10,
    'filter.status': 3,
  });

  const columns: ColumnsType<any> = [
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
      title: 'Số Điện Thoại',
      dataIndex: 'phone_number',
    },
    {
      title: 'Họ Và Tên',
      dataIndex: 'extra_data',
      render: (record) => {
        return record?.full_name;
      },
    },
    {
      title: 'Item Yêu Cầu',
      dataIndex: 'extra_data',
      render(value) {
        return value?.items?.map((item: number, index: number) => (
          <Tag key={index}>{itemTypeToText(item)}</Tag>
        ));
      },
    },
    {
      title: 'Lý Do',
      dataIndex: 'reasons',
      render(value) {
        const listItem: Array<string> = [];
        value?.map((item: any) => listItem.push(item.reason));
        return listItem.join(' , ');
      },
    },
    {
      title: 'Trạng Thái Chuyển Yêu Cầu',
      dataIndex: 'ticket',
      render(value) {
        return batchStatus === BatchStatus.DONE ? '' : !value ? 'Thất bại' : 'Thành công';
      },
    },
    {
      title: 'Lý do thất bại',
      dataIndex: 'extra_data',
      render: (value) => {
        return value?.reasonIsNotDraftTicket;
      },
    },
    {
      title: 'Chuyển Thành Ticket',
      dataIndex: 'ticket',
      render: (value) => {
        return <Checkbox disabled={true} checked={value && value?.status !== TicketStatus.DRAFT} />;
      },
    },
    {
      title: 'Action',
      fixed: 'right',
      render: (record) => {
        return (
          <div className='batch-detail_row-action' style={{ textAlign: 'right' }}>
            {isCan(Feature.TICKET_IMPORTBATCH_DETAIL_TICKET_DETAIL, ActionText.READ) &&
              !record?.extra_data.reasonIsNotDraftTicket && (
                <InfoCircleOutlined onClick={() => onClickDetail(record)} />
              )}

            {isCan(Feature.TICKET_IMPORTBATCH_DETAIL_DELETE, ActionText.SUBMIT) && (
              <Popconfirm
                title='Bạn có chắc chắn muốn xóa?'
                okText='Xóa'
                cancelText='Hủy'
                onConfirm={() => handleDeleteBatchItem(record?.id)}>
                <DeleteOutlined
                  style={{ pointerEvents: batchStatus === BatchStatus.TO_TICKET ? 'none' : 'auto' }}
                />
              </Popconfirm>
            )}
          </div>
        );
      },
    },
  ];

  async function getListBatchItem() {
    const params: any = {
      batch_id: id,
      query: {
        ...query,
      },
    };

    try {
      onLoading(true);
      const { status, data } = await sendBatchApi.getListBatchItem(params);
      onLoading(false);

      if (status === 200) {
        setListItem(data.data);
      }
    } catch (error) {
      onLoading(false);
    }
  }

  async function handleDeleteBatchItem(id: number) {
    const reqBody = {
      item_id: id,
    };
    try {
      onLoading(true);
      const { status } = await sendBatchApi.deleteImportBatchItem(reqBody);
      onLoading(false);

      if (status === 201) {
        toast.success('Xóa thành công');
        onReRender(true);
      }
    } catch (error) {
      onLoading(false);
    }
  }

  useImperativeHandle(ref, () => ({
    exportExcel: () => handleExportExcel(listItem?.meta?.totalItems),
  }));

  function handleExportExcel(totalItems: number) {
    if (!totalItems) {
      toast.error('Không có dữ liệu export');
      return;
    }

    const numberPgae = totalItems < 100 ? 1 : Math.ceil(totalItems / 100);
    const promises: Array<Promise<any>> = [];

    for (let index = 0; index < numberPgae; index++) {
      promises.push(
        sendBatchApi.getListBatchItem({
          batch_id: id,
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
      render: (value, record, index: number) => {
        return index + 1;
      },
    };
    newColumns[4] = {
      title: 'Item Yêu Cầu',
      dataIndex: 'extra_data',
      render: (value) => {
        let listItem: Array<string> = [];
        value?.items?.map((item: any) => listItem?.push(itemTypeToText(item)!));
        return listItem?.join(' , ');
      },
    };
    newColumns[8] = {
      title: 'Chuyển Thành Ticket',
      dataIndex: 'ticket',
      render: (value) => {
        return value && value?.status !== TicketStatus.DRAFT ? 'Yes' : 'No';
      },
    };
    newColumns.pop();

    exportExcel('batch_item_success', newColumns, promises);
  }

  const onClickDetail = (record: any) => {
    const status =
      batchStatus === BatchStatus.DONE ? 'draff' : !record.ticket ? 'Thất bại' : 'Thành công';
    const ticketStatus =
      record.ticket && record.ticket?.status !== TicketStatus.DRAFT ? 'Yes' : 'No';
    setStatusModal(status);
    if (status === 'Thành công' && ticketStatus === 'Yes') {
      setStatusModal('Ticket');
      history.push(
        `/admin/ticket/list/${record.ticket.id}?serial_number=${record.ticket.serial_number}`,
      );
    } else {
      setExtraDataItems(record?.extra_data.items);
      setReasonItems(record?.reasons);
      setSerial(record?.serial_number);
      createTicketModal.toggle();
    }
  };

  function handlePageChange(pagination: TablePaginationConfig) {
    const params = {
      ...query,
      page: pagination.current,
      limit: pagination.pageSize,
    };

    setQuery(params);
  }

  useEffect(() => {
    if (reRender) {
      getListBatchItem();
    }
    // eslint-disable-next-line
  }, [reRender]);

  useEffect(() => {
    getListBatchItem();
    // eslint-disable-next-line
  }, [query]);

  return (
    <div className='batch-item-success'>
      {createTicketModal.isShowing === true && (
        <CreateTicketModal
          isShowing={createTicketModal.isShowing}
          toggle={createTicketModal.toggle}
          serialNumber={serial}
          mode='current'
          statusModal={statusModal}
          extraDataItems={extraDataItems}
          reasonItems={reasonItems}
        />
      )}

      <Table
        bordered
        scroll={{ x: 'max-content' }}
        columns={columns}
        dataSource={listItem?.data}
        pagination={PaginationConfig(listItem)}
        onChange={handlePageChange}
        rowKey={(item) => {
          return item?.id;
        }}
      />
    </div>
  );
});
export default BatchItemImportSuccess;

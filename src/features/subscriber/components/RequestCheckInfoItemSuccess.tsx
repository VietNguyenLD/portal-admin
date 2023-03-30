import { DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Popconfirm, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import axiosClient from 'api/axiosClient';
import batchApi from 'api/batchApi';
import { BatchStatus, confirmRequestStatusText, notiStatusText } from 'constants/batch.enum';
import { ActionText, Feature } from 'constants/permission';
import { AppContext } from 'context/AppContext';
import useCan from 'hooks/useCan';
import useFetch from 'hooks/useFetch';
import { forwardRef, Fragment, useContext, useEffect, useImperativeHandle, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { generateTableOrderNumber } from 'share/helper';
import { exportExcel } from 'utils';
import PaginationConfig from 'utils/panigationConfig';
import BatchItemSendNotiDetail from './BatchItemSendNotiDetail';

const RequestCheckInfoItemSuccess = forwardRef(
  ({ batchStatus, onReRender, reRender }: any, ref) => {
    const { id } = useParams<{ id: string }>();
    const { setLoading } = useContext(AppContext);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [itemID, setItemID] = useState<number>();
    const [query, setQuery] = useState({
      page: 1,
      limit: 10,
      type: 'import_success',
    });

    const { isCan } = useCan();
    const { data, fetchData } = useFetch({
      url: `/send-batch/request-batch/list-items/${id}`,
      param: query,
      setLoading,
    });

    const columns: ColumnsType<any> = [
      {
        title: 'STT',
        render: (value, record, index) =>
          generateTableOrderNumber(query?.page, query?.limit, index),
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
        dataIndex: 'extra_data',
        render: (value: any) => value?.full_name,
      },
      {
        title: 'Trạng Thái Xác Nhận Gửi Đề Nghị',
        dataIndex: 'status',
        render: (value) => confirmRequestStatusText(value),
      },
      {
        title: 'Lý Do Thất Bại',
        dataIndex: 'extra_data',
        render: (values) => {
          const smsFailedReason = values?.smsFailedReason?.split('_')[2] ?? '';
          const notificationFailedReason = values?.notificationFailedReason?.split('_')[2] ?? '';
          return (
            <p style={{ whiteSpace: 'pre-line' }}>
              {`${smsFailedReason + '\n' + notificationFailedReason}`.trim()}
            </p>
          );
        },
      },
      {
        title: 'Được Gửi SMS Thành Công',
        dataIndex: 'sms_status',
        render: (value) => notiStatusText(value),
      },
      {
        title: 'Được Gửi Noti Thành Công',
        dataIndex: 'notification_status',
        render: (value) => notiStatusText(value),
      },
      {
        title: 'Thao Tác',
        fixed: 'right',
        render: (value: any) => {
          return (
            <div className='flex justify-between'>
              {isCan(Feature.TICKET_REQUEST_BATCH_DETAIL_DELETE_ITEM, ActionText.SUBMIT) && (
                <InfoCircleOutlined
                  className='pointer'
                  disabled={true}
                  style={{
                    display: [BatchStatus.PROCESSING_SMS_NOTIFICATION, BatchStatus.DONE].includes(
                      batchStatus,
                    )
                      ? 'inline-block'
                      : 'none',
                  }}
                  onClick={() => {
                    setIsOpenModal(true);
                    setItemID(value?.id);
                  }}
                />
              )}

              {isCan(Feature.TICKET_REQUEST_BATCH_DETAIL_ITEM_ACTION, ActionText.READ) && (
                <Popconfirm
                  title='Bạn có chắc chắn muốn xóa thuê bao này khỏi batch?'
                  okText='Xóa'
                  cancelText='Hủy'
                  onConfirm={() => handleDeleteItem(value?.id)}>
                  <DeleteOutlined
                    style={{
                      display: value?.status === 'IMPORT_SUCCESS' ? 'inline-block' : 'none',
                    }}
                  />
                </Popconfirm>
              )}
            </div>
          );
        },
      },
    ];

    useImperativeHandle(ref, () => ({
      exportExcel: () => handleExportExcel(data?.meta?.totalItems),
    }));

    function handleExportExcel(totalItems: number) {
      if (!totalItems) {
        toast.error('Không có dữ liệu export');
        return;
      }

      const numberPage = totalItems < 100 ? 1 : Math.ceil(totalItems / 100);
      const promises: Array<Promise<any>> = [];

      for (let index = 0; index < numberPage; index++) {
        promises.push(
          batchApi.getRequestCheckInfoListItem({
            ...query,
            id: id,
            page: index + 1,
            limit: 100,
          }),
        );
      }
      const newColumns = [...columns];
      newColumns[0] = {
        title: 'STT',
        render: (value, record, index) => {
          return index + 1;
        },
      };
      newColumns.pop();

      exportExcel('request_checkInfo_success', newColumns, promises, setLoading);
    }

    async function handleDeleteItem(id: number) {
      try {
        const url = `/send-batch/request-batch/list-items/${id}`;
        const { status } = await axiosClient.delete(url);

        if (status === 200) {
          fetchData(query);
          onReRender(true);
        }
      } catch (error) {
        console.log('Error:', error);
      }
    }

    function handlePageChange(value: any) {
      const params = {
        ...query,
        page: value?.current,
        limit: value?.pageSize,
      };

      setQuery(params);
      fetchData(params);
    }

    useEffect(() => {
      if (reRender) {
        fetchData(query);
      }
      // eslint-disable-next-line
    }, [reRender]);

    return (
      <Fragment>
        {isOpenModal ? (
          <BatchItemSendNotiDetail id={itemID} onCancelModal={() => setIsOpenModal(false)} />
        ) : null}

        <Table
          bordered
          scroll={{ x: 'max-content' }}
          columns={columns}
          dataSource={data?.data}
          rowKey={(record) => {
            return record?.id;
          }}
          onChange={handlePageChange}
          pagination={PaginationConfig(data)}
        />
      </Fragment>
    );
  },
);

export default RequestCheckInfoItemSuccess;

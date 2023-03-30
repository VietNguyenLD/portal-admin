import { Button, Col, Form, Row, TablePaginationConfig } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import batchApi, { SEND_BATCH_URL } from 'api/batchApi';
import simApi from 'api/simApi';
import ticketApi from 'api/ticketApi';
import 'components/CreateBatchModal/CreateBatchModal.scss';
import { BatchStatus, sendBatchItemStatusText, sendBatchTypeText } from 'constants/batch.enum';
import { Format } from 'constants/date';
import { ActionText, Feature } from 'constants/permission';
import { AppContext } from 'context/AppContext';
import useCan from 'hooks/useCan';
import useFetch from 'hooks/useFetch';
import { DataResponse } from 'models/common';
import { SimActivated, SimFilter } from 'models/sim';
import { Ticket, TicketFilter } from 'models/ticket';
import moment from 'moment';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { convertTicketType, DATE_FORMAT, exportExcel } from 'share/helper';
import { capitalizeText, formatDateFromIso } from 'utils';
import { batchStatusText } from 'utils/batch';
import { KYCProfileTempStatusToText } from 'utils/sim.enum';
import { ticketStatusInBatchToText } from 'utils/ticket';
import FilterSim from '../components/FilterSim';
import FilterTicket from '../components/FilterTicket';
import SimTable from '../components/SimTable';
import TicketTable from '../components/TicketTable';

const columns: ColumnsType<any> = [
  {
    title: 'STT',
    key: 'stt',
    render: (v, r, index) => index + 1,
  },
  {
    title: 'Mã Ticket',
    dataIndex: 'code',
  },
  {
    title: 'Loại',
    dataIndex: 'type',
    render: (v) => convertTicketType(v),
  },
  {
    title: 'Tình trạng',
    dataIndex: 'status',
    render: (record: number) => {
      return ticketStatusInBatchToText(record);
    },
  },
  {
    title: 'Số Lần CS Yêu Cầu',
    dataIndex: 'requested_count',
  },
  {
    title: 'Số Serial',
    dataIndex: 'serial_number',
    sorter: {
      compare: (a, b) => a.serial_number - b.serial_number,
      multiple: 1,
    },
  },
  {
    title: 'Số Thuê Bao',
    dataIndex: 'phone_number',
    sorter: {
      compare: (a, b) => a.phone_number - b.phone_number,
      multiple: 1,
    },
  },
  {
    title: 'Tên Thuê Bao',
    dataIndex: 'full_name',
    sorter: (a, b) => a.full_name.length - b.full_name.length,
    render: (record: string) => {
      return capitalizeText(record);
    },
  },
  {
    title: 'Người tạo',
    dataIndex: 'createdByUser',
    render: (record: { [key: string]: string }) => {
      return capitalizeText(record?.name);
    },
  },
  {
    title: 'Ngày Tạo',
    dataIndex: 'created_at',
    sorter: (a, b) => {
      var dateA = new Date(a.created_at).getTime();
      var dateB = new Date(b.created_at).getTime();
      return dateA > dateB ? 1 : -1;
    },
    render: (record: any) => {
      const dateFormated = formatDateFromIso(record, Format.DATE_TIME);
      return dateFormated;
    },
  },
  {
    title: 'Người cập nhật cuối',
    dataIndex: 'updatedByUser',
    render: (record: { [key: string]: string }) => {
      return capitalizeText(record?.name);
    },
  },
  {
    title: 'Ngày cập nhật cuối',
    dataIndex: 'updated_at',
    render: (record: any) => {
      return formatDateFromIso(record, Format.DATE_TIME);
    },
  },
  {
    title: 'Tình trạng gửi MBF',
    dataIndex: 'sendbatch_item_status',
    render: (status: number) => {
      return sendBatchItemStatusText(status);
    },
  },
  {
    title: 'Mã lỗi',
    dataIndex: 'mbf_error_code',
  },
  {
    title: 'Lỗi',
    dataIndex: 'mbf_error_message',
  },
  {
    title: 'Thao tác',
    fixed: 'right',
    render: (_: Ticket) => {
      return (
        <Link
          to={`/admin/quan-ly-ticket/danh-sach-ticket/xem-chi-tiet/${_.id}?serial_number=${_.serial_number}`}>
          Chi Tiết
        </Link>
      );
    },
  },
];

const BatchDetailPage = () => {
  const { setLoading } = useContext(AppContext);
  const params: { id: string } = useParams();
  const { search } = useLocation();
  const history = useHistory();

  const [batchType, setBatchType] = useState(Number(search.split('=')[1]));
  const [listId, setListId] = useState<any[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [dataTable, setDataTable] = useState<DataResponse<SimActivated[]>>();

  const { isCan } = useCan();
  const { data } = useFetch({ url: `${SEND_BATCH_URL}/${params.id}/detail`, setLoading });
  const { data: dataUser } = useFetch({ url: `/users` });
  const { data: dataTableBatch, fetchData: fetchDataTable } = useFetch({
    url: `${SEND_BATCH_URL}/${params.id}/${batchType === 1 ? 'ticket' : 'sim'}-list`,
  });

  useEffect(() => {
    setDataTable(dataTableBatch);

    if (dataTableBatch?.data) {
      setListId(
        dataTableBatch?.data.map((item: { id: number }) => {
          return item.id;
        }),
      );
    }
  }, [dataTableBatch]);

  const [form] = Form.useForm();

  const handleEditBtnClick = async () => {
    setIsEdit(!isEdit);
    if (isEdit) {
      if (!listId.length) {
        toast.error('Xin hãy chọn ticket');
        return;
      }

      try {
        const response = await batchApi.editSendBatchData(params.id, {
          item_ids: listId,
          type: 1,
        });
        const { status, data } = response;
        if (status === 200) {
          toast.success('Cập nhật batch thành công!');
          fetchDataTable();
        }
      } catch (error) {}
    }
  };

  const handleBtnRefreshClick = () => {
    window.location.reload();
  };

  const handleSendBatchBtnClick = async () => {
    try {
      await batchApi.submitSendBatchMBF(params.id);
      toast.success('Gửi MBF thành công!');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {}
  };

  const [query, setQuery] = useState({
    limit: 10,
    page: 1,
  });

  const onSearch = async (val: any) => {
    if (batchType === 1) {
      let params: TicketFilter = {
        limit: query.limit,
        page: 1,
        'filter.status': `$eq: 4`,
        'filter.kycTempStatus': '1',
      };
      if (val?.type) {
        params['filter.type'] = val.type;
      }
      if (val?.created_by) {
        params['filter.created_by'] = val.created_by;
      }
      if (val?.updated_by) {
        params['filter.updated_by'] = val.updated_by;
      }
      if (val?.created_at) {
        params['filter.created_at'] = `$btw:${moment(val?.created_at[0])
          .startOf('day')
          .format()},${moment(val?.created_at[1]).endOf('day').format()}`;
      }
      if (val?.updated_at) {
        params['filter.updated_at'] = `$btw:${moment(val?.updated_at[0])
          .startOf('day')
          .format()},${moment(val?.updated_at[1]).endOf('day').format()}`;
      }

      try {
        const response = await ticketApi.getTicketList(
          new URLSearchParams({ ...params } as any).toString(),
        );
        const { data } = response;
        setDataTable(data.data);
      } catch (error) {}
    }

    if (batchType === 2) {
      let params: SimFilter = {
        limit: query.limit,
        page: 1,
        'filter.kyc_temp_status': `$eq:3`,
        'filter.no_actived_ticket': '1',
      };
      if (val?.updated_by) {
        params['filter.kyc_temp_updated_by'] = val.updated_by;
      }
      if (val?.updated_at) {
        params['filter.updated_at'] = `$btw:${moment(val?.updated_at[0])
          .startOf('day')
          .format()},${moment(val?.updated_at[1]).endOf('day').format()}`;
      }
      try {
        const response = await simApi.getSimActivatedList(params);
        const { data } = response;
        setDataTable(data.data);
      } catch (error) {}
    }
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const { current, pageSize } = pagination;
    if (query.limit !== pageSize || current !== query.page) {
      setQuery({ ...query, limit: pageSize || 10, page: current || 1 });
      fetchDataTable({
        ...query,
        limit: pageSize,
        page: current,
      });
    }
  };

  const exportExcelHandler = () => {
    const removeColumn = [1, 2, 3, 4, 8, 9];
    let columnsSim = [...columns].filter((_x, index) => !removeColumn.includes(index));
    //@ts-ignorets-ignore÷
    columnsSim.insert(3, {
      title: 'Tình trạng',
      dataIndex: 'kyc_temp_status',
      render: (text: string, record: any) => {
        return KYCProfileTempStatusToText(record.kyc_temp_status);
      },
    });
    exportExcel(
      batchType === 1 ? columns : columnsSim,
      batchApi.getById,
      dataTableBatch.meta.totalItems,
      null,
      'batch' + params?.id,
      params?.id,
      batchType,
    );
  };

  return (
    <Fragment>
      <Button onClick={() => history.goBack()} style={{ marginBottom: '1rem' }}>
        Trở về
      </Button>
      <div className={`create-batch-modal is-detail ${!isEdit && 'checkbox-disabled'}`}>
        <Row gutter={[16, 16]}>
          <Col xl={9} xs={24}>
            <Row>
              <Col span={12}>
                Mã SendBatch: <span>{data?.code}</span>
              </Col>
              <Col span={12}>
                Tình trạng: <span>{batchStatusText(data?.status)}</span>
              </Col>
            </Row>
            <Row>
              <Col>
                <p>
                  Diễn giải: <span>{data?.description}</span>
                </p>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <p>
                  Tổng cộng: <span>{data?.total}</span>
                </p>
              </Col>
              <Col span={6}>
                <p>
                  Hoàn thành: <span>{data?.total_done}</span>
                </p>
              </Col>
              <Col span={6}>
                <p>
                  MBF từ chối: <span>{data?.total_reject}</span>
                </p>
              </Col>
              <Col span={6}>
                <p>
                  Lỗi hệ thống: <span>{data?.total_error}</span>
                </p>
              </Col>
            </Row>
          </Col>
          <Col xl={3} xs={24}>
            <p>
              Loại :{' '}
              <span style={{ fontWeight: 'bold' }}>{sendBatchTypeText(data?.sendbatch_type)} </span>
            </p>
          </Col>
          <Col xl={6} xs={12}>
            <Row>
              <p>
                Người tạo: <span>{data?.createdByUser && data?.createdByUser.name}</span>
              </p>
            </Row>
            <Row>
              <p>
                Thời gian tạo: <span>{moment(data?.created_at).format(DATE_FORMAT)}</span>
              </p>
            </Row>
          </Col>
          <Col xl={6} xs={12}>
            <Row>
              <p>
                Người cập nhật cuối: <span>{data?.updatedByUser && data?.updatedByUser.name}</span>
              </p>
            </Row>
            <Row>
              <p>
                Thời gian cập nhật cuối: <span>{moment(data?.updated_at).format(DATE_FORMAT)}</span>
              </p>
            </Row>
          </Col>
        </Row>
        <Form layout='vertical' form={form} onFinish={(val) => onSearch(val)}>
          {isEdit && batchType === 1 && <FilterTicket dataUser={dataUser}></FilterTicket>}
          {isEdit && batchType === 2 && <FilterSim dataUser={dataUser}></FilterSim>}
          <Row gutter={[16, 16]} className={'batch-control'}>
            {data?.status === BatchStatus.NEW ? (
              <>
                <Button type='primary' htmlType='submit'>
                  Load danh sách
                </Button>
                {isCan(Feature.TICKET_SENDBATCH_DETAIL, ActionText.UPDATE) && (
                  <Button type='primary' onClick={handleEditBtnClick}>
                    {isEdit ? 'Lưu' : 'Sửa'}
                  </Button>
                )}
                {isCan(Feature.TICKET_SENDBATCH_SEND_MBF, ActionText.SUBMIT) && (
                  <Button type='primary' onClick={handleSendBatchBtnClick} disabled={isEdit}>
                    Gửi MBF
                  </Button>
                )}
              </>
            ) : (
              <React.Fragment>
                <Button type='primary' onClick={handleBtnRefreshClick}>
                  Refresh
                </Button>
                {isCan(Feature.TICKET_SENDBATCH_DETAIL, ActionText.EXPORT) && (
                  <Button type='primary' onClick={exportExcelHandler}>
                    Export
                  </Button>
                )}
              </React.Fragment>
            )}
          </Row>
        </Form>
      </div>
      {batchType === 1 ? (
        <TicketTable data={dataTable} setListId={setListId} listId={listId} />
      ) : (
        <SimTable
          data={dataTable}
          setListId={setListId}
          handleTableChange={handleTableChange}
          currentPage={query.page}></SimTable>
      )}
    </Fragment>
  );
};

export default BatchDetailPage;

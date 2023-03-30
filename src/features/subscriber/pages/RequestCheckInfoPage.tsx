import { Button, Col, Form, Input, Row, Select, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import axiosClient from 'api/axiosClient';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import ResetButton from 'components/Button/ResetButton';
import SubmitButton from 'components/Button/SubmitButton';
import { Wrapper } from 'components/common/Wrapper';
import RangePickerField from 'components/Form/RangePickerField';
import SelectField from 'components/Form/SelectField';
import { BatchStatus, batchStatusText } from 'constants/batch.enum';
import { Format } from 'constants/date';
import { ActionText, Feature } from 'constants/permission';
import { AppContext } from 'context/AppContext';
import dayjs from 'dayjs';
import { filtersActions } from 'features/filtersSlice';
import useCan from 'hooks/useCan';
import useFetch from 'hooks/useFetch';
import moment from 'moment';
import { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { generateTableOrderNumber } from 'share/helper';
import { formatDateFromIso, parseISOString, uploadFormData } from 'utils';
import PaginationConfig from 'utils/panigationConfig';
import * as XLSX from 'xlsx';
import BatchSendNotiDetail from '../components/BatchSendNotiDetail';

const { Option } = Select;
function RequestCheckInfoPage() {
  const { requestCheckInfoFilter } = useAppSelector((state) => state.filters);
  const { setLoading } = useContext(AppContext);
  const formRef = useRef<any>();
  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [itemID, setItemID] = useState<number>();
  const [file, setFile] = useState<File>();
  const [dataFile, setDataFile] = useState<any>([]);
  const [error, setError] = useState();

  const { isCan } = useCan();
  const { data: userList } = useFetch({ url: '/users' });
  const { data: batchList, fetchData } = useFetch({
    url: '/send-batch/request-batch/list',
    param: requestCheckInfoFilter,
    setLoading,
  });

  const columns: ColumnsType<any> = [
    {
      title: 'STT',
      render: (value: any, record: any, index: number) => {
        return generateTableOrderNumber(
          requestCheckInfoFilter?.page,
          requestCheckInfoFilter?.limit,
          index,
        );
      },
    },
    {
      title: 'Ngày Import',
      dataIndex: 'created_at',
      render: (value: string) => {
        return formatDateFromIso(value, Format.DATE_TIME);
      },
    },
    {
      title: 'Batch ID',
      dataIndex: 'code',
    },
    {
      title: 'Tên File',
      dataIndex: 'extra_data',
      render: (value: any) => {
        return value?.file_name;
      },
    },
    {
      title: 'Ngày Bắt Đầu',
      dataIndex: 'extra_data',
      render: (value: any) => {
        return formatDateFromIso(value?.start_date, Format.DATE_TIME);
      },
    },
    {
      title: 'Ngày Kết Thúc',
      dataIndex: 'extra_data',
      render: (value: any) => {
        return formatDateFromIso(value?.end_date, Format.DATE_TIME);
      },
    },
    {
      title: 'Thời Gian Gửi Thông Báo',
      dataIndex: 'extra_data',
      render: (value: any) => {
        return value?.send_notification_date;
      },
    },
    {
      title: 'Tổng Cộng',
      dataIndex: 'extra_data',
      render: (value: any) => {
        return `${value?.success_total + value?.fail_total}`;
      },
    },
    {
      title: 'Import Thành Công',
      dataIndex: 'extra_data',
      render: (value: any) => {
        return value?.success_total;
      },
    },
    {
      title: 'Import Thất Bại',
      dataIndex: 'extra_data',
      render: (value: any) => {
        return value?.fail_total;
      },
    },
    {
      title: 'Người Thực Hiện',
      dataIndex: 'createdByUser',
      render: function (value: any) {
        return value?.name;
      },
    },
    {
      title: 'Trạng Thái',
      render: (value: any) => {
        return batchStatusText(value?.status, value?.type);
      },
    },
    {
      title: 'Chi Tiết Gửi SMS/Noti',
      render: (value: any) => {
        return (
          isCan(Feature.TICKET_REQUEST_BATCH_ACTION_DETAIL, ActionText.READ) &&
          [BatchStatus.PROCESSING_SMS_NOTIFICATION, BatchStatus.DONE].includes(value?.status) && (
            <span
              className='pointer'
              style={{
                color: '#1890ff',
              }}
              onClick={() => {
                setIsOpenModal(true);
                setItemID(value?.id);
              }}>
              Chi tiết
            </span>
          )
        );
      },
    },
    {
      title: 'Thao Tác',
      fixed: 'right',
      render: (value: any) => {
        return (
          isCan(Feature.TICKET_REQUEST_BATCH_DETAIL, ActionText.READ) && (
            <Link to={`/admin/subscriber/request-check-info/detail/${value?.id}`}>Chi tiết</Link>
          )
        );
      },
    },
  ];

  const readExcel = (file: File) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        //@ts-ignore
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray);
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { raw: false });

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d: any) => {
      setDataFile(d);
    });
  };

  const importHandler = async () => {
    if (dataFile.length === 0 || !file) return toast.error('Vui lòng chọn file!');

    try {
      setLoading(true);
      const createUrl = 'v2/send-batch/request-batch/create';
      const { data } = await axiosClient.post(createUrl, {
        items_total: dataFile.length,
        file_name: file?.name.replaceAll('.xlsx', '').replaceAll(' ', '') || '',
      });
      let numberFile = Math.ceil(dataFile.length / data?.data?.maxItemsPerFile);
      let dataChuck = dataFile.chunk_inefficient(data?.data?.maxItemsPerFile);
      let promises = [];
      const startDate = dayjs(parseISOString(dataChuck[0][0]['Ngày bắt đầu'])).format('DD/MM/YYYY');
      const endDate = dayjs(parseISOString(dataChuck[0][0]['Ngày kết thúc'])).format('DD/MM/YYYY');
      const timeSend = dataChuck[0][0]['Thời gian gửi thông báo'];
      const submitNumber = dataChuck[0][0]['Số lần gửi thông báo'];
      for (let i = 0; i < numberFile; i++) {
        const newExcel = convertExcel(dataChuck[i], {
          startDate,
          endDate,
          time_send: timeSend,
          submit_number: submitNumber,
        });
        const newFile = new File([newExcel], file?.name, {
          type: file?.type,
        });
        let resUpload = uploadFormData(data?.data?.presignedURL[i], newFile);
        promises.push(resUpload);
      }
      await Promise.all(promises);
      const submitUrl = '/send-batch/request-batch/submit';
      const resSubmit = await axiosClient.post(submitUrl, {
        batch_id: data.data?.batchId,
      });
      if (resSubmit.status === 200 || resSubmit.status === 201) {
        fetchData();
        setError(undefined);
        toast.success('Import thành công');
      }
      setFile(undefined);
      setLoading(false);
    } catch (error: any) {
      setError(error?.response?.data?.data?.reason);
      setLoading(false);
      console.log('Error:', error);
    }
  };

  const convertExcel = (data: any[], params: any) => {
    const rows = data.map((row: { [key: string]: string | number | boolean }) => {
      return {
        'Số điện thoại': row['Số điện thoại'],
        'Ngày bắt đầu': params?.startDate,
        'Ngày kết thúc': params?.endDate,
        'Thời gian gửi thông báo': params?.time_send,
        'Số lần gửi thông báo': params?.submit_number,
      };
    });

    /* generate worksheet and workbook */
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    /* fix headers */
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          'Số điện thoại',
          'Ngày bắt đầu',
          'Ngày kết thúc',
          'Thời gian gửi thông báo',
          'Số lần gửi thông báo',
        ],
      ],
      {
        origin: 'A1',
      },
    );

    /* create an csv file  */
    const xlsx = XLSX.write(workbook, { bookType: 'csv', type: 'buffer' });
    return xlsx;
  };

  function handlePageChange(value: any) {
    const params = {
      ...requestCheckInfoFilter,
      page: value?.current,
      limit: value?.pageSize,
    };

    dispatch(filtersActions.requestCheckInfoBatchList(params));
    fetchData(params);
  }

  function handleFormSearch(value: any) {
    const startCreatedAt = value.created_at && moment(value.created_at[0]).startOf('day').format();
    const endCreatedAt = value.created_at && moment(value.created_at[1]).endOf('day').format();
    const params = {
      ...requestCheckInfoFilter,
      page: 1,
      limit: 10,
      search: value?.search,
      'filter.created_at': value.created_at && `$btw:${startCreatedAt},${endCreatedAt}`,
      'filter.created_by': value?.created_by,
    };

    dispatch(filtersActions.requestCheckInfoBatchList(params));
    fetchData(params);
  }

  function onFillSearchForm() {
    formRef?.current?.setFieldsValue({
      search: requestCheckInfoFilter?.search,
      created_at: requestCheckInfoFilter?.['filter.created_at'] && [
        moment(requestCheckInfoFilter?.['filter.created_at']?.slice(5)?.split(',')[0]),
        moment(requestCheckInfoFilter?.['filter.created_at']?.slice(5)?.split(',')[1]),
      ],
      created_by: requestCheckInfoFilter?.['filter.created_by'] ?? '',
    });
  }

  useEffect(() => {
    onFillSearchForm();
    // eslint-disable-next-line
  }, [requestCheckInfoFilter]);

  useEffect(() => {
    file && readExcel(file);
  }, [file]);

  return (
    <Fragment>
      {isOpenModal ? (
        <BatchSendNotiDetail id={itemID} onCancelModal={() => setIsOpenModal(false)} />
      ) : null}

      <Wrapper>
        <Row gutter={16}>
          <Col span={12}>
            <Input disabled={true} placeholder='Tên file' value={file?.name} />
          </Col>
          <Col span={6} className='flex' style={{ columnGap: '1rem' }}>
            <Button
              onClick={() => {
                let input = document.getElementById('custom-file-input');
                input && input.click();
              }}>
              Chọn file
            </Button>
            <Button disabled={file ? false : true} onClick={importHandler}>
              Import
            </Button>
            <input
              type='file'
              id='custom-file-input'
              hidden
              accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
              onChange={(event: any) => {
                setFile(event.target.files[0]);
              }}
              onClick={(event: any) => (event.target.value = null)}
            />
          </Col>
          <Col span={6} className='text-right'>
            <Button
              download
              href='https://assets.mylocal.vn/admin-portal/file-templates/request_batch.xlsx'>
              Export template
            </Button>
          </Col>
        </Row>
        <span style={{ fontStyle: 'italic', color: '#ff2f48' }}>{error}</span>
        <Form layout='vertical' onFinish={handleFormSearch} ref={formRef}>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label='Tìm kiếm:' name='search'>
                <Input placeholder='BatchID, tên file' />
              </Form.Item>
            </Col>
            <Col span={6}>
              <RangePickerField label='Ngày import:' name='created_at' />
            </Col>
            <Col span={6}>
              <SelectField label='Người thực hiện:' name='created_by'>
                {userList?.data.map((item: any) => (
                  <Option key={item?.id} value={item?.id}>
                    {item?.name}
                  </Option>
                ))}
              </SelectField>
            </Col>
          </Row>

          <div className='row-button justify-end' style={{ marginTop: '1rem' }}>
            <SubmitButton type='primary' htmlType='submit' content='Tìm kiếm' />
            <ResetButton buttonRef={formRef} />
          </div>
        </Form>
      </Wrapper>

      <Table
        bordered
        scroll={{ x: 'max-content' }}
        columns={columns}
        dataSource={batchList?.data}
        rowKey={(record) => {
          return record?.id;
        }}
        onChange={handlePageChange}
        pagination={PaginationConfig(batchList)}
      />
    </Fragment>
  );
}

export default RequestCheckInfoPage;

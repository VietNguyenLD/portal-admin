import { UploadOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import sendBatchApi from 'api/sendBatchApi';
import { ActionText, Feature } from 'constants/permission';
import useCan from 'hooks/useCan';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { uploadFormData } from 'utils';
import * as XLSX from 'xlsx';

const { Option } = Select;
const { RangePicker } = DatePicker;

const URL_TEMPLATE = process.env.REACT_APP_BASE_TEMPLATE;

interface SearchUpdateListTicketProps {
  onSearch: (value: any) => void;
  loading: boolean;
  buttons?: React.ReactNode[];
  type?: string;
  fetchData: (options?: any) => void;
  users: any;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  exportExcelHandler: (options?: any) => void;
}

interface RowImport {
  phone_number: number;
  reason_ids: string;
  type: string;
}
const SearchImportListTicket: React.FC<SearchUpdateListTicketProps> = (
  props: SearchUpdateListTicketProps,
) => {
  const { onSearch, fetchData, setLoading, users, exportExcelHandler } = props;
  const { isCan } = useCan();
  const refBtnSearch = React.useRef(null);
  const [file, setFile] = useState<File>();
  const [dataFile, setDataFile] = useState<any>([]);
  const [form] = Form.useForm();
  const readExcel = (file: File) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        //@ts-ignore
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: 'buffer' });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d: any) => {
      d.pop();
      setDataFile(d);
    });
  };

  useEffect(() => {
    file && readExcel(file);
  }, [file]);

  const importHandler = async () => {
    if (dataFile.length === 0 || !file) return toast.error('Vui lòng chọn file!');
    setLoading(true);
    try {
      const { data } = await sendBatchApi.createImportBatch({
        items_total: dataFile.length,
        file_name: file?.name.replaceAll('.xlsx', '').replaceAll(' ', '') || '',
        type: 'importbatch',
      });
      let numberFile = Math.ceil(dataFile.length / data?.data?.maxItemsPerFile);
      let dataChuck = dataFile.chunk_inefficient(data?.data?.maxItemsPerFile);
      let promieses = [];
      for (let i = 0; i < numberFile; i++) {
        const newExcel = convertExcel(dataChuck[i]);
        const newFile = new File([newExcel], file?.name, {
          type: file?.type,
        });
        let resUpload = uploadFormData(data?.data?.presignedURL[i], newFile);
        promieses.push(resUpload);
      }
      await Promise.all(promieses);
      const resSubmit = await sendBatchApi.submitImportBatch({
        batch_id: data.data?.batchId,
      });
      if (resSubmit.status === 200 || resSubmit.status === 201) {
        setFile(undefined);
        fetchData({ limit: 10, page: 1 });
        return toast.success('Import thành công');
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      return console.error('Import thất bại!');
    }
  };
  const convertExcel = (data: RowImport[]) => {
    /* flatten objects */
    const rows = data.map((row: RowImport) => ({
      phone_number: row.phone_number,
      reason_ids: row.reason_ids,
      type: row.type || null,
    }));

    /* generate worksheet and workbook */
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    /* fix headers */
    XLSX.utils.sheet_add_aoa(worksheet, [['phone_number', 'reason_ids', 'type']], {
      origin: 'A1',
    });

    /* create an csv file  */
    const xlsx = XLSX.write(workbook, { bookType: 'csv', type: 'buffer' });
    return xlsx;
  };

  return (
    <Card className='search-box' style={{ marginBottom: 16 }}>
      <Form layout='vertical' form={form} onFinish={(val) => onSearch(val)}>
        <Row gutter={[20, 5]}>
          <Col xl={6}>
            <Input readOnly placeholder='' value={file?.name} />
          </Col>
          <Col xl={6} style={{ display: 'flex' }}>
            <Button
              style={{ marginRight: '20px' }}
              icon={<UploadOutlined />}
              onClick={() => {
                let input = document.getElementById('custom-file-input');
                input && input.click();
              }}>
              Chọn File
            </Button>
            {isCan(Feature.TICKET_IMPORTBATCH, ActionText.IMPORT) && (
              <Button
                type='primary'
                onClick={importHandler}
                disabled={dataFile.length === 0 || !file}>
                Import
              </Button>
            )}

            <input
              type='file'
              id='custom-file-input'
              hidden
              accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
              onChange={(e) => {
                //@ts-ignore
                setFile(e.target.files[0]);
              }}
            />
          </Col>
          <Col xl={12} style={{ textAlign: 'right' }}>
            {isCan(Feature.TICKET_IMPORTBATCH, ActionText.EXPORT) && (
              <a download href={URL_TEMPLATE} className='ant-btn ant-btn-primary'>
                Export template
              </a>
            )}
          </Col>
          <Col xs={12}>
            <Form.Item name='search' label='Tìm kiếm'>
              <Input placeholder='Search by Batch ID, File Name ...' />
            </Form.Item>
          </Col>
          <Col xl={4}>
            <Form.Item name='created_at' label='Ngày tạo:'>
              <RangePicker />
            </Form.Item>
          </Col>
          <Col xl={4} xs={12}>
            <Form.Item name='created_by' label='Người xử lý:'>
              <Select placeholder='Please choose' onChange={(val) => {}}>
                {users?.data.map((item: any) => (
                  <Option key={item.id} value={`$eq:${item.id}`}>
                    {item?.name}
                  </Option>
                ))}
                <Option value={undefined}>Tất cả</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={24} style={{ marginTop: '10px', textAlign: 'end' }}>
            <Button
              type='default'
              // htmlType='submit'
              onClick={exportExcelHandler}>
              Export
            </Button>
            <Button
              type='default'
              style={{ marginLeft: '10px' }}
              onClick={() => {
                form.resetFields();
                //@ts-ignore
                refBtnSearch && refBtnSearch?.current?.click();
              }}>
              Reset
            </Button>
            <Button
              ref={refBtnSearch}
              type='primary'
              className='search-box__search-button'
              htmlType='submit'>
              Search
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default SearchImportListTicket;

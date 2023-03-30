import { UploadOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import sendBatchApi from 'api/sendBatchApi';
import { ActionText, Feature } from 'constants/permission';
import useCan from 'hooks/useCan';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { replaceTextFileTxt } from 'share/helper';
import { uploadFormData } from 'utils';
import * as XLSX from 'xlsx';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface SearchUpdateListTicketProps {
  onSearch: (value: any) => void;
  loading: boolean;
  buttons?: React.ReactNode[];
  type?: string;
  fetchData: (options?: any) => void;
  users: any;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchImportListPhone: React.FC<SearchUpdateListTicketProps> = (
  props: SearchUpdateListTicketProps,
) => {
  const { onSearch, fetchData, users, setLoading } = props;
  const { isCan } = useCan();
  const refBtnSearch = React.useRef(null);
  const [file, setFile] = useState<File>();
  const [dataFile, setDataFile] = useState<any>([]);
  const [form] = Form.useForm();
  const readExcel = (file: File) => {
    try {
      const fileReader = new FileReader();
      if (file.name.search('.txt') !== -1) {
        const promise = new Promise((resolve, reject) => {
          fileReader.readAsText(file);
          fileReader.onload = (e) => {
            //@ts-ignore
            const txtArr = fileReader.result?.toString().split(' ').filter(Boolean);
            //@ts-ignore
            const dataChunk = txtArr?.chunk_inefficient(11);
            let data: any[] = [];
            dataChunk.pop();
            dataChunk.forEach((element: any[], index: number) => {
              if (index > 0) {
                data.push({
                  TEL_NUMBER: element.length > 1 && replaceTextFileTxt(element[0], ''),
                  TEL_TYPE: element.length > 2 && replaceTextFileTxt(element[1], ''),
                  SHOP_CODE: element.length > 3 && replaceTextFileTxt(element[2], ''),
                  HLR_EXISTS: element.length > 4 && replaceTextFileTxt(element[3], ''),
                  CRE_DATE:
                    element.length > 5 &&
                    replaceTextFileTxt(element[4], '-').slice(1, element[4].length - 1),
                  RE_USE: element.length > 6 && replaceTextFileTxt(element[5], ''),
                  CHANGE_DATETIME:
                    element.length > 7 &&
                    replaceTextFileTxt(element[6], '-').slice(1, element[6].length - 1),
                  STATUS: element.length > 8 && replaceTextFileTxt(element[7], ''),
                  SPE_NUMBER_TYPE: element.length > 9 && replaceTextFileTxt(element[8], ''),
                  KHO_TUDO: element.length > 10 && replaceTextFileTxt(element[9], ''),
                  CEN_CODE: element.length >= 11 && replaceTextFileTxt(element[10], ''),
                });
              }
            });

            resolve(data);
          };

          fileReader.onerror = (error) => {
            reject(error);
          };
        });

        return promise.then((d: any) => {
          setDataFile(d);
        });
      }

      const promise = new Promise((resolve, reject) => {
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
    } catch (error) {
      console.log(error);
    }
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
        type: 'resetbatch',
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
      return console.error(e);
    }
  };
  const convertExcel = (data: []) => {
    /* flatten objects */
    const rows = data.map((row: any) => ({
      tel_number: row.TEL_NUMBER,
      tel_type: row.TEL_TYPE,
      shop_code: row.SHOP_CODE,
      hlr_exists: row.HLR_EXISTS,
      cre_date: row.CRE_DATE,
      re_use: row.RE_USE,
      change_datetime: row.CHANGE_DATETIME,
      status: row.STATUS,
      spe_number_type: row.SPE_NUMBER_TYPE,
      kho_tudo: row.KHO_TUDO,
      cen_code: row.CEN_CODE,
    }));

    /* generate worksheet and workbook */
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    /* fix headers */
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          'TEL_NUMBER',
          'TEL_TYPE',
          'SHOP_CODE',
          'HLR_EXISTS',
          'CRE_DATE',
          'RE_USE',
          'CHANGE_DATETIME',
          'STATUS',
          'SPE_NUMBER_TYPE',
          'KHO_TUDO',
          'CEN_CODE',
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

  return (
    <Card className='search-box' style={{ marginBottom: 16 }}>
      <Form layout='vertical' form={form} onFinish={(val) => onSearch(val)}>
        <Row gutter={[20, 5]}>
          <Col xl={6}>
            <Input readOnly placeholder='' value={file?.name} />
          </Col>
          <Col xl={18} style={{ display: 'flex' }}>
            <Button
              style={{ marginRight: '20px' }}
              icon={<UploadOutlined />}
              onClick={() => {
                let input = document.getElementById('custom-file-input');
                input && input.click();
              }}>
              Chọn File
            </Button>

            {isCan(Feature.RESET_BATCH, ActionText.IMPORT) && (
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
              accept='.txt, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
              onChange={(e) => {
                //@ts-ignore
                setFile(e.target.files[0]);
              }}
            />
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

export default SearchImportListPhone;

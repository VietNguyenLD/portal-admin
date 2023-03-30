import {
  Checkbox,
  Col,
  DatePicker,
  Form,
  Image,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  Spin,
} from 'antd';
import { RangePickerProps } from 'antd/lib/date-picker';
import kycApi from 'api/kycApi';
import locationApi from 'api/location';
import simApi from 'api/simApi';
import { useAppDispatch } from 'app/hooks';
import UploadField from 'components/Form/UploadField';
import { KycIdType, KycIdTypeText } from 'constants/kyc.enum';
import { ticketActions } from 'features/ticketDetail/pages/ticketSlice';
import useLoading from 'hooks/useLoading';
import { KYCPrepareRequest, PrepareResponse } from 'models/kyc';
import { IssuePlace, Location, LocationListRequest } from 'models/location';
import moment from 'moment';
import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { refreshPage, uploadFormData } from 'utils/common';
import styles from './index.module.scss';

const { Option } = Select;

interface ModalUpdateTicketProps {
  openModal: boolean;
  data: {
    kyc: any;
    kyc_temp: any;
    sim: any;
    ticket: any;
  };
}

const dateFormatLocal = 'DD-MM-YYYY';
const ModalUpdateTicket: React.FC<ModalUpdateTicketProps> = ({ openModal, data }) => {
  const { kyc_temp, kyc } = data;
  const queryParams = new URLSearchParams(window.location.search);
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [issuePlace, setIssuePlace] = useState<IssuePlace[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [provinces, setProvinces] = useState<Location[]>([]);
  const [wards, setWards] = useState<Location[]>([]);
  const [previewImage, setPreviewImage] = useState('');
  const [photos, setPhotos] = useState<any>({
    id_front_img: '',
    id_back_img: '',
    selfie_img: '',
    signature_img: '',
  });

  const { loading, toggleLoading } = useLoading();

  const findImgPath = (data: any, imgProps: string) => {
    return data.data.find((item: PrepareResponse) => item.path_type === imgProps);
  };

  function getKey(value: string) {
    switch (value) {
      case 'id_front_img':
        return 'id_front_path';
      case 'id_back_img':
        return 'id_back_path';
      case 'selfie_img':
        return 'selfie_path';
      case 'signature_img':
        return 'signature_path';
    }
  }

  const handleSubmit = async (values: any) => {
    let paramsConfirm: any = {};
    try {
      toggleLoading(true);
      const paramsPrepare: KYCPrepareRequest = {
        kyc_id: kyc?.id,
        id_front_img: photos.id_front_img ? true : false,
        id_back_img: photos.id_back_img ? true : false,
        selfie_img: photos.selfie_img ? true : false,
        signature_img: photos.signature_img ? true : false,
      };

      var { status, data } = await kycApi.prepare(paramsPrepare);

      if (status === 201) {
        for (const property in photos) {
          if (photos[property]) {
            const key = getKey(property)!;
            const linkUpload = findImgPath(data, property).link_upload;
            const response = await uploadFormData(linkUpload, photos[property]);
            if (response?.status === 200) {
              paramsConfirm[key] = response?.data?.data?.url;
            }
          }
        }
      }

      paramsConfirm = {
        ...paramsConfirm,
        address: values.address,
        full_name: values.full_name,
        gender: values.gender,
        id_type: values.id_type,
        province_code: values.province_code,
        district_code: values.district_code,
        issue_place_code: values.issue_place_code,
        ward_code: values.ward_code,
        kyc_id: kyc?.id,
        id_number: values?.idNumber,
        expiry_date: kyc_temp?.expiry_date || kyc?.expiry_date,
        dob: values.dob && values['dob']?.format('YYYY-MM-DD'),
        issue_date: values.dob && values['issue_date']?.format('YYYY-MM-DD'),
        isCommittingKyc: values.commit,
      };

      const resConfirm = await kycApi.confirm(paramsConfirm);
      if (resConfirm.status === 201) {
        onRefeshData();
        handleCancel();
        toast.success('Cập nhật thông tin thành công');
        refreshPage();
      }
    } catch (error: any) {
      toggleLoading(false);
      console.log(error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    dispatch(ticketActions.openModal({ isOpen: false }));
  };

  const onRefeshData = async () => {
    try {
      const { data } = await simApi.getSimInfoBySerial(queryParams.get('serial_number') as string);
      dispatch(ticketActions.setSimDatail(data.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (openModal) {
      onRefeshData();
      onFill();
      getLocationIssue();
      getLocation({ level: 1 });
    }
    // eslint-disable-next-line
  }, [openModal]);

  const getLocationIssue = async () => {
    const { status, data } = await locationApi.getIssuePlace();
    if (status === 200 && data) {
      setIssuePlace(data.data);
    }
  };

  const getLocation = async (params: LocationListRequest) => {
    try {
      const { status, data } = await locationApi.getListLocation(params);
      if (status === 200 && data) {
        if (params.level === 1) {
          setProvinces(data.data);
        }
        if (params.level === 2) {
          setDistricts(data.data);
        }
        if (params.level === 3) {
          setWards(data.data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onFill = () => {
    form.setFieldsValue({
      full_name: kyc_temp?.full_name || kyc?.fullname,
      dob: (kyc_temp?.dob && moment(kyc_temp?.dob)) || (kyc?.dob && moment(kyc?.dob)),
      gender:
        kyc_temp?.gender == undefined || kyc_temp?.gender == null ? kyc.gender : kyc_temp?.gender,
      id_type: kyc_temp?.id_type || kyc?.idType,
      issue_date:
        (kyc_temp?.issue_date && moment(kyc_temp?.issue_date)) ||
        (kyc?.issueDate && moment(kyc?.issueDate)),
      issue_place_code: kyc_temp?.issue_place_code || kyc?.issuePlaceCode,
      address: kyc_temp?.address || kyc?.address,
      district_code: kyc_temp?.district || kyc?.district,
      province_code: kyc_temp?.province || kyc?.province,
      ward_code: kyc_temp?.ward || kyc?.ward,
      idNumber: kyc_temp?.id_number || kyc?.idNumber,
      commit: kyc_temp?.is_committing_kyc_info || kyc?.isCommitingKYCInfo || false,
    });
  };

  const handleChangeProvince = (code: string) => {
    form.setFieldsValue({
      district_code: '',
      ward_code: '',
    });
    const province = provinces.find((x: Location) => x.code === code);
    getLocation({ level: 2, parent_id: province?.id });
    form.setFieldsValue({
      district: null,
      ward: null,
    });
  };

  const handleChangeDistrict = (code: string) => {
    form.setFieldsValue({
      ward_code: '',
    });
    const district = districts.find((x: Location) => x.code === code);
    getLocation({ level: 3, parent_id: district?.id });
    form.setFieldsValue({
      ward: null,
    });
  };

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current && current > moment().endOf('day');
  };

  const handleUploadChange = (event: BaseSyntheticEvent) => {
    setPhotos({
      ...photos,
      [event.target.name]: event.target.files[0],
    });
  };

  return (
    <Modal
      title='Cập Nhật Thông Tin Thuê Bao'
      width='100%'
      open={openModal}
      okText='Cập nhật'
      cancelText='Huỷ'
      onOk={form.submit}
      onCancel={handleCancel}>
      <Spin spinning={loading}>
        <Form
          layout='vertical'
          form={form}
          onFinish={handleSubmit}
          style={{ position: 'relative' }}>
          <Row gutter={24}>
            <Col span={15}>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label='Tên chủ thuê bao:'
                    name='full_name'
                    rules={[{ required: true, message: 'Vui lòng nhập tên thuê bao!' }]}>
                    <Input placeholder='Nhập tên chủ thuê bao' />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label='Ngày sinh'
                    name='dob'
                    rules={[{ required: true, message: 'Vui lòng nhập ngày sinh thuê bao!' }]}>
                    <DatePicker format={dateFormatLocal} disabledDate={disabledDate} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label='Giới tính:'
                    name='gender'
                    rules={[{ required: true, message: 'Vui lòng chọn giới tính thuê bao!' }]}>
                    <Radio.Group>
                      <Radio value={0}> Nam </Radio>
                      <Radio value={1}> Nữ </Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label='Loại giấy tờ:'
                    name='id_type'
                    rules={[{ required: true, message: 'Vui lòng chọn loại giấy tờ thuê bao!' }]}>
                    <Radio.Group>
                      <Radio value={KycIdType.CITIZEN_IDENTITY_CARD}>
                        {KycIdTypeText.CITIZEN_IDENTITY_CARD}
                      </Radio>
                      <Radio value={KycIdType.PASSPORT}> {KycIdTypeText.PASSPORT} </Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name='idNumber' label='Số CMND:' className='form-item'>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label='Ngày cấp:'
                    name='issue_date'
                    rules={[{ required: true, message: 'Vui lòng nhập ngày cấp!' }]}>
                    <DatePicker format={dateFormatLocal} disabledDate={disabledDate} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label='Nơi cấp:' name='issue_place_code'>
                    <Select>
                      {issuePlace.map((item) => (
                        <Option key={item.code} value={item?.code}>
                          {item?.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label='Tỉnh thành:'
                    name='province_code'
                    rules={[{ required: true, message: 'Vui lòng chọn tỉnh thành!' }]}>
                    <Select
                      onChange={handleChangeProvince}
                      showSearch
                      filterOption={(input, option) =>
                        (option!.children as unknown as string)
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }>
                      {provinces.map((item: Location) => (
                        <Option key={item.code} value={item.code}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label='Quận/huyện:'
                    name='district_code'
                    rules={[{ required: true, message: 'Vui lòng chọn quận/huyện!' }]}>
                    <Select
                      onChange={handleChangeDistrict}
                      showSearch
                      filterOption={(input, option) =>
                        (option!.children as unknown as string)
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }>
                      {districts.map((item: Location) => (
                        <Option key={item.code} value={item.code}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label='Phường xã:'
                    name='ward_code'
                    rules={[{ required: true, message: 'Vui lòng chọn phường xã!' }]}>
                    <Select
                      showSearch
                      filterOption={(input, option) =>
                        (option!.children as unknown as string)
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }>
                      {wards.map((item: Location) => (
                        <Option key={item.code} value={item.code}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={16}>
                  <Form.Item
                    label='Địa chỉ:'
                    name='address'
                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
                    <Input placeholder='Nhập địa chỉ' />
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            <Col span={9} className={styles.updatePreviewImg}>
              <div>{previewImage ? <Image src={previewImage} /> : null}</div>
            </Col>
          </Row>

          <div className={styles.updateUpload}>
            <UploadField
              label='CMND mặt trước'
              name='id_front_img'
              value={kyc_temp?.id_front_img || kyc?.frontImg}
              onUploadChange={handleUploadChange}
              onImageClick={(imgBase64: string) => setPreviewImage(imgBase64)}
            />
            <UploadField
              label='CMND mặt sau'
              name='id_back_img'
              value={kyc_temp?.id_back_img || kyc?.backImg}
              onUploadChange={handleUploadChange}
              onImageClick={(imgBase64: string) => setPreviewImage(imgBase64)}
            />
            <UploadField
              label='Chân dung'
              name='selfie_img'
              value={kyc_temp?.selfie_img || kyc?.faceImg}
              onUploadChange={handleUploadChange}
              onImageClick={(imgBase64: string) => setPreviewImage(imgBase64)}
            />
            <UploadField
              label='Chữ ký'
              name='signature_img'
              value={kyc_temp?.signature_img || kyc?.signImg}
              onUploadChange={handleUploadChange}
              onImageClick={(imgBase64: string) => setPreviewImage(imgBase64)}
            />
          </div>

          <div className={styles.updateCommit}>
            <Form.Item name='commit' valuePropName='checked'>
              <Checkbox>Tôi cần câu cam kết về thông tin CMND/CCCD hoặc passport</Checkbox>
            </Form.Item>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default ModalUpdateTicket;

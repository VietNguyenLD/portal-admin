import { Button, Checkbox, Col, Form, Image, Input, Modal, Radio, Row, Select, Spin } from 'antd';
import kycApi from 'api/kycApi';
import locationApi from 'api/location';
import DatePickerField from 'components/Form/DatePickerField';
import UploadField from 'components/Form/UploadField';
import { Gender } from 'constants/common.enum';
import { KycIdType } from 'constants/kyc.enum';
import { KYCPrepareRequest, PrepareResponse } from 'models/kyc';
import { Location } from 'models/location';
import moment from 'moment';
import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { refreshPage, uploadFormData } from 'utils';
import { genderTypeToText } from 'utils/ticket';
const { Option } = Select;

function UpdateKycInfoModal(props: any) {
  const [form] = Form.useForm();
  const { isShowing, toggle, simDetail } = props;
  const KYC = simDetail?.kyc;
  const KYCTemp = simDetail?.kyc_temp;

  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [provinceList, setProvinceList] = useState<Location[]>([]);
  const [districtList, setDistrictList] = useState<Location[]>([]);
  const [wardList, setWardList] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [issuePlace, setIssuePlace] = useState<any>([]);
  const [previewImage, setPreviewImage] = useState('');
  const [photos, setPhotos] = useState<any>({
    id_front_img: '',
    id_back_img: '',
    selfie_img: '',
    signature_img: '',
  });

  const findImgPath = (data: any, imgProps: string) => {
    return data.data.find((item: PrepareResponse) => item.path_type === imgProps);
  };

  const getIssuePlace = async () => {
    const response = await locationApi.getIssuePlace();
    const { status, data } = response;
    if (status === 200) {
      setIssuePlace(data.data);
    }
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

  const onFill = () => {
    form.setFieldsValue({
      fullname: KYCTemp?.full_name || KYC.fullname,
      dob: KYCTemp?.dob ? moment(KYCTemp?.dob) : moment(KYC.dob),
      gender: KYCTemp?.gender || KYC.gender,
      idType: KYCTemp?.id_type || KYC.idType,
      idNumber: KYCTemp?.id_number || KYC.idNumber,
      issueDate: KYCTemp.issue_date ? moment(KYCTemp?.issue_date) : moment(KYC.issueDate),
      issuePlace: KYCTemp?.issue_place_code || KYC.issuePlaceCode,
      province: KYCTemp?.province_code || KYC.provinceCode,
      district: KYCTemp?.district_code || KYC.districtCode,
      ward: KYCTemp?.ward_code || KYC.wardCode,
      address: KYCTemp?.address || KYC.address,
      commit: KYCTemp?.is_committing_kyc_info || KYC?.isCommitingKYCInfo || false,
    });
  };

  const handleSaveClick = async (values: any) => {
    let confirmBody: any = {};
    const prepareBody: KYCPrepareRequest = {
      kyc_id: KYC?.id,
      id_front_img: photos.id_front_img ? true : false,
      id_back_img: photos.id_back_img ? true : false,
      selfie_img: photos.selfie_img ? true : false,
      signature_img: photos.signature_img ? true : false,
    };
    try {
      setLoading(true);
      let { status, data } = await kycApi.prepare(prepareBody);
      if (status === 201) {
        for (const property in photos) {
          if (photos[property]) {
            const key = getKey(property)!;
            const linkUpload = findImgPath(data, property).link_upload;
            const response = await uploadFormData(linkUpload, photos[property]);
            if (response?.status === 200) {
              confirmBody[key] = response?.data?.data?.url;
            }
          }
        }
      }

      confirmBody = {
        ...confirmBody,
        kyc_id: KYC?.id,
        full_name: values.fullname,
        gender: values.gender,
        id_type: values.idType,
        id_number: values.idNumber,
        dob: values.dob?.format('YYYY-MM-DD'),
        issue_date: values.issueDate?.format('YYYY-MM-DD'),
        issue_place_code: values.issuePlace,
        province_code: values.province,
        district_code: values.district,
        ward_code: values.ward,
        address: values.address,
        isCommittingKyc: values.commit,
      };

      const confirmRes = await kycApi.confirm(confirmBody);
      setLoading(false);
      if (confirmRes.status === 201) {
        toast.success('Cập nhật thành công');
        refreshPage();
        toggle();
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const handleProvinceChange = (code: string) => {
    setProvince(code);
    form.setFieldsValue({
      district: '',
      ward: '',
    });
  };

  const handleDistrictChange = (code: string) => {
    setDistrict(code);
    form.setFieldsValue({
      ward: '',
    });
  };

  const getProvinceList = async () => {
    const provinceRes = await locationApi.getListLocation({
      level: 1,
    });
    setProvinceList(provinceRes.data.data);
  };

  useEffect(() => {
    const getDistrictList = async (code: string) => {
      const province: Location = provinceList.find(
        (item: Location) => item.code === code,
      ) as Location;
      if (typeof province !== 'undefined') {
        setLoading(true);
        const districtRes = await locationApi.getListLocation({
          level: 2,
          parent_id: province.id,
        });
        setLoading(false);
        setDistrictList(districtRes.data.data);
      }
    };

    getDistrictList(province);
  }, [provinceList, province]);

  useEffect(() => {
    getIssuePlace();
    getProvinceList();
  }, []);

  useEffect(() => {
    onFill();
    setProvince(KYCTemp?.province_code ? KYCTemp?.province_code : KYC.provinceCode);
    setDistrict(KYCTemp?.district_code ? KYCTemp?.district_code : KYC.districtCode);
    // eslint-disable-next-line
  }, [simDetail]);

  useEffect(() => {
    const getWardList = async (code: string) => {
      const district: Location = districtList.find(
        (item: Location) => item.code === code,
      ) as Location;
      if (typeof district !== 'undefined') {
        setLoading(true);
        const districtRes = await locationApi.getListLocation({
          level: 3,
          parent_id: district.id,
        });
        setLoading(false);
        setWardList(districtRes.data.data);
      }
    };
    getWardList(district);
  }, [districtList, district]);

  const handleUploadChange = (event: BaseSyntheticEvent) => {
    setPhotos({
      ...photos,
      [event.target.name]: event.target.files[0],
    });
  };

  return (
    <Modal
      forceRender
      width={'100%'}
      wrapClassName='update-kyc-modal'
      footer={null}
      centered
      title='Cập Nhật Thông Tin Thuê Bao'
      open={isShowing}
      onCancel={() => toggle()}>
      <Spin spinning={loading}>
        <Form form={form} onFinish={handleSaveClick} className='update_form' layout='vertical'>
          <Row gutter={24}>
            <Col span={15}>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name='fullname' label='Tên chủ thuê bao:'>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <DatePickerField label='Ngày sinh:' name='dob' />
                </Col>

                <Col span={8}>
                  <Form.Item name='gender' label='Giới tính:'>
                    <Radio.Group>
                      <Radio value={Gender.MALE}>{genderTypeToText(Gender.MALE)}</Radio>
                      <Radio value={Gender.FEMALE}>{genderTypeToText(Gender.FEMALE)}</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name='idType' label='Loại giấy tờ:'>
                    <Radio.Group>
                      <Radio value={KycIdType.CITIZEN_IDENTITY_CARD}>CMND</Radio>
                      <Radio value={KycIdType.PASSPORT}>Passport</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name='idNumber' label='Số CMND:'>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <DatePickerField label='Ngày cấp:' name='issueDate' />
                </Col>
                <Col span={8}>
                  <Form.Item name='issuePlace' label='Nơi cấp:'>
                    <Select showSearch>
                      {issuePlace?.map((item: any) => {
                        return (
                          <Option value={item.code} key={item.id}>
                            {item.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name='province' label='Tỉnh/Thành phố:'>
                    <Select showSearch onChange={handleProvinceChange}>
                      {provinceList?.map((item: any) => {
                        return (
                          <Option value={item.code} key={item.id}>
                            {item.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name='district' label='Quận/Huyện:'>
                    <Select showSearch onChange={handleDistrictChange}>
                      {districtList?.map((item: any) => {
                        return (
                          <Option value={item.code} key={item.id}>
                            {item.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name='ward' label='Phường/Xã:'>
                    <Select showSearch>
                      {wardList.map((item: any) => {
                        return (
                          <Option value={item.code} key={item.id}>
                            {item.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={16}>
                  <Form.Item name='address' label='Địa chỉ:'>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={9} className='update_preview-img'>
              <div>{previewImage ? <Image src={previewImage} /> : null}</div>
            </Col>
          </Row>

          <div className='update_upload'>
            <UploadField
              label='CMND mặt trước'
              name='id_front_img'
              value={KYCTemp?.id_front_img || KYC?.frontImg}
              onUploadChange={handleUploadChange}
              onImageClick={(imgBase64: string) => setPreviewImage(imgBase64)}
            />
            <UploadField
              label='CMND mặt sau'
              name='id_back_img'
              value={KYCTemp?.id_back_img || KYC?.backImg}
              onUploadChange={handleUploadChange}
              onImageClick={(imgBase64: string) => setPreviewImage(imgBase64)}
            />
            <UploadField
              label='Chân dung'
              name='selfie_img'
              value={KYCTemp?.selfie_img || KYC?.faceImg}
              onUploadChange={handleUploadChange}
              onImageClick={(imgBase64: string) => setPreviewImage(imgBase64)}
            />
            <UploadField
              label='Chữ ký'
              name='signature_img'
              value={KYCTemp?.signature_img || KYC?.signImg}
              onUploadChange={handleUploadChange}
              onImageClick={(imgBase64: string) => setPreviewImage(imgBase64)}
            />
          </div>

          <div style={{ marginTop: 10 }}>
            <Form.Item name='commit' valuePropName='checked'>
              <Checkbox>Tôi cần câu cam kết về thông tin CMND/CCCD hoặc passport</Checkbox>
            </Form.Item>
          </div>

          <div className='update_btn'>
            <Button danger onClick={toggle}>
              Hủy
            </Button>
            <Button htmlType='submit'>Lưu</Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
}

export default UpdateKycInfoModal;

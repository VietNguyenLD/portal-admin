import { Col, Image, Row, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useAppSelector } from 'app/hooks';
import { BorderText } from 'components/BorderText';
import ModalUpdateTicket from 'components/Modal/updateTicket';
import { Format } from 'constants/date';
import Images from 'constants/images';
import moment from 'moment';
import { convertStatusPhone, DATE_FORMAT } from 'share/helper';
import { formatDateFromIso } from 'utils';
import { kycProfileTempStatusText } from 'utils/kyc';
import { genderTypeToText, idTypeToText } from 'utils/ticket';
import styles from './index.module.scss';

const { Text } = Typography;

const columns: ColumnsType<any> = [
  {
    title: 'STT',
    dataIndex: 'id',
    render: (_value, _record, index) => index + 1,
  },
  {
    title: 'Thời gian',
    dataIndex: 'sim',
  },
  {
    title: 'Người thực hiện',
    dataIndex: 'sim',
    sorter: {
      compare: (a: any, b: any) => parseInt(a?.sim?.phone_number) - parseInt(b?.sim?.phone_number),
      multiple: 1,
    },
  },
  {
    title: 'Hành động',
    dataIndex: 'kycProfile',
    sorter: {
      compare: (a: any, b: any) => a?.kycProfile?.fullname.length - b?.kycProfile?.fullname.length,
      multiple: 1,
    },
    render: (item) => {
      return item?.fullname;
    },
  },
  {
    title: 'Nội dung',
    dataIndex: 'sim',
    sorter: {
      compare: (a: any, b: any) => a?.sim?.mbf_code.length - b?.sim?.mbf_code.length,
      multiple: 1,
    },
  },
  {
    title: 'Hình ảnh',
    dataIndex: 'sim',
    render: (item: any) => {
      return item?.activationRequest?.deviceId;
    },
  },
];

export const DEFAULT_TEXT = '';
const SimInfo = (props: any) => {
  const { simDetail } = props;
  const { isOpenModal, simDatail } = useAppSelector((state) => state.ticket);

  if (!simDatail) {
    return null;
  }

  return (
    <>
      <ModalUpdateTicket openModal={isOpenModal} data={simDatail} />
      <BorderText title='Thông tin SIM' className={styles.siminfo_wrapper}>
        <Row gutter={[16, 16]} className={styles.siminfo_wrapper__row}>
          <Col span={6}>
            Sim serial:<Text mark> {simDetail?.sim?.serial_number}</Text>
          </Col>
          <Col span={6}>Phone number: {simDetail?.sim?.phone_number}</Col>
          <Col span={6}>MBF code: {simDetail?.sim?.mbf_code}</Col>
          <Col span={6}>
            Ngày kích hoạt: {moment(simDetail?.sim?.activated_at).format(DATE_FORMAT)}
          </Col>
        </Row>
        <Row gutter={[16, 16]} className={styles.siminfo_wrapper__row}>
          <Col span={6}>Type of SIM: {simDetail?.sim?.simType?.name}</Col>
          <Col span={6}>SIM Lot: {simDetail?.sim?.simLot?.name}</Col>
          <Col span={6}>Nhà phân phối: {simDetail?.sim?.simLot?.distributor?.name}</Col>
          <Col span={6}>Device id: {simDetail?.sim?.device_id} </Col>
        </Row>
      </BorderText>
      <BorderText title='Thông tin thuê bao' className={styles.siminfo_wrapper}>
        <Row gutter={[16, 16]} className={styles.siminfo_wrapper__row}>
          <Col span={6}>
            Trạng thái:
            <Text mark> {convertStatusPhone(simDetail?.kyc?.subscriptionStatus)}</Text>
          </Col>
          <Col span={6}>Tên chủ thuê bao: {simDetail?.kyc?.fullname}</Col>
          <Col span={6}>Ngày sinh: {moment(simDetail?.kyc?.dob).format('DD/MM/YYYY')}</Col>
          <Col span={6}>Giới tính: {genderTypeToText(simDetail?.kyc?.gender)}</Col>
        </Row>
        <Row gutter={[16, 16]} className={styles.siminfo_wrapper__row}>
          <Col span={6}>Loại giấy tờ: {idTypeToText(simDetail?.kyc?.idType)}</Col>
          <Col span={6}>
            Số {simDetail?.kyc?.idType === 0 ? 'CMND' : 'CCCD'}: {simDetail?.kyc?.idNumber}
          </Col>
          <Col span={6}>Ngày cấp: {moment(simDetail?.kyc?.issueDate).format('DD/MM/YYYY')}</Col>
          <Col span={6}>Nơi cấp: {simDetail?.kyc?.issuePlace}</Col>
        </Row>
        <Row gutter={[16, 16]} className={styles.siminfo_wrapper__row}>
          <Col span={6}>Tỉnh/Thành phố: {simDetail?.kyc?.province}</Col>
          <Col span={6}>Quận/Huyện: {simDetail?.kyc?.district}</Col>
          <Col span={6}>Phường/Xã: {simDetail?.kyc?.ward}</Col>
        </Row>
        <Row gutter={[16, 16]} className={styles.siminfo_wrapper__row}>
          <Col span={24}>
            Địa chỉ: {simDetail?.kyc?.address}, {simDetail?.kyc?.ward}, {simDetail?.kyc?.district},{' '}
            {simDetail?.kyc?.province}
          </Col>
        </Row>
        <Row gutter={[10, 16]} className={styles.siminfo_wrapper__row}>
          <div className={styles.siminfo_wrapper__col_title}>
            <div>Thông tin hiện tại</div>
          </div>
          <Col span={4}>
            <div className={styles.item_image}>
              <Image
                className={styles.item_image__img}
                src={simDetail?.kyc?.frontImg}
                onError={(e) => {
                  e.currentTarget.src = Images.IMG_DEFAULT;
                }}
              />
              <div className={styles.item_image__text}>Mặt trước</div>
            </div>
          </Col>
          <Col span={4}>
            <div className={styles.item_image}>
              <Image
                src={simDetail?.kyc?.backImg}
                className={styles.item_image__img}
                onError={(e) => {
                  e.currentTarget.src = Images.IMG_DEFAULT;
                }}
              />
              <div className={styles.item_image__text}>Mặt sau</div>
            </div>
          </Col>
          <Col span={4}>
            <div className={styles.item_image}>
              <Image
                src={simDetail?.kyc?.faceImg}
                className={styles.item_image__img}
                onError={(e) => {
                  e.currentTarget.src = Images.IMG_DEFAULT;
                }}
              />
              <div className={styles.item_image__text}>Chân dung</div>
            </div>
          </Col>
          <Col span={4}>
            <div className={styles.item_image}>
              <Image
                src={simDetail?.kyc?.signImg}
                className={styles.item_image__img}
                onError={(e) => {
                  e.currentTarget.src = Images.IMG_DEFAULT;
                }}
              />
              <div className={styles.item_image__text}>Chữ ký</div>
            </div>
          </Col>
        </Row>
      </BorderText>

      <BorderText title='Thông tin thuê bao cập nhật' className={styles.siminfo_wrapper}>
        <Row gutter={[16, 16]} className={styles.siminfo_wrapper__row}>
          <Col span={6}>
            Trạng thái cập nhật: {kycProfileTempStatusText(simDetail?.kyc_temp?.status)}
          </Col>
          <Col span={6}>Tên chủ thuê bao: {simDetail?.kyc_temp?.full_name || DEFAULT_TEXT}</Col>
          <Col span={6}>
            Ngày sinh:{' '}
            {simDetail?.kyc_temp?.dob
              ? moment(simDetail?.kyc_temp?.dob).format('DD/MM/YYYY')
              : DEFAULT_TEXT}
          </Col>
          <Col span={6}>Giới tính: {genderTypeToText(simDetail?.kyc_temp?.gender)}</Col>
        </Row>
        <Row gutter={[16, 16]} className={styles.siminfo_wrapper__row}>
          <Col span={6}>
            Loại giấy tờ:{' '}
            {simDetail?.kyc_temp?.id_type
              ? idTypeToText(simDetail?.kyc_temp?.id_type)
              : DEFAULT_TEXT}
          </Col>
          <Col span={6}>Số CMND/CCCD: {simDetail?.kyc_temp?.id_number || DEFAULT_TEXT}</Col>
          <Col span={6}>
            Ngày cấp:{' '}
            {simDetail?.kyc_temp?.issue_date
              ? moment(simDetail?.kyc_temp?.issue_date).format('DD/MM/YYYY')
              : DEFAULT_TEXT}
          </Col>
          <Col span={6}>Nơi cấp: {simDetail?.kyc_temp?.issue_place || DEFAULT_TEXT}</Col>
        </Row>
        <Row gutter={[16, 16]} className={styles.siminfo_wrapper__row}>
          <Col span={6}>Phường/ xã: {simDetail?.kyc_temp?.ward || DEFAULT_TEXT}</Col>
          <Col span={6}>Quận/ huyện: {simDetail?.kyc_temp?.district || DEFAULT_TEXT}</Col>
          <Col span={6}>Tỉnh/ thành phố: {simDetail?.kyc_temp?.province || DEFAULT_TEXT}</Col>
        </Row>
        <Col span={24}>
          Địa chỉ: {simDetail?.kyc_temp?.address}, {simDetail?.kyc_temp?.ward},{' '}
          {simDetail?.kyc_temp?.district}, {simDetail?.kyc_temp?.province}
        </Col>
        <Row
          gutter={[10, 16]}
          className={styles.siminfo_wrapper__row}
          style={{ marginTop: '32px' }}>
          <div className={styles.siminfo_wrapper__col_title}>
            <div>Thông tin update:</div>
          </div>
          <Col span={4}>
            <div className={styles.item_image}>
              <Image
                onError={(e) => {
                  e.currentTarget.src = Images.IMG_DEFAULT;
                }}
                src={simDetail?.kyc_temp?.id_front_img || Images.IMG_DEFAULT}
                preview={simDetail?.kyc_temp?.id_front_img ? true : false}
                className={styles.item_image__img}
              />
              <div className={styles.item_image__text}>Mặt trước</div>
            </div>
          </Col>
          <Col span={4}>
            <div className={styles.item_image}>
              <Image
                src={simDetail?.kyc_temp?.id_back_img || Images.IMG_DEFAULT}
                preview={simDetail?.kyc_temp?.id_back_img ? true : false}
                className={styles.item_image__img}
                onError={(e) => {
                  e.currentTarget.src = Images.IMG_DEFAULT;
                }}
              />
              <div className={styles.item_image__text}>Mặt sau</div>
            </div>
          </Col>
          <Col span={4}>
            <div className={styles.item_image}>
              <Image
                src={simDetail?.kyc_temp?.selfie_img || Images.IMG_DEFAULT}
                preview={simDetail?.kyc_temp?.selfie_img ? true : false}
                className={styles.item_image__img}
                onError={(e) => {
                  e.currentTarget.src = Images.IMG_DEFAULT;
                }}
              />
              <div className={styles.item_image__text}>Chân dung</div>
            </div>
          </Col>
          <Col span={4}>
            <div className={styles.item_image}>
              <Image
                src={simDetail?.kyc_temp?.signature_img || Images.IMG_DEFAULT}
                preview={simDetail?.kyc_temp?.signature_img ? true : false}
                className={styles.item_image__img}
                onError={(e) => {
                  e.currentTarget.src = Images.IMG_DEFAULT;
                }}
              />
              <div className={styles.item_image__text}>Chữ ký</div>
            </div>
          </Col>
          <Col span={4}>
            <div className={styles.item_image}>
              {simDetail?.kyc_temp?.documentURL && (
                <Image
                  height={204}
                  className={styles.item_image__img_hd}
                  src={simDetail?.kyc_temp?.documentURL || Images.IMG_DEFAULT}
                  preview={simDetail?.kyc_temp?.documentURL ? true : false}
                  onError={(e) => {
                    e.currentTarget.src = Images.IMG_DEFAULT;
                  }}
                />
              )}
            </div>
          </Col>
        </Row>
        <Row>
          <Col>Người cập nhật: {simDetail?.kyc_temp?.updated_by_user}</Col>
        </Row>
        <Row>
          <Col>
            Ngày cập nhật: {formatDateFromIso(simDetail?.kyc_temp?.updated_at, Format.DATE_TIME)}
          </Col>
        </Row>
      </BorderText>
      {/* <BorderText title='Lịch sử thay đổi' className={styles.siminfo_wrapper}>
        <Row gutter={[16, 16]} className={styles.siminfo_wrapper__row}>
          <Table
            loading={loadingTable}
            columns={columns}
            dataSource={histories}
            bordered
            pagination={false}
          />
        </Row>
      </BorderText> */}
    </>
  );
};

export default SimInfo;

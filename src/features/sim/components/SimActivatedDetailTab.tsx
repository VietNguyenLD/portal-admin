import { Button, Row, Spin, Table } from 'antd';
import kycApi from 'api/kycApi';
import ItemInfo from 'components/common/ItemInfo';
import CreateTicketModal from 'components/CreateTicketModal';
import { ChangeStatusPhoneButton } from 'components/Dropdown/ChangeStatusPhone';
import Fieldset from 'components/Form/Fieldset';
import Photo from 'components/Photo';
import { Format } from 'constants/date';
import { KYCProfileTempStatus, SubscriptionStatus } from 'constants/kyc.enum';
import { ActionText, Feature } from 'constants/permission';
import { SIMStatusText, simUserTypeText } from 'constants/sim.enum';
import { TicketStatus } from 'constants/ticket.enum';
import useCan from 'hooks/useCan';
import useModal from 'hooks/useModal';
import _ from 'lodash';
import moment from 'moment';
import { Fragment, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DATE_FORMAT } from 'share/helper';
import { capitalizeText, formatDateFromIso } from 'utils';
import { kycProfileTempStatusText, subscriptionStatusText } from 'utils/kyc';
import { PhoneNumberType } from 'utils/sim.enum';
import { genderTypeToText, idTypeToText, ticketStatusText } from 'utils/ticket';
import UpdateKycInfoModal from './UpdateKycInfoModal';

const FEATURE_SIM_ACTIVE = [
  Feature.ACTIVATED_SIM_ONE_WAY,
  Feature.ACTIVATED_SIM_TWO_WAY,
  Feature.ACTIVATED_SIM_UNSUBSCRIPTION,
  Feature.ACTIVATED_SIM_UNBLOCK,
];

function SimActivatedDetailTab(props: any) {
  const { simDetail, onReRender } = props;
  const KYC = simDetail?.kyc;
  const KYCTemp = simDetail?.kyc_temp;
  const ticket = simDetail?.ticket;
  const tickets = simDetail?.tickets;
  const SIM = simDetail?.sim;

  const history = useHistory();
  const { isCan } = useCan();
  const createTicketModal = useModal();
  const updateKycModal = useModal();

  const [loading, setLoading] = useState<boolean>(false);

  const createRequestBtn =
    KYC?.subscriptionStatus === SubscriptionStatus.UNLOCK && _.isEmpty(KYCTemp)
      ? _.isEmpty(ticket) || [TicketStatus.DONE, TicketStatus.CANCELED].includes(ticket?.status)
      : KYCTemp?.status === KYCProfileTempStatus.DONE;
  const updateBtn =
    _.isEmpty(ticket) || [TicketStatus.DONE, TicketStatus.CANCELED].includes(ticket?.status!);
  const cxApproveBtn =
    KYCTemp?.status === KYCProfileTempStatus.DRAFT &&
    (_.isEmpty(ticket) || [TicketStatus.CANCELED, TicketStatus.DONE].includes(ticket?.status));
  const sendMBFBtn = KYCTemp?.status === KYCProfileTempStatus.APPROVED;
  const doneBtn = KYCTemp?.status === KYCProfileTempStatus.MBF_REJECT;
  const deleteKycTempBtn =
    KYCTemp?.status === KYCProfileTempStatus.DRAFT &&
    (_.isEmpty(ticket) || [TicketStatus.DONE, TicketStatus.CANCELED].includes(ticket?.status));

  const columns = [
    {
      title: 'Mã ticket',
      dataIndex: 'code',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: number) => {
        return ticketStatusText(status);
      },
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdByUser',
      render: (record: any) => {
        return capitalizeText(record?.name);
      },
    },
    {
      title: 'Thời gian tạo',
      dataIndex: 'created_at',
      render: (text: string) => {
        return formatDateFromIso(text, Format.DATE_TIME);
      },
    },
  ];

  const handleSendMBFClick = async () => {
    const reqBody = {
      kyc_id: KYC?.id,
    };
    try {
      setLoading(true);
      const { status } = await kycApi.senMBF(reqBody);
      setLoading(false);

      if (status === 201) {
        toast.success('Gửi thành công');
        onReRender(true);
      }
    } catch (error) {
      setLoading(false);
      onReRender(true);
    }
  };

  const handleCXApprove = async (kycId: number) => {
    const reqBody = {
      kyc_id: kycId,
    };

    try {
      setLoading(true);
      const { status } = await kycApi.approve(reqBody);
      setLoading(false);

      if (status === 201) {
        toast.success('Duyệt thành công');
        onReRender(true);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const handleDoneClick = async (kycId: number) => {
    const reqBody = {
      kyc_id: kycId,
    };

    try {
      setLoading(true);
      const { status } = await kycApi.markDone(reqBody);
      setLoading(false);

      if (status === 201) {
        toast.success('Hoàn thành');
        onReRender();
      }
    } catch (error) {
      setLoading(false);
    }
  };

  async function handleDeleteKycTemp() {
    const reqBody = {
      kyc_id: KYC?.id,
    };

    try {
      setLoading(true);
      const { status } = await kycApi.delete(reqBody);
      setLoading(false);

      if (status === 201) {
        toast.success('Xóa thành công');
        onReRender(true);
      }
    } catch (error) {
      setLoading(false);
    }
  }

  return (
    <Fragment>
      {createTicketModal.isShowing === true && (
        <CreateTicketModal
          isShowing={createTicketModal.isShowing}
          toggle={createTicketModal.toggle}
          serialNumber={SIM?.serial_number}
          mode='current'
        />
      )}

      {updateKycModal.isShowing === true && (
        <UpdateKycInfoModal
          simDetail={simDetail}
          isShowing={updateKycModal.isShowing}
          toggle={updateKycModal.toggle}
        />
      )}

      <Spin spinning={loading}>
        <div className='sim-activated-detail-tab'>
          <div>
            <Fieldset title='Thông tin Sim'>
              <Row gutter={16}>
                <ItemInfo label='SIM serial' value={SIM?.serial_number} colSpan={6} />
                <ItemInfo label='Số điện thoại' value={SIM?.phone_number} colSpan={6} />
                <ItemInfo label='MBF code' value={SIM?.mbf_code} colSpan={6} />
                <ItemInfo
                  label='Ngày kích hoạt'
                  value={formatDateFromIso(SIM?.activated_at, Format.DATE_TIME)}
                  colSpan={6}
                />
              </Row>
              <Row gutter={16}>
                <ItemInfo label='Device id' value={SIM?.device_id} colSpan={6} />
                <ItemInfo label='Type of SIM' value={SIM?.simType?.name} colSpan={6} />
                <ItemInfo label='SIM lot' value={SIM?.simLot?.name} colSpan={6} />
                <ItemInfo
                  label='Nhà phân phối'
                  value={SIM?.simLot?.distributor?.name}
                  colSpan={6}
                />
              </Row>
              <Row gutter={16}>
                <ItemInfo
                  label='Loại số'
                  value={PhoneNumberType(SIM?.phone_number_type)}
                  colSpan={6}
                />
                <ItemInfo label='Trạng thái SIM' value={SIMStatusText(SIM?.status)} colSpan={6} />
                <ItemInfo
                  label='Ngày hết hạn'
                  value={SIM?.expired_at && moment(SIM?.expired_at).format(DATE_FORMAT)}
                  colSpan={6}
                />
                <ItemInfo
                  label='Đối tượng sử dụng'
                  value={simUserTypeText(KYC?.subscriberOwnerId)}
                  colSpan={6}
                />
              </Row>
              <Row gutter={16}>
                <ItemInfo label='Hình thức thanh toán' value={'Trả trước'} colSpan={6} />
                <ItemInfo label='Tên giao dịch viên' value={''} colSpan={6} />
                <ItemInfo
                  label='Điểm cung cấp dịch vụ'
                  value={`${
                    new Date(formatDateFromIso(SIM?.activated_at, 'YYYY-MM-DD')) <
                    new Date('2022-06-27')
                      ? 'Địa chỉ : 9 Sông Nhuệ, Phường 2, Quận Tân Bình, Tp.Hồ Chí Minh. \n  Điện thoại: 8428 7300 4664'
                      : 'Địa chỉ: 1/18 Nguyễn Văn Mại, Phường 4, Quận Tân Bình, Tp.Hồ Chí Minh. \n  Điện thoại: 8428 7300 4664'
                  }
                  `}
                  colSpan={6}
                />
              </Row>
            </Fieldset>
          </div>

          <div>
            <Fieldset title='Thông tin thuê bao'>
              <Row gutter={16}>
                <ItemInfo
                  label='Trạng thái'
                  value={subscriptionStatusText(KYC?.subscriptionStatus)}
                  colSpan={6}
                />
                <ItemInfo label='Tên chủ thuê bao' value={KYC?.fullname} colSpan={6} />
                <ItemInfo
                  label='Ngày sinh'
                  value={formatDateFromIso(KYC?.dob, Format.DATE)}
                  colSpan={6}
                />
                <ItemInfo label='Giới tính' value={genderTypeToText(KYC?.gender)} colSpan={6} />
              </Row>
              <Row gutter={16}>
                <ItemInfo label='Loại giấy tờ' value={idTypeToText(KYC?.idType)} colSpan={6} />
                <ItemInfo label='Số CMND' value={KYC?.idNumber} colSpan={6} />
                <ItemInfo
                  label='Ngày cấp'
                  value={formatDateFromIso(KYC?.issueDate, 'DD/MM/YYYY')}
                  colSpan={6}
                />
                <ItemInfo label='Nơi cấp' value={KYC?.issuePlace} colSpan={6} />
              </Row>
              <Row gutter={16}>
                <ItemInfo label='Tỉnh/Thành phố' value={KYC?.province} colSpan={6} />
                <ItemInfo label='Quận/Huyện' value={KYC?.district} colSpan={6} />
                <ItemInfo label='Phường/Xã' value={KYC?.ward} colSpan={6} />
              </Row>
              <Row gutter={16}>
                <ItemInfo label='Địa chỉ' value={capitalizeText(KYC?.address)} colSpan={6} />
              </Row>
              <div className='photo-list'>
                <Photo label='CMND mặt trước' url={KYC?.frontImg} />
                <Photo label='CMND mặt sau' url={KYC?.backImg} />
                <Photo label='Chân dung' url={KYC?.faceImg} />
                <Photo label='Chữ ký' url={KYC?.signImg} />
              </div>
            </Fieldset>
          </div>

          <div>
            {_.isEmpty(KYCTemp) === true ? null : (
              <Fieldset title='Thông tin thuê bao cập nhật'>
                <Row gutter={16}>
                  <ItemInfo
                    label='Trạng thái cập nhật'
                    value={kycProfileTempStatusText(KYCTemp?.status)}
                    colSpan={6}
                  />
                  <ItemInfo label='Tên chủ thuê bao' value={KYCTemp?.full_name} colSpan={6} />
                  <ItemInfo
                    label='Ngày sinh'
                    value={formatDateFromIso(KYCTemp?.dob, Format.DATE)}
                    colSpan={6}
                  />
                  <ItemInfo
                    label='Giới tính'
                    value={genderTypeToText(KYCTemp?.gender)}
                    colSpan={6}
                  />
                </Row>
                <Row gutter={16}>
                  <ItemInfo
                    label='Loại giấy tờ'
                    value={idTypeToText(KYCTemp?.id_type)}
                    colSpan={6}
                  />
                  <ItemInfo label='Số CMND' value={KYCTemp?.id_number} colSpan={6} />
                  <ItemInfo
                    label='Ngày cấp'
                    value={formatDateFromIso(KYCTemp?.issue_date, Format.DATE)}
                    colSpan={6}
                  />
                  <ItemInfo label='Nơi cấp' value={KYCTemp?.issue_place} colSpan={6} />
                </Row>
                <Row gutter={16}>
                  <ItemInfo label='Tỉnh/Thành phố' value={KYCTemp?.province} colSpan={6} />
                  <ItemInfo label='Quận/Huyện' value={KYCTemp?.district} colSpan={6} />
                  <ItemInfo label='Phường/Xã' value={KYCTemp?.ward} colSpan={6} />
                </Row>
                <Row gutter={16}>
                  <ItemInfo label='Địa chỉ' value={capitalizeText(KYCTemp?.address)} colSpan={6} />
                </Row>
                <div className='photo-list'>
                  <Photo label='CMND mặt trước' url={KYCTemp?.id_front_img} />
                  <Photo label='CMND mặt sau' url={KYCTemp?.id_back_img} />
                  <Photo label='Chân dung' url={KYCTemp?.selfie_img} />
                  <Photo label='Chữ ký' url={KYCTemp?.signature_img} />
                </div>
                <Row gutter={16}>
                  <ItemInfo label='Người cập nhật' value={KYCTemp?.updated_by_user} />
                </Row>
                <Row gutter={16}>
                  <ItemInfo
                    label='Ngày cập nhật'
                    value={formatDateFromIso(KYCTemp?.updated_at, Format.DATE_TIME)}
                  />
                </Row>
              </Fieldset>
            )}
          </div>

          <div>
            {_.isEmpty(ticket) && _.isEmpty(tickets) ? null : (
              <Fieldset title='Thông tin ticket'>
                <Table
                  className='sim-activated-detail-ticket'
                  rowKey={(record) => record?.id}
                  bordered
                  dataSource={tickets?.length > 1 ? tickets : [ticket]}
                  columns={columns}
                  onRow={(record: any) => {
                    return {
                      onClick: () => {
                        if (record?.status === TicketStatus.DRAFT) {
                          history.push(`/admin/ticket/request-detail/${record.serial_number}`);
                        } else {
                          history.push(
                            `/admin/ticket/list/${record.id}?serial_number=${record.serial_number}`,
                          );
                        }
                      },
                    };
                  }}
                  rowClassName={(record: any) => {
                    if (record?.id) {
                      return 'pointer';
                    }
                    return '';
                  }}
                />
              </Fieldset>
            )}
          </div>

          <div className='row-button justify-end'>
            <ChangeStatusPhoneButton featureIds={FEATURE_SIM_ACTIVE} ticket={ticket} />
            {isCan(Feature.ACTIVATED_SIM_CREATE, ActionText.SUBMIT) && createRequestBtn ? (
              <Button onClick={createTicketModal.toggle}>Tạo mới yêu cầu</Button>
            ) : null}

            {deleteKycTempBtn ? (
              <Button onClick={handleDeleteKycTemp} danger>
                Xóa cập nhật
              </Button>
            ) : null}

            {isCan(Feature.ACTIVATED_SIM_UPDATE, ActionText.SUBMIT) && updateBtn ? (
              <Button onClick={updateKycModal.toggle}>Cập nhật lại</Button>
            ) : null}

            {isCan(Feature.ACTIVATED_SIM_CONFIRM, ActionText.SUBMIT) && cxApproveBtn ? (
              <Button onClick={() => handleCXApprove(KYC?.id)}>CX Duyệt</Button>
            ) : null}
            {isCan(Feature.ACTIVATED_SIM_SEND_MBF, ActionText.SUBMIT) && sendMBFBtn ? (
              <Button onClick={handleSendMBFClick}>Gửi MBF</Button>
            ) : null}

            {doneBtn ? <Button onClick={() => handleDoneClick(KYC?.id)}>Hoàn thành</Button> : null}
          </div>
        </div>
      </Spin>
    </Fragment>
  );
}

export default SimActivatedDetailTab;

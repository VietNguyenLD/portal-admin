import { Button, Checkbox, Col, Input, Modal, Row, Spin, Table } from 'antd';
import simApi from 'api/simApi';
import userApi from 'api/userApi';
import Fieldset from 'components/Form/Fieldset';
import { ActionText, Feature } from 'constants/permission';
import {
  changeSimExpiredStatusText,
  ChangeSIMStatus,
  changeSIMStatusText,
  changeSIMTypeText,
} from 'constants/sim.enum';
import useCan from 'hooks/useCan';
import useModal from 'hooks/useModal';
import { User } from 'models/auth';
import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DATE_FORMAT } from 'share/helper';
import { genderTypeToText, idTypeToText } from 'utils/ticket';
import ChangeSimItemInfo from './ChangeSimItemInfo';

function ChangeSimDetailTab(props: any) {
  const { simDetail, onReRender } = props;

  const [verifyItems, setVerifyItems] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [updatedUser, setUpdatedUser] = useState('');

  const { isCan } = useCan();
  const approveModal = useModal();
  const rejectModal = useModal();
  const completeModal = useModal();

  useEffect(() => {
    if (simDetail?.changeSimRequest?.updated_by && simDetail?.changeSimRequest?.updated_by !== -1) {
      const fetchGroup = async () => {
        const response = await userApi.detailUser(simDetail?.changeSimRequest?.updated_by);
        const infoUser: User = response.data.data;
        setUpdatedUser(infoUser?.name);
      };
      fetchGroup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simDetail?.changeSimRequest]);

  useEffect(() => {
    if (simDetail) {
      setVerifyItems(
        simDetail?.changeSimRequest?.verify_item.map((item: any) => {
          return {
            ...item,
            isReject: item?.reject_reason.length > 0,
            reject_reason: item?.reject_reason,
          };
        }),
      );
    }
  }, [simDetail]);

  const handleCheckboxChange = (e: any, i: any) => {
    const isChecked = e.target.checked;
    const newsVerifyItems = verifyItems.map((element: any, index: any) => {
      if (index === i && isChecked) {
        element.isReject = true;
      } else if (index === i && !isChecked) {
        element.isReject = false;
      } else {
        return element;
      }
      return element;
    });
    setVerifyItems(newsVerifyItems);
  };

  const handleInputChange = (e: any, i: any) => {
    const value = e.target.value;
    const newsVerifyItems = verifyItems.map((element: any, index: any) => {
      if (index === i) {
        if (value) {
          element.isReject = true;
        } else {
          element.isReject = false;
        }
        element.reject_reason = value;
      }
      return element;
    });
    setVerifyItems(newsVerifyItems);
  };

  const columns = [
    {
      title: 'STT',
      key: 'id',
      dataIndex: 'id',
      render: (v: any, r: any, index: any) => index + 1,
    },
    {
      title: 'Nội dung',
      dataIndex: 'type',
      render: (value: string) => {
        switch (value) {
          case 'frequent_contacts_1':
            return 'Số thuê bao liên hệ gần nhất 1';
          case 'frequent_contacts_2':
            return 'Số thuê bao liên hệ gần nhất 2';
          case 'frequent_contacts_3':
            return 'Số thuê bao liên hệ gần nhất 3';
          case 'frequent_contacts_4':
            return 'Số thuê bao liên hệ gần nhất 4';
          case 'frequent_contacts_5':
            return 'Số thuê bao liên hệ gần nhất 5';
          case 'activated_at':
            return 'Thời gian kích hoạt';
          case 'balance':
            return 'Số tiền còn lại trong tài khoản';
          case 'last_charge_value':
            return 'Giá trị nạp tiền gần nhất';
          case 'last_charge_method':
            return 'Hình thức nạp tiền gần nhất';
          case 'expired_date':
            return 'Thời hạn sử dụng còn lại';
          case 'last_change_service':
            return 'Dịch vụ cuối cùng thay đổi';
          case 'sim_images':
            return 'Hình ảnh phôi SIM (cũ)';
          default:
            return value;
        }
      },
    },
    {
      title: 'Thông tin cung cấp',
      dataIndex: 'value',
      render: (v: string, r: any, i: any) =>
        r.type === 'activated_at' || r.type === 'expired_date' ? (
          <p>{moment(v).format(DATE_FORMAT)}</p>
        ) : r.type === 'sim_images' ? (
          <img src={v} alt='sim'></img>
        ) : (
          <p>{v}</p>
        ),
    },
    {
      title: 'Từ chối',
      dataIndex: 'isReject',
      render: (v: boolean, r: any, i: any) => (
        <Checkbox checked={v} onChange={(e) => handleCheckboxChange(e, i)} />
      ),
    },
    {
      title: 'Lý do',
      dataIndex: 'reject_reason',
      render: (v: string, r: any, i: any) => (
        <Input value={v} onChange={(e) => handleInputChange(e, i)} />
      ),
    },
  ];

  const handleApproveClick = async () => {
    const reqBody = {
      request_id: simDetail?.changeSimRequest?.id,
    };

    try {
      setLoading(true);
      const { status } = await simApi.changeSimApprove(reqBody);
      setLoading(false);

      if (status === 201) {
        toast.success('Duyệt thành công');
        onReRender(true);
        approveModal.toggle();
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const handleRejectClick = async () => {
    const reqBody = {
      request_id: simDetail?.changeSimRequest?.id,
      verify_ownership: verifyItems,
    };

    try {
      setLoading(true);
      const { status } = await simApi.changeSimReject(reqBody);
      setLoading(false);

      if (status === 201) {
        toast.success('Từ chối thành công');
        onReRender(true);
        rejectModal.toggle();
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const handleCompleteClick = async () => {
    const reqBody = {
      request_id: simDetail?.changeSimRequest?.id,
    };

    try {
      setLoading(true);
      const { status } = await simApi.doneRequestNewSIM(reqBody);
      setLoading(false);

      if (status === 201) {
        toast.success('Hoàn thành thành công');
        onReRender(true);
        completeModal.toggle();
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      {approveModal.isShowing === true && (
        <Modal
          footer={null}
          centered
          open={approveModal.isShowing}
          onCancel={() => approveModal.toggle()}>
          <Spin spinning={loading}>
            <p>Bạn có chắc sẽ duyệt yêu cầu</p>
            <Row className='justify-end' gutter={16} style={{ marginTop: '20px' }}>
              <Col>
                <Button type='primary' danger onClick={() => approveModal.toggle()}>
                  Thoát
                </Button>
              </Col>
              <Col>
                <Button type='primary' onClick={handleApproveClick}>
                  OK
                </Button>
              </Col>
            </Row>
          </Spin>
        </Modal>
      )}

      {rejectModal.isShowing === true && (
        <Modal
          footer={null}
          centered
          open={rejectModal.isShowing}
          onCancel={() => rejectModal.toggle()}>
          <Spin spinning={loading}>
            {verifyItems.find((item: any) => {
              return item.reject_reason !== '';
            }) ? (
              <div>
                <p>Bạn có chắc từ chối</p>
                <Row className='justify-end' gutter={16} style={{ marginTop: '20px' }}>
                  <Col>
                    <Button type='primary' danger onClick={() => rejectModal.toggle()}>
                      Thoát
                    </Button>
                  </Col>
                  <Col>
                    <Button type='primary' onClick={handleRejectClick}>
                      OK
                    </Button>
                  </Col>
                </Row>
              </div>
            ) : (
              <p>Bạn chưa nhập lý do từ chối</p>
            )}
          </Spin>
        </Modal>
      )}

      {completeModal.isShowing === true && (
        <Modal
          footer={null}
          centered
          open={completeModal.isShowing}
          onCancel={() => completeModal.toggle()}>
          <Spin spinning={loading}>
            <p>Bạn phải chắc rằng đã xử lý xong yêu cầu cho khách hàng</p>
            <Row className='justify-end' gutter={16} style={{ marginTop: '20px' }}>
              <Col>
                <Button type='primary' danger onClick={() => completeModal.toggle()}>
                  Thoát
                </Button>
              </Col>
              <Col>
                <Button type='primary' onClick={handleCompleteClick}>
                  OK
                </Button>
              </Col>
            </Row>
          </Spin>
        </Modal>
      )}

      <Spin spinning={loading}>
        <div className='change-sim-detail-tab'>
          <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
            <Col span={12}>
              <Fieldset title='Thông tin yêu cầu'>
                <ChangeSimItemInfo label='Mã yêu cầu:' value={simDetail?.changeSimRequest?.code} />
                <ChangeSimItemInfo
                  label='Trạng thái:'
                  value={
                    simDetail?.changeSimRequest?.status === 'EXPIRED'
                      ? 'Đóng'
                      : simDetail?.changeSimRequest?.status === 'EXPIRED_UPDATED'
                      ? 'Quá hạn cập nhật'
                      : changeSIMStatusText(simDetail?.changeSimRequest?.status)
                  }
                />
                <ChangeSimItemInfo
                  label='Thời gian xử lý còn lại:'
                  value={
                    simDetail?.changeSimRequest?.process_time_left !== 0
                      ? `${simDetail?.changeSimRequest?.process_time_left} ngày`
                      : '0'
                  }
                />
                <ChangeSimItemInfo
                  label='Trạng thái quá hạn:'
                  value={changeSimExpiredStatusText(simDetail?.changeSimRequest?.expired_status)}
                />
                <ChangeSimItemInfo
                  label='Thời gian quá hạn:'
                  value={
                    simDetail?.changeSimRequest?.expired_distance !== 0
                      ? `${simDetail?.changeSimRequest?.expired_distance} ngày`
                      : '0'
                  }
                />
                <ChangeSimItemInfo
                  label='Lý do:'
                  value={changeSIMTypeText(simDetail?.changeSimRequest?.type)}
                />
                <ChangeSimItemInfo
                  label='Thời gian tạo:'
                  value={moment(simDetail?.changeSimRequest?.created_at).format('DD/MM/YYYY HH:mm')}
                />
                <ChangeSimItemInfo
                  label='Người tạo:'
                  value={
                    simDetail?.changeSimRequest?.created_by === -1
                      ? 'User'
                      : simDetail?.changeSimRequest?.created_by
                  }
                />
                <ChangeSimItemInfo
                  label='Ngày cập nhật cuối:'
                  value={moment(simDetail?.changeSimRequest?.updated_at).format('DD/MM/YYYY HH:mm')}
                />
                <ChangeSimItemInfo
                  label='Người cập nhật cuối:'
                  value={
                    simDetail?.changeSimRequest?.updated_by === -1 ? 'Hệ thống' : `${updatedUser}`
                  }
                />
                <ChangeSimItemInfo
                  label='Lý do đóng yêu cầu:'
                  value={
                    simDetail?.changeSimRequest?.status !== 'EXPIRED'
                      ? ''
                      : changeSimExpiredStatusText(simDetail?.changeSimRequest?.expired_status)
                  }
                />
              </Fieldset>
            </Col>
            <Col span={12}>
              <Fieldset title='Thông tin thuê bao'>
                <Row>
                  <Col span={12}>
                    <p className='text--bold'>Số SIM Serial:</p>
                  </Col>
                  <Col span={12}>
                    <Link to={`/admin/sim/details/${simDetail?.changeSimRequest?.old_serial}`}>
                      <span>{simDetail?.changeSimRequest?.old_serial}</span>
                    </Link>
                  </Col>
                </Row>
                {simDetail?.changeSimRequest?.status === ChangeSIMStatus.DONE && (
                  <Row>
                    <Col span={12}>
                      <p className='text--bold'>Số SIM Serial mới:</p>
                    </Col>
                    <Col span={12}>
                      <Link to={`/admin/sim/details/${simDetail?.changeSimRequest?.new_serial}`}>
                        <span>{simDetail?.changeSimRequest?.new_serial}</span>
                      </Link>
                    </Col>
                  </Row>
                )}
                <ChangeSimItemInfo
                  label='Số thuê bao:'
                  value={simDetail?.changeSimRequest?.phone_number}
                />
                <ChangeSimItemInfo label='Gói cước:' value={simDetail?.mbf_code} />
                <ChangeSimItemInfo label='Tên thuê bao:' value={simDetail?.kycProfile?.fullname} />
                <ChangeSimItemInfo
                  label='Giới tính:'
                  value={genderTypeToText(simDetail?.kycProfile?.gender)}
                />
                <ChangeSimItemInfo
                  label='Loại giấy tờ:'
                  value={idTypeToText(simDetail?.kycProfile?.idType)}
                />
                <ChangeSimItemInfo label='Số CMND/CCCD:' value={simDetail?.kycProfile?.idNumber} />
                <ChangeSimItemInfo
                  label='Địa chỉ:'
                  value={`${simDetail?.kycProfile?.address} ${simDetail?.kycProfile?.ward} ${simDetail?.kycProfile?.district} ${simDetail?.kycProfile?.province}`}
                />
                <ChangeSimItemInfo
                  label='Ngày sinh:'
                  value={moment(simDetail?.kycProfile?.dob).format(DATE_FORMAT)}
                />
                <ChangeSimItemInfo
                  label='Ngày kích hoạt:'
                  value={moment(simDetail?.activated_at).format(DATE_FORMAT)}
                />
              </Fieldset>
            </Col>
          </Row>
          <Fieldset title='Xác minh sở hữu'>
            <Table
              className={`sim-activated-detail-ticket is-change ${
                simDetail?.changeSimRequest?.status !== ChangeSIMStatus.PENDING_APPROVAL &&
                'is-disabled'
              }`}
              bordered
              dataSource={verifyItems}
              columns={columns}
              pagination={false}
            />
          </Fieldset>
          {simDetail?.changeSimRequest?.status === ChangeSIMStatus.PENDING_APPROVAL && (
            <Row style={{ columnGap: '1rem', marginTop: '20px' }} justify='end'>
              {isCan(Feature.ACTIVATED_SIM_CHANGE_SIM_DETAIL_APPROVE, ActionText.SUBMIT) && (
                <Button onClick={approveModal.toggle} type='primary'>
                  Duyệt
                </Button>
              )}

              {isCan(Feature.ACTIVATED_SIM_CHANGE_SIM_DETAIL_REJECT, ActionText.SUBMIT) && (
                <Button onClick={rejectModal.toggle} type='primary' danger>
                  Từ chối
                </Button>
              )}
            </Row>
          )}

          {isCan(Feature.ACTIVATED_SIM_CHANGE_SIM_DETAIL_MARK_DONE, ActionText.SUBMIT) &&
            simDetail?.changeSimRequest?.status === ChangeSIMStatus.MBF_REJECT && (
              <Row style={{ columnGap: '1rem', marginTop: '20px' }} justify='end'>
                <Button onClick={completeModal.toggle} type='primary'>
                  Hoàn thành
                </Button>
              </Row>
            )}
        </div>
      </Spin>
    </Fragment>
  );
}

export default ChangeSimDetailTab;

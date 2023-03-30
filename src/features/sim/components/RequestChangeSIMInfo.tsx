import { Button, Col, Modal, Row, Spin } from 'antd';
import simApi from 'api/simApi';
import ItemInfo from 'components/common/ItemInfo';
import Fieldset from 'components/Form/Fieldset';
import { genderText } from 'constants/common.enum';
import { Format } from 'constants/date';
import { ChangeSIMStatus, changeSIMStatusText, changeSIMTypeText } from 'constants/sim.enum';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { formatDateFromIso } from 'utils';
import { RequestDetailData } from '../pages/RequestChangeSIMDetail';

interface RequestChangeSIMInfoProps {
  requestDetailData: RequestDetailData | undefined;
  toggleReRender: (flag: boolean) => void;
}

function RequestChangeSIMInfo(props: RequestChangeSIMInfoProps) {
  const { requestDetailData, toggleReRender } = props;

  const changeSimRequest = requestDetailData?.changeSimRequest;
  const kycProfile = requestDetailData?.kycProfile;

  const DoneRequestNewSIMConfirm = () => {
    Modal.confirm({
      content: (
        <div>
          <p>Bạn phải chắc rằng đã xử lý xong yêu cầu cho khách hàng.</p>
        </div>
      ),
      cancelText: 'Hủy',
      onOk() {
        handleDoneRequestNewSIM();
      },
    });
  };

  async function handleDoneRequestNewSIM() {
    const reqBody = {
      request_id: changeSimRequest?.id,
    };

    try {
      const { status } = await simApi.doneRequestNewSIM(reqBody);

      if (status === 201) {
        toast.success('Đã hoàn thành');
        toggleReRender(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Spin spinning={false}>
      <div className='request-newsim-info'>
        <Row gutter={16}>
          <Col span={12}>
            <Fieldset title='Thông tin yêu cầu'>
              <ItemInfo label='Mã yêu cầu' value={changeSimRequest?.code} colSpan={24} />
              <ItemInfo
                label='Trạng thái'
                value={changeSIMStatusText(changeSimRequest?.status!)}
                colSpan={24}
              />
              <ItemInfo
                label='Lý do'
                value={changeSIMTypeText(changeSimRequest?.type!)}
                colSpan={24}
              />
              <ItemInfo
                label='Thời gian tạo'
                value={formatDateFromIso(changeSimRequest?.created_at!, Format.DATE_TIME)}
                colSpan={24}
              />
              <ItemInfo label='Người tạo' value='User' colSpan={24} />
              <ItemInfo
                label='Ngày cập nhật'
                value={formatDateFromIso(changeSimRequest?.updated_at!, Format.DATE_TIME)}
                colSpan={24}
              />
              <ItemInfo label='Người cập nhật' value='' colSpan={24} />
            </Fieldset>
          </Col>

          <Col span={12}>
            <Fieldset title='Thông tin thuê bao'>
              <Col className='flex' style={{ padding: '5px 8px' }}>
                <span className='text--bold w-50 inline-flex'>SIM serial: </span>
                <Link
                  to={`/admin/sim/details/${changeSimRequest?.old_serial}`}
                  className='w-50 inline-flex'>
                  <span>{changeSimRequest?.old_serial}</span>
                </Link>
              </Col>
              <Col className='flex' style={{ padding: '5px 8px' }}>
                <span className='text--bold w-50 inline-flex'>SIM serial mới:</span>
                <Link
                  to={`/admin/sim/details/${changeSimRequest?.new_serial}`}
                  className='w-50 inline-flex'>
                  <span>{changeSimRequest?.new_serial}</span>
                </Link>
              </Col>
              <ItemInfo label='Số thuê bao' value={kycProfile?.phoneNum!} colSpan={24} />
              <ItemInfo label='Gói cước' value={requestDetailData?.mbf_code} colSpan={24} />
              <ItemInfo label='Tên thuê bao' value={kycProfile?.fullname} colSpan={24} />
              <ItemInfo label='Giới tính' value={genderText(kycProfile?.gender!)} colSpan={24} />
              <ItemInfo
                label='Ngày sinh'
                value={formatDateFromIso(kycProfile?.dob!, Format.DATE)}
                colSpan={24}
              />
              <ItemInfo
                label='Ngày kích hoạt'
                value={formatDateFromIso(requestDetailData?.activated_at!, Format.DATE_TIME)}
                colSpan={24}
              />
              <ItemInfo label='Tỉnh/Thành phố' value={kycProfile?.province} colSpan={24} />
              <ItemInfo label='Quận/Huyện' value={kycProfile?.district} colSpan={24} />
              <ItemInfo label='Phường/Xã' value={kycProfile?.ward} colSpan={24} />
              <ItemInfo label='Địa chỉ' value={kycProfile?.address} colSpan={24} />
            </Fieldset>
          </Col>
        </Row>

        {changeSimRequest?.status === ChangeSIMStatus.MBF_REJECT ? (
          <div className='row-button justify-end'>
            <Button onClick={DoneRequestNewSIMConfirm}>Hoàn thành</Button>
          </div>
        ) : null}
      </div>
    </Spin>
  );
}

export default RequestChangeSIMInfo;

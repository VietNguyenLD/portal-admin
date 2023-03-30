import { Button, Checkbox, Col, Row, Spin } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import axiosClient from 'api/axiosClient';
import ItemInfo from 'components/common/ItemInfo';
import Fieldset from 'components/Form/Fieldset';
import Photo from 'components/Photo';
import { Format } from 'constants/date';
import { TicketStatus } from 'constants/ticket.enum';
import { Ticket } from 'models/ticket';
import { useEffect, useState } from 'react';
import { capitalizeText, formatDateFromIso } from 'utils';
import { subscriptionStatusText } from 'utils/kyc';
import { genderTypeToText, idTypeToText } from 'utils/ticket';
import { SimDetailState } from '../pages/RequestDetail';

interface ReqBody {
  items: CheckboxValueType[];
  reason_ids: CheckboxValueType[];
}

interface RequestDetailTabProps {
  simDetail: SimDetailState | undefined;
  onUpdateRequest: (reqBody: ReqBody) => void;
  onDeleteRequest: (ticket: Ticket) => void;
  onSubmitRequest: (ticket: Ticket) => void;
}

function RequestDetailTab(props: RequestDetailTabProps) {
  const { simDetail, onUpdateRequest, onDeleteRequest, onSubmitRequest } = props;

  const [itemSelected, setItemSelected] = useState<CheckboxValueType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [reasons, setReasons] = useState([]);
  const [reasonSelected, setReasonSelected] = useState<CheckboxValueType[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const serial = simDetail?.sim?.serial_number;

  const handleItemChange = async (value: CheckboxValueType[]) => {
    if (value.length === 0) return setReasons([]);
    try {
      setLoading(true);
      const url = `/config/app-reason/list?filter.type=1&filter.items=$in:${value}&filter.is_active=$eq:1`;
      const response = await axiosClient.get(url);
      setLoading(false);
      const { status, data } = response;
      if (status === 200) {
        setReasons(data.data.data);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const handleUpdateRequest = async () => {
    const reqBody = {
      items: itemSelected,
      reason_ids: reasonSelected,
    };
    if (onUpdateRequest) {
      onUpdateRequest(reqBody);
      setIsEdit(false);
    }
  };

  useEffect(() => {
    if (simDetail?.ticket?.status !== TicketStatus.DONE) {
      simDetail?.ticket?.items && setItemSelected(simDetail?.ticket.items);
      simDetail?.ticket?.items && handleItemChange(simDetail?.ticket.items);
      simDetail?.ticket?.reasons && setReasonSelected(simDetail?.ticket.reasons);
    }
  }, [simDetail]);

  return (
    <Spin spinning={loading}>
      <div>
        <Row>
          <Col span={8}>
            <Row>
              <Col span={6}>Mã ticket:</Col>
              <Col span={18}>{simDetail?.ticket?.code}</Col>
            </Row>

            <Row>
              <Col span={6}>Sim:</Col>
              <Col span={12}>{serial}</Col>
            </Row>

            <Row>
              <Col span={6}>BatchId:</Col>
              <Col span={12}>{simDetail?.ticket?.batchId_code}</Col>
            </Row>

            <p>Item yêu cầu cập nhật</p>

            <Checkbox.Group
              value={itemSelected}
              onChange={(value: CheckboxValueType[]) => {
                setItemSelected(value);
                setReasonSelected([]);
                handleItemChange(value);
              }}
              disabled={isEdit ? false : true}>
              <table>
                <thead>
                  <tr>
                    <th>Selected</th>
                    <th>Item</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <Checkbox value={1} />
                    </td>
                    <td>Mặt trước CMND</td>
                  </tr>
                  <tr>
                    <td>
                      <Checkbox value={2} />
                    </td>
                    <td>Mặt sau CMND</td>
                  </tr>
                  <tr>
                    <td>
                      <Checkbox value={3} />
                    </td>
                    <td>Chân dung</td>
                  </tr>
                  <tr>
                    <td>
                      <Checkbox value={4} />
                    </td>
                    <td>Chữ ký</td>
                  </tr>
                </tbody>
              </table>
            </Checkbox.Group>

            <p>Lý do:</p>

            <Checkbox.Group
              value={reasonSelected}
              onChange={(value: any) => setReasonSelected(value)}
              disabled={isEdit ? false : true}>
              <table>
                <thead>
                  <tr>
                    <th>Selected</th>
                    <th>Lý do</th>
                  </tr>
                </thead>

                <tbody>
                  {reasons.length > 0 &&
                    reasons.map((item: any) => {
                      return (
                        <tr key={item.id}>
                          <td>
                            <Checkbox value={item.id} />
                          </td>
                          <td>{item.reason}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </Checkbox.Group>
          </Col>

          <Col span={16}>
            <div>
              <Fieldset title='Thông tin Sim'>
                <Row>
                  <ItemInfo label='Sim serial' value={simDetail?.sim?.serial_number} />
                  <ItemInfo label='Type of Sim' value={simDetail?.sim?.simType?.name} />
                  <ItemInfo label='Số điện thoại' value={simDetail?.sim?.phone_number} />
                </Row>
                <Row>
                  <ItemInfo
                    label='Ngày kích hoạt'
                    value={formatDateFromIso(simDetail?.sim?.activated_at!, Format.DATE)}
                  />
                  <ItemInfo label='MBF code' value={simDetail?.sim?.mbf_code} />
                  <ItemInfo label='Sim lot' value={simDetail?.sim?.simLot?.name} />
                </Row>
                <Row>
                  <ItemInfo
                    label='Nhà phân phối'
                    value={simDetail?.sim?.simLot?.distributor?.name}
                  />
                  <ItemInfo label='Device ID' value={simDetail?.sim?.device_id} />
                </Row>
              </Fieldset>
            </div>
            <div>
              <Fieldset title='Thông tin thuê bao'>
                <Row>
                  <Col span={8}>
                    <span className='text--bold'>Trạng thái: </span>
                    <span>{subscriptionStatusText(simDetail?.kyc?.subscriptionStatus!)}</span>
                  </Col>
                  <ItemInfo
                    label='Tên chủ thuê bao'
                    value={capitalizeText(simDetail?.kyc?.fullname!)}
                  />
                  <ItemInfo
                    label='Ngày sinh'
                    value={formatDateFromIso(simDetail?.kyc?.dob!, Format.DATE)}
                  />
                </Row>
                <Row>
                  <ItemInfo label='Giới tính' value={genderTypeToText(simDetail?.kyc?.gender!)} />
                  <ItemInfo label='Loại giấy tờ' value={idTypeToText(simDetail?.kyc?.idType!)} />
                  <ItemInfo label='Số CMND/CCCD' value={simDetail?.kyc?.idNumber} />
                </Row>

                <Row>
                  <ItemInfo
                    label='Ngày cấp'
                    value={formatDateFromIso(simDetail?.kyc?.issueDate!, Format.DATE)}
                  />
                  <ItemInfo label='Nơi cấp' value={simDetail?.kyc?.issuePlace} />
                </Row>
                <Row>
                  <ItemInfo label='Tỉnh/Thành phố' value={simDetail?.kyc?.province} />
                  <ItemInfo label='Quận/Huyện' value={simDetail?.kyc?.district} />
                  <ItemInfo label='Phường/Xã' value={simDetail?.kyc?.ward} />
                </Row>
                <Row>
                  <ItemInfo
                    colSpan={24}
                    label='Địa chỉ'
                    value={capitalizeText(simDetail?.kyc?.address!)}
                  />
                </Row>
                <div className='photo-list'>
                  <Photo label='CMND mặt trước' url={simDetail?.kyc?.frontImg} />
                  <Photo label='CMND mặt sau' url={simDetail?.kyc?.backImg} />
                  <Photo label='Chân dung' url={simDetail?.kyc?.faceImg} />
                  <Photo label='Chữ ký' url={simDetail?.kyc?.signImg} />
                </div>
              </Fieldset>
            </div>
          </Col>
        </Row>
        <Row>
          <ItemInfo label='Người tạo' value={simDetail?.ticket?.createdByUser?.name} />
          <ItemInfo label='Người cập nhật cuối' value='' />
        </Row>
        <Row>
          <ItemInfo
            label='Thời gian tạo'
            value={formatDateFromIso(
              simDetail?.ticket?.createdByUser?.created_at!,
              Format.DATE_TIME,
            )}
          />
          <ItemInfo
            label='Lần cập nhật cuối'
            value={formatDateFromIso(simDetail?.ticket?.updated_at!, Format.DATE_TIME)}
          />
        </Row>
      </div>
      <div className='create-ticket_btn'>
        <Button
          disabled={isEdit ? true : false}
          style={{
            display: [TicketStatus.DRAFT].includes(simDetail?.ticket?.status!) ? 'block' : 'none',
          }}
          onClick={() => setIsEdit(true)}>
          Sửa
        </Button>
        <Button
          style={{
            display: [TicketStatus.DRAFT].includes(simDetail?.ticket?.status!) ? 'block' : 'none',
          }}
          disabled={itemSelected?.length > 0 && reasonSelected?.length > 0 ? false : true}
          onClick={handleUpdateRequest}>
          Lưu
        </Button>
        <Button
          style={{
            display: [TicketStatus.DRAFT].includes(simDetail?.ticket?.status!) ? 'block' : 'none',
          }}
          type='primary'
          danger
          onClick={() => onDeleteRequest(simDetail?.ticket!)}>
          Xóa
        </Button>
        <Button
          disabled={isEdit ? true : false}
          style={{
            display: [TicketStatus.DRAFT].includes(simDetail?.ticket?.status!) ? 'block' : 'none',
          }}
          type='primary'
          onClick={() => onSubmitRequest(simDetail?.ticket!)}>
          Chuyển thành ticket
        </Button>
      </div>
    </Spin>
  );
}

export default RequestDetailTab;

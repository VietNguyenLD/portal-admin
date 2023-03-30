import { Button, Col, Input, Modal, Row, Spin } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import axiosClient from 'api/axiosClient';
import configApi from 'api/configApi';
import ticketApi from 'api/ticketApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import ItemInfo from 'components/common/ItemInfo';
import Fieldset from 'components/Form/Fieldset';
import Photo from 'components/Photo';
import TableSelected, { IDataTable } from 'components/TableSelected';
import { AppReasonType } from 'constants/app.reason';
import { Format } from 'constants/date';
import { KYCProfileTempStatus, SubscriptionStatus } from 'constants/kyc.enum';
import { TicketStatus } from 'constants/ticket.enum';
import { ticketActions } from 'features/ticketDetail/pages/ticketSlice';
import useDebounce from 'hooks/useDebounce';
import _ from 'lodash';
import { KYC, KYCTemp } from 'models/kyc';
import { Sim } from 'models/sim';
import { Reason, ReasonItem, Ticket } from 'models/ticket';
import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { capitalizeText, formatDateFromIso } from 'utils';
import { subscriptionStatusText } from 'utils/kyc';
import { genderTypeToText, idTypeToText } from 'utils/ticket';
import './CreateTicketModal.scss';
interface SimDetailState {
  sim?: Sim | undefined;
  kyc?: KYC | undefined;
  kyc_temp?: KYCTemp | undefined;
  ticket?: Ticket | undefined;
}

interface CreateTicketModalProps {
  mode?: string;
  serialNumber?: string;
  isShowing: boolean;
  toggle: () => void;
  onReRender?: (flag: boolean) => void;
  statusModal?: string;
  extraDataItems?: any;
  reasonItems?: any;
}

const initialSimDetailState = {
  sim: undefined,
  kyc: undefined,
  ticket: undefined,
};

function CreateTicketModal(props: CreateTicketModalProps) {
  const dispatch = useAppDispatch();
  const params: { id: string } = useParams();
  const { dataItem, dataReason } = useAppSelector((state) => state.ticket);
  const {
    isShowing,
    toggle,
    mode,
    serialNumber,
    onReRender,
    statusModal,
    extraDataItems,
    reasonItems,
  } = props;
  const [serial, setSerial] = useState<string>('');
  const debouncedSearchSerial: string = useDebounce<string>(serial, 500);
  const [simDetail, setSimDetail] = useState<SimDetailState | undefined>(initialSimDetailState);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isCheckAllItem, setIsCheckAllItem] = useState<boolean>(false);
  const [isCheckAllReason, setIsCheckAllReason] = useState<boolean>(false);
  const kyc = simDetail?.kyc;

  const createRequestBtn =
    kyc?.subscriptionStatus === SubscriptionStatus.UNLOCK && _.isEmpty(simDetail?.kyc_temp)
      ? _.isEmpty(simDetail?.ticket) ||
        [TicketStatus.DONE, TicketStatus.CANCELED].includes(simDetail?.ticket?.status!)
      : simDetail?.kyc_temp?.status === KYCProfileTempStatus.DONE;

  const itemsID = dataItem.reduce((total: number[], value: IDataTable) => {
    if (value.checked) {
      total.push(value?.value);
    }
    return total;
  }, []);

  const reasonsID = dataReason.reduce((total: number[], value: IDataTable) => {
    if (value.checked) {
      total.push(value?.value);
    }
    return total;
  }, []);

  const checkIsEdit = (ticket: Ticket) => {
    if (_.isEmpty(ticket!) === true) {
      setIsEdit(true);
    }
    if ([TicketStatus.DONE].includes(ticket?.status!)) {
      setIsEdit(true);
    }
    return;
  };

  useEffect(() => {
    let countChecked = 0;
    for (const item of dataItem) {
      if (item.checked) {
        countChecked += 1;
      }
    }

    if (countChecked === dataItem?.length && dataItem?.length !== 0) {
      return setIsCheckAllItem(true);
    }
    return setIsCheckAllItem(false);
  }, [dataItem]);

  useEffect(() => {
    let countChecked = 0;
    for (const item of dataReason) {
      if (item.checked) {
        countChecked += 1;
      }
    }

    if (countChecked === dataReason?.length && dataReason?.length !== 0) {
      return setIsCheckAllReason(true);
    }
    return setIsCheckAllReason(false);
  }, [dataReason]);

  useEffect(() => {
    if (reasonItems?.length) {
      getTicketReason('1,2,3,4', simDetail?.ticket?.reasons as any, true);
    }
    // eslint-disable-next-line
  }, []);

  const handleCancel = () => {
    setSimDetail(initialSimDetailState);
    setSerial('');
    toggle();
  };

  const handleSubmitTicket = async (ticketId: number) => {
    try {
      setLoading(true);
      const response = await ticketApi.submitTicket(ticketId);
      setLoading(false);
      const { status } = response;
      if (status === 201) {
        toast.success('Tạo Thành Công Yêu Cầu');
        handleCancel();
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const handleUpdateRequest = async () => {
    try {
      const reqBody = {
        items: itemsID,
        reason_ids: reasonsID,
      };
      setLoading(true);
      const url = `/ticket/${simDetail?.ticket?.id}/update`;
      const response = await axiosClient.put(url, reqBody);
      setLoading(false);
      const { status } = response;
      if (status === 200) {
        toast.success('Lưu thành công');
        setIsEdit(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const handleCreateRequest = async () => {
    const reqBody = {
      items: itemsID,
      reason_ids: reasonsID,
      serial_number: simDetail?.sim?.serial_number,
      phone_number: simDetail?.sim?.phone_number,
    };

    try {
      setLoading(true);
      const response = await ticketApi.createTicket(reqBody);

      setLoading(false);
      const { status, data } = response;
      if (status === 201) {
        toast.success('Tạo Thành Công');
        setSimDetail({
          ...simDetail,
          ticket: data.data,
        });
        setIsEdit(false);
        if (onReRender) {
          onReRender(true);
        }
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleDeleteClick = async (ticketId: number) => {
    try {
      setLoading(true);
      const response = await ticketApi.deleteTicket(ticketId);
      setLoading(false);
      const { status } = response;
      if (status === 200) {
        toast.success('Xóa thành công');
        if (onReRender) {
          onReRender(true);
        }
        handleCancel();
      }
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    if (!debouncedSearchSerial) {
      if (extraDataItems) {
        const newDataItem = dataItem.map((item) => {
          if (extraDataItems.some((dataItem: any) => dataItem === item.value)) {
            return { ...item, checked: true };
          } else {
            return { ...item, checked: false };
          }
        });
        dispatch(ticketActions.setItemData(newDataItem));
      } else {
        dispatch(
          ticketActions.setItemData(
            dataItem.map((v: IDataTable) => ({ ...v, checked: false, disabled: false })),
          ),
        );
      }
      dispatch(ticketActions.setDataReason([]));
      return;
    }
    const getSimDetailsBySerial = async () => {
      try {
        setLoading(true);
        const url = `/sim/${debouncedSearchSerial}/detail`;
        const response = await axiosClient.get(url, { signal: controller.signal });
        setLoading(false);

        const { status, data } = response;
        if (status === 200) {
          setSimDetail(data.data);
          const ticket = data.data.ticket;
          if (ticket.status !== TicketStatus.DONE && ticket.status !== TicketStatus.CANCELED) {
            ticket.items && formatDataItem(ticket.items);
            ticket.items &&
              getTicketReason(ticket?.items.join(','), ticket?.reasons, reasonItems ? true : false);
          }
          checkIsEdit(data.data.ticket);
        }
      } catch (error) {
        setLoading(false);
      }
    };

    getSimDetailsBySerial();

    return () => {
      dispatch(ticketActions.setDataReason([]));
      controller.abort();
    };
    // eslint-disable-next-line
  }, [debouncedSearchSerial]);

  useEffect(() => {
    if (serialNumber) {
      setSerial(serialNumber);
    }
  }, [serialNumber]);

  const onCheckAllChangeItem = (e: CheckboxChangeEvent) => {
    setIsCheckAllItem(e.target.checked);
    if (e.target.checked) {
      getTicketReason('1,2,3,4', simDetail?.ticket?.reasons as any);
      return dispatch(
        ticketActions.setItemData(
          dataItem.map((v: IDataTable) => ({ ...v, checked: true, disabled: false })),
        ),
      );
    }
    getTicketReason('', simDetail?.ticket?.reasons as any);
    return dispatch(
      ticketActions.setItemData(
        dataItem.map((v: IDataTable) => ({ ...v, checked: false, disabled: false })),
      ),
    );
  };

  const onCheckAllChangeReason = (e: CheckboxChangeEvent) => {
    setIsCheckAllReason(e.target.checked);
    if (e.target.checked) {
      return dispatch(
        ticketActions.setDataReason(
          dataReason.map((v: IDataTable) => ({ ...v, checked: true, disabled: false })),
        ),
      );
    }
    return dispatch(
      ticketActions.setDataReason(
        dataReason.map((v: IDataTable) => ({ ...v, checked: false, disabled: false })),
      ),
    );
  };
  const formatDataItem = (items: number[]) => {
    if (!items || items?.length === 0) return;
    const result = dataItem.map((item: IDataTable) => {
      return {
        ...item,
        checked: items.includes(item.value),
      };
    });
    dispatch(ticketActions.setItemData(result));
  };

  const getTicketReason = async (params: string, r: ReasonItem[], filter: boolean = false) => {
    if (!params) return dispatch(ticketActions.setDataReason([]));
    try {
      const { data } = await configApi.getAppReasons(
        `$in:${params}`,
        AppReasonType.TICKET_KYC,
        '$eq:1',
      );
      let reasons = data.data.data;

      let resonTicket = (r || []).map((x: any) => x.id);
      let result: IDataTable[] = reasons.map((reason: Reason) => {
        return {
          text: reason.reason,
          checked: resonTicket?.includes(reason.id),
          disabled: true,
          value: reason.id,
        };
      });

      if (filter === true && reasonItems) {
        const newReasonItem = result.map((item) => {
          if (reasonItems.some((reasonItem: any) => reasonItem.id === item.value)) {
            return { ...item, checked: true };
          } else {
            return { ...item, checked: false };
          }
        });
        dispatch(ticketActions.setDataReason(newReasonItem));
      } else {
        dispatch(ticketActions.setDataReason(result));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onTableItemChange = (_e: CheckboxChangeEvent, index: number) => {
    let result = dataItem.map((item: IDataTable, i: number) => {
      if (index === i) {
        return {
          ...item,
          checked: !item.checked,
        };
      }
      return item;
    });
    let items = result.reduce((result: number[], item: IDataTable) => {
      if (item.checked) {
        result.push(item.value);
      }
      return result;
    }, []);

    getTicketReason(items.join(','), simDetail?.ticket?.reasons as any);
    dispatch(ticketActions.setItemData(result));
  };

  const onTableReasonChange = (_e: CheckboxChangeEvent, index: number) => {
    let result = dataReason.map((item: IDataTable, i: number) => {
      if (index === i) {
        return {
          ...item,
          checked: !item.checked,
        };
      }
      return item;
    });
    dispatch(ticketActions.setDataReason(result));
  };

  return (
    <Modal
      width={'100%'}
      wrapClassName='create-ticket-modal'
      footer={null}
      centered
      open={isShowing}
      onCancel={handleCancel}
      title={statusModal ? 'Cập nhật yêu cầu' : 'Tạo mới yêu cầu'}>
      <Spin spinning={loading}>
        <div>
          <Row>
            <Col span={8}>
              <Row>
                <Col span={6}>Mã ticket:</Col>
                {![TicketStatus.DONE, TicketStatus.CANCELED].includes(simDetail?.ticket?.status!) &&
                  statusModal !== 'draff' && <Col span={18}>{simDetail?.ticket?.code}</Col>}
              </Row>

              <Row>
                <Col span={6}>Sim:</Col>
                <Col span={12}>
                  <Input
                    disabled={mode && mode === 'current' ? true : false}
                    value={serial}
                    onChange={(event: BaseSyntheticEvent) => setSerial(event.target.value)}
                  />
                </Col>
              </Row>
              {(simDetail?.ticket?.batch_id || params.id) && (
                <Row>
                  <Col span={6}>Batch ID:</Col>
                  <Col span={18}>{simDetail?.ticket?.batchId_code}</Col>
                </Row>
              )}

              <p>Item yêu cầu cập nhật</p>

              <TableSelected
                columns={['Selected', 'Item']}
                data={dataItem.map((v: IDataTable) => {
                  // const isChecked =
                  //   extraDataItems?.length && extraDataItems.some((item: any) => item === v.value);
                  return {
                    ...v,
                    disabled: false,
                  };
                })}
                onChange={onTableItemChange}
                onCheckAllChange={onCheckAllChangeItem}
                isCheckAll={isCheckAllItem}
              />

              <p>Lý do:</p>
              <TableSelected
                columns={['Selected', 'Item']}
                data={dataReason.map((v: IDataTable) => {
                  // const isChecked =
                  //   reasonItems?.length && reasonItems.some((item: any) => item.id === v.value);
                  return {
                    ...v,
                    disabled: false,
                  };
                })}
                onChange={onTableReasonChange}
                onCheckAllChange={onCheckAllChangeReason}
                isCheckAll={isCheckAllReason}
              />
            </Col>

            <Col span={16}>
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

                <div className='create-ticket_photos'>
                  <Photo label='CMND mặt trước' url={simDetail?.kyc?.frontImg} />
                  <Photo label='CMND mặt sau' url={simDetail?.kyc?.backImg} />
                  <Photo label='Chân dung' url={simDetail?.kyc?.faceImg} />
                  <Photo label='Chữ ký' url={simDetail?.kyc?.signImg} />
                </div>
              </Fieldset>
            </Col>
          </Row>
          <Row>
            <ItemInfo label='Người tạo' value={simDetail?.ticket?.createdByUser?.name} />
            <ItemInfo label='Người cập nhật cuối' value='admin 1' />
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
        {statusModal !== 'draff' && (
          <div className='create-ticket_btn'>
            {createRequestBtn ? (
              <Button
                disabled={itemsID?.length > 0 && reasonsID?.length > 0 ? false : true}
                onClick={handleCreateRequest}>
                Tạo yêu cầu
              </Button>
            ) : null}

            <Button
              disabled={isEdit ? true : false}
              style={{
                display: [TicketStatus.DRAFT].includes(simDetail?.ticket?.status!)
                  ? 'block'
                  : 'none',
              }}
              onClick={() => setIsEdit(true)}>
              Sửa
            </Button>

            <Button
              style={{
                display: [TicketStatus.DRAFT].includes(simDetail?.ticket?.status!)
                  ? 'block'
                  : 'none',
              }}
              disabled={itemsID?.length > 0 && reasonsID?.length > 0 ? false : true}
              onClick={handleUpdateRequest}>
              Lưu
            </Button>

            <Button
              style={{
                display: [TicketStatus.DRAFT].includes(simDetail?.ticket?.status!)
                  ? 'block'
                  : 'none',
              }}
              type='primary'
              danger
              onClick={() => handleDeleteClick(simDetail?.ticket?.id!)}>
              Xóa
            </Button>

            <Button
              disabled={isEdit ? true : false}
              style={{
                display: [TicketStatus.DRAFT].includes(simDetail?.ticket?.status!)
                  ? 'block'
                  : 'none',
              }}
              type='primary'
              onClick={() => handleSubmitTicket(simDetail?.ticket?.id!)}>
              Chuyển thành ticket
            </Button>
          </div>
        )}
      </Spin>
    </Modal>
  );
}

export default CreateTicketModal;

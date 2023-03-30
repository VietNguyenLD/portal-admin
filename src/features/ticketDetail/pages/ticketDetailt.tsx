import { Button, Spin, Tabs } from 'antd';
import configApi from 'api/configApi';
import kycApi from 'api/kycApi';
import simApi from 'api/simApi';
import ticketApi from 'api/ticketApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import ContractList from 'components/ContractList';
import { ChangeStatusPhoneButton } from 'components/Dropdown/ChangeStatusPhone';
import { ListButtonFooter } from 'components/ListButtonFooter';
import DestroyTicket from 'components/Modal/DestroyTicket';
import ModalRejectTicket from 'components/Modal/RejectTicket';
import { IDataTable } from 'components/TableSelected';
import { AppReasonType } from 'constants/app.reason';
import { KYCProfileTempStatus } from 'constants/kyc.enum';
import { ActionText, Feature } from 'constants/permission';
import { TicketStatus, TicketType } from 'constants/ticket.enum';
import useCan from 'hooks/useCan';
import useModal from 'hooks/useModal';
import useReRender from 'hooks/useReRender';
import { DocumentData } from 'models/contract';
import { KYC, KYCTemp } from 'models/kyc';
import { Reason, ReasonCancelTicket, ReasonItem, Ticket } from 'models/ticket';
import { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { refreshPage } from 'utils';
import styles from './index.module.scss';
import SimInfo from './SimInfo';
import TicketHistory from './TicketHistory';
import TiccketInfo from './TicketInfo';
import { data, ticketActions } from './ticketSlice';

const FEATURE_LIST = [
  Feature.TICKET_ALL_DETAIL_ONE_WAY,
  Feature.TICKET_ALL_DETAIL_TWO_WAY,
  Feature.TICKET_ALL_DETAIL_UNSUBSCRIPTION,
  Feature.TICKET_ALL_DETAIL_UNBLOCK,
];
const FEATURE_AWAITING = [
  Feature.TICKET_WAITING_LIST_ONE_WAY,
  Feature.TICKET_WAITING_LIST_TWO_WAY,
  Feature.TICKET_WAITING_LIST_UNSUBSCRIPTION,
  Feature.TICKET_WAITING_LIST_UNBLOCK,
];

interface SimDetailState {
  kyc?: KYC | undefined;
  kyc_temp: KYCTemp | undefined;
  ticket?: Ticket | undefined;
  documentData: DocumentData;
}

const TicketDetailt = () => {
  const { isCan } = useCan();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const queryParams = new URLSearchParams(window.location.search);
  const history = useHistory();
  const cancelModal = useModal();
  const params: { id: string } = useParams();
  const { ticket, dataItem } = useAppSelector((state) => state.ticket);
  const { reRender, toggleReRender } = useReRender();

  const [openReject, setOpenReject] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [simDetail, setSimDetail] = useState<SimDetailState>();

  const KYCTemp = simDetail?.kyc_temp;

  const initialItems = [
    { label: 'Thông tin ticket', children: <TiccketInfo />, key: '1', closable: false },
    {
      label: 'Thông tin SIM',
      children: <SimInfo simDetail={simDetail} />,
      key: '2',
      closable: false,
    },
    {
      label: 'Lịch sử ticket',
      children: <TicketHistory />,
      key: '3',
      closable: false,
    },
    {
      label: 'Thông tin Hợp đồng',
      key: '4',
      children: <ContractList documentData={simDetail?.documentData} />,
      closable: false,
    },
  ];
  const [activeKey, setActiveKey] = useState(initialItems[0].key);

  useEffect(() => {
    simDetail && dispatch(ticketActions.setSimDatail(simDetail));
    // eslint-disable-next-line
  }, [simDetail]);

  useEffect(() => {
    if (params) {
      const { id } = params;
      getTicketById(id);
    }
    // eslint-disable-next-line
  }, [params]);

  const getSimDetailBySerial = async () => {
    try {
      const paramSerial = queryParams.get('serial_number');
      setLoading(true);
      const { status, data } = await simApi.simDetailBySerial(paramSerial!);
      setLoading(false);

      if (status === 200) {
        setSimDetail(data.data);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const getTicketById = async (id: string) => {
    try {
      const { data } = await ticketApi.getOne(id);
      const ticket = data.data.ticket;
      if (data.data && data.message === 'Success') {
        formatDataItem(ticket.items);
        getTicketReason(ticket.items.join(','), ticket.reasons);
        dispatch(ticketActions.ticketDetail(ticket));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getTicketReason = async (params: string, r: ReasonItem[]) => {
    try {
      const { data } = await configApi.getAppReasons(
        `$in:${params}`,
        AppReasonType.TICKET_KYC,
        '$eq:1',
      );
      let reasons = data.data.data;
      let resonTicket = r.map((x: any) => x.id);

      let result: IDataTable[] = reasons.map((reason: Reason) => {
        return {
          text: reason.reason,
          checked: resonTicket?.includes(reason.id),
          disabled: true,
          value: reason.id,
        };
      });

      dispatch(ticketActions.setDataReason(result));
    } catch (error) {
      console.error(error);
    }
  };

  const formatDataItem = (items: number[]) => {
    if (!items || items.length === 0) {
      dispatch(ticketActions.setItemData(data));
    }
    const result = dataItem.map((item: IDataTable) => {
      return {
        ...item,
        checked: items.includes(item.value),
      };
    });
    dispatch(ticketActions.setItemData(result));
  };

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
  };

  const onMarkDoneTicket = async (id: number) => {
    try {
      setLoading(true);
      await ticketApi.markDoneTicket({ ticket_id: id });
      setLoading(false);
      toast.success('Ticket thành công');
      refreshPage();
    } catch (error: any) {
      setLoading(false);
      console.log(error);
    }
  };

  const onReject = async () => {
    setOpenReject(!openReject);
  };

  const onSendMBF = async () => {
    try {
      setLoading(true);
      await kycApi.senMBF({ kyc_id: simDetail?.kyc?.id! });
      toast.success('Gửi MBF thành công!');
      setLoading(false);
      toggleReRender(true);
    } catch (error: any) {
      setLoading(false);
      toggleReRender(true);
    }
  };

  const onReUpdate = () => {
    setActiveKey(initialItems[1].key);
    dispatch(ticketActions.openModal({ isOpen: true }));
  };

  const handleCancel = () => {
    setOpenReject(false);
  };

  const isShowBtnRejectRequest = () => {
    if (ticket?.type === TicketType.US) {
      return (
        TicketStatus.USER_UPDATED === ticket?.status &&
        (location.pathname.includes('/list')
          ? isCan(Feature.TICKET_ALL_DETAIL_DENIED, ActionText.SUBMIT)
          : isCan(Feature.TICKET_WAITING_LIST_DENIED, ActionText.SUBMIT))
      );
    }
    return (
      TicketStatus.USER_UPDATED === ticket?.status &&
      ticket?.requested_count < 3 &&
      (location.pathname.includes('/list')
        ? isCan(Feature.TICKET_ALL_DETAIL_DENIED, ActionText.SUBMIT)
        : isCan(Feature.TICKET_WAITING_LIST_DENIED, ActionText.SUBMIT))
    );
  };

  const isShowReUpdate = () => {
    const arrShow = [
      TicketStatus.USER_UPDATED,
      TicketStatus.REQUESTED,
      TicketStatus.MBF_REJECT,
      TicketStatus.CX_APPROVED,
    ];
    if (ticket?.type === TicketType.US) {
      return (
        arrShow.includes(ticket?.status) &&
        (location.pathname.includes('/list')
          ? isCan(Feature.TICKET_ALL_DETAIL_UPDATE, ActionText.SUBMIT)
          : isCan(Feature.TICKET_WAITING_LIST_UPDATE, ActionText.SUBMIT))
      );
    }
    return (
      arrShow.includes(ticket?.status as number) &&
      (location.pathname.includes('/list')
        ? isCan(Feature.TICKET_ALL_DETAIL_DENIED, ActionText.SUBMIT)
        : isCan(Feature.TICKET_WAITING_LIST_DENIED, ActionText.SUBMIT))
    );
  };

  const isShowCXApproved = () => {
    return (
      KYCTemp?.status === KYCProfileTempStatus.DRAFT &&
      ![TicketStatus.CANCELED, TicketStatus.DONE].includes(simDetail?.ticket?.status!) &&
      isCan(Feature.TICKET_ALL_DETAIL_CONFIRM, ActionText.SUBMIT)
    );
  };

  const isShowMBF = () => {
    return (
      ticket?.status === TicketStatus.CX_APPROVED &&
      KYCTemp?.status === KYCProfileTempStatus.APPROVED &&
      (location.pathname.includes('/list')
        ? isCan(Feature.TICKET_ALL_DETAIL_SEND_MBF, ActionText.SUBMIT)
        : isCan(Feature.TICKET_WAITING_LIST_SEND_MBF, ActionText.SUBMIT))
    );
  };

  const isShowBtnDone = () => {
    const arrShow = [TicketStatus.USER_UPDATED, TicketStatus.MBF_REJECT];
    if (ticket?.type === TicketType.US) {
      return (
        arrShow.includes(ticket?.status) &&
        (TicketStatus.MBF_REJECT === ticket?.status ||
          (TicketStatus.USER_UPDATED === ticket?.status &&
            ticket?.extra_data?.search('Xác nhận') !== -1)) &&
        (location.pathname.includes('/list')
          ? isCan(Feature.TICKET_ALL_DETAIL_DONE, ActionText.SUBMIT)
          : isCan(Feature.TICKET_WAITING_LIST_DONE, ActionText.SUBMIT))
      );
    }
    return (
      TicketStatus.MBF_REJECT === ticket?.status &&
      (location.pathname.includes('/list')
        ? isCan(Feature.TICKET_ALL_DETAIL_DONE, ActionText.SUBMIT)
        : isCan(Feature.TICKET_WAITING_LIST_DONE, ActionText.SUBMIT))
    );
  };

  const isShowBtnCancel = () => {
    const arrNotShow = [TicketStatus.DONE, TicketStatus.CANCELED];
    return (
      !arrNotShow.includes(ticket?.status as number) &&
      (location.pathname.includes('/list')
        ? isCan(Feature.TICKET_ALL_DETAIL_CANCEL, ActionText.SUBMIT)
        : isCan(Feature.TICKET_WAITING_LIST_CANCEL, ActionText.SUBMIT))
    );
  };

  const onCancelTicket = async (val: ReasonCancelTicket) => {
    try {
      const response = await ticketApi.cancelTicket(ticket?.id as number, val.reason);
      const { data } = response;
      if (data.message === 'Success') {
        toast.success('Huỷ ticket thành công!');
        refreshPage();
      }
    } catch (error) {
      console.error(error);
    }
    cancelModal.toggle();
  };

  const renderListButton = () => {
    return (
      <ListButtonFooter
        buttons={[
          <ChangeStatusPhoneButton
            ticket={ticket}
            featureIds={location.pathname.includes('/list') ? FEATURE_LIST : FEATURE_AWAITING}
          />,
          isShowBtnCancel() && (
            <Button danger onClick={cancelModal.toggle}>
              Huỷ ticket
            </Button>
          ),
          isShowBtnRejectRequest() && (
            <Button type='primary' onClick={() => onReject()} danger>
              Từ chối, yêu cầu lại
            </Button>
          ),
          isShowReUpdate() && (
            <Button type='primary' onClick={() => onReUpdate()}>
              Cập nhật lại
            </Button>
          ),
          isShowCXApproved() && (
            <Button onClick={() => handleCXApprove(simDetail?.ticket?.id!)}>CX duyệt</Button>
          ),
          isShowMBF() && (
            <Button type='primary' onClick={onSendMBF}>
              Gửi MBF
            </Button>
          ),
          // isShowBtnDeleteRequest() && (
          //   <Button type='primary' onClick={onSendMBF}>
          //     Xoá yêu cầu
          //   </Button>
          // ),
          isShowBtnDone() && (
            <Button type='primary' onClick={() => onMarkDoneTicket(ticket?.id as number)}>
              Hoàn thành
            </Button>
          ),
        ]}
      />
    );
  };

  const handleCXApprove = async (ticketId: number) => {
    try {
      setLoading(true);
      const response = await ticketApi.approve(ticketId);
      setLoading(false);
      const { status } = response;
      if (status === 201) {
        toast.success('Duyệt thành công');
        toggleReRender(true);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reRender) {
      getSimDetailBySerial();
      getTicketById(params.id);
      toggleReRender(false);
    }

    // eslint-disable-next-line
  }, [reRender]);

  useEffect(() => {
    getSimDetailBySerial();
    // eslint-disable-next-line
  }, []);

  if (!isCan(Feature.TICKET_ALL_DETAIL, ActionText.READ)) return null;

  return (
    <Spin spinning={loading}>
      <Button style={{ marginBottom: '10px' }} onClick={() => history.goBack()}>
        Quay lại
      </Button>
      <ModalRejectTicket isOpen={openReject} handleCancel={handleCancel} />
      <DestroyTicket
        openModal={cancelModal.isShowing}
        cancelModal={cancelModal.toggle}
        onFinish={onCancelTicket}
      />
      <Tabs
        className={styles.awaitrail_wrapper}
        type='editable-card'
        onChange={onChange}
        activeKey={activeKey}
        items={initialItems}
        hideAdd
      />
      {renderListButton()}
    </Spin>
  );
};

export default TicketDetailt;

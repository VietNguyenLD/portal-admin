import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal, Spin } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import configApi from 'api/configApi';
import ticketApi from 'api/ticketApi';
import { useAppSelector } from 'app/hooks';
import TableSelected, { IDataTable } from 'components/TableSelected';
import { AppReasonType } from 'constants/app.reason';
import { Reason, ReasonItem } from 'models/ticket';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface ModalRejectTicketProps {
  isOpen: boolean;
  handleCancel: () => void;
}

const ModalRejectTicket: React.FC<ModalRejectTicketProps> = ({ handleCancel, isOpen }) => {
  const { dataItem, dataReason, ticket } = useAppSelector((state) => state.ticket);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataItemTer, setDataItemTer] = useState<IDataTable[]>([]);
  const [dataResonTer, setDataResonTer] = useState<IDataTable[]>([]);
  const [isCheckAllItem, setIsCheckAllItem] = useState<boolean>(false);
  const [isCheckAllReason, setIsCheckAllReason] = useState<boolean>(false);
  useEffect(() => {
    onResetTable();
  }, [isOpen]);

  const onTableItemChange = (_e: CheckboxChangeEvent, index: number) => {
    let result = dataItemTer.map((item: IDataTable, i: number) => {
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

    getTicketReason(items.join(','), ticket?.reasons as any);
    setDataItemTer(result);
  };

  const getTicketReason = async (params: string, r: ReasonItem[]) => {
    try {
      setLoading(true);
      const { data } = await configApi.getAppReasons(
        `$in:${params}`,
        AppReasonType.TICKET_KYC,
        '$eq:1',
      );
      let reasons = data.data.data;
      let result: IDataTable[] = reasons.map((reason: Reason) => {
        return {
          text: reason.reason,
          checked: false,
          disabled: false,
          value: reason.id,
        };
      });
      setDataResonTer(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onTableReasonChange = (_e: CheckboxChangeEvent, index: number) => {
    let result = dataResonTer.map((item: IDataTable, i: number) => {
      if (index === i) {
        return {
          ...item,
          checked: !item.checked,
        };
      }
      return item;
    });
    setDataResonTer(result);
  };

  const onResetTable = () => {
    setDataItemTer(dataItem.map((item: IDataTable) => ({ ...item, disabled: false })));
    setDataResonTer(dataReason.map((item: IDataTable) => ({ ...item, disabled: false })));
  };

  const onCancel = () => {
    onResetTable();
    handleCancel();
  };

  const confirm = () => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc muốn gửi',
      okText: 'Yes',
      cancelText: 'No',
      onOk: onSendRequest,
    });
  };

  const onSendRequest = async () => {
    const items = dataItemTer.reduce((total: number[], value: IDataTable) => {
      if (value.checked) {
        total.push(value?.value);
      }
      return total;
    }, []);
    const reasons = dataResonTer.reduce((total: number[], value: IDataTable) => {
      if (value.checked) {
        total.push(value?.value);
      }
      return total;
    }, []);

    let params = {
      items: items,
      reason_ids: reasons,
    };
    if (items.length === 0 || reasons.length === 0) {
      return toast.error('Vui lòng chọn lý do!');
    }

    try {
      const result = await ticketApi.rejectTicket(ticket?.id as number, params);
      if (result.status === 201 || result.status === 200) {
        toast.success('Từ chối thành công');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const onCheckAllChangeItem = (e: CheckboxChangeEvent) => {
    let items: IDataTable[];
    if (e.target.checked) {
      items = dataItemTer.map((v: IDataTable) => ({ ...v, checked: true }));
    } else {
      items = dataItemTer.map((v: IDataTable) => ({ ...v, checked: false }));
    }
    setDataItemTer(items);
    let itemsCheck = items.reduce((result: number[], item: IDataTable) => {
      if (item.checked) {
        result.push(item.value);
      }
      return result;
    }, []);
    getTicketReason(itemsCheck.join(','), ticket?.reasons as any);
    return setDataItemTer(items);
  };

  const onCheckAllChangeReason = (e: CheckboxChangeEvent) => {
    let reasons: IDataTable[];
    if (e.target.checked) {
      reasons = dataResonTer.map((v: IDataTable) => ({ ...v, checked: true }));
    } else {
      reasons = dataResonTer.map((v: IDataTable) => ({ ...v, checked: false }));
    }
    setDataResonTer(reasons);
  };

  useEffect(() => {
    let countChecked = 0;
    for (const item of dataItemTer) {
      if (item.checked) {
        countChecked += 1;
      }
    }

    if (countChecked === dataItemTer.length && dataItemTer.length !== 0) {
      return setIsCheckAllItem(true);
    }
    return setIsCheckAllItem(false);
  }, [dataItemTer]);

  useEffect(() => {
    let countChecked = 0;
    for (const item of dataResonTer) {
      if (item.checked) {
        countChecked += 1;
      }
    }

    if (countChecked === dataResonTer.length && dataResonTer.length !== 0) {
      return setIsCheckAllReason(true);
    }
    return setIsCheckAllReason(false);
  }, [dataResonTer]);

  return (
    <Modal
      title='Yêu cầu cập nhật lại'
      onCancel={onCancel}
      open={isOpen}
      onOk={confirm}
      okText='Gửi'
      cancelText='Huỷ'>
      <div>Item yêu cầu cập nhật:</div>
      <TableSelected
        columns={['Selected', 'Item']}
        data={dataItemTer}
        onChange={onTableItemChange}
        onCheckAllChange={onCheckAllChangeItem}
        isCheckAll={isCheckAllItem}
      />
      <div style={{ marginTop: '10px' }}>Item yêu cầu cập nhật:</div>
      <Spin spinning={loading}>
        <TableSelected
          columns={['Selected', 'Item']}
          data={dataResonTer}
          onChange={onTableReasonChange}
          onCheckAllChange={onCheckAllChangeReason}
          isCheckAll={isCheckAllReason}
        />
      </Spin>
    </Modal>
  );
};

export default ModalRejectTicket;

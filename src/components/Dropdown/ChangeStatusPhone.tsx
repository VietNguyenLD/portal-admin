import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Modal, Space } from 'antd';
import kycApi from 'api/kycApi';
import { useAppSelector } from 'app/hooks';
import LockSimModal from 'components/Modal/LockSim';
import { BlockServiceItem } from 'constants/app.reason';
import { ActionText } from 'constants/permission';
import { TicketStatus } from 'constants/ticket.enum';
import useCan from 'hooks/useCan';
import useModal from 'hooks/useModal';
import { Ticket } from 'models/ticket';
import React, { useMemo, useState } from 'react';
import { toast } from 'react-toastify';

interface ChangeStatusPhoneButtonProps {
  ticket: Ticket | any;
  featureIds: number[];
}

const { confirm } = Modal;
export const STATUS_TICKET_SHOW = [TicketStatus.CANCELED, TicketStatus.DONE];
// export const STATUS_KYC_HIDE = [KYCProfileTempStatus.DRAFT, KYCProfileTempStatus.APPROVED];
export const ChangeStatusPhoneButton: React.FC<ChangeStatusPhoneButtonProps> = ({
  featureIds,
  ticket,
}) => {
  const { isCan, getPermission } = useCan();
  const { simDatail } = useAppSelector((state) => state.ticket);
  const lockSimModal = useModal();
  const [typeAction, setTypeAction] = useState<number>();
  const kyc = simDatail?.kyc;

  const simHandler = (type: number) => {
    setTypeAction(type);
    lockSimModal.toggle();
  };

  const menu = useMemo(() => {
    return (
      <Menu
        items={[
          kyc?.subscriptionStatus !== BlockServiceItem.BLOCK_1_WAY &&
          kyc?.subscriptionStatus !== BlockServiceItem.BLOCK_2_WAY
            ? {
                label: isCan(featureIds[0], ActionText.SUBMIT) && (
                  <p onClick={() => simHandler(BlockServiceItem.BLOCK_1_WAY)}>Khoá 1 chiều</p>
                ),
                key: '1',
              }
            : {
                label: isCan(featureIds[3], ActionText.SUBMIT) && (
                  <p onClick={() => simHandler(BlockServiceItem.UNLOCK)}>Mở khoá</p>
                ),
                key: '3',
              },
          kyc?.subscriptionStatus !== BlockServiceItem.BLOCK_2_WAY
            ? {
                label: isCan(featureIds[1], ActionText.SUBMIT) && (
                  <p onClick={() => simHandler(BlockServiceItem.BLOCK_2_WAY)}>Khoá 2 chiều</p>
                ),
                key: '2',
              }
            : null,
          {
            label: isCan(featureIds[2], ActionText.SUBMIT) && (
              <p onClick={() => simHandler(BlockServiceItem.UNSUBSCRIPTION)}>Huỷ dịch vụ</p>
            ),
            key: '4',
          },
        ]}
      />
    );
  }, [ticket, kyc]);

  const onLockSim = async (val: any) => {
    try {
      let params = {
        type: typeAction as number,
        kyc_id: kyc?.id || '',
        reason_ids: val?.reasons,
      };
      const { status } = await kycApi.blockSubscription(params);
      debugger;
      if (status === 200 || status === 201) {
        toast.success('Thành công!');
        lockSimModal.toggle();
        setTimeout(() => {
          return window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (Object.keys(simDatail?.ticket || {}).length > 0) {
    if (!STATUS_TICKET_SHOW.includes(ticket?.status)) return null;
  }

  // if (STATUS_KYC_HIDE.includes(simDatail?.kyc_temp?.status)) return null;

  return (
    <React.Fragment>
      <LockSimModal
        phoneNumber={ticket?.phone_number}
        openModal={lockSimModal.isShowing}
        cancelModal={lockSimModal.toggle}
        onFinish={onLockSim}
        type={typeAction}
      />
      <Dropdown
        overlay={menu}
        disabled={kyc?.subscriptionStatus === BlockServiceItem.UNSUBSCRIPTION}>
        <Button>
          <Space>
            Khoá /mở thuê bao
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
    </React.Fragment>
  );
};

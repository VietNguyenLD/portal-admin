import { Button, Spin, Tabs } from 'antd';
import simApi from 'api/simApi';
import { useAppDispatch } from 'app/hooks';
import ContractList from 'components/ContractList';
import { ticketActions } from 'features/ticketDetail/pages/ticketSlice';
import useReRender from 'hooks/useReRender';
import { DocumentData } from 'models/contract';
import { KYC, KYCTemp } from 'models/kyc';
import { Sim } from 'models/sim';
import { Ticket } from 'models/ticket';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import SimActivatedDetailTab from '../components/SimActivatedDetailTab';
import SimHistory from '../components/SimHistory';

interface SimDetailState {
  kyc?: KYC | undefined;
  kyc_temp?: KYCTemp | undefined;
  sim?: Sim | undefined;
  ticket?: Ticket | undefined;
  documentData: DocumentData | undefined;
}

function SimActivatedDetail() {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { serial } = useParams<{ serial: string }>();
  const [loading, setLoading] = useState(false);
  const [simDetail, setSimDetail] = useState<SimDetailState>();
  const { reRender, toggleReRender } = useReRender();

  const items = [
    {
      label: 'Thông tin SIM',
      key: '1',
      children: <SimActivatedDetailTab simDetail={simDetail} onReRender={toggleReRender} />,
    },
    {
      label: 'Thông tin Hợp đồng',
      key: '2',
      children: <ContractList documentData={simDetail?.documentData} />,
    },
    {
      label: 'Lịch sử thay đổi',
      key: '3',
      children: <SimHistory KYCId={simDetail?.kyc?.id} serial={simDetail?.sim?.serial_number} />,
    },
  ];

  async function getSimDetailBySerial() {
    try {
      setLoading(true);
      const response = await simApi.getSimInfoBySerial(serial);
      setLoading(false);
      const { data, status } = response;
      if (status === 200) {
        dispatch(ticketActions.setSimDatail(data?.data));
        setSimDetail(data.data);
      }
    } catch (error) {
      setLoading(false);
    }
  }

  useEffect(() => {
    getSimDetailBySerial();
    // eslint-disable-next-line
  }, [serial]);

  useEffect(() => {
    if (reRender) {
      getSimDetailBySerial();
      toggleReRender(false);
    }
    // eslint-disable-next-line
  }, [reRender]);

  return (
    <Spin spinning={loading}>
      <Button onClick={() => history.goBack()} style={{ marginBottom: '1rem' }}>
        Trở về
      </Button>
      <div className='sim-activated-detail'>
        <Tabs defaultActiveKey='1' type='card' items={items} />
      </div>
    </Spin>
  );
}

export default SimActivatedDetail;

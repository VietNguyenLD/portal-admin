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
import ChangeSimDetailTab from '../components/ChangeSimDetailTab';
import ChangeSimHistory from '../components/ChangeSimHistory';

interface SimDetailState {
  kycProfile?: KYC | undefined;
  kyc_temp?: KYCTemp | undefined;
  sim?: Sim | undefined;
  ticket?: Ticket | undefined;
  documentData: DocumentData | undefined;
}

function ChangeSimDetail() {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [simDetail, setSimDetail] = useState<SimDetailState>();
  const { reRender, toggleReRender } = useReRender();

  const items = [
    {
      label: 'Thông tin yêu cầu',
      key: '1',
      children: <ChangeSimDetailTab simDetail={simDetail} onReRender={toggleReRender} />,
    },
    {
      label: 'Lịch sử',
      key: '2',
      children: <ChangeSimHistory simId={id}/>,
    },
    {
      label: 'Hợp đồng',
      key: '3',
      children: <ContractList documentData={simDetail?.documentData} />,
    },
  ];

  async function getChangeSimDetailById() {
    try {
      setLoading(true);
      const response = await simApi.getChangeSimInfoById(id);
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
    getChangeSimDetailById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (reRender) {
      getChangeSimDetailById();
      toggleReRender(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

export default ChangeSimDetail;

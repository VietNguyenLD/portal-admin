import { Spin, Tabs } from 'antd';
import simApi from 'api/simApi';
import BackButton from 'components/Button/BackButton';
import ContractList from 'components/ContractList';
import useLoading from 'hooks/useLoading';
import useReRender from 'hooks/useReRender';
import { DocumentData } from 'models/contract';
import { KYCProfile, RequestChangeSIM } from 'models/sim';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RequestChangeSIMHistory from '../components/RequestChangeSIMHistory';
import RequestChangeSIMInfo from '../components/RequestChangeSIMInfo';

export interface RequestDetailData {
  documentData: DocumentData;
  changeSimRequest: RequestChangeSIM;
  kycProfile: KYCProfile;
  activated_at: string;
  mbf_code: string;
}

function RequestChangeSIMDetail() {
  const { id } = useParams<{ id: string }>();

  const { reRender, toggleReRender } = useReRender();

  const { loading, toggleLoading } = useLoading();
  const [requestDetailData, setRequestDetailData] = useState<RequestDetailData | undefined>();

  const items = [
    {
      label: 'Thông tin yêu cầu',
      key: '1',
      children: (
        <RequestChangeSIMInfo
          requestDetailData={requestDetailData}
          toggleReRender={toggleReRender}
        />
      ),
    },
    {
      label: 'Lịch sử',
      key: '2',
      children: <RequestChangeSIMHistory />,
    },
    {
      label: 'Thông tin hợp đồng',
      key: '3',
      children: <ContractList documentData={requestDetailData?.documentData} />,
    },
  ];

  async function getRequestNewSIMDetail() {
    try {
      toggleLoading(true);
      const { status, data } = await simApi.getRequestNewSIMDetail(id);
      toggleLoading(false);

      if (status === 200) {
        setRequestDetailData(data.data);
      }
    } catch (error) {
      toggleLoading(false);
      console.log('Error: ', error);
    }
  }

  useEffect(() => {
    getRequestNewSIMDetail();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (reRender) {
      getRequestNewSIMDetail();
    }
    // eslint-disable-next-line
  }, [reRender]);

  return (
    <Spin spinning={loading}>
      <div className='request-newsim-detail'>
        <BackButton />

        <div className='request-newsim-detail_main'>
          <Tabs type='card' items={items} />
        </div>
      </div>
    </Spin>
  );
}

export default RequestChangeSIMDetail;

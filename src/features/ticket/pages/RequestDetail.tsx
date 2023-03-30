import { Button, Spin, Tabs } from 'antd';
import axiosClient from 'api/axiosClient';
import ticketApi from 'api/ticketApi';
import ContractList from 'components/ContractList';
import { DocumentData } from 'models/contract';
import { KYC } from 'models/kyc';
import { Sim } from 'models/sim';
import { Ticket } from 'models/ticket';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import RequestDetailTab from '../components/RequestDetailTab';

export interface SimDetailState {
  sim?: Sim | undefined;
  kyc?: KYC | undefined;
  ticket?: Ticket | undefined;
  documentData: DocumentData | undefined;
}

const initialSimDetailState = {
  sim: undefined,
  kyc: undefined,
  ticket: undefined,
  documentData: undefined,
};

function RequestDetail() {
  const { serial } = useParams<{ serial: string }>();
  const history = useHistory();
  const [loading, setLoading] = useState<boolean>(false);
  const [simDetail, setSimDetail] = useState<SimDetailState | undefined>(initialSimDetailState);

  const getSimDetailsBySerial = async () => {
    try {
      setLoading(true);
      const url = `/sim/${serial}/detail`;
      const response = await axiosClient.get(url);
      setLoading(false);

      const { status, data } = response;
      if (status === 200) {
        setSimDetail(data.data);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    if (!serial) {
      return;
    }

    getSimDetailsBySerial();
    return () => {
      controller.abort();
    };
    // eslint-disable-next-line
  }, [serial]);

  const handleUpdateRequest = async (reqBody: { [key: string]: any }) => {
    try {
      setLoading(true);
      const url = `/ticket/${simDetail?.ticket?.id}/update`;
      const response = await axiosClient.put(url, reqBody);
      setLoading(false);
      const { status } = response;
      if (status === 200) {
        toast.success('Lưu thành công');
        getSimDetailsBySerial();
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const handleDeleteRequest = async (ticket: Ticket) => {
    try {
      setLoading(true);
      const response = await ticketApi.deleteTicket(ticket.id);
      setLoading(false);
      const { status } = response;
      if (status === 200) {
        toast.success('Xóa thành công');
        history.push('/admin/ticket/request-list');
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSubmitRequest = async (ticket: Ticket) => {
    try {
      setLoading(true);
      const response = await ticketApi.submitTicket(ticket.id);
      setLoading(false);
      const { status } = response;
      if (status === 201) {
        toast.success('Tạo Thành Công Yêu Cầu');
        history.push('/admin/ticket/request-list');
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const items = [
    {
      label: 'Thông tin Yêu cầu',
      key: '1',
      children: (
        <RequestDetailTab
          simDetail={simDetail}
          onUpdateRequest={handleUpdateRequest}
          onDeleteRequest={handleDeleteRequest}
          onSubmitRequest={handleSubmitRequest}
        />
      ),
    },
    {
      label: 'Thông tin Hợp đồng',
      key: '2',
      children: <ContractList documentData={simDetail?.documentData} />,
    },
  ];
  return (
    <React.Fragment>
      <Button
        style={{
          marginBottom: '1rem',
        }}
        onClick={() => history.goBack()}>
        Trở về
      </Button>
      <div className='request-detail'>
        <Spin spinning={loading}>
          <Tabs defaultActiveKey='1' type='card' items={items} />
        </Spin>
      </div>
    </React.Fragment>
  );
}

export default RequestDetail;

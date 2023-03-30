import { Button, Modal, Row, Tabs } from 'antd';
import axiosClient from 'api/axiosClient';
import BackButton from 'components/Button/BackButton';
import ItemInfo from 'components/common/ItemInfo';
import Fieldset from 'components/Form/Fieldset';
import { BatchStatus, batchStatusText } from 'constants/batch.enum';
import { Format } from 'constants/date';
import { ActionText, Feature } from 'constants/permission';
import { AppContext } from 'context/AppContext';
import useCan from 'hooks/useCan';
import useFetch from 'hooks/useFetch';
import useReRender from 'hooks/useReRender';
import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { formatDateFromIso } from 'utils';
import RequestCheckInfoItemFail from '../components/RequestCheckInfoItemFail';
import RequestCheckInfoItemSuccess from '../components/RequestCheckInfoItemSuccess';

function RequestCheckInfoDetailPage() {
  const exportSuccessRef = useRef<any>();
  const exportFailRef = useRef<any>();
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const [activeKey, setActiveKey] = useState('1');
  const { setLoading } = useContext(AppContext);

  const { reRender, toggleReRender } = useReRender();
  const { isCan } = useCan();
  const { data, fetchData } = useFetch({
    url: `/send-batch/request-batch/${id}`,
    setLoading,
  });

  const extraData = data?.extra_data;
  const createdByUser = data?.createdByUser;
  const confirmRequestBtn = data?.status === BatchStatus.IMPORTED && extraData?.success_total > 0;

  const items = [
    {
      label: 'Thông tin import đúng',
      key: '1',
      children: (
        <RequestCheckInfoItemSuccess
          ref={exportSuccessRef}
          batchStatus={data?.status}
          onReRender={toggleReRender}
          reRender={reRender}
        />
      ),
    },
    {
      label: 'Thông tin import sai',
      key: '2',
      children: <RequestCheckInfoItemFail ref={exportFailRef} />,
    },
  ];

  async function handleDeleteBatch() {
    try {
      setLoading(true);
      const url = `/send-batch/request-batch/${data?.id}`;
      const { status } = await axiosClient.delete(url);

      if (status === 200) {
        toast.success('Xóa thành công');
        history.goBack();
      }
    } catch (error) {
      setLoading(false);
      console.log('Error:', error);
    }
  }

  function handleExportExcel(activeKey: string) {
    if (activeKey === '1') {
      exportSuccessRef?.current?.exportExcel();
    } else {
      exportFailRef?.current?.exportExcel();
    }
  }

  async function handleConfirmSendNoti() {
    const param = {
      request_batch_id: data?.id,
    };

    try {
      setLoading(true);
      const url = `/send-batch/request-batch/confirm-request`;
      const { status } = await axiosClient.post(url, param);

      if (status === 201) {
        toast.success('Đã xác nhận gửi đề nghị xong.');
        setLoading(false);
        toggleReRender(true);
      }
    } catch (error) {
      setLoading(false);
      console.log('Error:', error);
    }
  }

  function confirmRequestModal() {
    Modal.confirm({
      title: 'Xác Nhận Gửi Đề Nghị',
      content: <p>Bạn có chắc là muốn gửi Noti/SMS cho các thuê bao trong batch này không?</p>,
      onOk: () => {
        handleConfirmSendNoti();
      },
      cancelText: 'Hủy',
      okText: 'Gửi',
    });
  }

  useEffect(() => {
    if (reRender) {
      fetchData();
    }
    toggleReRender(false);
    // eslint-disable-next-line
  }, [reRender]);

  return (
    <Fragment>
      <BackButton />
      <div className='bg-white' style={{ padding: '1rem' }}>
        <Fieldset title='Thông tin chi tiết'>
          <Row gutter={16}>
            <ItemInfo label='Batch ID' value={data?.code} />
            <ItemInfo
              label='Ngày bắt đầu'
              value={formatDateFromIso(extraData?.start_date, Format.DATE_TIME)}
            />
            <ItemInfo label='Import thành công' value={extraData?.success_total} />
            <ItemInfo
              label='Thời gian tạo'
              value={formatDateFromIso(data?.created_at, Format.DATE_TIME)}
            />
            <ItemInfo
              label='Ngày kết thúc'
              value={formatDateFromIso(extraData?.end_date, Format.DATE_TIME)}
            />
            <ItemInfo label='Import thất bại' value={extraData?.fail_total} />
            <ItemInfo label='Người tạo' value={createdByUser?.name} />
            <ItemInfo label='Thời gian gửi thông báo' value={extraData?.send_notification_date} />
            <ItemInfo label='Xác nhận thành công' value={extraData?.request_success} />

            <ItemInfo label='Trạng thái' value={batchStatusText(data?.status, data?.type)} />
            <ItemInfo label='Tên file' value={extraData?.file_name} />
            <ItemInfo label='Xác nhận thất bại' value={extraData?.request_fail} />
            <ItemInfo label='Tổng cộng' value={extraData?.total_items} />
          </Row>
        </Fieldset>
      </div>
      <div className='flex justify-end' style={{ margin: '1rem 0 1rem', columnGap: '1rem' }}>
        {activeKey === '1' ? (
          <React.Fragment>
            {isCan(Feature.TICKET_REQUEST_BATCH_DETAIL_DELETE_BATCH, ActionText.SUBMIT) &&
              data?.status === BatchStatus.IMPORTED && (
                <Button onClick={handleDeleteBatch}>Xóa</Button>
              )}

            {isCan(Feature.TICKET_REQUEST_BATCH_DETAIL_CONFIRM, ActionText.SUBMIT) &&
              confirmRequestBtn && (
                <Button onClick={() => confirmRequestModal()}>Xác nhận gửi đề nghị</Button>
              )}

            {isCan(Feature.TICKET_REQUEST_BATCH_DETAIL, ActionText.EXPORT) && (
              <Button onClick={() => handleExportExcel(activeKey)}>Export</Button>
            )}
          </React.Fragment>
        ) : (
          <React.Fragment>
            {isCan(Feature.TICKET_REQUEST_BATCH_DETAIL_DELETE_BATCH, ActionText.SUBMIT) &&
              data?.status === BatchStatus.IMPORTED && (
                <Button onClick={handleDeleteBatch}>Xóa</Button>
              )}

            {isCan(Feature.TICKET_REQUEST_BATCH_DETAIL, ActionText.EXPORT) && (
              <Button onClick={() => handleExportExcel(activeKey)}>Export</Button>
            )}
          </React.Fragment>
        )}
      </div>

      <Tabs
        type='card'
        items={items}
        activeKey={activeKey}
        onChange={(activeKey) => setActiveKey(activeKey)}
        className='bg-white'
      />
    </Fragment>
  );
}

export default RequestCheckInfoDetailPage;

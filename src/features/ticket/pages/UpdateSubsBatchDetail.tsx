import { Button, Col, Modal, Row, Spin, Tabs } from 'antd';
import sendBatchApi from 'api/sendBatchApi';
import ItemInfo from 'components/common/ItemInfo';
import Fieldset from 'components/Form/Fieldset';
import { BatchStatus } from 'constants/batch.enum';
import { Format } from 'constants/date';
import { ActionText, Feature } from 'constants/permission';
import useCan from 'hooks/useCan';
import useLoading from 'hooks/useLoading';
import useModal from 'hooks/useModal';
import useReRender from 'hooks/useReRender';
import { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { capitalizeText, formatDateFromIso } from 'utils';
import BatchItemImportFail from '../components/BatchItemImportFail';
import BatchItemImportSuccess from '../components/BatchItemImportSuccess';

function UpdateSubsBatchDetail() {
  const { id } = useParams<{ id: string }>();
  const { isCan } = useCan();
  const history = useHistory();
  const { reRender, toggleReRender } = useReRender();
  const { loading, toggleLoading } = useLoading();
  const resultCreateRequestModal = useModal();
  const resultCreateTicketModal = useModal();

  const [activeKey, setActiveKey] = useState('1');
  const [batchDetail, setBatchDetail] = useState<any>();

  const exportSuccessRef = useRef<any>();
  const exportFailRef = useRef<any>();

  const createRequestBtn =
    batchDetail?.status === BatchStatus.DONE && batchDetail?.success_total > 0;
  const createTicketBtn = batchDetail?.is_allow_create_ticket && batchDetail?.success_total > 0;

  const items = [
    {
      label: 'Thông tin import đúng',
      key: '1',
      children: (
        <BatchItemImportSuccess
          onLoading={toggleLoading}
          ref={exportSuccessRef}
          batchStatus={batchDetail?.status}
          onReRender={toggleReRender}
          reRender={reRender}
        />
      ),
    },
    {
      label: 'Thông tin import sai',
      key: '2',
      children: <BatchItemImportFail onLoading={toggleLoading} ref={exportFailRef} />,
    },
  ];

  const resultCreateRequest = () => {
    return (
      <Modal
        title='Kết quả chuyển yêu cầu'
        closable={false}
        footer={[
          <Button key='back' type='primary' onClick={() => resultCreateRequestModal.toggle()}>
            OK
          </Button>,
        ]}
        open={true}>
        <div>
          <p>Đã chuyển yêu cầu xong.</p>
          <p>
            {batchDetail?.request_success} thành công, {batchDetail?.request_fail} thất bại.
          </p>
        </div>
      </Modal>
    );
  };

  const resultCreateTicket = () => {
    return (
      <Modal
        title='Kết quả chuyển ticket'
        closable={false}
        footer={[
          <Button key='back' type='primary' onClick={() => resultCreateTicketModal.toggle()}>
            OK
          </Button>,
        ]}
        open={true}>
        <div>
          <p>Đã chuyển thành ticket xong.</p>
          <p>{batchDetail?.ticket_total} thành công.</p>
        </div>
      </Modal>
    );
  };

  async function handleCreateRequest() {
    const reqBody = {
      batch_id: batchDetail?.id,
    };

    try {
      toggleLoading(true);
      const { status } = await sendBatchApi.updateToDraft(reqBody);
      toggleLoading(false);
      if (status === 201) {
        toggleReRender(true);
        resultCreateRequestModal.toggle();
      }
    } catch (error) {
      toggleLoading(false);
    }
  }

  async function handleCreateTicket() {
    const reqBody = {
      batch_id: batchDetail?.id,
    };

    try {
      toggleLoading(true);
      const { status } = await sendBatchApi.updateToTicket(reqBody);
      toggleLoading(false);

      if (status === 201) {
        toggleReRender(true);
        resultCreateTicketModal.toggle();
      }
    } catch (error) {
      toggleLoading(false);
    }
  }

  const getImportBatchDetail = async () => {
    try {
      toggleLoading(true);
      const { status, data } = await sendBatchApi.getImportBatchDetail(id);
      toggleLoading(false);
      if (status === 200) {
        setBatchDetail(data.data);
      }
    } catch (error) {
      toggleLoading(false);
    }
  };

  function handleExportExcel(activeKey: string) {
    if (activeKey === '1') {
      exportSuccessRef?.current?.exportExcel();
    } else {
      exportFailRef?.current?.exportExcel();
    }
  }

  function renderButton() {
    if (activeKey === '1') {
      return (
        <Col span={20} className='batch-detail_action'>
          {isCan(Feature.TICKET_IMPORTBATCH_DETAIL_TO_REQUEST, ActionText.SUBMIT) &&
            (createRequestBtn ? (
              <Button onClick={handleCreateRequest}>Chuyển thành yêu cầu</Button>
            ) : null)}

          {isCan(Feature.TICKET_IMPORTBATCH_DETAIL_TO_TICKET, ActionText.SUBMIT) &&
            (createTicketBtn ? (
              <Button onClick={handleCreateTicket}>Chuyển thành ticket</Button>
            ) : null)}

          {isCan(Feature.TICKET_IMPORTBATCH_DETAIL, ActionText.EXPORT) && (
            <Button onClick={() => handleExportExcel(activeKey)}>Export</Button>
          )}
        </Col>
      );
    }
    return (
      <Col span={20} className='batch-detail_action'>
        {isCan(Feature.TICKET_IMPORTBATCH_DETAIL, ActionText.EXPORT) && (
          <Button onClick={() => handleExportExcel(activeKey)}>Export</Button>
        )}
      </Col>
    );
  }

  useEffect(() => {
    if (reRender) {
      getImportBatchDetail();
      toggleReRender(false);
    }
    // eslint-disable-next-line
  }, [reRender]);

  useEffect(() => {
    getImportBatchDetail();
    // eslint-disable-next-line
  }, [id]);

  return (
    <Spin spinning={loading}>
      {resultCreateRequestModal.isShowing ? resultCreateRequest() : null}
      {resultCreateTicketModal.isShowing ? resultCreateTicket() : null}

      <div className='update-subs-batch-detail'>
        <Row>
          <Col span={4}>
            <Button onClick={() => history.goBack()}>Trở về</Button>
          </Col>
          {renderButton()}
        </Row>

        <Fieldset title='Thông tin chi tiết'>
          <Row gutter={16} className='info_item'>
            <ItemInfo label='Batch ID' value={batchDetail?.code} colSpan={8} />
            <ItemInfo
              label='Tổng cộng'
              value={`${batchDetail?.success_total + batchDetail?.fail_total}`}
              colSpan={8}
            />
            <ItemInfo label='Tên files' value={batchDetail?.file_name} colSpan={8} />
          </Row>

          <Row gutter={16} className='info_item'>
            <ItemInfo
              label='Thời gian tạo'
              value={formatDateFromIso(batchDetail?.created_at, Format.DATE_TIME)}
              colSpan={8}
            />
            <ItemInfo label='Import thành công' value={batchDetail?.success_total} colSpan={8} />
            <ItemInfo label='Yêu cầu thành công' value={batchDetail?.request_success} colSpan={8} />
          </Row>

          <Row gutter={16} className='info_item'>
            <ItemInfo
              label='Người tạo'
              value={capitalizeText(batchDetail?.createdByUser?.name)}
              colSpan={8}
            />
            <ItemInfo label='Import thất bại' value={batchDetail?.fail_total} colSpan={8} />
            <ItemInfo label='Yêu cầu thất bại' value={batchDetail?.request_fail} colSpan={8} />
          </Row>

          <Row gutter={16} className='info_item'>
            <ItemInfo
              label='Thời gian chuyển yêu cầu'
              value={formatDateFromIso(batchDetail?.updated_at, Format.DATE_TIME)}
              colSpan={8}
            />
            <ItemInfo label='Chuyển thành ticket' value={batchDetail?.ticket_total} colSpan={8} />
            <ItemInfo label='Loại' value={batchDetail?.import_type} colSpan={8} />
          </Row>

          <Row gutter={16} className='info_item'>
            <ItemInfo
              label='Người cập nhật'
              value={capitalizeText(batchDetail?.updatedByUser?.name)}
              colSpan={8}
            />
          </Row>
        </Fieldset>

        <Tabs
          type='card'
          items={items}
          activeKey={activeKey}
          onChange={(activeKey) => setActiveKey(activeKey)}
        />
      </div>
    </Spin>
  );
}

export default UpdateSubsBatchDetail;

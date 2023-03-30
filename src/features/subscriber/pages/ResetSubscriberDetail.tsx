import { Button, Row, Spin, Tabs } from 'antd';
import axiosClient from 'api/axiosClient';
import sendBatchApi from 'api/sendBatchApi';
import ItemInfo from 'components/common/ItemInfo';
import Fieldset from 'components/Form/Fieldset';
import { BatchStatus } from 'constants/batch.enum';
import { Format } from 'constants/date';
import { ActionText, Feature } from 'constants/permission';
import useCan from 'hooks/useCan';
import useLoading from 'hooks/useLoading';
import { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { capitalizeText, formatDateFromIso } from 'utils';
import { batchStatusText } from 'utils/batch';
import ImportSubscriberFail from '../components/ImportSubscriberFail';
import ImportSubscriberSuccess from '../components/ImportSubscriberSuccess';

function ResetSubscriberDetail() {
  const { isCan } = useCan();
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { loading, toggleLoading } = useLoading();

  const [batchDetail, setBatchDetail] = useState<any>();
  const [activeKey, setActiveKey] = useState('1');

  const exportSuccessRef = useRef<any>();
  const exportFailRef = useRef<any>();

  const revokeBtn = batchDetail?.status === BatchStatus.DONE && batchDetail?.success_total > 0;

  const items = [
    {
      label: 'Import thành công',
      key: '1',
      children: <ImportSubscriberSuccess onLoading={toggleLoading} ref={exportSuccessRef} />,
    },
    {
      label: 'Import lỗi',
      key: '2',
      children: <ImportSubscriberFail onLoading={toggleLoading} ref={exportFailRef} />,
    },
  ];

  function handleExportExcel(activeKey: string) {
    if (activeKey === '1') {
      exportSuccessRef?.current?.exportExcel();
    } else {
      exportFailRef?.current?.exportExcel();
    }
  }

  async function handleRevokeClick() {
    try {
      const url = `/send-batch/reset-batch/${id}/revoke-subs`;
      toggleLoading(true);
      const { status } = await axiosClient.post(url);
      toggleLoading(false);
      console.log('revoke-status: ', status);
    } catch (error) {
      toggleLoading(false);
    }
  }

  useEffect(() => {
    async function getImportBatchDetail() {
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
    }

    getImportBatchDetail();
    // eslint-disable-next-line
  }, [id]);

  function renderButton() {
    if (activeKey === '1') {
      return (
        <Row className='reset-subscriber_btn'>
          {isCan(Feature.RESET_BATCH_DETAIL_UNSUBSCRIPTION, ActionText.SUBMIT) &&
            (revokeBtn ? <Button onClick={handleRevokeClick}>Yêu cầu thu hồi</Button> : null)}

          {isCan(Feature.RESET_BATCH_DETAIL, ActionText.EXPORT) && (
            <Button onClick={() => handleExportExcel(activeKey)}>Export</Button>
          )}
        </Row>
      );
    }
    return (
      <Row className='reset-subscriber_btn'>
        {isCan(Feature.RESET_BATCH_DETAIL, ActionText.EXPORT) && (
          <Button onClick={() => handleExportExcel(activeKey)}>Export</Button>
        )}
      </Row>
    );
  }

  return (
    <Spin spinning={loading}>
      <div className='reset-subscriber-detail'>
        <Button onClick={() => history.goBack()} className='back-btn'>
          Trở về
        </Button>

        <Fieldset title='Thông tin chi tiết'>
          <Row gutter={16} className='info_item'>
            <ItemInfo label='BatchID' value={batchDetail?.code} colSpan={6} />
            <ItemInfo
              label='Tổng số thuê bao'
              value={`${batchDetail?.success_total + batchDetail?.fail_total}`}
              colSpan={6}
            />
            <ItemInfo label='Tên file' value={batchDetail?.file_name} colSpan={6} />
          </Row>
          <Row gutter={16} className='info_item'>
            <ItemInfo
              label='Ngày tạo'
              value={formatDateFromIso(batchDetail?.created_at, Format.DATE_TIME)}
              colSpan={6}
            />
            <ItemInfo label='Import thành công' value={batchDetail?.success_total} colSpan={6} />
            <ItemInfo
              label='Hủy thành công'
              value={batchDetail?.unsubscription_success}
              colSpan={6}
            />
            <ItemInfo label='Thu hồi thành công' value={batchDetail?.recall_success} colSpan={6} />
          </Row>
          <Row gutter={16} className='info_item'>
            <ItemInfo
              label='Người tạo'
              value={capitalizeText(batchDetail?.createdByUser?.name)}
              colSpan={6}
            />
            <ItemInfo label='Import lỗi' value={batchDetail?.fail_total} colSpan={6} />
            <ItemInfo label='Hủy lỗi' value={batchDetail?.unsubscription_fail} colSpan={6} />
            <ItemInfo label='Thu hồi lỗi' value={batchDetail?.recall_fail} colSpan={6} />
          </Row>
          <Row gutter={16} className='info_item'>
            <ItemInfo
              label='Ngày yêu cầu thu hồi'
              value={formatDateFromIso(batchDetail?.updated_at, Format.DATE_TIME)}
              colSpan={6}
            />
            <ItemInfo
              label='Trạng thái batch'
              value={batchStatusText(batchDetail?.status, batchDetail?.type)}
              colSpan={6}
            />
            <ItemInfo label='Ngày thu hồi STB' value='-' colSpan={6} />
          </Row>
          <Row gutter={16} className='info_item'>
            <ItemInfo
              label='Người yêu cầu thu hồi'
              value={capitalizeText(batchDetail?.updatedByUser?.name)}
              colSpan={6}
            />
          </Row>
        </Fieldset>

        {renderButton()}

        <div className='reset-subscriber_tabs'>
          <Tabs
            type='card'
            activeKey={activeKey}
            items={items}
            onChange={(activeKey) => setActiveKey(activeKey)}
          />
        </div>
      </div>
    </Spin>
  );
}

export default ResetSubscriberDetail;

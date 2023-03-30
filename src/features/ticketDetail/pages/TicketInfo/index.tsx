import { Box } from '@mui/material';
import { Col, Row } from 'antd';
import { useAppSelector } from 'app/hooks';
import clsx from 'clsx';
import TableSelected from 'components/TableSelected';
import moment from 'moment';
import { ticketStatusText } from 'utils/ticket';
import { convertTicketExpied, convertTicketType, DATE_FORMAT } from '../../../../share/helper';
import { DEFAULT_TEXT } from '../SimInfo';
import styles from './index.module.scss';
import { Format } from '../../../../constants/date';
import { capitalizeText, formatDateFromIso } from '../../../../utils';

const TicketInfo = () => {
  const { dataItem, dataReason, ticket } = useAppSelector((state) => state.ticket);
  return (
    <>
      <Box className={styles.ticket_info}>
        <Row gutter={[16, 16]} className={clsx(styles.ticket_info__textbold, styles.mb_10)}>
          <Col span={12}>Mã Ticket: {ticket?.code}</Col>
          <Col span={12}>Trạng thái ticket: {ticketStatusText(ticket?.status!)}</Col>
        </Row>

        <Row gutter={[16, 16]} className={clsx(styles.ticket_info__textbold, styles.mb_10)}>
          <Col span={12}>Số lần yêu cầu hiện tại: {ticket?.requested_count}</Col>
          <Col span={12}>Trạng thái quá hạn: {convertTicketExpied(ticket?.expired_status)}</Col>
        </Row>
        <Row gutter={[16, 16]} className={styles.mb_10}>
          <Col span={12} className={styles.ticket_info__textbold}>
            Loại: {convertTicketType(ticket?.type)}
          </Col>
          <Col span={12}>Người yêu cầu: {ticket?.author}</Col>
        </Row>
        {ticket?.batchId_code && (
          <Row gutter={[16, 16]} className={styles.mb_10}>
            <Col span={12} className={styles.ticket_info__textbold}>
              BatchID: {ticket?.batchId_code}
            </Col>
          </Row>
        )}

        <Row gutter={[16, 16]} className={styles.mb_10}>
          <Col span={12} className={styles.ticket_info__textbold}>
            Nội dung: {ticket?.extra_data && JSON.parse(ticket?.extra_data).content}
          </Col>
          <Col span={12}>
            Thời gian tạo: {ticket && formatDateFromIso(ticket.created_at, Format.DATE_TIME)}
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12} className={styles.mt_20}>
            <div className={styles.mb_10}>Item yêu cầu cập nhật:</div>
            <div className={styles.mb_20}>
              <TableSelected columns={['Selected', 'Item']} data={dataItem} />
            </div>
            <div className={styles.mb_10}>Lý do:</div>
            <div>
              <TableSelected columns={['Selected', 'Item']} data={dataReason} />
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.mb_10}>Người cập nhật cuối: admin1</div>
            <div className={styles.mb_10}>
              Thời gian cập nhật cuối:{' '}
              {ticket && formatDateFromIso(ticket.updated_at, Format.DATE_TIME)}
            </div>
          </Col>
        </Row>
      </Box>
    </>
  );
};

export default TicketInfo;

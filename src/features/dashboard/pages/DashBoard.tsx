import { Column, Pie } from '@ant-design/plots';
import { Col, DatePicker, DatePickerProps, Form, Row, Select, Spin } from 'antd';
import { RangePickerProps } from 'antd/lib/date-picker';
import ticketApi from 'api/ticketApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { BorderText } from 'components/BorderText';
import { TicketStatus, TicketStatusText, TicketType, TicketTypeText } from 'constants/ticket.enum';
import { ticketActions } from 'features/ticketDetail/pages/ticketSlice';
import { StatisticalRequest, TicketDashboard } from 'models/ticket';
import { User } from 'models/user';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { disabledDate } from 'share/helper';
import styles from './index.module.scss';
const { Option } = Select;
const { RangePicker } = DatePicker;

const renderTextCholum = (text: string) => {
  switch (text) {
    case 'done':
      return TicketStatusText.DONE;
    case 'mbfReject':
      return TicketStatusText.MBF_REJECT;
    case 'requested':
      return 'Đang YCCN';
    case 'userUpdated':
      return TicketStatusText.USER_UPDATED;
  }
};

const renderTextPie = (text: string) => {
  switch (text) {
    case 'metrics_1_14':
      return 'Từ 1-14 ngày';
    case 'metrics_15':
      return '15 ngày';
    case 'metrics_16_29':
      return 'Từ 16-29 ngày';
    case 'metrics_30':
      return '30 ngày';
    case 'metrics_31_59':
      return 'Từ 31-59 ngày';
    case 'metrics_60':
      return '60 ngày';
  }
};

const configCol: any = {
  // data: statisticalData,
  xField: 'name',
  yField: 'value',
  seriesField: 'name',
  isGroup: 'true',
  legend: {
    position: 'right',
    offsetX: 8,
  },
  minColumnWidth: 50,
};

const configPie: any = {
  appendPadding: 10,
  // data: dataPie,
  angleField: 'value',
  height: 300,
  width: 500,
  colorField: 'type',
  radius: 0.9,
  label: {
    type: 'inner',
    offset: '-30%',
    content: ({ percent }: any) => `${(percent * 100).toFixed(0)}%`,
    style: {
      fontSize: 14,
      textAlign: 'center',
    },
  },
  interactions: [
    {
      type: 'element-active',
    },
  ],
};

const Dashboard = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [users, setUsers] = useState<User[]>([]);
  const [dashBoard, setDashboard] = useState<TicketDashboard>();
  const [query, setQuery] = useState<StatisticalRequest>();
  const [statisticalData, setStatisticalData] = useState<any>([]);
  const [dataPie, setDataPie] = useState<any>([]);
  const { query: queryTicket } = useAppSelector((state) => state.ticket);
  useEffect(() => {
    getDataDashboard();
  }, []);
  configCol.data = statisticalData;
  configPie.data = dataPie;

  useEffect(() => {
    getStatistical();
    // eslint-disable-next-line
  }, [query]);

  const getDataDashboard = async () => {
    try {
      const { status, data } = await ticketApi.dashboard();
      if (status === 200) {
        setDashboard(data.data);

        let dataPieChar = [];
        for (const [key, value] of Object.entries(data.data.expired_update_metrics)) {
          dataPieChar.push({
            type: renderTextPie(key),
            value: value,
          });
        }
        setDataPie(dataPieChar);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getStatistical = async () => {
    try {
      const { status, data } = await ticketApi.statistical(query);
      if (status === 200 && data?.data) {
        let dataBarChar = [];
        for (const [key, value] of Object.entries(data.data)) {
          dataBarChar.push({
            name: renderTextCholum(key),
            value: value,
          });
        }
        setStatisticalData(dataBarChar);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onSelectedUser = (id: number) => {
    setQuery({ ...query, updated_by: id });
  };

  const onSelectedTicketType = (id: number) => {
    setQuery({ ...query, type: id });
  };

  const onSelectedFromDate = (
    _value: DatePickerProps['value'] | RangePickerProps['value'],
    dateString: [string, string] | string,
  ) => {
    setQuery({
      ...query,
      to: moment(dateString[1]).endOf('day').format(),
      from: moment(dateString[0]).startOf('day').format(),
    });
  };

  const onLinkExpiredTicket = () => {
    dispatch(
      ticketActions.setQueryFilter({
        ...queryTicket,
        TicketExpiredStatus: 2,
      }),
    );
    history.push('/admin/ticket/list');
  };

  const onLinkUserUpdateTicket = () => {
    delete queryTicket.TicketExpiredStatus;
    dispatch(
      ticketActions.setQueryFilter({
        ...queryTicket,
        'filter.status': `$eq:${TicketStatus.USER_UPDATED}`,
      }),
    );
    history.push('/admin/ticket/list');
  };

  const onLinkRequestListTicket = () => {
    history.push('/admin/ticket/request-list');
  };

  return (
    <Spin spinning={false}>
      <Form layout='vertical'>
        <Row gutter={24} className={styles.dashboard}>
          <Col span={14}>
            <h1 className={styles.dashboard__title}>Thống Kê Ticket</h1>
            <Row gutter={[16, 16]} className={styles.dashboard__fillter}>
              <Col span={4}>
                <Form.Item label='Người xử lý'>
                  <Select defaultValue={null} onChange={onSelectedUser}>
                    {users.map((item) => (
                      <Option key={item?.id} value={item.id}>
                        {item?.name}
                      </Option>
                    ))}
                    <Option value={null}>Tất cả</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label='Loại ticket'>
                  <Select defaultValue={null} onChange={onSelectedTicketType}>
                    <Option value={TicketType.CS}>{TicketTypeText.CS}</Option>
                    <Option value={TicketType.TL}>{TicketTypeText.TL}</Option>
                    <Option value={TicketType.US}>{TicketTypeText.US}</Option>
                    <Option value={null}>Tất cả</Option>
                  </Select>
                </Form.Item>
              </Col>
              {/* <Col span={4}>
                <Form.Item label='Từ ngày'>
                  <DatePicker onChange={onSelectedFromDate} />
                </Form.Item>
              </Col> */}
              <Col span={8}>
                <Form.Item label='Từ ngày - Đến ngày'>
                  <RangePicker onChange={onSelectedFromDate} disabledDate={disabledDate} />
                </Form.Item>
              </Col>
            </Row>
          </Col>

          <Col span={10} className={styles.dashboard__colright}>
            <BorderText title='Cần Xử Lý' className={styles.dashboard__legend}>
              <div className={styles.dashboard__boxright} onClick={onLinkExpiredTicket}>
                <span>Qúa hạn xử lý:</span>
                <span>{dashBoard?.expired_processing_total}</span>
              </div>
              <div className={styles.dashboard__boxright} onClick={onLinkUserUpdateTicket}>
                <span>Chờ duyệt:</span>
                <span>{dashBoard?.waiting_for_approve_total}</span>
              </div>
              <div className={styles.dashboard__boxright} onClick={onLinkRequestListTicket}>
                <span> Chưa submit:</span> <span>{dashBoard?.waiting_for_submit}</span>
              </div>
            </BorderText>
          </Col>
          <Col span={14} style={{ marginTop: '50px', paddingLeft: '50px' }}>
            <Column {...configCol} />
          </Col>

          <Col span={10} style={{ marginTop: '50px' }}>
            <h1 className={styles.dashboard__title}>Thống Kê Theo Thời Gian Yêu Cầu</h1>
            <div className={styles.container}>
              <div className={styles.container__item}>
                <div className={styles.container__item_row}>
                  <span>Từ 1-14 ngày</span>
                  <span>{dashBoard?.expired_update_metrics?.metrics_1_14 || 0}</span>
                </div>
                <div className={styles.container__item_row}>
                  <span>Từ 16-29 ngày</span>
                  <span>{dashBoard?.expired_update_metrics?.metrics_16_29 || 0}</span>
                </div>
                <div className={styles.container__item_row}>
                  <span>Từ 31-59 ngày</span>
                  <span>{dashBoard?.expired_update_metrics?.metrics_31_59 || 0}</span>
                </div>
              </div>
              <div className={styles.container__item}>
                <div className={styles.container__item_row}>
                  <span>15 ngày</span>
                  <span>{dashBoard?.expired_update_metrics?.metrics_15 || 0}</span>
                </div>
                <div className={styles.container__item_row}>
                  <span>30 ngày</span>
                  <span>{dashBoard?.expired_update_metrics?.metrics_30 || 0}</span>
                </div>
                <div className={styles.container__item_row}>
                  <span>Từ 60 ngày</span>
                  <span>{dashBoard?.expired_update_metrics?.metrics_60 || 0}</span>
                </div>
              </div>
            </div>

            <div className={styles.dashboard__colright_char}>
              <Pie {...configPie} />
            </div>
          </Col>
        </Row>
      </Form>
    </Spin>
  );
};

export default Dashboard;

import { Button, Form, Row, TablePaginationConfig } from 'antd';
import { TICKET_URL } from 'api/ticketApi';
import useFetch from 'hooks/useFetch';
import { TicketFilter } from 'models/ticket';
import moment from 'moment';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import FilterTicker from './FilterTicket';
import TicketTable from './TicketTable';

interface BatchTicketProps {
  onSaveBtnClick: (value: any) => void;
  dataUser: any;
  setListId: (value: any) => void;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const BatchTicket: React.FC<BatchTicketProps> = (props: BatchTicketProps) => {
  const { onSaveBtnClick, dataUser, setListId, setLoading } = props;

  const [query, setQuery] = useState({
    limit: 10,
    page: 1,
    'filter.status': `$eq: 4`,
    'filter.kycTempStatus': '1',
  });

  const [form] = Form.useForm();

  const { data, fetchData } = useFetch({ url: `${TICKET_URL}/list`, param: query, setLoading });

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const { current, pageSize } = pagination;
    if (query.limit !== pageSize || current !== query.page) {
      setQuery({ ...query, limit: pageSize || 10, page: current || 1 });
      fetchData({
        ...query,
        limit: pageSize,
        page: current,
      });
    }
  };

  useEffect(() => {
    let params: TicketFilter;
    params = query;

    form.setFieldsValue({
      // type: params['filter.type'],
      // created_by: params['filter.created_by'],
      // updated_by: params['filter.updated_by'],
    });
  }, [query, form]);

  const onSearch = async (val: any) => {
    let params: TicketFilter = {
      limit: query.limit,
      page: 1,
      'filter.status': `$eq: 4`,
      'filter.kycTempStatus': '1',
    };
    if (val?.type) {
      params['filter.type'] = val.type;
    }
    if (val?.created_by) {
      params['filter.created_by'] = val.created_by;
    }
    if (val?.updated_by) {
      params['filter.updated_by'] = val.updated_by;
    }
    if (val?.created_at) {
      params['filter.created_at'] = `$btw:${moment(val?.created_at[0])
        .startOf('day')
        .format()},${moment(val?.created_at[1]).endOf('day').format()}`;
    }
    if (val?.updated_at) {
      params['filter.updated_at'] = `$btw:${moment(val?.updated_at[0])
        .startOf('day')
        .format()},${moment(val?.updated_at[1]).endOf('day').format()}`;
    }
    fetchData(params);
  };

  return (
    <div className={'batch-body'}>
      <Form layout='vertical' form={form} onFinish={(val) => onSearch(val)}>
        <FilterTicker dataUser={dataUser}></FilterTicker>
        <Row gutter={[0, 8]} className={'batch-control'}>
          <Button htmlType='submit' type='primary'>
            Load danh sách
          </Button>
          <Button type='primary' onClick={onSaveBtnClick}>
            Lưu
          </Button>
        </Row>
      </Form>
      <TicketTable
        data={data}
        setListId={setListId}
        handleTableChange={handleTableChange}
        currentPage={query.page}
      />
    </div>
  );
};

export default BatchTicket;

import { Image, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { TICKET_URL_HIS } from 'api/ticketApi';
import { Format } from 'constants/date';
import { AppContext } from 'context/AppContext';
import useFetch from 'hooks/useFetch';
import { TicketHistory } from 'models/ticket';
import moment from 'moment';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const StyledHistoryPhoto = styled.div`
  display: flex;
  column-gap: 1rem;
  .ant-image {
    height: 3.75rem;
    img {
      height: 100%;
    }
  }
`;

const columns: ColumnsType<TicketHistory> = [
  {
    title: 'STT',
    dataIndex: 'index',
    key: 'index',
    width: 50,
    render: (val, record, index) => <>{index + 1}</>,
  },
  {
    title: 'Thời gian',
    dataIndex: 'created_at',
    key: 'created_at',
    width: 200,
    render: (text) => moment(text).format(Format.DATE_TIME),
  },
  {
    title: 'Người thực hiện',
    dataIndex: 'operator',
    key: 'operator',
    width: 200,
  },
  {
    title: 'Hành động',
    dataIndex: 'action_text',
    key: 'action_text',
    width: 150,
  },
  {
    title: 'Nội dung',
    dataIndex: 'extra_data',
    key: 'content',
    width: 250,
    render: (record: any) => record?.content,
  },
  {
    title: 'Hình ảnh',
    dataIndex: 'extra_data',
    key: 'extra_data',
    render: (record: any) => {
      return (
        <StyledHistoryPhoto>
          {record?.images?.map((item: string) => (
            <Image key={item} src={item} />
          ))}
        </StyledHistoryPhoto>
      );
    },
  },
];

const TicketHistoryTap = () => {
  const params: { id: string } = useParams();
  const { setLoading } = useContext(AppContext);

  const { data } = useFetch({
    url: `${TICKET_URL_HIS}/${params.id}`,
    setLoading,
  });

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        bordered
        pagination={false}
        rowKey={(record) => {
          return record?.created_at;
        }}
      />
    </div>
  );
};

export default TicketHistoryTap;

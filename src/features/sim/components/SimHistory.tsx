import { Image, Table } from 'antd';
import { Format } from 'constants/date';
import { ChangeSIMType } from 'constants/sim.enum';
import { AppContext } from 'context/AppContext';
import useFetch from 'hooks/useFetch';
import _ from 'lodash';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { formatDateFromIso } from 'utils';

const StyledHistoryImg = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  .ant-image-img {
    height: 3.75rem;
    object-fit: contain;
  }
`;

const columns = [
  {
    title: 'STT',
    render: (text: string, record: any, index: number) => {
      return index + 1;
    },
  },
  {
    title: 'Thời gian',
    dataIndex: 'created_at',
    key: 'created_at',
    render: (text: string) => {
      return formatDateFromIso(text, Format.DATE_TIME);
    },
  },
  {
    title: 'Hành động',
    dataIndex: 'extra_data',
    key: 'extra_data',
    render: (record: any) => {
      return record?.message;
    },
  },
  {
    title: 'Nội dung',
    dataIndex: 'extra_data',
    width: 400,
    key: 'extra_data',
    render: (record: any) => getRedirectLink(record),
  },
  {
    title: 'Hình ảnh',
    dataIndex: 'extra_data',
    key: 'extra_data',
    render: (record: any) => (
      <StyledHistoryImg>
        {record?.images?.map((item: any, index: number) => {
          return <Image key={index} src={item.to} />;
        })}
      </StyledHistoryImg>
    ),
  },
];

function getRedirectLink(record: any) {
  if (record?.change_sim_type === ChangeSIMType.GET_NEW) {
    return (
      <Link to={`/admin/sim/request-change-sim/detail/${record?.request_change_sim_id}`}>
        {record?.content}
      </Link>
    );
  }

  if ([ChangeSIMType.DAMAGED_SIM, ChangeSIMType.LOST_SIM].includes(record?.change_sim_type)) {
    return (
      <Link to={`/admin/sim/request-to-change/details/${record?.request_change_sim_id}`}>
        {record?.content}
      </Link>
    );
  }

  const messageList = record?.content?.split(';');
  return {
    props: {
      className: 'pre-wrap',
    },
    children: messageList?.join('\n'),
  };
}

function SimHistory(props: any) {
  const { KYCId, serial } = props;
  const { setLoading } = useContext(AppContext);

  const { data } = useFetch({
    url: `/kyc/histories?kyc_id=${KYCId}&serial_number=${serial}`,
    setLoading,
  });

  const dataSource = data?.filter((item: any) => {
    return _.isEmpty(item) === false;
  });

  return (
    <div className='sim-history'>
      <Table
        bordered
        columns={columns}
        dataSource={dataSource}
        rowKey={(record) => {
          return record.id;
        }}
      />
    </div>
  );
}

export default SimHistory;

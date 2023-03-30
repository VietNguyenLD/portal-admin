import { Button, Card, Form, Input } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import { PERMISSION_URL } from 'api/permissionApi';
import { AppContext } from 'context/AppContext';
import useFetch from 'hooks/useFetch';
import { GroupPermissionResponse } from 'models/permission';
import moment from 'moment';
import React, { Fragment, useContext } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { DATE_FORMAT } from '../../../../share/helper';

const GroupPermission = () => {
  const { setLoading } = useContext(AppContext);
  const math = useRouteMatch();
  const history = useHistory();

  const { data, fetchData } = useFetch({
    url: `${PERMISSION_URL}`,
    param: { isActive: 0 },
    setLoading,
  });

  const columns: ColumnsType<GroupPermissionResponse> = [
    {
      title: 'STT',
      key: 'stt',
      render: (v, r, index) => index + 1,
    },
    {
      title: 'ID nhóm',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên nhóm',
      dataIndex: 'name',
      width: '40%',
      key: 'name',
    },
    {
      title: 'Ngày thực hiện',
      dataIndex: 'created_at',
      render: (value) => moment(value).format(DATE_FORMAT),
      key: 'created_at',
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updated_at',
      render: (value) => moment(value).format(DATE_FORMAT),
      key: 'updated_at',
    },
    {
      title: 'Người thực hiện',
      dataIndex: 'createdByUser.display_name',
      render: (v, r) => <span>{r?.createdByUser?.display_name}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (value) => <p>{value === true ? 'Active' : 'Deactive'}</p>,
    },
    {
      title: 'Thao tác',
      dataIndex: 'id',
      width: '150',
      render: (value, recode) => {
        const handleClick = (e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault();
          return history.push(`${math.url}/${value}`);
        };
        return <a onClick={handleClick}>Chi tiết</a>;
      },
    },
  ];

  const onFinish = (value: string) => {
    const option = {
      groupName: value ? value : undefined,
    };
    fetchData(option);
  };
  return (
    <Fragment>
      <Card>
        <div className='flex justify-between'>
          <Form
            name='advanced_search'
            className='ant-advanced-search-form'
            style={{ width: '40%' }}>
            <Form.Item name={`name`}>
              <Input.Search placeholder='tên nhóm' allowClear onSearch={onFinish} enterButton />
            </Form.Item>
          </Form>
          <Button type='primary' onClick={() => history.push(`${math.url}/create`)}>
            Tạo nhóm mới
          </Button>
        </div>
      </Card>
      <Table
        columns={columns}
        dataSource={data}
        bordered
        rowKey={(record) => {
          return record.id;
        }}
      />
    </Fragment>
  );
};

export default GroupPermission;

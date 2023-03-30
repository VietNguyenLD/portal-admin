import { UserAddOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Spin, Tag } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import GroupUserService from 'features/permission/service/GroupUserService';
import { TablePermissionUser } from 'models/user';
import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

const GroupPermissionUser = () => {
  const history = useHistory();
  const math = useRouteMatch();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TablePermissionUser[]>([]);
  const [formSearch, setFormSearch] = useState('');

  const columns: ColumnsType<TablePermissionUser> = [
    {
      title: 'STT',
      key: 'id',
      dataIndex: 'id',
      render: (v, r, index) => index + 1,
    },
    {
      title: 'Tài khoản',
      dataIndex: 'email',
      key: 'email',
      sorter: (a: { email: string }, b: { email: string }) =>
        b.email && a.email ? b.email.localeCompare(a.email) : 0,
    },
    {
      title: 'Tên người dùng',
      dataIndex: 'name',
      width: '30%',
      key: 'name',
      sorter: (a: { name: string }, b: { name: string }) =>
        b.name && a.name ? b.name.localeCompare(a.name) : 0,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: '40%',
      key: 'email',
      sorter: (a: { email: string }, b: { email: string }) =>
        b.email && a.email ? b.email.localeCompare(a.email) : 0,
    },
    {
      title: 'Nhóm',
      dataIndex: 'groups',
      key: 'groups',
      render: (v) => {
        return v.map((item: any) => (
          <Tag color={'green'} key='loser'>
            {item}
          </Tag>
        ));
      },
    },
    {
      title: 'Is_Active',
      dataIndex: 'status',
      key: 'status',
      sorter: (a: { status: string }, b: { status: string }) =>
        b.status && a.status ? b.status.localeCompare(a.status) : 0,
    },
    {
      title: 'Thao tác',
      dataIndex: 'id',
      width: '15%',
      render: (value, recode) => {
        const handleClick = (e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault();
          return history.push(`${math.url}/${value}`);
        };
        return <Button type='link' onClick={handleClick}>Chi tiết</Button>;
      },
    },
  ];

  useEffect(() => {
    const fetchListUser = async () => {
      setLoading(true);
      const res = await GroupUserService.listUsers(formSearch);
      setData(res);
      setLoading(false);
    };
    fetchListUser();
  }, [formSearch]);

  const onFinish = (value: string) => {
    console.log(value);
    setFormSearch(value);
  };
  return (
    <Spin spinning={loading}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Form
            name='advanced_search'
            className='ant-advanced-search-form'
            style={{ width: '40%' }}>
            <Form.Item name={`name`}>
              <Input.Search
                placeholder='tài khoản, họ và tên, ...'
                allowClear
                onSearch={onFinish}
                enterButton
              />
            </Form.Item>
          </Form>
          <Button
            type='primary'
            style={{ float: 'right', borderRadius: '4px' }}
            onClick={() => history.push(`${math.url}/create`)}
            icon={<UserAddOutlined />}>
            Thêm người dùng
          </Button>
        </div>
      </Card>
      {data && <Table columns={columns} dataSource={data} bordered />}
    </Spin>
  );
};

export default GroupPermissionUser;

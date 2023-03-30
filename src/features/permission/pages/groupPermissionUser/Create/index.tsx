import { Button, Card, Checkbox, Form } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import permissionApi, { PERMISSION_URL } from 'api/permissionApi';
import MainInfoUser from 'components/MainInfoUser/MainInfo';
import { ActionText } from 'constants/permission';
import { AppContext } from 'context/AppContext';
import GroupUserService from 'features/permission/service/GroupUserService';
import useFetch from 'hooks/useFetch';
import {
  AllPermissResponse,
  GroupPermissionDetailResponse,
  TableGroupPermissionDetail,
} from 'models/permission';
import { FormCreateUser } from 'models/user';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { toast } from 'react-toastify';
import { columnsGroup, isCheckedPermission } from 'share/helper';
import styles from './index.module.scss';

const GroupPermissioUserCreate = () => {
  const queryParams = new URLSearchParams(window.location.search);

  const { setLoading } = useContext(AppContext);
  const params: { id: string } = useParams();
  const history = useHistory();
  const math = useRouteMatch();

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [dataTable, setDataTable] = useState<TableGroupPermissionDetail[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [form] = Form.useForm();

  const { data: dataGroup } = useFetch({ url: `${PERMISSION_URL}`, setLoading });

  const columns: ColumnsType<TableGroupPermissionDetail> = [
    {
      title: 'STT',
      key: 'stt',
      render: (v, r, index) => index + 1,
    },
    {
      title: 'Màn hình/Chức năng',
      dataIndex: 'featureName',
      key: 'featureName',
    },
    {
      title: 'Xem',
      dataIndex: 'actions',
      key: 'read',
      render: (v: string[], r: any) => {
        return v?.includes(ActionText.READ) ? (
          <Checkbox
            checked={Boolean(isCheckedPermission(r?.action_status as any, ActionText.READ))}
            disabled
          />
        ) : null;
      },
    },
    {
      title: 'Thêm',
      dataIndex: 'actions',
      key: 'create',
      render: (v: string[], r: any) =>
        v?.includes(ActionText.CREATE) ? (
          <Checkbox
            disabled
            checked={Boolean(isCheckedPermission(r?.action_status as any, ActionText.CREATE))}
          />
        ) : null,
    },
    {
      title: 'Sửa/Lưu',
      dataIndex: 'actions',
      key: 'update',
      render: (v: string[], r: any) =>
        v?.includes(ActionText.UPDATE) ? (
          <Checkbox
            disabled
            checked={Boolean(isCheckedPermission(r?.action_status as any, ActionText.UPDATE))}
          />
        ) : null,
    },
    {
      title: 'Xử lý/Submit',
      dataIndex: 'actions',
      key: 'submit',
      render: (v: string[], r: any) =>
        v?.includes(ActionText.SUBMIT) ? (
          <Checkbox
            disabled
            checked={Boolean(isCheckedPermission(r?.action_status as any, ActionText.SUBMIT))}
          />
        ) : null,
    },
    {
      title: 'Import',
      dataIndex: 'actions',
      key: 'import',
      render: (v: string[], r: any) =>
        v?.includes(ActionText.IMPORT) ? (
          <Checkbox
            disabled
            checked={Boolean(isCheckedPermission(r?.action_status as any, ActionText.IMPORT))}
          />
        ) : null,
    },
    {
      title: 'Export',
      dataIndex: 'actions',
      key: 'export',
      render: (v: string[], r: any) =>
        v?.includes(ActionText.EXPORT) ? (
          <Checkbox
            disabled
            checked={Boolean(isCheckedPermission(r?.action_status as any, ActionText.EXPORT))}
          />
        ) : null,
    },
  ];

  useEffect(() => {
    const getListPermission = async () => {
      let result: TableGroupPermissionDetail[] = [];
      const listAllPermission = await permissionApi.allPermission();
      if (listAllPermission.data.message === 'Success') {
        selectedRowKeys.forEach(async (item) => {
          const res = await permissionApi.groupPermisson(item.toString());
          if (res.data.message === 'Success') {
            form.setFieldsValue({
              id: params.id,
              name: queryParams.get('name'),
            });
            const data = await formatData(
              res.data.data.actions,
              listAllPermission.data.data,
              result,
            );
            result = data;
          }
          setDataTable(result);
        });
      }
    };
    selectedRowKeys.length > 0 ? getListPermission() : setDataTable([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRowKeys]);

  const formatData = async (
    dataPermission: GroupPermissionDetailResponse[],
    listAllPermission: AllPermissResponse[],
    listTempTable: TableGroupPermissionDetail[],
  ): Promise<TableGroupPermissionDetail[]> => {
    const result: TableGroupPermissionDetail[] = [];
    dataPermission.forEach((item: GroupPermissionDetailResponse) => {
      let permission: AllPermissResponse | undefined = listAllPermission.find(
        (p: AllPermissResponse) => p.featureId === item.feature,
      );
      let status = item.action_status;
      const listActionData = new Set(permission?.actions);
      for (let index = 0; index < listTempTable.length; index++) {
        if (listTempTable[index] && permission?.featureId === listTempTable[index].feature) {
          if (listTempTable[index].actions && listTempTable[index].actions?.length > 0) {
            listTempTable[index].actions.forEach((i) => listActionData.add(i));
            status = item.action_status | listTempTable[index].action_status;
          }
        }
      }
      const permissionAction: string[] = [];
      listActionData.forEach((value) => {
        permissionAction.push(value);
      });
      result.push({
        ...item,
        action_status: status,
        actions: permissionAction,
        featureName: permission?.featureName,
      });
    });
    return result;
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleCreate = async (value: FormCreateUser) => {
    if (selectedRowKeys.length > 0) {
      const formUser: FormCreateUser = {
        ...value,
        groupId: selectedRowKeys,
      };
      GroupUserService.createUser(formUser);
    } else {
      toast.error('Bạn chưa chọn quyền cho user!');
    }
  };
  return (
    <Form form={form} layout='vertical' onFinish={handleCreate}>
      <div
        className='search-box'
        style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type='primary'
          htmlType='submit'
          className={styles.buttonAction}
          onClick={() => {
            history.push(`${math.url}/create`);
          }}>
          Thêm
        </Button>
      </div>
      <Card title='Thông tin chung' className='search-box' style={{ marginBottom: 16 }}>
        <MainInfoUser isEdit={isEdit} isNew={true} />
      </Card>
      <Card title='Nhóm' className='search-box' style={{ marginBottom: 16 }}>
        <Table
          rowKey={'id'}
          bordered
          dataSource={dataGroup}
          columns={columnsGroup}
          pagination={false}
          rowSelection={{
            selectedRowKeys,
            onChange: onSelectChange,
          }}
        />
      </Card>
      <Card title='Chi tiết quyền' className='search-box' style={{ marginBottom: 16 }}>
        <Table rowKey={'id'} columns={columns} dataSource={dataTable} bordered pagination={false} />
      </Card>
    </Form>
  );
};

export default GroupPermissioUserCreate;

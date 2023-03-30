import { Button, Card, Checkbox, Form, Select, Spin } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import permissionApi from 'api/permissionApi';
import userApi from 'api/userApi';
import { ActionText } from 'constants/permission';
import GroupUserService from 'features/permission/service/GroupUserService';
import {
  AllPermissResponse,
  GroupPermissionDetailResponse,
  TableGroupPermissionDetail,
} from 'models/permission';
import { FormInFoUser, Groups, User } from 'models/user';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { isCheckedPermission } from 'share/helper';
import { checkUserStatus } from 'utils/unit';
import MainInfoUser from '../../../../../components/MainInfoUser/MainInfo';
import styles from './index.module.scss';

const GroupPermissioUserDetail = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const params: { id: string } = useParams();
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEdit, setIsEdit] = useState<boolean>(true);
  const [isSelectGroup, setIsSelectGroup] = useState<boolean>(false);
  const [dataTable, setDataTable] = useState<TableGroupPermissionDetail[]>([]);
  const [listGroup, setListGroup] = useState<Groups[]>([]);
  const [allGroup, setAllGroup] = useState<AllPermissResponse[]>([]);
  const [dataGroup, setDataGroup] = useState<string[]>([]);

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
    if (params.id) {
      const fetchGroup = async () => {
        const listGroup = await permissionApi.group();
        setListGroup(listGroup.data.data);
        fetchDetailUser(listGroup.data.data);
      };
      fetchGroup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchDetailUser = async (group: Groups[]) => {
    setIsLoading(true);
    const response = await userApi.detailUser(params.id);
    const infoUser: User = response.data.data;
    if (infoUser) {
      form.setFieldsValue({
        first_name: infoUser.first_name ? infoUser.first_name : undefined,
        last_name: infoUser.last_name,
        email: infoUser.email,
        phone: infoUser.phone,
        status: checkUserStatus(infoUser.status ?? 0),
      });
      if (infoUser.groups) {
        const nameGroup = infoUser.groups.map((item) => item.name);
        setDataGroup(nameGroup);
        const listAllPermission = await permissionApi.allPermission();
        if (listAllPermission.data.message === 'Success') {
          setAllGroup(listAllPermission.data.data)
          await getListPermission(nameGroup, group, listAllPermission.data.data);
        }
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    dataGroup.length > 0 ? getListPermission(dataGroup, listGroup, allGroup) : setDataTable([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelectGroup, listGroup]);

  const getListPermission = async (select: string[], group: Groups[], listAllPermission: AllPermissResponse[]) => {
    let result: TableGroupPermissionDetail[] = [];
    select.forEach(async (item) => {
      const findGroup: Groups | undefined = group.find((items: Groups) => item === items.name);
      if (findGroup) {
        const res = await permissionApi.groupPermisson(findGroup.id);
        if (res.data.message === 'Success') {
          form.setFieldsValue({
            id: params.id,
            name: queryParams.get('name'),
          });
          result = await formatData(res.data.data.actions, listAllPermission, result);
        }
        setDataTable(result);
      }
    });
  };

  const formatData = async (
    dataPermission: GroupPermissionDetailResponse[],
    listAllPermission: AllPermissResponse[],
    listTempTable: TableGroupPermissionDetail[],
  ): Promise<TableGroupPermissionDetail[]> => {
    const result: TableGroupPermissionDetail[] = [];
    dataPermission.forEach((item: GroupPermissionDetailResponse) => {
      const permission: AllPermissResponse | undefined = listAllPermission.find(
        (p: AllPermissResponse) => p.featureId === item.feature,
      );
      let status = item.action_status;
      const listActionData = new Set(permission?.actions);
      for (let index = 0; index < listTempTable.length; index++) {
        if (listTempTable[index] && permission?.featureId === listTempTable[index].feature) {
          if (listTempTable[index].actions && listTempTable[index].actions?.length > 0) {
            listTempTable[index].actions.forEach((i: string) => listActionData.add(i));
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

  const handleChangeGroup = (value: string[]) => {
    if (value.length > 0) {
      setDataGroup(value);
    } else {
      setDataGroup(['']);
    }
    setIsSelectGroup(!isSelectGroup);
  };

  const handleSubmitEdit = async (valueForm: FormInFoUser) => {
    if (dataGroup && dataGroup[0] !== '') {
      await GroupUserService.editUser(params.id, valueForm, dataGroup, listGroup);
      fetchDetailUser(listGroup);
      setIsEdit(!isEdit);
    } else {
      toast.error('Bạn chưa chọn quyền cho user!');
    }
  };
  return (
    <Spin spinning={isLoading}>
      <Form form={form} layout='vertical' onFinish={handleSubmitEdit}>
        <div
          className='search-box'
          style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
          {/* {params.id && (
            <Button
              type='primary'
              htmlType='submit'
              className={styles.buttonAction}
              onClick={() => {
                setIsCreateUser(false)
                history.push(`${math.url}/create`)
              }}
              >
              Thêm
            </Button>
          )} */}
          {params.id && (
            <Button
              type='primary'
              disabled={!isEdit}
              className={styles.buttonAction}
              onClick={() => setIsEdit(!isEdit)}>
              Sửa
            </Button>
          )}
          <Button
            type='primary'
            htmlType='submit'
            disabled={isEdit}
            className={styles.buttonAction}>
            Lưu
          </Button>
        </div>
        <Card title='Thông tin chung' className='search-box' style={{ marginBottom: 16 }}>
          <MainInfoUser isEdit={isEdit} statusUser={form.getFieldValue('status')}/>
        </Card>
        <Card title='Nhóm' className='search-box' style={{ marginBottom: 16 }}>
          {listGroup && dataGroup.length > 0 && (
            <Select
              style={{ width: '100%' }}
              defaultValue={dataGroup}
              disabled={isEdit}
              mode='multiple'
              allowClear
              onChange={(value) => handleChangeGroup(value)}>
              {listGroup?.map((items: Groups) => {
                const findGroup = dataGroup.find((item) => item === items.name);
                if (!findGroup) {
                  return (
                    <Select.Option
                      key={items?.id}
                      value={`${items?.name}`}>{`${items?.name} `}</Select.Option>
                  );
                }
                return '';
              })}
            </Select>
          )}
        </Card>
        <Card title='Chi tiết quyền' className='search-box' style={{ marginBottom: 16 }}>
          {dataGroup.length > 0 && dataGroup[0] !== '' && (
            <Table
              rowKey={'id'}
              columns={columns}
              dataSource={dataTable}
              bordered
              pagination={false}
            />
          )}
        </Card>
      </Form>
    </Spin>
  );
};

export default GroupPermissioUserDetail;

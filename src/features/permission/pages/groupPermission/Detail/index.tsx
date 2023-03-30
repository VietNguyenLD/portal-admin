import { Button, Card, Checkbox, Col, Form, Input, Row, Select } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import permissionApi, { PERMISSION_URL } from 'api/permissionApi';
import { Action, ActionText } from 'constants/permission';
import { AppContext } from 'context/AppContext';
import useFetch from 'hooks/useFetch';
import {
  AllPermissResponse,
  CreatePermissionRequest,
  GroupPermissionDetailResponse,
} from 'models/permission';
import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { isCheckedPermission } from 'share/helper';
import styles from './index.module.scss';

interface DataType {
  key: React.Key;
  name: string;
  chinese: number;
  math: number;
  english: number;
}

const GroupPermissionDetail = () => {
  const { setLoading } = useContext(AppContext);
  const params: { id: string } = useParams();

  const [dataTable, setDataTable] = useState([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [currentFeatures, setCurrentFeatures] = useState<string[]>([]);
  const [remaningFeatures, setRemaningFeatures] = useState([]);
  const [isAddFeature, setIsAddFeature] = useState<boolean>(false);
  const tableRef = useRef<null | HTMLTableElement>(null);
  const [isAddMore, setIsAddMore] = useState(false);

  const [form] = Form.useForm();

  const { data } = useFetch({ url: `${PERMISSION_URL}/permission/${params.id}`, setLoading });
  const { data: permissons } = useFetch({ url: `${PERMISSION_URL}/all-permission` });
  const { group_user, actions } = data || {};

  const handleEditButtonClick = () => {
    setIsEdit(true);
  };

  const handleAddButtonClick = () => {
    setIsAddFeature(true);
    setIsEdit(true);
  };

  const handleSelectChange = async (value: any) => {
    const newFeatureItem = permissons.find((item: any) => {
      return item.featureId === value;
    });

    const newFeature = {
      ...newFeatureItem,
      feature: value,
      action_status: 0,
    };

    const newDataTable: any = [...dataTable, newFeature];
    setDataTable(newDataTable);
    setIsAddMore(true);
  };

  useEffect(() => {
    if (isAddMore) {
      tableRef.current?.scrollTo({ top: 9999, behavior: 'smooth' });
      setIsAddMore(false);
    }
  }, [isAddMore]);

  const handleSavePermission = async (value: any) => {
    const { status, name } = value;
    setLoading(true);
    const permissions: any = dataTable.map((featurePermissions) => {
      const { feature, action_status } = featurePermissions;
      return {
        featureId: feature,
        actions: action_status,
      };
    });

    const bodyPermissions = { permissions, status, group_name: name };

    try {
      const { status } = await permissionApi.create(params.id, {
        ...bodyPermissions,
      } as CreatePermissionRequest);
      if (status === 200) {
        toast.success('Cập nhật thành công!');
      }
    } catch (error) {
      toast.error('Cập nhật thất bại!');
    }
    setLoading(false);
    setIsEdit(false);
    setIsAddFeature(false);
  };

  const handleRadioChange = (target: any, action: any, e: any) => {
    const newDataTable: any = dataTable.map((itemData: any) => {
      const { feature } = itemData;
      if (feature === target.feature) {
        return { ...itemData, action_status: itemData.action_status ^ action };
      }

      return itemData;
    });

    setDataTable(newDataTable);
  };

  const handleRemovePermission = (v: any) => {
    const newDataTable = dataTable.filter((itemData: any) => {
      return itemData.feature !== v.feature;
    });
    setDataTable(newDataTable);
  };

  useEffect(() => {
    form.setFieldsValue({
      id: params.id,
      name: group_user?.name,
      status: group_user?.status,
    });
  }, [data]);

  useEffect(() => {
    const listFeatures = dataTable.map((data) => {
      const { feature } = data;
      return feature;
    });
    setCurrentFeatures(listFeatures);
  }, [dataTable]);

  useEffect(() => {
    if (permissons && permissons.length) {
      const listRemaingFeatures = permissons.filter((item: any) => {
        const { featureId } = item;
        return !currentFeatures.includes(featureId);
      });
      setRemaningFeatures(listRemaingFeatures);
    }
  }, [currentFeatures]);

  useEffect(() => {
    if (permissons && data) {
      formatData();
    }
  }, [permissons, data]);

  const formatData = async () => {
    const result = actions.map((item: GroupPermissionDetailResponse) => {
      let permission: AllPermissResponse = permissons.find(
        (p: AllPermissResponse) => p.featureId === item.feature,
      );
      return {
        ...item,
        actions: permission?.actions,
        featureName: permission?.featureName,
      };
    });
    setDataTable(result);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: 'STT',
      key: 'stt',
      render: (v, r, index) => index + 1,
    },
    {
      title: 'Màn hình/Chức năng',
      dataIndex: 'featureName',
      key: 'featureName',
      sorter: (a: any, b: any) => a.featureName.localeCompare(b.featureName),
    },
    {
      title: 'Xem',
      dataIndex: 'actions',
      key: 'read',
      render: (v: string[], r: any) => {
        return v?.includes(ActionText.READ) ? (
          <Checkbox
            checked={Boolean(isCheckedPermission(r?.action_status as any, ActionText.READ))}
            disabled={!isEdit}
            onChange={(e) => handleRadioChange(r, Action.READ, e)}
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
            disabled={!isEdit}
            checked={Boolean(isCheckedPermission(r?.action_status as any, ActionText.CREATE))}
            onChange={(e) => handleRadioChange(r, Action.CREATE, e)}
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
            disabled={!isEdit}
            checked={Boolean(isCheckedPermission(r?.action_status as any, ActionText.UPDATE))}
            onChange={(e) => handleRadioChange(r, Action.UPDATE, e)}
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
            disabled={!isEdit}
            checked={Boolean(isCheckedPermission(r?.action_status as any, ActionText.SUBMIT))}
            onChange={(e) => handleRadioChange(r, Action.SUBMIT, e)}
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
            disabled={!isEdit}
            checked={Boolean(isCheckedPermission(r?.action_status as any, ActionText.IMPORT))}
            onChange={(e) => handleRadioChange(r, Action.IMPORT, e)}
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
            disabled={!isEdit}
            checked={Boolean(isCheckedPermission(r?.action_status as any, ActionText.EXPORT))}
            onChange={(e) => handleRadioChange(r, Action.EXPORT, e)}
          />
        ) : null,
    },
    {
      title: 'Xoá',
      render: (v, r, index) => (
        <Button onClick={() => handleRemovePermission(v)} type='primary' danger>
          Xoá
        </Button>
      ),
    },
  ];

  return (
    <Fragment>
      <Card className='search-box' style={{ marginBottom: 16 }}>
        <Form form={form} onFinish={(value) => handleSavePermission(value)}>
          <Row gutter={[20, 5]}>
            <Col span={3}>
              <Form.Item name='id' label='Mã nhóm:'>
                <Input readOnly />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name='name' label='Tên nhóm:'>
                <Input readOnly={!isEdit} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name='status' label='Status:'>
                <Select disabled={!isEdit}>
                  <Select.Option value={true}>Active</Select.Option>
                  <Select.Option value={false}>Deactive</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12} className={styles.list_button}>
              <Button type='primary' disabled={isAddFeature} onClick={handleAddButtonClick}>
                Thêm
              </Button>
              <Button type='primary' disabled={isEdit} onClick={handleEditButtonClick}>
                Sửa
              </Button>
              <Button type='primary' htmlType='submit' disabled={!isEdit}>
                Lưu
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Table
        columns={columns}
        dataSource={dataTable}
        bordered
        pagination={false}
        className={`${styles.custom_table} ${!isEdit && styles.has_delete}`}
        ref={tableRef}
      />
      {isAddFeature && (
        <>
          <Select
            style={{ width: '45%', marginTop: 16 }}
            onChange={(e) => handleSelectChange(e)}
            placeholder='Xin vui lòng chọn màn hình/chức năng muốn thêm..'>
            {remaningFeatures &&
              remaningFeatures.length &&
              remaningFeatures.map((permisson: any) => {
                const { featureName, featureId } = permisson;
                return (
                  <Select.Option key={featureId} value={featureId}>
                    {featureName}{' '}
                  </Select.Option>
                );
              })}
          </Select>
        </>
      )}
    </Fragment>
  );
};

export default GroupPermissionDetail;

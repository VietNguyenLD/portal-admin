import { Button, Form, InputNumber, Select, Spin, Table } from 'antd';
import configApi from 'api/configApi';
import { UnitType } from 'constants/common.enum';
import { ActionText, Feature } from 'constants/permission';
import useCan from 'hooks/useCan';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { DATE_FORMAT } from 'share/helper';
// import { isCan } from 'share/helper';
import { capitalizeText, unitTypeToText, formatDateFromIso } from 'utils';
import { Format } from 'constants/date';

const { Option } = Select;

const columns = [
  {
    title: 'STT',
    dataIndex: 'id',
  },
  {
    title: 'Cấu Hình',
    dataIndex: 'name',
  },
  {
    title: 'Số',
    dataIndex: 'value',
    editable: true,
  },
  {
    title: 'Đơn Vị Tính',
    dataIndex: 'unit',
    render: (unit: number) => {
      return unitTypeToText(unit);
    },
  },
  {
    title: 'Cập Nhật Lần Cuối Bởi',
    dataIndex: 'last_updated_by',
    render: (text: string) => {
      return capitalizeText(text);
    },
  },
  {
    title: 'Cập Nhật Lần Cuối Lúc',
    dataIndex: 'last_updated_time',
    // render: (record: any) => {
    //   return formatDateFromIso(record, Format.DATE_TIME);
    // },
  },
];

const EditableCell = ({ editing, dataIndex, inputType, children, ...restProps }: any) => {
  const inputNode =
    inputType === 'number' ? (
      <InputNumber />
    ) : (
      <Select>
        <Option value={UnitType.HOUR}>Giờ</Option>
        <Option value={UnitType.DAY}>Ngày</Option>
      </Select>
    );
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}>
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const Param = () => {
  const [form] = Form.useForm();
  const { isCan } = useCan();
  const [param, setParam] = useState([]);
  const [editingKey, setEditingKey] = useState(0);
  const [rowSelected, setRowSelected] = useState({
    id: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const isEditing = (record: any) => {
    return record.id === editingKey;
  };

  const edit = (record: any) => {
    form.setFieldsValue({
      unit: '',
      value: '',
      ...record,
    });
    setEditingKey(record.id);
  };

  const save = async () => {
    const row = await form.validateFields();
    try {
      const response = await configApi.editParam(rowSelected.id, row);
      const { status } = response;
      if (status === 200) {
        getParams();
        toast.success('Lưu thành công');
        setEditingKey(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record: any) => ({
        record,
        inputType: col.dataIndex === 'value' ? 'number' : 'select',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const getParams = async () => {
    try {
      setLoading(true);
      const response = await configApi.getParam();
      setLoading(false);
      const { status, data } = response;
      if (status === 200) {
        setParam(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getParams();
  }, []);

  return (
    <Spin spinning={loading}>
      <div className='param'>
        <div className='param_btn'>
          {isCan(Feature.CONFIG_PARAM, ActionText.UPDATE) && (
            <Button onClick={() => edit(rowSelected)}>Sửa</Button>
          )}
          {isCan(Feature.CONFIG_PARAM, ActionText.UPDATE) && (
            <Button
              disabled={editingKey !== 0 ? false : true}
              type='primary'
              danger
              onClick={() => save()}>
              Lưu
            </Button>
          )}
        </div>
        <Form form={form} component={false}>
          <Table
            className='param_table'
            onRow={(record) => {
              return {
                onClick: () => {
                  setRowSelected(record);
                },
              };
            }}
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={param}
            columns={mergedColumns}
            rowKey={(record) => {
              return record.id;
            }}
            rowClassName={(record) => {
              return record.id === rowSelected?.id ? 'selected' : '';
            }}
          />
        </Form>
      </div>
    </Spin>
  );
};

export default Param;

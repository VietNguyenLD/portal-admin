import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Table, Tag } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import configApi from 'api/configApi';
import { AppReasonType } from 'constants/app.reason';
import { ActionText, Feature } from 'constants/permission';
import { AppContext } from 'context/AppContext';
import useCan from 'hooks/useCan';
import useFetch from 'hooks/useFetch';
import useModal from 'hooks/useModal';
import { AppReason, AppReasonRequest } from 'models/app.reason';
import { Fragment, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { showNumberOrderTable } from 'share/helper';
import PaginationConfig from 'utils/panigationConfig';
import { Format } from '../../../constants/date';
import { ItemType, ItemTypeText } from '../../../constants/ticket.enum';
import { formatDateFromIso } from '../../../utils';
import AddEditRequestReason from '../components/AddEditRequestReason';
import SearchReason from '../components/SearchReason';

const renderItem = (type: number) => {
  switch (type) {
    case ItemType.ID_FRONT:
      return <Tag color='blue'>{ItemTypeText.ID_FRONT}</Tag>;
    case ItemType.ID_BACK:
      return <Tag color='blue'>{ItemTypeText.ID_BACK}</Tag>;
    case ItemType.PORTRAIT:
      return <Tag color='blue'>{ItemTypeText.PORTRAIT}</Tag>;
    case ItemType.SIGNATURE:
      return <Tag color='blue'>{ItemTypeText.SIGNATURE}</Tag>;
  }
};

const RequestReason2 = () => {
  const { setLoading } = useContext(AppContext);

  const [query, setQuery] = useState<any>({
    limit: 10,
    page: 1,
    'filter.type': `$eq:${AppReasonType.TICKET_KYC}`,
  });
  const [itemSelected, setItemSelected] = useState<AppReason | null>(null);

  const { data, fetchData } = useFetch({
    url: `/config/app-reason/list`,
    param: query,
    setLoading,
  });
  const createModal = useModal();
  const editModal = useModal();
  const { isCan } = useCan();

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const { current, pageSize } = pagination;
    if (current !== query.page || pageSize !== query.limit) {
      setQuery({
        ...query,
        limit: pageSize,
        page: current,
      });
      fetchData({
        ...query,
        limit: pageSize,
        page: current,
      });
    }
  };
  const columns: ColumnsType<any> = [
    {
      title: 'STT',
      render: (_value, _record, index) => {
        return showNumberOrderTable(query.page, index);
      },
    },
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'Lý do',
      dataIndex: 'reason',
      key: 'reason',
      sorter: {
        compare: (a, b) => a.code - b.code,
        multiple: 2,
      },
    },
    {
      title: 'Item',
      dataIndex: 'items',
      key: 'items',
      render: (v) => {
        return v.map((x: number) => renderItem(x));
      },
    },
    {
      title: 'Cập nhật lần cuối bởi',
      dataIndex: 'updatedByUser',
      key: 'updatedByUser',
      sorter: (a, b) => a?.name - b?.name,
      render: (v) => v?.name,
    },
    {
      title: 'Cập nhật lần cuối lúc',
      dataIndex: 'updated_at',
      key: 'updated_at',
      sorter: (a, b) => {
        var dateA = new Date(a.updated_at).getTime();
        var dateB = new Date(b.updated_at).getTime();
        return dateA > dateB ? 1 : -1;
      },
      render: (record: any) => {
        return formatDateFromIso(record, Format.DATE_TIME);
      },
    },
    {
      title: 'Active',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (v) => {
        return (
          <Tag color={v ? 'geekblue' : 'volcano'} key='loser'>
            {v ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
          </Tag>
        );
      },
    },
    {
      title: 'Thao Tác',
      fixed: 'right',
      key: 'action',
      render: (_v, r) => {
        if (isCan(Feature.CONFIG_TICKET_REASON, ActionText.UPDATE)) {
          return (
            <span
              style={{ cursor: 'pointer', color: '#1890ff' }}
              onClick={() => {
                setItemSelected(r);
                editModal.toggle();
              }}>
              Chi tiết
            </span>
          );
        }
      },
    },
  ];

  const onCreate = async (val: AppReasonRequest) => {
    try {
      let params: AppReasonRequest = {
        ...val,
        type: AppReasonType.TICKET_KYC,
      };
      const _res = await configApi.createAppReason(params);
      toast.success('Tạo thành công!');
      createModal.toggle();
      fetchData(query);
    } catch (error) {
      console.log(error);
    }
  };

  const onEdit = async (val: AppReasonRequest) => {
    if (!itemSelected) return;
    try {
      let params: AppReasonRequest = {
        ...val,
        type: AppReasonType.TICKET_KYC,
      };

      const _response = await configApi.editAppReason(itemSelected?.id, params);
      toast.success('Cập yêu cầu thành công!');
      editModal.toggle();
      fetchData(query);
    } catch (error) {
      console.log();
    }
  };

  const onSearch = (val: any) => {
    let params: any = {
      limit: query.limit,
      page: query.page,
      'filter.type': `$eq:${AppReasonType.TICKET_KYC}`,
    };

    if (val && val['filter.items']) {
      params['filter.items'] = '$in:' + val['filter.items'].join(',');
    }
    if (val && val['filter.is_active']) {
      params['filter.is_active'] = val['filter.is_active'];
    }

    setQuery(params);
    fetchData(params);
  };

  return (
    <Fragment>
      <AddEditRequestReason
        openModal={createModal.isShowing}
        fetchData={fetchData}
        cancelModal={createModal.toggle}
        onFinish={onCreate}
        type='add'
      />
      <AddEditRequestReason
        openModal={editModal.isShowing}
        fetchData={fetchData}
        cancelModal={() => {
          setItemSelected(null);
          editModal.toggle();
        }}
        onFinish={onEdit}
        item={itemSelected}
        type='edit'
      />
      <SearchReason
        loading={false}
        onSearch={onSearch}
        buttons={[
          isCan(Feature.CONFIG_TICKET_REASON, ActionText.CREATE) && (
            <Button
              type='primary'
              icon={<PlusCircleOutlined />}
              key='create_btn'
              className='search-box__search-button'
              onClick={createModal.toggle}>
              Tạo mới
            </Button>
          ),
        ]}
      />
      <Table
        scroll={{ x: 'max-content' }}
        columns={columns}
        dataSource={data?.data}
        onChange={handleTableChange}
        pagination={PaginationConfig(data)}
        rowKey={(record) => {
          return record.id;
        }}
      />
    </Fragment>
  );
};

export default RequestReason2;

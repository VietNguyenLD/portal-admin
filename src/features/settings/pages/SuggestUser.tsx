import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Table, Tag } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import suggestApi from 'api/suggest';
import { ActionText, Feature } from 'constants/permission';
import { AppContext } from 'context/AppContext';
import useCan from 'hooks/useCan';
import useFetch from 'hooks/useFetch';
import useModal from 'hooks/useModal';
import { Suggest, SuggestCreate } from 'models/suggest';
import moment from 'moment';
import { Fragment, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { DATE_FORMAT, showNumberOrderTable } from 'share/helper';
import PaginationConfig from 'utils/panigationConfig';
import AddEditSuggest from '../components/AddEditSuggest';
import SearchSuggest from '../components/SearchSuggest';

const SuggestUser = () => {
  const { setLoading } = useContext(AppContext);
  const { isCan } = useCan();
  const [query, setQuery] = useState<any>({
    limit: 10,
    page: 1,
  });
  const [itemSelected, setItemSelected] = useState<Suggest | null>(null);
  const { data, fetchData } = useFetch({
    url: `/inform-update-request/list`,
    param: query,
    setLoading,
  });
  const createSuggestModal = useModal();
  const editSuggestModal = useModal();
  const [isConfirm, setIsConfirm] = useState(false);

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
      title: 'Mã YC',
      dataIndex: 'code',
      key: 'code',
      sorter: {
        compare: (a, b) => {
          return parseFloat(a.code.slice(2)) - parseFloat(b.code.slice(2));
        },
        multiple: 2,
      },
    },
    {
      title: 'Từ ngày',
      dataIndex: 'start_at',
      key: 'start_at',
      render: (v) => moment(v).format(DATE_FORMAT),
    },
    {
      title: 'Đến ngày',
      dataIndex: 'end_at',
      key: 'end_at',
      sorter: (a, b) => {
        var dateA = new Date(a.end_at).getTime();
        var dateB = new Date(b.end_at).getTime();
        return dateA > dateB ? 1 : -1;
      },
      render: (v) => moment(v).format(DATE_FORMAT),
    },
    {
      title: 'Có loại trừ các thuê bao đã cập nhật',
      dataIndex: 'exclude_updated_user',
      key: 'exclude_updated_user',
      sorter: {
        compare: (a, b) => a.exclude_updated_user - b.exclude_updated_user,
        multiple: 1,
      },
      render: (v) => {
        return (
          <Tag color={v ? 'green' : 'geekblue'} key='loser'>
            {v ? 'Có' : 'Không'}
          </Tag>
        );
      },
    },
    {
      title: 'Last updated by',
      dataIndex: 'updatedByUser',
      key: 'updatedByUser',
      render: (v) => v?.email || null,
    },
    {
      title: 'Last updated time',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (v) => moment(v).format('DD/MM/YYYY HH:MM:SS'),
      sorter: (a, b) => {
        var dateA = new Date(a.updated_at).getTime();
        var dateB = new Date(b.updated_at).getTime();
        return dateA > dateB ? 1 : -1;
      },
    },
    {
      title: 'Active',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (v) => {
        return (
          <Tag color={v ? 'geekblue' : 'volcano'} key='loser'>
            {v ? 'Yes' : 'No'}
          </Tag>
        );
      },
    },
    {
      title: 'Thao Tác',
      fixed: 'right',
      render: (_v, r) => {
        if (isCan(Feature.CONFIG_BROADCAST, ActionText.UPDATE)) {
          return (
            <span
              style={{ cursor: 'pointer', color: '#1890ff' }}
              onClick={() => {
                setItemSelected(r);
                editSuggestModal.toggle();
              }}>
              Chi Tiết
            </span>
          );
        }
      },
    },
  ];

  const onCreateSuggest = async (val: any) => {
    try {
      let params: SuggestCreate = {
        is_active: val?.is_active,
        is_exclude_updated_user: val?.is_exclude_updated_user,
        start_at: moment(val?.create_at[0]).format('YYYY-MM-DD'),
        end_at: moment(val?.create_at[1]).format('YYYY-MM-DD'),
      };

      if (isConfirm) {
        const { status } = await suggestApi.create(params);
        if (status === 200 || status === 201) {
          let btn_reset = document.getElementById('btn-reset');
          toast.success('Tạo yêu cầu thành công!');
          createSuggestModal.toggle();
          btn_reset && btn_reset.click();
          setIsConfirm(false);
        }
      } else {
        setIsConfirm(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onEditSuggest = async (val: any) => {
    try {
      let params: SuggestCreate = {
        is_active: val?.is_active,
        is_exclude_updated_user: val?.is_exclude_updated_user,
        start_at: moment(val?.create_at[0]).format('YYYY-MM-DD'),
        end_at: moment(val?.create_at[1]).format('YYYY-MM-DD'),
      };
      const { status } = await suggestApi.edit(itemSelected?.id as number, params);
      if (status === 200 || status === 201) {
        let btn_reset = document.getElementById('btn-reset');
        toast.success('Cập yêu cầu thành công!');
        editSuggestModal.toggle();
        btn_reset && btn_reset.click();
      }
    } catch (error) {
      console.log();
    }
  };

  const onSearch = (val: any) => {
    let params: any = {
      limit: query.limit,
      // page: query.page,
    };
    if (val?.create_at) {
      params['filter.created_at'] = `$btw:${moment(val?.create_at[0])
        .startOf('day')
        .format()},${moment(val?.create_at[1]).endOf('day').format()}`;
    }
    if (val['filter.exclude_updated_user']) {
      params['filter.exclude_updated_user'] = val['filter.exclude_updated_user'];
    }
    if (val['filter.is_active']) {
      params['filter.is_active'] = val['filter.is_active'];
    }

    setQuery(params);
    fetchData(params);
  };

  return (
    <Fragment>
      <AddEditSuggest
        openModal={createSuggestModal.isShowing}
        fetchData={fetchData}
        cancelModal={createSuggestModal.toggle}
        onFinish={onCreateSuggest}
        isConfirm={isConfirm}
        setIsConfirm={setIsConfirm}
        type='add'
      />

      <AddEditSuggest
        openModal={editSuggestModal.isShowing}
        fetchData={fetchData}
        cancelModal={() => {
          setItemSelected(null);
          editSuggestModal.toggle();
        }}
        onFinish={onEditSuggest}
        suggestItem={itemSelected}
        type='edit'
      />
      <SearchSuggest
        loading={false}
        onSearch={onSearch}
        buttons={[
          isCan(Feature.CONFIG_BROADCAST, ActionText.CREATE) && (
            <Button
              type='primary'
              icon={<PlusCircleOutlined />}
              key='create_btn'
              className='search-box__search-button'
              onClick={createSuggestModal.toggle}>
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

export default SuggestUser;

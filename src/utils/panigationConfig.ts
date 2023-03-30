import { TablePaginationConfig } from 'antd/lib/table';

const PaginationConfig = (data: any): false | TablePaginationConfig => {
  if (!data) {
    return false;
  }

  return {
    current: Number(data?.meta?.currentPage),
    pageSize: Number(data?.meta?.itemsPerPage),
    total: Number(data?.meta?.totalItems),
  };
};

export default PaginationConfig;

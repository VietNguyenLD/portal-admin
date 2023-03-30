import { DoubleLeftOutlined, SyncOutlined } from '@ant-design/icons';
import Icons from 'constants/icons';
import { Feature } from 'constants/permission';
import { useState } from 'react';
import { BsFillSimFill } from 'react-icons/bs';
import { GiTicket } from 'react-icons/gi';
import { IoMdSettings } from 'react-icons/io';
import { MdDashboard } from 'react-icons/md';
import NavItem from './NavItem';

interface sidebarProps {}

const navMenu = [
  {
    title: 'Dashboard',
    icon: <MdDashboard />,
    featureId: [Feature.DASHBOARD_TICKET],
    children: [
      {
        featureId: Feature.DASHBOARD_TICKET,
        title: 'Cập nhật thông tin TB',
        path: '/admin/dashboard/update-subscriber-info',
      },
    ],
  },
  {
    title: 'Thiết Lập',
    icon: <IoMdSettings />,
    featureId: [Feature.CONFIG_PARAM, Feature.CONFIG_TICKET_REASON, Feature.CONFIG_BROADCAST],
    children: [
      {
        title: 'Tham số',
        path: '/admin/setting/param',
        featureId: Feature.CONFIG_PARAM,
      },
      {
        title: 'Lý do yêu cầu',
        path: '/admin/setting/request-reason',
        featureId: Feature.CONFIG_APP_REASON,
      },
      {
        title: 'Đề nghị tất cả user',
        path: '/admin/setting/suggest-user',
        featureId: Feature.CONFIG_BROADCAST,
      },
      {
        title: 'Lý do Khoá/Mở 1C,2C/Huỷ dịch vụ',
        path: '/admin/setting/lock-cancel-service',
        featureId: Feature.CONFIG_APP_REASON,
      },
    ],
  },
  {
    title: 'Quản Lý Cập Nhật TTTB',
    icon: <GiTicket />,
    featureId: [
      Feature.TICKET_ALL_LIST,
      Feature.TICKET_WAITING_LIST,
      Feature.TICKET_REQUESTED_LIST,
    ],
    children: [
      {
        title: 'Danh sách ticket',
        path: '/admin/ticket/list',
        featureId: Feature.TICKET_ALL_LIST,
      },
      {
        title: 'Danh sách chờ xử lý',
        path: '/admin/ticket/pending',
        featureId: Feature.TICKET_WAITING_LIST,
      },
      {
        title: 'Danh sách yêu cầu',
        path: '/admin/ticket/request-list',
        featureId: Feature.TICKET_REQUESTED_LIST,
      },
      {
        title: 'Gửi MBF theo batch',
        path: '/admin/ticket/send-batch',
        featureId: Feature.TICKET_SENDBATCH,
      },
      {
        title: 'Import danh sách CNTTTB',
        path: '/admin/ticket/import-list-cntttb',
        featureId: Feature.TICKET_IMPORTBATCH,
      },
      {
        title: 'Danh sách đề nghị kiểm tra TTTB',
        path: '/admin/subscriber/request-check-info/list',
        featureId: Feature.TICKET_REQUEST_BATCH,
      },
    ],
  },
  {
    title: 'Quản Lý SIM Đã Kích Hoạt',
    icon: <BsFillSimFill />,
    featureId: [Feature.ACTIVATED_SIM_LIST],
    children: [
      {
        title: 'Danh sách SIM đã kích hoạt',
        path: '/admin/sim/activated-list',
        featureId: Feature.ACTIVATED_SIM_LIST,
      },
      {
        title: 'Danh sách yêu cầu đổi SIM hỏng, mất',
        path: '/admin/sim/request-to-change',
        longText: true,
        featureId: Feature.ACTIVATED_SIM_CHANGE_SIM,
      },
      {
        title: 'Danh sách yêu cầu đổi SIM mới',
        path: '/admin/sim/request-change-sim/list',
        featureId: Feature.ACTIVATED_SIM_CHANGE_SIM,
      },
    ],
  },
  {
    title: 'Thu hồi STB cắt hủy',
    icon: <SyncOutlined />,
    path: '/admin/phone/list',
    featureId: [
      Feature.TICKET_ALL_LIST,
      Feature.TICKET_WAITING_LIST,
      Feature.TICKET_REQUESTED_LIST,
      999,
    ],
  },
  {
    title: 'QL và phân quyền User',
    icon: <GiTicket />,
    featureId: [Feature.MANAGE_USER_CONFIG, Feature.MANAGE_USER_LIST],
    children: [
      {
        title: 'Thiết lập nhóm người dùng',
        path: '/admin/permission/group-permission',
        featureId: Feature.MANAGE_USER_CONFIG,
      },
      {
        title: 'Danh sách người dùng',
        path: '/admin/permission/user',
        featureId: Feature.MANAGE_USER_LIST,
      },
    ],
  },
];

export function Sidebar(props: sidebarProps) {
  const [collapse, setCollapse] = useState(false);
  const [menu, setMenu] = useState(navMenu);

  return (
    <aside className={`sidebar ${collapse ? 'collapse' : ''}`}>
      <div className='flex align-center relative'>
        <span className='sidebar_icon inline-flex justify-center align-center'>
          <img src={Icons.ICON_LOCAL} alt='icon-local' />
        </span>
        <span className='sidebar_name text--overflow'>MYLOCAL PORTAL</span>
        <DoubleLeftOutlined
          className='sidebar_toggle flex justify-center align-center'
          onClick={() => setCollapse((prevState) => !prevState)}
        />
      </div>
      <ul className='sidebar_nav'>
        {menu.map((item, index) => {
          return <NavItem key={index} item={item} />;
        })}
      </ul>
    </aside>
  );
}

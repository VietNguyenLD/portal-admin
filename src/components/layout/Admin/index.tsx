import { LockOutlined, LogoutOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { Sidebar } from 'components/common';
import { UserStatus } from 'constants/user.enum';
import { AppContext } from 'context/AppContext';
import { authActions } from 'features/auth/authSlice';
import DashBoard from 'features/dashboard';
import { filtersActions } from 'features/filtersSlice';
import Permissions from 'features/permission';
import Setting from 'features/settings';
import SimFeature from 'features/sim';
import SubscriberFeature from 'features/subscriber';
import Ticket from 'features/ticket';
import RequestListPage from 'features/ticket/pages/RequestList';
import TicketPendingPage from 'features/ticket/pages/TicketPending';
import { useContext, useEffect, useState } from 'react';
import { Link, Redirect, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { capitalizeText } from 'utils';
import Phone from '../../../features/phone';
import './Admin.scss';

export function AdminLayout() {
  const history = useHistory();
  const math = useRouteMatch();
  const dispatch = useAppDispatch();

  const { currentUser } = useAppSelector((state) => state.auth);
  const { loading } = useContext(AppContext);

  const [isOpenUserMenu, setIsOpenUserMenu] = useState(false);

  useEffect(() => {
    if (currentUser?.status === UserStatus.NEW) {
      dispatch(authActions.logout());
    }
    // eslint-disable-next-line
  }, [currentUser]);

  const avatarName = (name: string) => {
    if (!name) return;
    const arrNameChar = name?.split(' ').map((word) => word[0]);
    return `${arrNameChar[0]}${arrNameChar[arrNameChar.length - 1]}`.toUpperCase();
  };

  function handleLogout() {
    dispatch(filtersActions.reset());
    dispatch(authActions.logout());
    history.push('/auth/login');
  }

  return (
    <div className='admin-layout'>
      <Sidebar />

      <div className='admin_main'>
        <Spin tip='Đang tải' spinning={loading}>
          <header>
            <div className='action'>
              <div className='profile' onClick={() => setIsOpenUserMenu((state) => !state)}>
                {avatarName(currentUser?.name!)}
              </div>
              <div className={`${isOpenUserMenu ? 'active' : ''} menu`}>
                <h3>
                  {capitalizeText(currentUser?.name!)}
                  <br />
                  <span></span>
                </h3>
                <ul>
                  <li>
                    <LockOutlined />
                    <Link to='/auth/change-password'>Đổi mật khẩu</Link>
                  </li>
                  <li>
                    <LogoutOutlined />
                    <Link to='' onClick={handleLogout}>
                      Đăng xuất
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </header>

          <div className='admin_content'>
            <Switch>
              <Route path={`${math.url}/ticket`} component={Ticket} />
              <Route path={`${math.url}/ticket/pending`} component={TicketPendingPage} />
              <Route path={`${math.url}/dashboard`} component={DashBoard} />
              <Route path={`${math.url}/ticket/request-list`} component={RequestListPage} />
              <Route path={`${math.url}/sim`} component={SimFeature} />
              <Route path={`${math.url}/setting`} component={Setting} />
              <Route path={`${math.url}/phone`} component={Phone} />
              <Route path={`${math.url}/permission`} component={Permissions} />
              <Route path={`${math.url}/subscriber`} component={SubscriberFeature} />

              <Redirect from={`${math.url}`} to={`${math.url}/dashboard`} />
            </Switch>
          </div>
        </Spin>
      </div>
    </div>
  );
}

import { useAppDispatch } from 'app/hooks';
import Icons from 'constants/icons';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { authActions } from '../authSlice';
import styles from './Logout.module.scss';

function LogoutPage() {
  const history = useHistory();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(authActions.logout());
  }, [dispatch]);

  return (
    <div className={styles.logoutPage}>
      <div className={styles.logoutContent}>
        <div>
          <div className={styles.logoutForm}>
            <div>
              <div className={styles.formHeader}>
                <img src={Icons.ICON_LOCAL} alt='icon-local' draggable={false} />
                <h2>Admin Portal</h2>
                <p>Phiên đăng nhập của bạn đã hết hạn.</p>
              </div>
              <button type='submit' onClick={() => history.push('/auth/login')}>
                Đăng nhập lại
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogoutPage;

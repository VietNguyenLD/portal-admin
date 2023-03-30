import { Modal, Spin } from 'antd';
import authApi from 'api/authApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import FindAccount from 'components/Modal/FindAccount';
import Icons from 'constants/icons';
import Images from 'constants/images';
import { UserStatus } from 'constants/user.enum';
import { authActions } from 'features/auth/authSlice';
import { filtersActions } from 'features/filtersSlice';
import { Form, Formik } from 'formik';
import { ForgotPasswordRequest } from 'models/auth';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { refreshPage } from 'utils';
import '../Auth.scss';
import EmailField from '../components/EmailField';
import PasswordField from '../components/PasswordField';
import styles from './Login.module.scss';

function LoginPage() {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { logging, currentUser, error } = useAppSelector((state) => state.auth);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const accessToken = Boolean(localStorage.getItem('access_token'));

    if (!accessToken) {
      dispatch(filtersActions.reset());
      dispatch(authActions.logout());
    }
    if (currentUser?.status === UserStatus.NEW) {
      return history.push('/auth/change-password');
    }
    if (currentUser?.status === UserStatus.ACTIVE) {
      return history.push('/admin');
    }
    // eslint-disable-next-line
  }, [currentUser, history]);

  const handleEmailSearch = async (reqBody: ForgotPasswordRequest) => {
    try {
      const response = await authApi.forgotPassword(reqBody);
      const { status, data } = response;
      if (status === 201) {
        toast.info('Mã pin đã được gửi tới email của bạn.', {
          autoClose: 1500,
        });
        setOpenModal(false);
        history.push(`/auth/reset-password/${data.data}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const warningModal = () => {
      if (error?.data === null) {
        Modal.error({
          title: `Tài khoản của bạn đã bị khóa!`,
          okText: 'Đóng',
          onOk: () => {
            dispatch(authActions.logout());
            refreshPage();
          },
        });
      }
      if (error?.data?.num_try_again > 0) {
        Modal.warning({
          title: `Bạn còn ${error?.data?.num_try_again} lần đăng nhập.`,
          content: 'Tài khoản của bạn sẽ bị khóa nếu đăng nhập sai 5 lần.',
          okText: 'Đóng',
          onOk: () => {
            dispatch(authActions.logout());
          },
        });
      }
    };

    warningModal();
    // eslint-disable-next-line
  }, [error]);

  return (
    <Spin spinning={logging}>
      <FindAccount
        openModal={openModal}
        onToggleModal={(flag: boolean) => setOpenModal(flag)}
        onEmailSearch={handleEmailSearch}
      />
      <div className={styles.loginPage}>
        <div className={styles.loginContent}>
          <div>
            <div className={styles.loginForm}>
              <Formik
                initialValues={{
                  email: '',
                  password: '',
                }}
                validate={(values) => {
                  const errors: any = {};

                  if (!values.email) {
                    errors.email = 'Vui lòng nhập địa chỉ email';
                  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                    errors.email = 'Địa chỉ email không hợp lệ';
                  }

                  if (!values.password) {
                    errors.password = 'Vui lòng nhập mật khẩu';
                  } else if (
                    !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*]).{8,}$/.test(
                      values.password,
                    )
                  ) {
                    errors.password =
                      'Mật khẩu phải có ít nhất 8 ký tự, gồm chữ HOA, chữ thường, số và ký tự đặc biệt';
                  }

                  return errors;
                }}
                onSubmit={(values: any) => {
                  dispatch(authActions.login(values));
                }}>
                {() => (
                  <Form>
                    <div className={styles.formHeader}>
                      <img src={Icons.ICON_LOCAL} alt='icon-local' draggable={false} />
                      <h2>Đăng Nhập</h2>
                    </div>

                    <EmailField id='email' type='email' name='email' placeholder='Địa chỉ email' />
                    <PasswordField id='password' name='password' placeholder='Mật khẩu' />
                    <div className={styles.formBtn}>
                      <button type='submit'>Đăng Nhập</button>
                      <span onClick={() => setOpenModal(true)}>Quên mật khẩu</span>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
            <div className={styles.loginImg}>
              <img src={Images.LOGO_LOCAL} alt='login-thumb' draggable={false} />
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
}

export default LoginPage;

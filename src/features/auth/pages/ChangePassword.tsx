import { CloseOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import authApi from 'api/authApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import Icons from 'constants/icons';
import Images from 'constants/images';
import { UserStatus } from 'constants/user.enum';
import { Form, Formik } from 'formik';
import { ChangePasswordRequest } from 'models/auth';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authActions } from '../authSlice';
import PasswordField from '../components/PasswordField';
import styles from './Login.module.scss';

function ChangePassword() {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState<boolean>(false);

  const changePassword = async (reqBody: ChangePasswordRequest) => {
    try {
      setLoading(true);
      const response = await authApi.chagePassword(reqBody);
      setLoading(false);
      const { status } = response;
      if (status === 200) {
        toast.success('Đổi mật khẩu thành công');
        dispatch(authActions.logout());
        history.push('/auth/login');
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSubmit = (values: any) => {
    const reqBody = {
      oldPassword: values.oldPassword,
      newPassword: values.password,
    };

    changePassword(reqBody);
  };

  useEffect(() => {
    if (currentUser?.status === UserStatus.NEW) {
      toast.error('Bạn phải đổi mật khẩu lần đầu');
    }
  }, []);

  return (
    <Spin spinning={loading}>
      <div className={styles.loginPage}>
        <div className={styles.loginContent}>
          <CloseOutlined className={styles.loginClose} onClick={() => history.push('/admin')} />
          <div>
            <div className={styles.loginForm}>
              <Formik
                initialValues={{
                  oldPassword: '',
                  password: '',
                  confirmPassword: '',
                }}
                validate={(values) => {
                  const errors: any = {};

                  if (!values.oldPassword) {
                    errors.oldPassword = 'Vui lòng nhập mật khẩu cũ';
                  }

                  if (!values.password) {
                    errors.password = 'Vui lòng nhập mật khẩu mới';
                  } else if (
                    !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*]).{8,}$/.test(
                      values.password,
                    )
                  ) {
                    errors.password =
                      'Mật khẩu phải có ít nhất 8 ký tự, gồm chữ HOA, chữ thường, số và ký tự đặc biệt';
                  }

                  if (!values.confirmPassword) {
                    errors.confirmPassword = 'Vui lòng nhập lại mật khẩu mới';
                  } else if (values.confirmPassword !== values.password) {
                    errors.confirmPassword = 'Mật khẩu mới không trùng khớp';
                  }

                  return errors;
                }}
                onSubmit={handleSubmit}>
                {() => (
                  <Form>
                    <div className={styles.formHeader}>
                      <img src={Icons.ICON_LOCAL} alt='icon-local' draggable={false} />
                      <h2>Đổi Mật Khẩu</h2>
                    </div>

                    <PasswordField id='oldPassword' name='oldPassword' placeholder='Mật khẩu cũ' />
                    <PasswordField id='password' name='password' placeholder='Mật khẩu mới' />
                    <PasswordField
                      id='confirmPassword'
                      name='confirmPassword'
                      placeholder='Nhập lại mật khẩu mới'
                    />
                    <div className={styles.formBtn}>
                      <button type='submit'>Đổi mật khẩu</button>
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

export default ChangePassword;

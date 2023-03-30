import { CloseOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import authApi from 'api/authApi';
import { useAppDispatch } from 'app/hooks';
import Icons from 'constants/icons';
import Images from 'constants/images';
import { Form, Formik } from 'formik';
import { ForgotPasswordVerifyRequest } from 'models/auth';
import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authActions } from '../authSlice';
import PasswordField from '../components/PasswordField';
import styles from './Login.module.scss';

function ResetPassword() {
  const { key } = useParams<{ key: string }>();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const resetPassword = async (reqBody: ForgotPasswordVerifyRequest) => {
    try {
      setLoading(true);
      const response = await authApi.forgotPasswordVerify(reqBody);
      setLoading(false);
      const { status } = response;
      if (status === 201) {
        toast.success('Đặt lại mật khẩu thành công');
        dispatch(authActions.logout());
        history.push('/auth/login');
      }
    } catch (error) {
      setLoading(false);
    }
  };
  const handleSubmit = (values: any) => {
    const reqBody = {
      key: key,
      pin: values.pin,
      password: values.password,
    };

    resetPassword(reqBody);
  };

  return (
    <Spin spinning={loading}>
      <div className={styles.loginPage}>
        <div className={styles.loginContent}>
          <CloseOutlined
            className={styles.loginClose}
            onClick={() => history.push('/auth/login')}
          />
          <div>
            <div className={styles.loginForm}>
              <Formik
                initialValues={{
                  pin: '',
                  password: '',
                  confirmPassword: '',
                }}
                validate={(values) => {
                  const errors: any = {};

                  if (!values.pin) {
                    errors.pin = 'Vui lòng nhập mã pin';
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
                    errors.confirmPassword = 'Vui lòng nhập mật khẩu mới';
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
                      <h2>Đặt Lại Mật Khẩu</h2>
                    </div>
                    <PasswordField
                      id='pin'
                      name='pin'
                      type='text'
                      placeholder='Mã pin'
                      toggleShow={false}
                    />
                    <PasswordField id='password' name='password' placeholder='Mật khẩu mới' />
                    <PasswordField
                      id='confirmPassword'
                      name='confirmPassword'
                      placeholder='Nhập lại mật khẩu mới'
                    />
                    <div className={styles.formBtn}>
                      <button type='submit'>Đặt lại mật khẩu</button>
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

export default ResetPassword;

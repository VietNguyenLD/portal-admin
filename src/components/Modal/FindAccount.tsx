import { Button, Input, Modal } from 'antd';
import { ErrorMessage, Form, Formik } from 'formik';

function FindAccount(props: any) {
  const { onToggleModal, onEmailSearch } = props;

  const handleCancel = () => {
    if (onToggleModal) {
      onToggleModal(false);
    }
  };

  const handleEmailSearch = async (values: any) => {
    const reqBody = {
      email: values.email,
    };
    if (onEmailSearch) {
      onEmailSearch(reqBody);
    }
  };

  return (
    <Modal
      className='find-account-modal'
      title='Tìm Tài Khoản'
      open={props.openModal}
      onCancel={handleCancel}
      footer={null}>
      <Formik
        initialValues={{
          email: '',
        }}
        validate={(values) => {
          const errors: any = {};

          if (!values.email) {
            errors.email = 'Vui lòng nhập địa chỉ email';
          } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
            errors.email = 'Địa chỉ email không hợp lệ';
          }

          return errors;
        }}
        onSubmit={handleEmailSearch}>
        {({ values, handleChange, handleBlur }) => (
          <Form>
            <div>Vui lòng nhập địa chỉ email để tìm kiếm tài khoản của bạn.</div>
            <Input
              id='email'
              name='email'
              placeholder='Địa chỉ email'
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
            />
            <ErrorMessage className='form_error' name='email' component='span' />
            <div className='form_btn' style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button key='submit' htmlType='submit'>
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export default FindAccount;

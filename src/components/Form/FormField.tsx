import { Form, FormProps } from 'antd';

interface FormFieldProps extends FormProps {
  children: React.ReactNode;
  formRef?: React.MutableRefObject<any>;
}

function FormField(props: FormFieldProps) {
  const { children, layout = 'vertical', formRef, ...theArgs } = props;

  return (
    <Form
      {...theArgs}
      ref={formRef}
      layout={layout}
      onKeyUp={(event) => {
        if (event.code === 'Enter') {
          formRef?.current?.submit();
        }
      }}>
      {children}
    </Form>
  );
}

export default FormField;

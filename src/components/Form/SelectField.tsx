import { Form, Select } from 'antd';

const { Option } = Select;

interface SelectFieldProps {
  label: string;
  name: string;
  children: React.ReactNode;
}

function SelectField(props: SelectFieldProps) {
  const { label, name, children } = props;
  return (
    <Form.Item label={label} name={name}>
      <Select
        showSearch
        allowClear
        placeholder='Chọn một giá trị'
        optionFilterProp='children'
        filterOption={(input, option) => {
          return (
            ((Array.isArray(option?.children) ? option?.children.join('') : option?.children)
              ?.toLowerCase()
              .indexOf(input.toLowerCase()) as number) >= 0
          );
        }}>
        <Option value=''>Tất cả</Option>
        {children}
      </Select>
    </Form.Item>
  );
}

export default SelectField;

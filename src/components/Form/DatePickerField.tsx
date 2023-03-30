import { DatePicker, Form } from 'antd';
import moment from 'moment';

interface DatePickerFieldProps {
  label: string;
  name: string;
}
function DatePickerField({ label, name }: DatePickerFieldProps) {
  return (
    <Form.Item label={label} name={name}>
      <DatePicker
        placeholder='Chọn ngày'
        format='DD-MM-YYYY'
        disabledDate={(date: any) => {
          return date > moment().endOf('day') || date < moment().subtract(100, 'year');
        }}
      />
    </Form.Item>
  );
}

export default DatePickerField;

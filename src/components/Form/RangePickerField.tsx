import { DatePicker, Form } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;

interface RangePickerFieldProps {
  label: string;
  name: string;
}

function RangePickerField({ label, name }: RangePickerFieldProps) {
  return (
    <Form.Item label={label} name={name}>
      <RangePicker
        style={{ width: '100%' }}
        placeholder={['Từ ngày', 'Đến ngày']}
        format='DD-MM-YYYY'
        disabledDate={(date) => {
          return date > moment().endOf('day') || date < moment().subtract(100, 'year');
        }}
      />
    </Form.Item>
  );
}

export default RangePickerField;

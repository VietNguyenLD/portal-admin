import { Excel } from 'antd-table-saveas-excel';
import { ColumnsType } from 'antd/lib/table';
import { RcFile } from 'antd/lib/upload';
import axiosClient from 'api/axiosClient';
import dayjs from 'dayjs';
import queryString from 'query-string';

export function formatDateFromIso(isoDate: string, format?: string) {
  if (isoDate) {
    return dayjs(isoDate).format(format);
  } else {
    return '';
  }
}

export function capitalizeText(text: string) {
  if (!text) return;
  const lowerCaseText = text.toLocaleLowerCase();
  const newText = lowerCaseText.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
  return newText;
}

export function secondToDayHour(seconds: string | number) {
  seconds = Number(seconds);
  var days = Math.floor(seconds / (3600 * 24));
  var hours = Math.floor((seconds % (3600 * 24)) / 3600);
  var minutes = Math.floor((seconds % 3600) / 60);
  const daysText = days + ' ngày';
  const hoursText = hours + Number((minutes / 60).toFixed(1)) + ' giờ';

  return {
    days: daysText,
    hours: hoursText,
  };
}

export const getBase64 = (file?: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    }
  });

export const getTimeDifference = (startDate: string, endDate: string) => {
  const date = new Date(dayjs(endDate).diff(dayjs(startDate)));
  const yearDiff = Math.abs(date.getUTCFullYear() - 1970);
  const monthDiff = Math.abs(date.getUTCMonth());
  const dayDiff = Math.abs(date.getUTCDate() - 1);
  return { yearDiff, monthDiff, dayDiff };
};

export function refreshPage() {
  setTimeout(() => {
    window.location.reload();
  }, 1000);
}

export async function exportExcel(
  name: string,
  columns: ColumnsType<any>,
  promises: Array<Promise<any>>,
  setLoading?: (flag: boolean) => void,
) {
  try {
    setLoading && setLoading(true);
    const result = await Promise.all(promises);
    const data = result?.reduce((accumulator, currentValue) => {
      return accumulator.concat(currentValue?.data?.data?.data);
    }, []);

    const excel = new Excel();
    excel
      .setRowHeight(1.3, 'cm')
      .addSheet(`${name}`)
      .addColumns(columns as any)
      .addDataSource(data, {
        str2Percent: true,
      })
      .saveAs(`${name}_${dayjs(new Date()).format('DD/MM/YYYY')}.xlsx`);
    setLoading && setLoading(false);
  } catch (error) {
    setLoading && setLoading(false);
    console.log(error);
  }
}

export function generateParamString(params: { [key: string]: number | string | boolean }) {
  const paramString = queryString.stringify(params, {
    skipEmptyString: true,
  });

  return paramString;
}

export function uploadFormData(url: string, data: any) {
  const bodyFormData = new FormData();
  bodyFormData.append('file', data);

  return axiosClient.put(url, bodyFormData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}

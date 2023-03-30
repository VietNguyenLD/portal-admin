import axiosClient from 'api/axiosClient';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { generateParamString } from 'utils';

interface useFetchProps {
  url: string;
  param?: any;
  setLoading?: Dispatch<SetStateAction<boolean>>;
}

function useFetch({ url, param, setLoading }: useFetchProps) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  async function fetchData(param?: any, controller?: any) {
    try {
      setLoading && setLoading(true);
      const signal = controller?.signal;
      const paramString = param && generateParamString(param);
      const newUrl = url + `${param ? '?' + paramString : ''}`;
      const { status, data } = await axiosClient.get(newUrl, { signal: signal });
      if (status === 200) {
        setData(data.data);
        setLoading && setLoading(false);
      }
    } catch (error: any) {
      setLoading && setLoading(false);
      setError(error?.response);
      console.log('Error fetch:', error);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    fetchData(param, controller);

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line
  }, []);

  return {
    data,
    fetchData,
    error,
  };
}

export default useFetch;

import React, { useState } from 'react'
import Papa from 'papaparse';
import axiosInstance from '../environment/index'
import { useDispatch } from 'react-redux';
import { setError } from '../../store/reducers';
import { Button } from 'antd';

function DownloadCsv({ URL, buttonType, styles, filename, headers, disabled }: any) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const dispatch = useDispatch()
  const getData = async (Url: any) => {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get(Url)
      if(response && response.data.data && Array.isArray(response.data.data)){
        exportData(Papa.unparse({
          "fields": headers.map((head: any) => head.title),
          "data": response.data.data.map((dt: any) => {
            return headers.map((head: any) => head?.formate ? head?.formate(dt[head.key]) : dt[head.key])
          })
        }), `${filename ? filename : 'Data'}_${new Date().toISOString()}.csv`, 'text/csv;charset=utf-8;')
        // exportData(Papa.unparse(response.data.data), `${filename ? filename : 'Data'}_${new Date().toISOString()}.csv`, 'text/csv;charset=utf-8;')
        dispatch(setError({ status: true, type: 'success', message: 'Data Exported Sucessfully' }))
        setIsLoading(false)
      }else{
        dispatch(setError({ status: true, type: 'error', message: 'Data is not in a correct formate' }))
        setIsLoading(false)
      }
    } catch (err: any) {
      dispatch(setError({ status: true, type: 'error', message: err }))
      setIsLoading(false)
    }
  }

   const exportData = (data: any, fileName: any, type: any) => {
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div style={styles ? {...styles} : { margin: '10px 0' }}>
      <Button  type={buttonType || 'primary'} onClick={() => getData(URL)} disabled={disabled || isLoading}>{isLoading ? 'Exporting...' : 'Export To CSV'}</Button>
    </div>
  );
}

export default DownloadCsv
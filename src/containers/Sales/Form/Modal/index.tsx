import { Button, Modal, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import SalesService from '../../../../services/Sales.services'
import { setError } from '../../../../store/reducers'
import { useDispatch } from 'react-redux'

function ModalDelete({ show, hideModal, fetchList, data }: any) {
    const [currentType, setCurrentType] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { deleteFileList } = SalesService
    const dispatch = useDispatch()

    const removeFileList =  async () => {
      try {
        if(data === null){
            dispatch(setError({ status: true, type: 'error', message: 'Please select the file to delete' }))
            return;
        }
        setIsLoading(true)
        const response = await deleteFileList({ fileId: data?.id, type: parseInt(data?.is_senior) })
        if(response){
          dispatch(setError({ status: true, type: 'success', message: 'File List Deleted successfully' }))
          hideModal()
          fetchList()
          setCurrentType(null)
        }
        setIsLoading(false)
      } catch (err: any) {
        setIsLoading(false)
        dispatch(setError({ status: true, type: 'error', message: err }))
      }
    }

    useEffect(() => {
        return () => {
            setCurrentType(null)
        }
    }, [])
    const options = [
      { label: 'Paid-Senior', value: 1 },
      { label: 'UnPaid-Junior', value: 0 },
      { label: 'All Data', value: 2 },
    ];
  return (
    <>
        <Modal
            title={`Are you sure you want to delete ${data?.value}`}
            open={show}
            onCancel={hideModal}
            footer={() => (
              <div className='user-details__backstep-footer'>
                <div>
                  <Button onClick={hideModal}>Close</Button>
                  <Button style={{marginLeft:"10px"}} onClick={removeFileList} type="primary" disabled={isLoading}>{isLoading ? 'Loading...' : 'Submit'}</Button>
                </div>
              </div>
            )}
        >
            <Select
                disabled
                options={options}
                onChange={(e: any) => setCurrentType(e)}
                placeholder="Select is senior"
                style={{width: '100%'}}
                value={options.filter((item)=> item.value == data.is_senior)?.[0].label}
            />
        </Modal>
    </>
  )
}

export default ModalDelete
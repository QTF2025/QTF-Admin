import React, { useState, useEffect } from 'react'
import ContentHeader from '../../components/ContentHeader'
import { Form } from 'antd'
import { formLayout, formTailLayout } from '../../utils'
import GenerateElements from '../../components/GenerateElements'
import { Button } from 'antd'
import useIsMobile from '../../utils/isMobile'
import '../../utils/styles/formStyles.scss'
import { fieldsData } from './contants'
import ConfigurationService from '../../services/Configurations.services'
import { useDispatch } from 'react-redux'
import { setError } from '../../store/reducers'

const Configure = () => {
    const [form] = Form.useForm();
    const isMobile = useIsMobile()
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState<boolean>(false) 
    const { getConfiguration, createConfiguration } = ConfigurationService

    const fetchIpAddress = async () => {
        try {
            setIsLoading(true)
            const response = await getConfiguration()
            if(response && response?.data){
                form.setFieldsValue({
                    ipAddress: response.data.ip
                })
            }
            setIsLoading(false)
        } catch (err: any) {
            setIsLoading(false)
            dispatch(setError({ status: true, type: 'error', message: err }))
        }
    }

    const createIpAddress = async (values: any) => {
        try {
            setIsLoading(true)
            const response = await createConfiguration(values)
            if(response){
                dispatch(setError({ status: true, type: 'success', message: response?.message }))
                fetchIpAddress()
            }
            setIsLoading(false)
        } catch (err: any) {
            setIsLoading(false)
            dispatch(setError({ status: true, type: 'error', message: err }))
        }
    }

    useEffect(() => {
        fetchIpAddress()
    }, [])

  return (
    <div className='form-container'>
        <ContentHeader 
            showBtn={false}
            redirectPath=''
            buttonText=''
            title={`Configuration`}
            showIcon={false}
        />
        <div className='form-container__body'>
        <Form
          {...formLayout}
          form={form}
          onFinish={createIpAddress}
          className='form-container__form-body'
          layout={isMobile ? 'vertical' : 'horizontal'}
      >
             {
                  fieldsData.map((formItem: any, i: number) => (
                        <GenerateElements elementData={formItem} index={i} key={i} />
                  ))
              }
              <Form.Item {...formTailLayout}>
                <Button type="primary" htmlType="submit" disabled={isLoading}>
                  Submit
                </Button>
              </Form.Item>
        </Form>
        </div>
    </div>
  )
}

export default Configure
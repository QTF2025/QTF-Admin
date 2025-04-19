import React, { useEffect, useState } from 'react'
import { Form, Button } from "antd";
import ContentHeader from '../../../components/ContentHeader'
import GenerateElements from '../../../components/GenerateElements';
import { accessOptions, assignLeadOptions, fieldsData, responseKeys } from './constants';
import { formLayout, formTailLayout } from '../../../utils';
import useIsMobile from '../../../utils/isMobile';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import '../../../utils/styles/formStyles.scss'
import DepartmentService from '../../../services/Departments.services';
import { setError } from '../../../store/reducers';
import { useDispatch } from 'react-redux';

const DeparmentForm = () => {
    const [form] = Form.useForm();
    const [isEditable, setIsEditable] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const isMobile = useIsMobile()
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const params = useParams()
    const { getDepartment, createDepartment, editDepartment } = DepartmentService

    const fetchDepartmentData = async (deptId: any) => {
      try {
        const response = await getDepartment(deptId)
        if(response?.data){
          const { name } = response.data;
          const keys = Object.keys(response.data);
          const selectedOptions = keys.map((key: any) => {
              if(responseKeys[key] && response.data[key] === '1'){
                return responseKeys[key]
              }
            })
          form.setFieldsValue({
            departmentName: name,
            access: selectedOptions,
            assignLeads: selectedOptions
          })
        }
      } catch (err: any) {
        dispatch(setError({ status: true, type: 'error', message: err }))
      }
    }

    const onFormSubmit = async (data: any) => {
      try {
          setIsLoading(true)
          if(isEditable){
            await editDepartment(data, params.id) 
          }else{
            await createDepartment(data)
          }
          setIsLoading(false)
          navigate('/departments')
      } catch (err: any) {
          setIsLoading(false)
          dispatch(setError({ status: true, type: 'error', message: err }))
      }
    }
    
    useEffect(() => {
      if(Object.keys(params).length > 0 && location.pathname.includes('edit')){
        fetchDepartmentData(params.id)
        setIsEditable(true)
      }

      return () => {
        form.resetFields()
        setIsEditable(false)
      }
    }, [location])

  return (
    <div className='form-container'>
        <ContentHeader 
            showBtn={false}
            redirectPath=''
            buttonText=''
            title={`${isEditable ? 'Edit' : 'Create'} Department`}
            showIcon={false}
        />
        <div className='form-container__body'>
          <Form
              {...formLayout}
              form={form}
              onFinish={(values: any) => {
                let copyValues = {...values}
                const { assignLeads, access } = copyValues

                if(access){
                  accessOptions.forEach((opt: any) => {
                    if(copyValues.access.includes(opt.value)){
                      copyValues[opt.value] = '1'
                    }else{
                      copyValues[opt.value] = '0'
                    }
                  })
                }else{
                  accessOptions.forEach((opt: any) => {
                    copyValues[opt.value] = '0'
                  })
                }
                copyValues['assignLead'] = assignLeads && assignLeadOptions.some((opt: any) => copyValues.assignLeads.includes(opt.value)) ? '1' : '0'
                delete copyValues.assignLeads
                delete copyValues.access

                onFormSubmit(copyValues)
              }}
              className='form-container__form-body'
              layout={isMobile ? 'vertical' : 'horizontal'}
          >
            {
                fieldsData.map((formItem: any, i: number) => (
                      <GenerateElements elementData={formItem} index={i} key={i} />
                ))
            }
            <Form.Item {...formTailLayout}>
              <Button htmlType="button" onClick={() => window.history.back()}>
                Back
              </Button>
              <Button type="primary" htmlType="submit" disabled={isLoading}>
                {isLoading ? 'Loading...' : isEditable ? 'Save' : 'Create'}
              </Button>
            </Form.Item>
          </Form>
        </div>
    </div>
  )
}

export default DeparmentForm
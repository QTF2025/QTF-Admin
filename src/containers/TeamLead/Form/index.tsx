import React, { useEffect, useState } from 'react'
import { Form, Button } from "antd";
import ContentHeader from '../../../components/ContentHeader'
import GenerateElements from '../../../components/GenerateElements';
import { formLayout, formTailLayout } from '../../../utils';
import useIsMobile from '../../../utils/isMobile';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import '../../../utils/styles/formStyles.scss'
import TeamLeadService from '../../../services/TeamLead.services';
import { useDispatch } from 'react-redux';
import { setError } from '../../../store/reducers';
import DepartmentService from '../../../services/Departments.services';


const TeamLeadForm = () => {
    const [form] = Form.useForm();
    const [isEditable, setIsEditable] = useState<boolean>(false)
    const [departmentList, setDepartmentList] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const isMobile = useIsMobile()
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const params = useParams()
    const { getTeamLead, editTeamLead, createTeamLead } = TeamLeadService;
    const { getDepartmentList } = DepartmentService

    const fieldsData = [
        {
            label: 'Department',
            key: 'departmentIds',
            elementType: 'MULTI_SELECT',
            required: true,
            disable: false,
            options: departmentList,
            onChangeField: () => {},
            type: 'text',
            placeholder: 'Select Department',
            config: {
                rules: [{ required: true, message: 'Please Select Department' }],
            }
        },
        {
            label: 'First Name',
            key: 'firstName',
            elementType: 'INPUT',
            onChangeField: () => {},
            required: true,
            disable: false,
            type: 'text',
            placeholder: 'Enter First Name',
            config: {
                rules: [{ required: true, message: 'Please Enter First Name' }],
            }
        },
        {
            label: 'Last Name',
            key: 'lastName',
            elementType: 'INPUT',
            onChangeField: () => {},
            required: true,
            disable: false,
            type: 'text',
            placeholder: 'Enter Last Name',
            config: {
                rules: [{ required: false, message: 'Please Enter Last Name' }],
            }
        },
        {
            label: 'Email',
            key: 'email',
            elementType: 'INPUT',
            onChangeField: () => {},
            required: true,
            disable: false,
            type: 'text',
            placeholder: 'Enter Email',
            config: {
                rules: [{type: 'email',message: 'Please provide valid E-mail!' },{ required: true, message: 'Please Enter Email' }],
            }
        },
        {
            label: 'Password',
            key: 'password',
            elementType: 'INPUT_PASSWORD',
            onChangeField: () => {},
            required: true,
            disable: false,
            type: 'password',
            placeholder: 'Enter Password',
            config: {
                rules: [{ required: true, message: 'Please Enter Password' }],
            }
        },
    ]

    const fetchDepartmentList = async () => {
      try {
          setIsLoading(true)
          const response = await getDepartmentList();
          const { data } = response
          if(data && data.length > 0){
            setDepartmentList(data.map((dt: any) => ({
                value: dt.dept_id,
                label: dt.name,
            })))
          }
          setIsLoading(false)
      } catch (err: any) {
          setIsLoading(false)
          dispatch(setError({ status: true, type: 'error', message: err }))
      }
    }

    const fetchTeamLeadData = async (deptId: any) => {
      try {
        const response = await getTeamLead(deptId)
        if(response?.data){
          const { departments, email, first_name, last_name } = response.data;
          const selectedDeps: any[] = departments.map((dep: any) => dep.id)
          form.setFieldsValue({
            departmentIds: selectedDeps,
            email: email,
            firstName: first_name,
            lastName: last_name,
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
            await editTeamLead(data, params.id) 
          }else{
            await createTeamLead(data)
          }
          setIsLoading(false)
          navigate('/teamlead')
      } catch (err: any) {
          setIsLoading(false)
          dispatch(setError({ status: true, type: 'error', message: err }))
      }
    }
    
    useEffect(() => {
      if(Object.keys(params).length > 0 && location.pathname.includes('edit')){
        fetchTeamLeadData(params.id)
        setIsEditable(true)
      }

      fetchDepartmentList()

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
            title={`${isEditable ? 'Edit' : 'Create'} Team Lead`}
            showIcon={false}
        />
        <div className='form-container__body'>
        <Form
          {...formLayout}
          form={form}
          onFinish={onFormSubmit}
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

export default TeamLeadForm
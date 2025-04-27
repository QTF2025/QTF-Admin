import React, { useEffect, useState, useMemo } from 'react'
import { Form, Button } from "antd";
import ContentHeader from '../../../components/ContentHeader'
import GenerateElements from '../../../components/GenerateElements';
import { formLayout, formTailLayout } from '../../../utils';
import useIsMobile from '../../../utils/isMobile';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DepartmentService from '../../../services/Departments.services';
import { useDispatch } from 'react-redux';
import { setError } from '../../../store/reducers';
import { isSeniorField, isSeniorOptions, isActiveField, isActiveOptions } from './constants'
import '../../../utils/styles/formStyles.scss'
import TeamService from '../../../services/Team.services';
import localStorageContent from '../../../utils/localstorage';
import TeamLeadService from '../../../services/TeamLead.services';


const TeamForm = () => {
    const [form] = Form.useForm();
    const [isEditable, setIsEditable] = useState<boolean>(false)
    const [departmentList, setDepartmentList] = useState<any[]>([])
    const [teamLeadList, setTeamLeadList] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isSenior, setIsSenior] = useState<boolean>(true)
    const isMobile = useIsMobile()
    const location = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()
    const { getDepartmentList } = DepartmentService
    const { getTeam, createTeam, editTeam, filterTeamLeadByDept } = TeamService
    const localUserData = localStorageContent.getUserData()

    const onChangeDepartments = async (selected: any) => {
     // await fetchTeamLeadList(selected);

      if(selected.some((dep: any) => [1,2,3,4,5,6].includes(dep))){
        setIsSenior(false)
      }else{
        setIsSenior(true)
      }
    }
    const fieldsData = [
        {
            label: 'Department',
            key: 'departmentIds',
            elementType: 'MULTI_SELECT',
            required: true,
            disable: false,
            options: departmentList,
            onChangeField: onChangeDepartments,
            type: 'text',
            placeholder: 'Select Department',
            config: {
                rules: [{ required: true, message: 'Please Select Department' }],
            }
        },
        {
            label: 'Is Senior',
            key: 'isSenior',
            elementType: 'CHECKBOX_GROUP',
            required: true,
            options: isSeniorOptions,
            disable: isSenior,
            onChangeField: () => {},
            type: 'text',
            placeholder: '',
            config: {
                rules: [{ required: false, message: 'Please Select Is Senior' }],
            }
        },
        // {
        //   label: 'Team Lead',
        //   key: 'teamLeadIds',
        //   elementType: 'MULTI_SELECT',
        //   required: true,
        //   disable: false,
        //   options: teamLeadList,
        //   onChangeField: () => {},
        //   type: 'text',
        //   placeholder: 'Select Team Lead',
        //   config: {
        //     rules: [{ required: true, message: 'Please Select Team Lead' }],
        //   }
        // },
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
            label: `${isEditable ? 'New Password' : 'Password'}`,
            key: 'password',
            elementType: 'INPUT_PASSWORD',
            onChangeField: () => {},
            required: true,
            disable: false,
            type: 'password',
            placeholder: 'Enter Password',
            config: {
                rules: [{ required: false, message: 'Please Enter Password' }],
            }
        },
        {
            label: 'User Active',
            key: 'status',
            elementType: 'CHECKBOX_GROUP',
            required: true,
            options: isActiveOptions,
            disable: false,
            onChangeField: () => {},
            type: 'text',
            placeholder: '',
            config: {
                rules: [{ required: false, message: 'Please Select Is Active' }],
            }
        }
    ]

    const generateFormFields = useMemo(() => {
      let copyfields: any[] = [...fieldsData]
      if(localUserData && localUserData?.role !== '1'){
        // copyfields.splice(0,2)
        copyfields = copyfields.filter((field: any, i: any) => ![0,1,6].includes(i))
      }else{
        copyfields = !isEditable ? copyfields.slice(0, 7) : copyfields
      }

      return copyfields
    }, [departmentList,teamLeadList, isEditable, isSenior])

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

    const fetchTeamData = async (deptId: any) => {
      try {
        const response = await getTeam(deptId)
        if(response?.data){
          const { departments, email, first_name, last_name, is_senior, status, teamLeads } = response.data;
          const selectedDeps: any[] = departments.map((dep: any) => dep.id)
          const selectedTeamLeads: any[] = teamLeads?.map((dt: any) => ({
            value: dt.user_id,
            label: `${dt.first_name} ${dt.last_name}`,
        }))
          if(departments.some((dep: any) => [1,4].includes(dep.id))){
            setIsSenior(false)
          }
          form.setFieldsValue({
            isSenior: is_senior === '1' ? ['isSenior'] : [],
            departmentIds: selectedDeps,
            teamLeadIds: selectedTeamLeads,
            email: email,
            firstName: first_name,
            lastName: last_name,
            status: status === '1' ? ['status'] : [],
          })
        }
      } catch (err: any) {
        dispatch(setError({ status: true, type: 'error', message: err }))
      }
     
    }
    // const fetchTeamLeadList = async (selected: any) => {
    //   try {
    //       setIsLoading(true)
    //       const response = await filterTeamLeadByDept({ departmentIds: selected });
    //       const { data } = response
    //       if(data && data.length > 0){
    //         setTeamLeadList(data?.map((dt: any) => ({
    //             value: dt.user_id,
    //             label: `${dt.first_name} ${dt.last_name}`,
    //         })))
    //       }
    //       setIsLoading(false)
    //   } catch (err: any) {
    //       setIsLoading(false)
    //       dispatch(setError({ status: true, type: 'error', message: err }))
    //   }
    // }
    const onFormSubmit = async (data: any) => {
      console.log("rrrrr");
      try {
        const copyData = { ...data };
        
        if (isEditable) {
          copyData.status = (Array.isArray(copyData?.status) && copyData?.status.length > 0) ? '1' : '0';
        }
    
        copyData.isSenior = (Array.isArray(copyData?.isSenior) && copyData?.isSenior.length > 0) ? '1' : '0';
    
        setIsLoading(true);
    
        if (isEditable) {
          await editTeam(copyData, params.id);
        } else {
          await createTeam(copyData);
        }
    
        setIsLoading(false);
        navigate('/team');
      } catch (err: any) {
        setIsLoading(false);
        dispatch(setError({ status: true, type: 'error', message: err?.message || 'Something went wrong' }));
      }
    }
    
    
    useEffect(() => {
      if(Object.keys(params).length > 0 && location.pathname.includes('edit')){
        fetchTeamData(params.id)
        setIsEditable(true)
      }

      if(localUserData && localUserData?.role === "1") {
        fetchDepartmentList()        
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
            title={`${isEditable ? 'Edit' : 'Create'} Team`}
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
                  generateFormFields.map((formItem: any, i: number) => (
                        <GenerateElements elementData={formItem} index={i} key={i} />
                  ))
              }
              {/* <p>User In active on </p> */}
              <Form.Item {...formTailLayout}>
                <Button htmlType="button" onClick={() => window.history.back()}>
                  Back
                </Button>
                <Button type="primary" htmlType="submit">
                  {isLoading ? 'Loading...' : isEditable ? 'Save' : 'Create'}
                </Button>
              </Form.Item>
        </Form>
        </div>
    </div>
  )
}

export default TeamForm
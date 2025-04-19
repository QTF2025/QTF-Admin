import React, { useState, useEffect } from 'react'
import { Popover, Avatar, Badge, Select, Button } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { BellOutlined, UserOutlined } from "@ant-design/icons";
import './styles.scss'
import useIsMobile from '../../utils/isMobile';
import { useDispatch } from 'react-redux';
import { clearData, setError } from '../../store/reducers';
import localStorageContent from '../../utils/localstorage';
import HeaderService from '../../services/Header.services';
import { jwtDecode } from 'jwt-decode';
import { aesEncrypt } from './constants';
import axios from 'axios';
import Authservices from '../../services/Auth.services';

function Header({ user }: any) {
    const [notificationCount, setNotificationCount] = useState<number>(0);
    const [hasMultiDepartment, setHasMultiDepartment] = useState<boolean>(false);
    const [multiDepartments, setMultiDepartments] = useState<any[]>([]);
    const [currentDepartment, setCurrentDepartment] = useState<any>(null)
     const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const isMobile = useIsMobile()
    const localUserData = localStorageContent.getUserData();
    const multiDep = localStorageContent.getMultiDepartment();
    const { getNotifications, multiDepartment, patchDepartment } = HeaderService;

    const handleLogout = async () => {
      try {
        const service = new Authservices();
        
        // Log out from the server using refresh token
        const refreshToken = localStorage.getItem('refresh_token')?.toString();
        if (refreshToken) {
          await service.logout({ refreshToken });
        }
        
        // Clear local storage and application state
        localStorage.clear();
        await dispatch(clearData()); // Ensure state is cleared before navigation
    
        // Navigate to login or home page
        navigate('/');
    
      } catch (error) {
        console.error("Error during logout:", error);
        // Optionally, handle the error (e.g., show a message to the user)
      }
    };
     
    const fetchNotificationsList = async () => {
      try {
        let URL = ''
        if (multiDep !== null && multiDep) {
          URL = `/dashboard/notifications?deptId=${localUserData.departmentId}`
        } else {
          URL = '/dashboard/notifications'
        }

        const response = await getNotifications(URL);
        if(response){
          const data = response?.totalNotifications;
          setNotificationCount(data ? data : 0)
        }
      } catch (err: any) {
          dispatch(setError({ status: true, type: 'error', message: err }))
      } 
    } 

    const checkMultiDepartment = async () => {
      try {
        const multipleLocalDt = localStorageContent.getMultiDepartment()

        const response = await multiDepartment()
        // console.log('response', response)
        if(response){
          const { isMultiDepartment, data } = response;
          if(isMultiDepartment){
            setHasMultiDepartment(true)
            if (data.length > 0) {
              const options = data.map((dt: any) => ({ value: dt.dept_id, label: dt?.department_name }))
              setMultiDepartments(options)
            }
            if (multipleLocalDt === null){
              localStorageContent.setMultiDepartment(true)
              window.location.reload()
            }else{
              if (JSON.parse(multipleLocalDt)){
                localStorageContent.setMultiDepartment(true)
              }else{
                localStorageContent.setMultiDepartment(true)
                window.location.reload()
              }
            }
          }else{
            if (multipleLocalDt === null) {
              localStorageContent.setMultiDepartment(false)
              // window.location.reload()
            } else {
              if (JSON.parse(multipleLocalDt)) {
                localStorageContent.setMultiDepartment(false)
                window.location.reload()
              } else {
                localStorageContent.setMultiDepartment(false)
              }
            }
          }
        } 
      } catch (err: any) {
        dispatch(setError({ status: true, type: 'error', message: err }))
      }
    } 

    const updateDepartment = async (departId: any) => {
      try {
        if (departId === null){
          return;
        }
        const response = await patchDepartment({
          deptId: departId
        })
        if (response) {
          dispatch(setError({ status: true, type: 'success', message: response?.message }))
          let tokDetails: any = jwtDecode(response?.data?.access?.token);
          aesEncrypt(tokDetails.key)
          localStorage.setItem('access_token', response?.data?.access?.token)
          localStorage.setItem('refresh_token', response?.data?.refresh?.token)
          localStorage.setItem('expires', response?.data?.access?.expires)
          window.location.reload();
        }
      } catch (err: any) {
        dispatch(setError({ status: true, type: 'error', message: err }))
      }
    }

    const onChangeDepartment = async (value: any) => {
      setCurrentDepartment(value)
      updateDepartment(value)

      if(location.pathname !== '/dashboard'){
          navigate('/dashboard')
      }
    }

    const content = (
      <div className='profile-list'>
          <p onClick={handleLogout}>Logout</p>
      </div>
    );

    useEffect(() => {
     (localUserData?.role === "3" && location.pathname !== '/notifications') && fetchNotificationsList()
    }, [location.pathname])

    useEffect(() => {
      const localUserData = localStorageContent.getUserData();
      if(localUserData?.departmentId === 7 || localUserData?.departmentId === 9){
        navigate('/reports')
      }
    }, [])

    useEffect(() => {
      if(localUserData){
        if(localUserData?.role !== '1' && localUserData.departmentId < 7){
          setCurrentDepartment(localUserData.departmentId)
          checkMultiDepartment()
        }
      }else{
        navigate('/')
      }
    }, [])

  return (
    <div className='header-container'>
        <div className='header-container__left'>
          {
          hasMultiDepartment &&  multiDepartments?.map((item) => 
          <Button  onClick={() => onChangeDepartment(item.value)} style={{marginLeft: '10px'}} type={ (localUserData?.departmentId === item.value) ? 'primary': 'default'}>{item.label}</Button>
          )
          }
            {/* {
              hasMultiDepartment && (
                <Select
                  style={{ width: 150 }}
                  onChange={onChangeDepartment}
                  options={multiDepartments}
                  value={currentDepartment}
                />
              )
            } */}
        </div>
        <div className='header-container__right'>
            <div className='header-container__right--content'>
              {localUserData && <span className='header-container__right--content__title'>{localUserData?.firstName + ' ' + localUserData?.lastName}</span>}
              {
                localUserData && localUserData?.role === "3" && (
                  <Badge count={notificationCount} className='header_icons'>
                    <BellOutlined className='cell_icon' onClick={() => navigate('/notifications')} />
                  </Badge>
                )
              }
              <Popover placement="bottom" content={content} trigger={isMobile ? "click" : "hover"} className='header_icons'>
                <Avatar size={40} icon={<UserOutlined />} />
              </Popover>
            </div>
        </div>
    </div>
  )
}

export default Header
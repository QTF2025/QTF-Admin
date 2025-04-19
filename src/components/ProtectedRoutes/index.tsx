import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import localStorageContent from '../../utils/localstorage';

const ProtectedRoutes = ({ children }: any) => {
    const navigate = useNavigate();
    const localUserData = localStorageContent.getUserData();

    useEffect(() => {
        if(localUserData === null || localUserData === undefined){
            navigate('/')
        }
    }, [localUserData])

  return (
    <>
        {children}
    </>
  )
}

export default ProtectedRoutes
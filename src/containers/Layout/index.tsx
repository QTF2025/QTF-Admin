import React, { useLayoutEffect, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { ILayout } from './models'
import { useDispatch } from 'react-redux'
import { clearData } from "../../store/reducers";
import localStorageContent from '../../utils/localstorage'
import Sidebar from '../../components/Sidebar'
import './styles.scss'
import Header from '../../components/Header'


const Layout: React.FC<ILayout> = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userData = localStorageContent.getUserData();
  
  useEffect(() => {
    if(userData === null || userData === undefined){
      dispatch(clearData())
      navigate('/unauthorized')
    }
  }, [])

  return (
    <div className='layout'>
        <div className='layout__sidebar'>
          <Sidebar />
        </div>
        <div className='layout__body'>
            <div className='layout__body--header'>
              <Header />
            </div>
            <div className='layout__body--main'>
                <Outlet />
            </div>
            <div className='layout__body--footer'>
            
            </div>
        </div>
        
    </div>
  )
}

export default Layout
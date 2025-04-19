import React from 'react'
import unAuth from '../../assets/images/unauthorized.jpg';
import { Button } from 'antd';
import './styles.scss'
import { useNavigate } from 'react-router-dom';

function UnAuthorized() {
    const navigate = useNavigate()
  return (
    <div className='unauthorized_container'>
        <div className='unauthorized_container--image'> 
            <img src={unAuth} alt="un-authorized" />
        </div>
        <Button type='primary' onClick={() => navigate('/')}>Click Here to Login</Button>
    </div>
  )
}

export default UnAuthorized
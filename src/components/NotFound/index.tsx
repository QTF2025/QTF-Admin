import React from 'react'
import notFound from '../../assets/images/notfound.jpg';
import { Button } from 'antd';
import './styles.scss'
import { useNavigate } from 'react-router-dom';

function NotFound() {
    const navigate = useNavigate()
  return (
    <div className='unauthorized_container'>
        <div className='unauthorized_container--image'> 
            <img src={notFound} alt="un-authorized" />
        </div>
        <Button type='primary' onClick={() => navigate(-1)}>Go Back</Button>
    </div>
  )
}

export default NotFound
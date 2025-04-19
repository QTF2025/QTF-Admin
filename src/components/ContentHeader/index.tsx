import React from 'react'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { IContentHeader } from './models'
import './styles.scss'

const ContentHeader = ({ title, showBtn, redirectPath, buttonText, showIcon, Icon }: IContentHeader) => {
    const navigate = useNavigate()

  return (
    <div className='content-header'>
        <p>{title}</p>
        {
            showBtn && (
                <Button icon={(showIcon && Icon) && <Icon size={20}/>} onClick={() => navigate(redirectPath)}>{buttonText}</Button>
            )
        }
    </div>
  )
}

export default ContentHeader
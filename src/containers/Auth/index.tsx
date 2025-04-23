import React, { useEffect, useState } from 'react'
import { Button, Form } from "antd";
import { initAuth} from '../../store/actions/creators'
import { useDispatch, useSelector } from 'react-redux'
import { IInitialState } from '../../store/reducers/models';
import { useNavigate } from 'react-router-dom';
import './styles.scss'
import GenerateElements from '../../components/GenerateElements';
import { formLayout, formTailLayout } from '../../utils';
import localStorageContent from '../../utils/localstorage';
import logo from '../../assets/images/qtflogo.png'
const Auth = () => {
    const state: IInitialState = useSelector((state: any) => state.store)
    const { isAuthenticated, isAuthLoading } = state;
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const localUserData = localStorageContent.getUserData();
    
    const fields = [
        {
            label: 'User Name',
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

    const onFinish = (values: any) => {
        dispatch(initAuth(values))
    }

    useEffect(() => {
        if(isAuthenticated || localUserData){
            if(localUserData?.departmentId === 7 || localUserData?.departmentId === 9){
                navigate('/reports')
            }else{
                navigate('/dashboard')
            }
            
        }
    }, [isAuthenticated, localUserData])

    return (
        <div className="auth-container">
            <div className="auth-container__login">
                
                <h3 className="auth-container__login--title"><img src={logo} alt='logo' style={{width: '40%'}} /></h3>
                <Form
                    name="basic"
                    {...formLayout}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    className='auth-container__login--form'
                >
                    {
                        fields.map((formItem: any, i: number) => (
                                <GenerateElements elementData={formItem} index={i} key={i} />
                        ))
                    }
                    <Form.Item
                        {...formTailLayout}
                    >
                    <Button className='loginbutton' type="primary" htmlType="submit" disabled={isAuthLoading}>
                       {isAuthLoading ? 'Signing In...' : 'Submit'}
                    </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default Auth
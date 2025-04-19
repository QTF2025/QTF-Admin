import { Button, Col, Row } from 'antd'
import React from 'react'
import { Form } from 'antd'
import GenerateElements from '../../../components/GenerateElements'
import ReferalsService from '../../../services/Referals.services'
import '../../../utils/styles/formStyles.scss'
import { setError } from '../../../store/reducers'
import { useDispatch } from 'react-redux'


function CreateReferal({ getReferals }: any) {
    const [form] = Form.useForm()
    const { createReferals } = ReferalsService
    const dispatch = useDispatch()

    const createReferal = async (values: any) => {
        try {
            const response = await createReferals(values);
            dispatch(setError({ status: true, type: 'success', message: response?.message }))
            getReferals(1, null)
            form.setFieldsValue({
                name: '',
                email: '',
                phone: '',
                referedBy: ''
            })
        } catch (error: any) {
            dispatch(setError({ status: true, type: 'error', message: error }))
        }
    }
    const formFields = [
         {
            label: 'Name',
            key: 'name',
            elementType: 'INPUT',
            onChangeField: () => {},
            required: true,
            disable: false,
            type: 'text',
            placeholder: 'Enter user Name',
            config: {
                rules: [{ required: true, message: 'Please Enter user Name' }],
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
            placeholder: 'Enter user Email',
            config: {
                rules: [{ required: true, message: 'Please Enter user Email' }],
            }
        },
        {
            label: 'Mobile',
            key: 'phone',
            elementType: 'INPUT',
            onChangeField: () => {},
            required: true,
            disable: false,
            type: 'number',
            placeholder: 'Enter user Mobile',
            config: {
                rules: [{ required: true, message: 'Please Enter user Mobile' }],
            }
        },
        {
            label: 'Refered By',
            key: 'referedBy',
            elementType: 'INPUT',
            onChangeField: () => {},
            required: true,
            disable: false,
            type: 'text',
            placeholder: 'Enter Refered By',
            config: {
                rules: [{ required: true, message: 'Please Enter Refered By' }],
            }
        },
    ]
  return (
    <div className='form-container__body'>
         <Form
            form={form}
            onFinish={createReferal}
            autoComplete="off"
            layout='vertical'
            className='form-container__form-body'
        >
            <Row
            >
                {
                    formFields.map((formItem, index) => (
                        <Col className="gutter-row" xl={24} sm={24} xs={24} key={index}>
                            <GenerateElements elementData={formItem} />
                        </Col>
                    ))
                }
            </Row>
            <Row justify={'end'}>
                <Col>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    </div>
  )
}

export default CreateReferal
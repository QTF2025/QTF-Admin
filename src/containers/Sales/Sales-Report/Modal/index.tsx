import { Button, Form, Modal } from 'antd'
import React, { useState, useEffect } from 'react'
import GenerateElements from '../../../../components/GenerateElements'
import { timeoptionsLables } from '../../constants'
import SalesService from '../../../../services/Sales.services'
import { useLocation } from 'react-router-dom'
import { setError } from '../../../../store/reducers'
import { useDispatch } from 'react-redux'

const fieldsData = [
        {
            label: 'Time Zone',
            key: 'timezone',
            elementType: 'SELECT',
            required: true,
            disable: false,
            options: timeoptionsLables,
            onChangeField: () => {},
            type: 'text',
            placeholder: 'Select Time zone',
            config: {
                rules: [{ required: true, message: 'Please Select Time zone' }],
            }
        },
        {
            label: 'Select Date',
            key: 'followUpDate',
            elementType: 'DATE_PICKER_DATE_TIME',
            onChangeField: () => {},
            required: true,
            disable: false,
            type: 'date',
            value: '',
            config: {
                rules: [{ required: false, message: 'Please Select Date!' }],
            }
        },
        {
            label: 'Comment',
            key: 'comment',
            elementType: 'INPUT',
            required: true,
            disable: false,
            onChangeField: () => {},
            type: 'text',
            placeholder: 'Enter Comment',
            config: {
                rules: [{ required: false, message: 'Please Enter Comment' }],
            }
        },
]
const FollowUpModal = ({ show, hideModal, page, refreshData, followUpData, updateFollowUpData }: any) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { createFollowUp } = SalesService;
    const location = useLocation()
    const dispatch = useDispatch()
    const { pathname } = location

    const create = async (values: any) => {
        try {
            setIsLoading(true)
            const copyValues = {...values}
            if(pathname === '/sales/followup-calls'){
                copyValues.followUpId = followUpData.id
            }
            const response = await createFollowUp(pathname === '/sales/followup-calls' ? followUpData.contact_id : followUpData.id, copyValues)
             dispatch(setError({ status: true, type: 'success', message: response?.message }))
            setIsLoading(false)
            hideModal()
            refreshData(page, null)
            updateFollowUpData(null)
        } catch (error: any) {
            setIsLoading(false)
            dispatch(setError({ status: true, type: 'error', message: error }))
        }
    }

  return (
    <>
    <Modal
        title={'Follow Up Note'}
        open={show}
        onCancel={() => {
            hideModal()
            updateFollowUpData(null)
        }}
        footer={() => <></>}
        className='followup__modal'
      >
        {
            followUpData === null ? (
                <h2>Please Select Follow Up User</h2>
            ) : (
                <Form
                    form={form}
                    onFinish={create}
                    className='form-container__form-body'
                    layout={'vertical'}
                >
                    {
                        fieldsData.map((formItem: any, i: number) => (
                                <GenerateElements elementData={formItem} index={i} key={i} />
                        ))
                    }
                    <Form.Item>
                        <Button type="primary" htmlType="submit" disabled={isLoading}>
                        Submit
                        </Button>
                    </Form.Item>
                </Form>
            )
        }
      </Modal>
    </>
  )
}

export default FollowUpModal
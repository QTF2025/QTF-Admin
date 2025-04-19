import { Button, Modal, Form } from 'antd'
import React, { useEffect, useState } from 'react'
import GenerateElements from '../../../components/GenerateElements';
import { setError } from '../../../store/reducers';
import { useDispatch } from 'react-redux';
import SalesService from '../../../services/Sales.services';

function EditUserModal({ showEditModal,toggleEditModal, editUser, currentPage, queryString, getSalesListData }: any) {
    const [form] = Form.useForm();
    const [isModified, setIsModified] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const dispatch = useDispatch();
    const { editLeadData } = SalesService;

    const fieldsData: any[] = [
        {
            label: 'Name',
            key: 'name',
            childKey: [],
            parentKey: [],
            elementType: 'INPUT',
            onChangeField: () => setIsModified(true),
            required: false,
            disable: false,
            type: 'text',
            config: {
                rules: [{ required: false, message: 'Please Enter Email!' }],
            }
        },
        {
            label: 'Email',
            key: 'email',
            childKey: [],
            parentKey: [],
            elementType: 'INPUT',
            onChangeField: () => setIsModified(true),
            required: false,
            disable: false,
            type: 'text',
            config: {
                rules: [{ required: false, message: 'Please Enter Email!' }],
            }
        },
        {
            label: 'Mobile',
            key: 'phone',
            childKey: [],
            parentKey: [],
            elementType: 'INPUT',
            onChangeField: () => setIsModified(true),
            required: false,
            disable: false,
            type: 'text',
            config: {
                rules: [{ required: false, message: 'Please Enter Mobile Number!' }],
            }
        },
    ]

    const submitEditUser = async (values: any) => {
       try {
            setIsLoading(true)
            if(editUser === null || (editUser && editUser?.id === null)){
                dispatch(setError({ status: true, type: 'error', message: 'Lead details not found' }))
                return;
            }
            const response: any = await editLeadData(editUser?.id, values)
            if(response){
                getSalesListData(currentPage, queryString)
                toggleEditModal(null)
                dispatch(setError({ status: true, type: 'success', message: `${editUser ? editUser?.name : 'User'} Details Updated Successfully!` }))
            }
            setIsLoading(false)
        } catch (err: any) {
            setIsLoading(false)
            dispatch(setError({ status: true, type: 'error', message: err }))
        }
    }

    useEffect(() => {
        if(editUser){
            const { phone_number, email , name} = editUser
            form.setFieldsValue({
                name: name || '',
                email: email || '',
                phone: phone_number || ''
            })
        }

        return () => {
            setIsLoading(false)
            setIsModified(false)
        }
    }, [editUser])

  return (
    <>
        <Modal
            title={'Edit User'}
            open={showEditModal}
            onCancel={() => toggleEditModal(null)}
            footer={() => <></>}
            className='form-container__form-body'
        >
            <hr />
            <div>
                <Form
                    form={form}
                    onFinish={submitEditUser}
                    className='form-container__form-body'
                    layout={true ? 'vertical' : 'horizontal'}
                >
                        {
                            fieldsData.map((formItem: any, i: number) => (
                                    <GenerateElements elementData={formItem} index={i} key={i} />
                            ))
                        }
                        <Form.Item>
                            <Button htmlType="button" onClick={() => toggleEditModal(null)}>
                            Cancel
                            </Button>
                            <Button disabled={!isModified || isLoading} type="primary" htmlType="submit">
                                {isLoading ? 'Submitting' : 'Submit'}
                            </Button>
                        </Form.Item>
                    </Form>
            </div>
        </Modal>
    </>
  )
}

export default EditUserModal
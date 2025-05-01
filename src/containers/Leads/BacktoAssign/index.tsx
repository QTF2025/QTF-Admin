import { Button, Col, Form, Modal, Row } from 'antd'
import React, { useMemo } from 'react'
import localStorageContent from '../../../utils/localstorage'
import { formLayout } from '../../../utils'
import GenerateElements from '../../../components/GenerateElements'
import { gutterBlobal } from '../Lead/constants'

function BackToAssign({ submitBackStep, setCurrentBackStepDep, showBackStepModal, setBackStepModal, onChangeSubmitBack }: any) {
    const userData = localStorageContent.getUserData()
    const [form] = Form.useForm();
    const depts = [                
        { label: 'Documents', value: 2 },
        // { label: 'Preparation', value: 3 },
        { label: 'Preparation', value: 4 },
        { label: 'Payments', value: 5 },
        { label: 'Filling', value: 6 },
    ];
    const endRange = depts.findIndex((item) => item.value === userData?.departmentId)
    const fieldsData = [
        {
            label: 'Department',
            key: 'deptId',
            elementType: 'SELECT',
            required: true,
            disable: false,
            options: depts.slice(0, endRange),
            onChangeField: onChangeSubmitBack,
            type: 'text',
            placeholder: 'Select Department',
            config: {
                rules: [{ required: true, message: 'Please Select Department' }],
            }
        },
        {
            label: 'Comment',
            key: 'comment',
            elementType: 'INPUT',
            onChangeField: onChangeSubmitBack,
            required: true,
            disable: false,
            type: 'text',
            placeholder: 'Enter Comment',
            config: {
                rules: [{ required: false, message: 'Please Enter Comment' }],
            }
        },
    ]

    const generateFormFields = useMemo(() => {
      let copyfields: any[] = [...fieldsData]
      if(userData?.role === '3' && (userData?.departmentId === 4 || userData?.departmentId === 5)){
        copyfields = copyfields.splice(0,3)
      }else{
        copyfields = copyfields.slice(0, 3)
      }

      return copyfields
    }, [])

  return (
    <>
        <Modal
            title={'Select Department'}
            open={showBackStepModal}
            onCancel={() => {
              setCurrentBackStepDep(null)
              setBackStepModal(false)
            }}
            footer={() => <></>}
            className='user-details__backstep-modal'
          >
            <Form
            {...formLayout}
            form={form}
            onFinish={submitBackStep}
            className='form-container__form-body'
            layout={'vertical'}
            style={{width: '100%'}}
        >
           <Row
                gutter={gutterBlobal}
            >
                {
                    generateFormFields.map((formItem: any, index: number) => (
                        <Col className="gutter-row" xl={24} sm={24} xs={24} key={index}>
                            <GenerateElements elementData={formItem} />
                        </Col>
                    ))
                }
            </Row>
            <Row justify={'end'}>
                <Col>
                    <Form.Item>
                        <Button onClick={() => {
                            setBackStepModal(false)
                        }}>
                            Cancel
                        </Button>
                    </Form.Item>
                </Col>
                <Col>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
            </Form>
          </Modal>
    </>
  )
}

export default BackToAssign
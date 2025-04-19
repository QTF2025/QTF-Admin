import React, { useState, useEffect } from 'react'
import localStorageContent from '../../../utils/localstorage'
import { Col, Row, Form, Button, Collapse, Table } from 'antd'
import { gutterBlobal } from '../Lead/constants'
import GenerateElements from '../../../components/GenerateElements'
import TaxConfiguration from '../../TaxConfiguration'
import LeadService from '../../../services/Lead.services'
import { useDispatch } from 'react-redux'
import { initGetLead } from '../../../store/actions/creators'
import useIsMobile from '../../../utils/isMobile'
import { setError } from '../../../store/reducers'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
const { Panel } = Collapse;

const ReviewSection = ({ leadData }: any) => {
    const [form] = Form.useForm()
    const [reviewList, setReviewList] = useState<any[]>([])
    const [readOnly, setReadOnly] = useState<boolean>(false)
    const { updateServiceCharge, getServiceChargeList } = LeadService
    const dispatch = useDispatch()
    const userData = localStorageContent.getUserData()
    const isMobile = useIsMobile()
    const navigate = useNavigate()

    const onGetServiceChargeList = async () => {
        try {
            if(leadData === null){
                return;
            }
            const response = await getServiceChargeList(leadData?.lead_id)
            if(response){
                setReviewList(response.data)
            }
        } catch (err: any) {
            dispatch(setError({ status: true, type: 'error', message: err }))
        }
    }

    const onSubmitServiceCharge = async (values: any) => {
        try {
            if(leadData === null){
                return;
            }
            const response = await updateServiceCharge(leadData?.lead_id, values)
            if(response){
                dispatch(setError({ status: true, type: 'success', message: response?.message }))
                if(values.isReady === '2'){
                    navigate('/leads')
                }else{
                    dispatch(initGetLead(leadData?.lead_id))
                }
            }
        } catch (err: any) {
            dispatch(setError({ status: true, type: 'error', message: err }))
        }
    }

    const fields: any[] = [
        {
            label: 'Service Charge',
            key: 'serviceCharge',
            elementType: 'INPUT',
            onChangeField: () => {},
            required: true,
            disable: readOnly,
            type: 'number',
            placeholder: 'Enter Service Charge',
            config: {
                rules: [{ required: false, message: 'Please Enter Service Charge' }],
            }
        },
        {
        label: 'Ready to pay',
        key: 'isReady',
        elementType: 'SELECT',
        onChangeField: () => {},
        options: [
            {
            value: '1',
            label: "Paid",
            },
            {
            value: '2',
            label: "Walk Out",
            },
            {
            value: '3',
            label: "Awaiting",
            },
            {
            value: '4',
            label: "Pending Docs",
            }
        ],
        required: true,
        disable: false,
        type: 'string',
        placeholder: 'Select Ready to pay option',
        config: {
            rules: [{ required: false, message: 'Please Enter Ready to pay option' }],
        }
    },
     {
            label: 'Comment',
            key: 'comment',
            elementType: 'INPUT',
            onChangeField: () => {},
            required: true,
            disable: readOnly,
            type: 'text',
            placeholder: 'Enter Comment',
            config: {
                rules: [{ required: false, message: 'Please Enter Comment' }],
            }
        },
    ]

    const columns: any[] = [
         {
            title: 'Service Charge',
            dataIndex: 'service_charge',
            key: 'service_charge',
        },
         {
            title: 'Comment',
            dataIndex: 'comment',
            key: 'comment',
            render: (value: any) => <>{value ? value : '--'}</>
        },
        {
            title: 'Status',
            render: (data: any) => {
                let currentStatus = ''
                switch(true){
                case data.status === null:
                    currentStatus = 'Draft'
                    break;
                case data.status === '1':
                    currentStatus = 'Ready to pay'
                    break;
                case data.status === '2':
                    currentStatus = 'Walkout'
                    break;
                case data.status === '3':
                    currentStatus = 'Not Ready to pay'
                    break;
                    case data.status === '4':
                    currentStatus = 'Pending Docs'
                    break;
                default:
                    currentStatus = '--'
                }

                return <>{currentStatus}</>
            }
        },
        {
            title: 'Created On',
            dataIndex: 'created_dt',
            key: 'created_dt',
            render: (value: any) => <>{value ? dayjs(value).format('DD/MM/YYYY') : '--'}</>
        },
    ]

    useEffect(() => {
        
        if(leadData){
            const { service_charge, client_payment_status, service_charge_comment } = leadData;
            if(service_charge){
                form.setFieldsValue({
                    serviceCharge: service_charge,
                    isReady: client_payment_status,
                    comment: service_charge_comment 
                })
            }
            if(userData && userData?.departmentId === 5 && userData?.role === "3"){
                onGetServiceChargeList()
            }
        }
    }, [leadData])

  return (
    <div>
          {(userData?.role === "2" || userData?.role === "3") && (userData?.departmentId === 4 || userData?.departmentId === 5) &&
            <>
             <Collapse accordion>
                <Panel header={'Generate Tax Calculation'} key={0}>
                    <TaxConfiguration section={'LEAD'} leadData={leadData} showHeader={false} />
                  </Panel>
            </Collapse>
                {
                    userData?.departmentId === 5 && (
                        <Form
                            form={form}
                            onFinish={onSubmitServiceCharge}
                            autoComplete="off"
                            layout={isMobile ? 'vertical' : 'horizontal'}
                            style={{marginTop: 10}}
                        >
                            <Row
                                gutter={gutterBlobal}
                            >
                                {
                                    fields.map((formItem: any, index: number) => (
                                        <Col className="gutter-row" xl={6} sm={12} xs={24} key={index}>
                                            <GenerateElements elementData={formItem} />
                                        </Col>
                                    ))
                                }
                                {
                                    !readOnly && (
                                        <Col className="gutter-row" xl={6} sm={12} xs={24}>
                                            <Form.Item>
                                            {userData?.role == "3" && leadData?.department_id == userData.departmentId && 
                                            <Button type="primary" htmlType="submit">
                                                    Submit
                                                </Button>
                                            }
                                            </Form.Item>
                                        </Col>
                                    )
                                }
                            </Row>
                        </Form>
                    )
                }
                {leadData?.selected_review && <p className="selectdfiles" style={{margin: '10px 0'}}><b>User Selected Review:</b> <a target="_blank" href={leadData.selected_review} rel="noreferrer">Review</a></p>}
                {userData && userData?.departmentId === 5 && userData?.role === "3" && (
                    <Collapse accordion style={{marginBottom: 15}}>
                        <Panel header={'Service Charge Comments'} key={0}>
                            <Table bordered columns={columns} dataSource={reviewList} />
                        </Panel>
                    </Collapse>
                )}
            </>
        }   
    </div>
  )
}

export default ReviewSection
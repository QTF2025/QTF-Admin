import React, { useEffect, useState } from 'react'
import { Form, Button, Row, Col } from "antd";
import ContentHeader from '../../components/ContentHeader'
import GenerateElements from '../../components/GenerateElements';
import { useDispatch } from 'react-redux';
import { setError } from '../../store/reducers';
import './styles.scss'
import TaxConfigurationService from '../../services/TaxConfiguration.services';
import Skeleton from '../../components/Skeletons';
import { initGetLead } from '../../store/actions/creators';
import localStorageContent from '../../utils/localstorage';

const formLayout = {
    labelCol: { span: 20 },
    wrapperCol: { span: 20 },
}

const glutterLocal = {
            xs: 0,
            sm: 12,
            xl: 24,
        }

const TaxConfiguration = ({ section, leadData, showHeader }: any) => {
    const [form] = Form.useForm();
    const [enableTaxPaidAmount, setEnableTaxPaidAmount] = useState<boolean>(false)
    const [readOnly, setReadOnly] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { createTaxConfiguration, getTaxConfiguration, updateLeadTaxConfiguration } = TaxConfigurationService
    const dispatch = useDispatch();
    const userData = localStorageContent.getUserData()

    const fetchTaxConfig =  async () => {
        try {
            setIsLoading(true)
            const response = await getTaxConfiguration()
            if(response && response?.data){
                const {
                    amended_tax_return,
                    election_6013,
                    fatca,
                    fbar,
                    federal,
                    fica,
                    itin,
                    k1s,
                    local,
                    misc_service,
                    non_resident,
                    premium_client_services,
                    schedule_c,
                    schedule_d,
                    schedule_e,
                    state,
                } = response?.data;

                form.setFieldsValue({
                    Election6013: election_6013 || 0,
                    amendedTaxReturn: amended_tax_return || 0,
                    fatca: fatca || 0,
                    fbar: fbar || 0,
                    federal: federal || 0,
                    fica: fica || 0,
                    itin: itin || 0,
                    k1s: k1s || 0,
                    local: local || 0,
                    miscService: misc_service || 0,
                    nonResident: non_resident || 0,
                    premiumClientServices: premium_client_services || 0,
                    scheduleC: schedule_c || 0,
                    scheduleD: schedule_d || 0,
                    scheduleE: schedule_e || 0,
                    state: state || 0,
                })
            }
            setIsLoading(false)
        } catch (err: any) {
            setIsLoading(false)
            dispatch(setError({ status: true, type: 'error', message: err }))
        }
    }

    const onFinish =  async (values: any) => {
        try {
            setIsLoading(true)
            if(section === 'LEAD' && leadData){
                const copyValues = {...values}
                delete copyValues.actual_amount
                const response = await updateLeadTaxConfiguration(leadData?.lead_id, copyValues)
                if(response){
                    dispatch(setError({ status: true, type: 'success', message: response?.message }))
                    dispatch(initGetLead(leadData?.lead_id))
                }
            }else{
                const response = await createTaxConfiguration(values)
                if(response){
                    dispatch(setError({ status: true, type: 'success', message: response?.message }))
                    fetchTaxConfig()
                }
            }
            setIsLoading(false)
        } catch (err: any) {
            setIsLoading(false)
            dispatch(setError({ status: true, type: 'error', message: err }))
        }
    }

    const fieldsData = [
      {
            label: 'Federal',
            key: 'federal',
            elementType: 'INPUT',
            onChangeField: () => {},
            required: true,
            disable: readOnly,
            type: 'number',
            placeholder: 'Enter Federal',
            config: {
                rules: [{ required: true, message: 'Please Enter Federal' }],
            }
        },
        {
            label: 'State',
            key: 'state',
            elementType: 'INPUT',
            onChangeField: () => {},
            required: true,
            disable: readOnly,
            type: 'number',
            placeholder: 'Enter State',
            config: {
                rules: [{ required: true, message: 'Please Enter State' }],
            }
        },
        {
            label: 'Local',
            key: 'local',
            elementType: 'INPUT',
            onChangeField: () => {},
            required: true,
            disable: readOnly,
            type: 'number',
            placeholder: 'Enter Local',
            config: {
                rules: [{ required: true, message: 'Please Enter Local' }],
            }
        },
        {
            label: 'Non-Resident (Form 1040NR)',
            key: 'nonResident',
            elementType: 'INPUT',
            onChangeField: () => {},
            required: true,
            disable: readOnly,
            type: 'number',
            placeholder: 'Enter Non-Resident (Form 1040NR)',
            config: {
                rules: [{ required: true, message: 'Please Enter Non-Resident (Form 1040NR)' }],
            }
        },
        {
            label: 'Amended Tax Return (Form 1040X)',
            key: 'amendedTaxReturn',
            elementType: 'INPUT',
            onChangeField: () => {},
            required: true,
            disable: readOnly,
            type: 'number',
            placeholder: 'Enter Amended Tax Return (Form 1040X)',
            config: {
                rules: [{ required: true, message: 'Please Enter Amended Tax Return (Form 1040X)' }],
            }
        },
        {
            label: 'ITIN',
            key: 'itin',
            elementType: 'INPUT',
            onChangeField: () => {},
            required: true,
            disable: readOnly,
            type: 'number',
            placeholder: 'Enter ITIN',
            config: {
                rules: [{ required: true, message: 'Please Enter ITIN' }],
            }
        },
        {
            label: '6013 Election',
            key: 'Election6013',
            elementType: 'INPUT',
            onChangeField: () => {},
            required: true,
            disable: readOnly,
            type: 'number',
            placeholder: 'Enter 6013 Election',
            config: {
                rules: [{ required: true, message: 'Please Enter 6013 Election' }],
            }
        },
        {
            label: 'Schedule A',
            key: 'fatca',
            elementType: 'INPUT',
            onChangeField: () => {},
            required: true,
            disable: readOnly,
            type: 'number',
            placeholder: 'Enter FATCA',
            config: {
                rules: [{ required: true, message: 'Please Enter FATCA' }],
            }
        },
        {
            label: 'Schedule-D',
            key: 'scheduleD',
            elementType: 'INPUT',
            onChangeField: () => {},
            required: true,
            disable: readOnly,
            type: 'number',
            placeholder: 'Enter Schedule-D',
            config: {
                rules: [{ required: true, message: 'Please Enter Schedule-D' }],
            }
        },
        {
            label: 'Schedule-E',
            key: 'scheduleE',
            elementType: 'INPUT',
            onChangeField: () => {},
            required: true,
            disable: readOnly,
            type: 'number',
            placeholder: 'Enter Schedule-E',
            config: {
                rules: [{ required: true, message: 'Please Enter Schedule-E' }],
            }
        },
        {
            label: 'Schedule-C',
            key: 'scheduleC',
            elementType: 'INPUT',
            onChangeField: () => {},
            required: true,
            disable: readOnly,
            type: 'number',
            placeholder: 'Enter Schedule-C',
            config: {
                rules: [{ required: true, message: 'Please Enter Schedule-C' }],
            }
        },
        {
            label: "K1's",
            key: 'k1s',
            elementType: 'INPUT',
            onChangeField: () => {},
            required: true,
            disable: readOnly,
            type: 'number',
            placeholder: "Enter K1's",
            config: {
                rules: [{ required: true, message: "Please Enter K1's" }],
            }
        },
        {
            label: 'FBAR',
            key: 'fbar',
            elementType: 'INPUT',
            onChangeField: () => {},
            required: true,
            disable: readOnly,
            type: 'number',
            placeholder: 'Enter FBAR',
            config: {
                rules: [{ required: true, message: 'Please Enter FBAR' }],
            }
        },
        {
            label: 'FATCA',
            key: 'fica',
            elementType: 'INPUT',
            onChangeField: () => {},
            required: true,
            disable: readOnly,
            type: 'number',
            placeholder: 'Enter FATCA',
            config: {
                rules: [{ required: true, message: 'Please Enter FATCA' }],
            }
        },
        {
            label: 'Premium Client Services',
            key: 'premiumClientServices',
            elementType: 'INPUT',
            onChangeField: () => {},
            required: true,
            disable: readOnly,
            type: 'number',
            placeholder: 'Enter Premium Client Services',
            config: {
                rules: [{ required: true, message: 'Please Enter Premium Client Services' }],
            }
        },
        {
            label: 'Misc. Servic',
            key: 'miscService',
            elementType: 'INPUT',
            onChangeField: () => {},
            required: true,
            disable: readOnly,
            type: 'number',
            placeholder: 'Enter Misc. Servic',
            config: {
                rules: [{ required: true, message: 'Please Enter Misc. Servic' }],
            }
        },
        {
            label: 'Actual Amount',
            key: 'actual_amount',
            elementType: 'INPUT',
            onChangeField: () => {},
            required: true,
            disable: true,
            type: 'number',
            placeholder: 'Actual Amount',
            config: {
                rules: [{ required: false, message: 'Actual Amount' }],
            }
        },
        {
            label: 'Lead Type',
            key: 'leadType',
            elementType: 'SELECT',
            onChangeField: () => {},
            options: [
                {
                value: '1',
                label: "E-Filing",
                },
                {
                value: '2',
                label: "Paper-Filing",
                }
            ],
            required: true,
            disable: readOnly,
            type: 'string',
            placeholder: 'Select Lead Type',
            config: {
                rules: [{ required: true, message: 'Please Enter Lead Type' }],
            }
        },
        {
            label: 'Select Tax Paid',
            key: 'leadPayableOption',
            elementType: 'SELECT',
            onChangeField: () => setEnableTaxPaidAmount(true),
            options: [
                {
                value: '1',
                label: "Due",
                },
                {
                value: '2',
                label: "Refund",
                }
            ],
            required: true,
            disable: readOnly,
            type: 'string',
            placeholder: 'Select Lead Type',
            config: {
                rules: [{ required: true, message: 'Please Enter Lead Type' }],
            }
        },
        {
            label: 'Amount',
            key: 'leadPayableAmount',
            elementType: 'INPUT',
            onChangeField: () => {},
            required: true,
            disable: enableTaxPaidAmount ? false : true,
            type: 'number',
            placeholder: 'Amount',
            config: {
                rules: [{ required: false, message: 'Amount' }],
            }
        },
    ]

    useEffect(() => {
        if(section === 'LEAD'){
            if(leadData){
                const {
                    amended_tax_return_count,
                    election_6013_count,
                    fatca_count,
                    fbar_count,
                    federal_count,
                    fica_count,
                    itin_count,
                    k1s_count,
                    local_count,
                    misc_service_count,
                    non_resident_count,
                    premium_client_services_count,
                    schedule_c_count,
                    schedule_d_count,
                    schedule_e_count,
                    state_count,
                    actual_amount,
                    lead_type,
                    lead_payable_option,
                    lead_payable_amount
                } = leadData;

                form.setFieldsValue({
                    Election6013: election_6013_count || 0,
                    amendedTaxReturn: amended_tax_return_count || 0,
                    fatca: fatca_count || 0,
                    fbar: fbar_count || 0,
                    federal: federal_count || 0,
                    fica: fica_count || 0,
                    itin: itin_count || 0,
                    k1s: k1s_count || 0,
                    local: local_count,
                    miscService: misc_service_count || 0,
                    nonResident: non_resident_count || 0,
                    premiumClientServices: premium_client_services_count || 0,
                    scheduleC: schedule_c_count || 0,
                    scheduleD: schedule_d_count || 0,
                    scheduleE: schedule_e_count || 0,
                    state: state_count || 0,
                    actual_amount: actual_amount || 0,
                    leadType: lead_type,
                    leadPayableOption: lead_payable_option,
                    leadPayableAmount: lead_payable_amount?.toString()
                })
            }
            if(userData && leadData && (userData?.departmentId === 5 || leadData?.lead_status === "6"|| leadData?.department_id !== userData.departmentId)){
                setReadOnly(true)
            }
        }
        if(section === 'TAX_CONFIG'){
            fetchTaxConfig()
        }
        if(section === 'TAX-CONFIG-VIEW'){
            setReadOnly(true)
            if(leadData){
                const {
                    amended_tax_return_count,
                    election_6013_count,
                    fatca_count,
                    fbar_count,
                    federal_count,
                    fica_count,
                    itin_count,
                    k1s_count,
                    local_count,
                    misc_service_count,
                    non_resident_count,
                    premium_client_services_count,
                    schedule_c_count,
                    schedule_d_count,
                    schedule_e_count,
                    state_count,
                    actual_amount,
                    lead_type,
                    lead_payable_option,
                    lead_payable_amount
                } = leadData;

                form.setFieldsValue({
                    Election6013: election_6013_count || 0,
                    amendedTaxReturn: amended_tax_return_count || 0,
                    fatca: fatca_count || 0,
                    fbar: fbar_count || 0,
                    federal: federal_count || 0,
                    fica: fica_count || 0,
                    itin: itin_count || 0,
                    k1s: k1s_count || 0,
                    local: local_count || 0,
                    miscService: misc_service_count || 0,
                    nonResident: non_resident_count || 0,
                    premiumClientServices: premium_client_services_count || 0,
                    scheduleC: schedule_c_count || 0,
                    scheduleD: schedule_d_count || 0,
                    scheduleE: schedule_e_count || 0,
                    state: state_count || 0,
                    actual_amount: actual_amount || 0,
                    leadType: lead_type,
                    leadPayableOption: lead_payable_option,
                    leadPayableAmount: lead_payable_amount?.toString()
    
                    
                })
            }
        }
    }, [leadData])

  return (
    <div className='form-container'>
       {
        showHeader && (
            <ContentHeader 
                showBtn={false}
                redirectPath=''
                buttonText=''
                title={`Tax Configuration`}
                showIcon={false}
            />
        )
       }
        <div className={`form-container__body ${section === 'LEAD' ? 'rounded' : ''}`}>
         {
            isLoading ? (
                <Row
                    gutter={glutterLocal}
                >
                    {
                    new Array(13).fill('null').map((_: any, index: number) => (
                        <Col className="gutter-row" xl={4} sm={12} xs={24} key={index}>
                        <Skeleton shape="rectangle" styles={{height: '20px', width: '150px'}} />
                        <Skeleton shape="rectangle" />
                        </Col>
                    ))
                    }
                </Row>
            ): (
                
                    <Form
                        {...formLayout}
                        form={form}
                        onFinish={onFinish}
                        layout={'vertical'}
                    >
                    <Row
                        gutter={glutterLocal}
                    >
                        {
                            fieldsData.slice(0, section === 'LEAD' ? 20 : 16).map((formItem: any, index: number) => (
                                <Col className="gutter-row" xl={section === 'LEAD' ? 6 : 4} sm={12} xs={24} key={index}>
                                    <GenerateElements elementData={formItem} />
                                </Col>
                            ))
                        }
                    </Row>
                    {
                        section !== 'TAX-CONFIG-VIEW' && !readOnly && (
                            <Row justify={'end'}>
                                <Col>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                    Submit
                                    </Button>
                                </Form.Item>
                                </Col>
                            </Row>
                        )
                    }
                    
                    </Form>
            )
        }
        </div>
    </div>
  )
}

export default TaxConfiguration
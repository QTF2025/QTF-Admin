import React, { useState, useEffect, useMemo } from 'react'
import { Col, Row, Form, Button, Checkbox } from "antd";
import { gutterBlobal } from '../constants';
import GenerateElements from '../../../../components/GenerateElements';
import Skeleton from '../../../../components/Skeletons';
import { useDispatch, useSelector } from 'react-redux';
import localStorageContent from '../../../../utils/localstorage';
import { IInitialState } from '../../../../store/reducers/models';
import { addMedicalExpenses, initUpdateVerifyStatus } from '../../../../store/actions/creators';
import { setError, setSections } from '../../../../store/reducers';
import { yesNoOptions } from '../GeneralInformation/constants';
import { emptyMedicalContext } from './constants'
import { isEmptyKeys } from '../../../../utils';

function MedicalExpenses() {
    const [form] = Form.useForm()
    const [isReadOnly, setIsReadOnly] = useState<boolean>(false)
    const [filterFields, setfilterFields] = useState([])
    const [medicalExpensesObj, setMedicalExpensesObj] = useState<any>({...emptyMedicalContext})
    const [showFields, setShowFields] = useState<any>({
        medicalExpense: false,
        medicalPurposes: false,
        form1098: false,
        stateLocalTaxes: false,
        realEstateTaxes: false,
    })
    const localStoreData = localStorageContent.getUserData()
    const gloablStore = useSelector((state: any) => state.store)
    const { isleadDetailsLoading, leadData }: IInitialState = gloablStore
    const dispatch = useDispatch()

    const onChangeMedicalExpenses = (value: any, name: any) => {
        if(name === 'form1098'){
            setMedicalExpensesObj((prev: any) => {
                return {
                    ...prev,
                    [name]: value.files[0]
                }
            })
        }else{
            setMedicalExpensesObj((prev: any) => {
                return {
                    ...prev,
                    [name]: value
                }
            })
        }
    }

    const onChangeDropDown = (key: string, status: boolean) => {
        if(key === 'medicalDentalExpenses'){
            setShowFields((prev: any) => {
                let copyValues = {...prev}
                copyValues['medicalExpense'] = status;
                copyValues['medicalPurposes'] = status
                return copyValues
            })
        }else{
            setShowFields((prev: any) => {
                let copyValues = {...prev}
                copyValues['form1098'] = status;
                copyValues['realEstateTaxes'] = status;
                copyValues['stateLocalTaxes'] = status;
                return copyValues
            })
        }
    }
    

       const formFields: any = useMemo(() => {
        return [
        {
            label: 'Medical and Dental Expenses',
            key: 'medicalDentalExpenses',
            childKey: ['medicalExpense', 'medicalPurposes'],
            parentKey: [],
            elementType: 'SELECT',
            onChangeField: (value: any, name: any, index: any) => {
                onChangeDropDown('medicalDentalExpenses', value === '1')
                onChangeMedicalExpenses(value, name)
            },
            required: true,
            options: yesNoOptions,
            disable: isReadOnly,
            type: 'text',
            config: {
                rules: [{ required: true, message: 'Please Select Option' }],
            }
        },
        {
            label: 'Total Medical Expenses (Out Of Pocket)',
            key: 'medicalExpense',
            childKey: [],
            parentKey: ['medicalDentalExpenses'],
            elementType: 'INPUT',
            onChangeField: onChangeMedicalExpenses,
            required: true,
            disable: isReadOnly,
            type: 'number',
            placeholder: 'Enter Medical Expenses',
            config: {
                rules: [{ required: true, message: 'Please Enter Medical Expenses' }],
            }
        },
        {
            label: 'No. Of Miles Driven for Medical Purposes?',
            key: 'medicalPurposes',
            childKey: [],
            parentKey: ['medicalDentalExpenses'],
            elementType: 'INPUT',
            onChangeField: onChangeMedicalExpenses,
            required: true,
            disable: isReadOnly,
            type: 'number',
            placeholder: 'Enter Medical Purposes',
            config: {
                rules: [{ required: true, message: 'Please Enter Medical Purposes' }],
            }
        },
        // Home Mortgage Selection
        {
            label: 'Home Mortgage in US during the tax year? (Form 1098)',
            key: 'homeMortgage',
            childKey: ['form1098','stateLocalTaxes', 'realEstateTaxes'],
            parentKey: [],
            elementType: 'SELECT',
            onChangeField: (value: any, name: any, index: any) => {
                const shouldShowFields = value === '1';
                console.log('Home Mortgage Selected:', value, 'Show Fields:', shouldShowFields);
                onChangeDropDown('form1098', shouldShowFields);
                onChangeDropDown('realEstateTaxes', shouldShowFields);
                onChangeDropDown('stateLocalTaxes', shouldShowFields);
                onChangeMedicalExpenses(value, name);
            },
            required: true,
            options: yesNoOptions,
            disable: isReadOnly,
            type: 'text',
            config: {
                rules: [{ required: true, message: 'Please Select an option.' }],
            },
        },

        // Form 1098 (File Input)
        {
            label: '(Form 1098)',
            key: 'form1098',
            childKey: [],
            parentKey: ['homeMortgage'],
            elementType: 'INPUT_FILE_TOOLTIP',
            toolTiptext: '',
            onChangeField: onChangeMedicalExpenses,
            required: true,
            value: medicalExpensesObj.form1098 ? medicalExpensesObj.form1098 : '',
            disable: isReadOnly,
            type: 'file',
            config: {
                rules: [{ required: false, message: 'Please Upload Form 1098' }],
            },
        },

        // Real Estate Taxes (Text Input)
        {
            label: 'Real Estate Taxes',
            key: 'realEstateTaxes',
            childKey: [],
            parentKey: ['homeMortgage'],
            elementType: 'INPUT',
            onChangeField: onChangeMedicalExpenses,
            required: true,
            disable: isReadOnly,
            type: 'text',
            config: {
                rules: [{ required: false, message: 'Please Enter Real Estate Taxes' }],
            },
        },

        // State and Local Personal Property Taxes (Text Input)
        {
            label: 'State and Local Personal Property Taxes',
            key: 'stateLocalTaxes',
            childKey: [],
            parentKey: ['homeMortgage'],
            elementType: 'INPUT',
            onChangeField: onChangeMedicalExpenses,
            required: true,
            disable: isReadOnly,
            type: 'text',
            config: {
                rules: [{ required: false, message: 'Please Enter Property Taxes' }],
            },
        },
     
        {
            label: 'Have You Contributed To Charity?',
            key: 'contributedCharity',
            childKey: [],
            parentKey: [],
            elementType: 'INPUT',
            onChangeField: onChangeMedicalExpenses,
            required: true,
            disable: isReadOnly,
            type: 'text',
            config: {
                rules: [{ required: false, message: 'Please Enter Contributed To Charity' }],
            }
        },
        ]
    }, [leadData, medicalExpensesObj, isReadOnly])

    const onSubmitMedicalIncome = (values: any) => {
        //const copyValues = {...medicalExpensesObj}
        let { realEstateTaxes, stateLocalTaxes, contributedCharity } = medicalExpensesObj;
        let copyValues = {...medicalExpensesObj, realEstateTaxes: realEstateTaxes ? realEstateTaxes : 0, stateLocalTaxes: stateLocalTaxes ? stateLocalTaxes : 0, contributedCharity : contributedCharity ? contributedCharity : 0}
        // return
        if(copyValues?.medicalDentalExpenses === '0'){
            delete copyValues?.medicalExpense
            delete copyValues?.medicalPurposes
        }

        if(copyValues?.homeMortgage === '0'){
            delete copyValues?.form1098
        }

        let isValidDetails = true;
        isValidDetails = isEmptyKeys(copyValues, 'ALL',[]);

        if(!isValidDetails){
            dispatch(setError({ status: true, type: 'error', message: 'Form validation Error' }))
            return
        }
        
        if(typeof copyValues?.form1098 === 'string' && copyValues?.form1098.length > 5){
            delete copyValues.form1098
        }
        const keys = Object.keys(copyValues)

        const formData = new FormData()

        keys.forEach((key: any) => {
            formData.append(key, copyValues[key])
        })
        dispatch(addMedicalExpenses(formData, leadData?.lead_id))
    }

     const submitVerifyStatus = (e: any) => {
        if(leadData !== null){
            let obj = {
                verifyMedicalExpenses: e.target.checked ? "1" : '0'
            }
            dispatch(initUpdateVerifyStatus(leadData?.lead_id, obj))
        }
    }

        useEffect(() => {
        let conditionalKeys = Object.keys(showFields)
        let existingKeys = filterFields.map((field: any) => field.key)
        conditionalKeys.forEach((fieldKey: any) => {
            if(showFields[fieldKey]){
                existingKeys.push(fieldKey)
            }else{
                existingKeys = existingKeys.filter((key: any) => key !== fieldKey)
            }
        })
        setfilterFields(formFields.filter((field: any) => existingKeys.includes(field.key)))
    }, [showFields])
    
    useEffect(() => {
        if(leadData && Object.keys(leadData).length > 0 && !Array.isArray(leadData)){
            const { medicalExpenses } = leadData;
            if(Object.keys(medicalExpenses).length > 0 && medicalExpenses){
                const {
                    medicalDentalExpenses,
                    homeMortgage,
                    form1098,
                    medicalExpense,
                    medicalPurposes,
                    realEstateTaxes,
                    stateLocalTaxes,
                    contributedCharity
                } = medicalExpenses;

                const yesNoElements = ['medicalDentalExpenses', 'homeMortgage']
                const residentData: any = {
                    medicalDentalExpenses: medicalDentalExpenses || '0',
                    homeMortgage: homeMortgage || '0'
                }
                let residentKeys = leadData ? Object.keys(residentData) : []
                if(residentKeys.length > 0){
                    setfilterFields(formFields.filter((field: any) => (field?.parentKey.length > 0 && yesNoElements.includes(field.parentKey[0]) && residentData[field?.parentKey[0]] === '1') || field?.parentKey.length === 0))
                }

                setShowFields({
                    medicalExpense: medicalDentalExpenses === '1',
                    medicalPurposes: medicalDentalExpenses === '1',
                    form1098: homeMortgage === '1',
                })

                setMedicalExpensesObj({
                    medicalDentalExpenses,
                    homeMortgage,
                    form1098,
                    medicalExpense,
                    medicalPurposes,
                    realEstateTaxes,
                    stateLocalTaxes,
                    contributedCharity
                })
                    
                form.setFieldsValue({
                    medicalDentalExpenses,
                    homeMortgage,
                    form1098,
                    medicalExpense,
                    medicalPurposes,
                    realEstateTaxes,
                    stateLocalTaxes,
                    contributedCharity
                })
            }

             if(localStoreData){
                setIsReadOnly(!localStoreData?.leadEdit)
            }
        }else{
            setfilterFields(formFields.filter((field: any) => field?.parentKey.length === 0))
        }
    }, [leadData])

  return (
    <div>
          {
              isleadDetailsLoading ? (
                  <>
                      <Row
                          gutter={gutterBlobal}
                      >
                          {
                              new Array(12).fill('null').map((_: any, index: number) => (
                                  <Col className="gutter-row" xl={6} sm={12} xs={24} key={index}>
                                      <Skeleton shape="rectangle" styles={{ height: '20px', width: '150px' }} />
                                      <Skeleton shape="rectangle" />
                                  </Col>
                              ))
                          }
                      </Row>
                  </>
              ) : (
                  <>
                      <Form
                          form={form}
                          onFinish={onSubmitMedicalIncome}
                          onFinishFailed={() => { }}
                          autoComplete="off"
                          layout='vertical'
                      >
                          <Row
                              gutter={gutterBlobal}
                          >
                              {
                                  filterFields.map((formItem: any, index: number) => (
                                      <Col className="gutter-row" xl={6} sm={12} xs={24} key={index}>
                                          <GenerateElements elementData={formItem} />
                                      </Col>
                                  ))
                              }
                          </Row>
                          {
                            !isReadOnly && (
                                <Row justify={'end'}>
                                    <Col>
                                        <Form.Item>
                                        {localStoreData?.role == "3" &&
                                         ((leadData?.department_id == localStoreData.departmentId) || leadData === null || leadData?.assigned_agent == localStoreData.userId) &&                                   
                                            <Button disabled={isReadOnly} type="primary" htmlType="submit">
                                                Submit
                                            </Button>
                                        }
                                            {
                                                    false && localStoreData && localStoreData.departmentId !== 1 && (
                                                        <span className="mx-4">
                                                            <Checkbox disabled={leadData ? isReadOnly : true} checked={leadData && leadData?.medical_expenses_verified === '1'} onChange={submitVerifyStatus}>Verify</Checkbox>
                                                            <Checkbox disabled={leadData ? isReadOnly : true} onChange={() => dispatch(setSections('Medical Expenses'))}>Comment</Checkbox>
                                                        </span>
                                                    )
                                                }
                                        </Form.Item>
                                    </Col>
                                </Row>
                            )
                          }
                      </Form>
                  </>
              )
          }
    </div>
  )
}

export default MedicalExpenses
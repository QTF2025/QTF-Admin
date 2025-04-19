import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { Col, Row, Form, Button, Checkbox } from "antd";
import { gutterBlobal } from '../constants';
import GenerateElements from '../../../../components/GenerateElements';
import Skeleton from '../../../../components/Skeletons';
import localStorageContent from '../../../../utils/localstorage';
import { useDispatch, useSelector } from 'react-redux';
import { IInitialState } from '../../../../store/reducers/models';
import { addIncomeInformation, initUpdateVerifyStatus } from '../../../../store/actions/creators';
import { employmentIncomes, investmentIncomes, rentalIncomes, retirementIncomes, salesAssets, selfEmploymentIncomes } from './constants';
import { setSections } from '../../../../store/reducers';

function IncomeInformation() {
    const [form] = Form.useForm()
    const [isReadOnly, setIsReadOnly] = useState<boolean>(false)
    const gloablStore = useSelector((state: any) => state.store)
    const { isleadDetailsLoading, leadData }: IInitialState = gloablStore
    const dispatch = useDispatch()
    const localUserData = localStorageContent.getUserData();
    
    const onSubmitIncomeInformation = (values: any) => {
        console.log('values', values)
        // const copyValues = {...values}
        // const keys = Object.keys(values)
        // keys.forEach((k: any) => {
        //     if(!isNaN(Number(copyValues[k]))){
        //         copyValues[k] = Number(copyValues[k])
        //     }
        // })
        const havingValues = Object.fromEntries(
            Object.entries(values).filter(([_, value]) => value !== null)
          );
        dispatch(addIncomeInformation(havingValues, leadData.lead_id))
    }

    const formFields: any = useMemo(() => {
        return [
        {
            label: 'Employment Income : ',
            key: 'employmentIncome',
            elementType: 'CHECKBOX_GROUP',
            required: false,
            options: employmentIncomes,
            disable: isReadOnly,
            onChangeField: () => {},
            type: 'text',
            placeholder: '',
            config: {
                rules: [{ required: false, message: 'Please Select any of the option' }],
            }
        },
        {
            label: 'Investment Income : ',
            key: 'investmentIncome',
            elementType: 'CHECKBOX_GROUP',
            required: false,
            options: investmentIncomes,
            disable: isReadOnly,
            onChangeField: () => {},
            type: 'text',
            placeholder: '',
            config: {
                rules: [{ required: false, message: 'Please Select any of the option' }],
            }
        },
        {
            label: 'Self-Employment Income : ',
            key: 'selfEmploymentIncome',
            elementType: 'CHECKBOX_GROUP',
            required: false,
            options: selfEmploymentIncomes,
            disable: isReadOnly,
            onChangeField: () => {},
            type: 'text',
            placeholder: '',
            config: {
                rules: [{ required: false, message: 'Please Select any of the option' }],
            }
        },
        {
            label: 'Rental Income : ',
            key: 'rentalIncome',
            elementType: 'CHECKBOX_GROUP',
            required: false,
            options: rentalIncomes,
            disable: isReadOnly,
            onChangeField: () => {},
            type: 'text',
            placeholder: '',
            config: {
                rules: [{ required: false, message: 'Please Select any of the option' }],
            }
        },
        {
            label: 'Retirement Income : ',
            key: 'retirementIncome',
            elementType: 'CHECKBOX_GROUP',
            required: false,
            options: retirementIncomes,
            disable: isReadOnly,
            onChangeField: () => {},
            type: 'text',
            placeholder: '',
            config: {
                rules: [{ required: false, message: 'Please Select any of the option' }],
            }
        },
        {
            label: 'Sale of Assets : ',
            key: 'salesOfAssets',
            elementType: 'CHECKBOX_GROUP',
            required: false,
            options: salesAssets,
            disable: isReadOnly,
            onChangeField: () => {},
            type: 'text',
            placeholder: '',
            config: {
                rules: [{ required: false, message: 'Please Select any of the option' }],
            }
        },
    ] 
    }, [isReadOnly])

    const submitVerifyStatus = (e: any) => {
        if(leadData !== null){
        let obj = {
            verifyIncomeInfo: e.target.checked ? "1" : '0'
        }
        dispatch(initUpdateVerifyStatus(leadData?.lead_id, obj))
        }
    }
    
 useEffect(() => {
        if(leadData && Object.keys(leadData).length > 0 && !Array.isArray(leadData)){
            const { incomeInformaton } = leadData;
           
            form.setFieldsValue({
                employmentIncome: incomeInformaton?.employmentIncome,
                investmentIncome: incomeInformaton?.investmentIncome,
                selfEmploymentIncome: incomeInformaton?.selfEmploymentIncome,
                rentalIncome: incomeInformaton?.rentalIncome,
                retirementIncome: incomeInformaton?.retirementIncome,
                salesOfAssets: incomeInformaton?.salesOfAssets,
            })

            if(localUserData){
            setIsReadOnly(!localUserData?.leadEdit)
        }
        }
    }, [leadData])

  return (
    <div style={{padding: '0px 20px' }}>
          {
              isleadDetailsLoading ? (
                  <>
                      <Row
                          gutter={gutterBlobal}
                      >
                          {
                              new Array(8).fill('null').map((_: any, index: number) => (
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
                          onFinish={onSubmitIncomeInformation}
                          onFinishFailed={() => { }}
                          autoComplete="off"
                          layout='vertical'
                      >
                          <Row
                              gutter={gutterBlobal}
                          >
                            <div>
                                <p>Briefly look through and mark the appropriate sections for the following income categories (You and Spouse- if Joint Tax Return). Moreover, please submit the required Source Statements for each respective category : </p>
                                <hr />
                            </div>
                              {
                                  formFields.map((formItem: any, index: number) => (
                                      <Col className="gutter-row" xl={6} sm={12} xs={24} key={index}>
                                          <GenerateElements elementData={formItem} />
                                      </Col>
                                  ))
                              }
                          </Row>
                           {
                             !isReadOnly && (
                              //  false && (
                                    <Row justify={'end'}>
                              <Col>
                                  <Form.Item>
                                  {localUserData?.role == "3" && 
                                  ((leadData?.department_id == localUserData.departmentId) || leadData === null || leadData?.assigned_agent == localUserData.userId) && 
                                        <Button type="primary" disabled={isReadOnly} htmlType="submit">
                                          Submit
                                      </Button>
                                  }
                                        {
                                           false && localUserData && localUserData.departmentId !== 1 && (
                                                <span className="mx-4">
                                                    <Checkbox disabled={leadData ? false : true} checked={leadData && leadData?.income_information_verified === '1'} onChange={submitVerifyStatus}>Verify</Checkbox>
                                                    <Checkbox disabled={leadData ? false : true} onChange={() => dispatch(setSections('Income Information'))}>Comment</Checkbox>
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

export default IncomeInformation
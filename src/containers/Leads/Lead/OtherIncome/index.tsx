import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { Col, Row, Form, Button, Checkbox } from "antd";
import { gutterBlobal } from '../constants';
import GenerateElements from '../../../../components/GenerateElements';
import Skeleton from '../../../../components/Skeletons';
import localStorageContent from '../../../../utils/localstorage';
import { useDispatch, useSelector } from 'react-redux';
import { IInitialState } from '../../../../store/reducers/models';
import { addOtherIncome, initUpdateVerifyStatus } from '../../../../store/actions/creators';
import { setSections } from '../../../../store/reducers';
import './styles.scss'

function OtherIncome() {
    const [form] = Form.useForm()
    const [isReadOnly, setIsReadOnly] = useState<boolean>(false)
    const localStoreData = localStorageContent.getUserData()
    const gloablStore = useSelector((state: any) => state.store)
    const { isleadDetailsLoading, leadData }: IInitialState = gloablStore
    const dispatch = useDispatch()

    const onChangeOtherIncome = () => {

    }

    const onSubmitOtherIncome = (values: any) => {
        const copyValues = {...values}
        const keys = Object.keys(values)
        keys.forEach((key: any) => {
           // if(!isNaN(Number(copyValues[k]))){
            if (!isNaN(Number(copyValues[key])) && !['others', 'others2', 'others3'].includes(key)) {
                copyValues[key] = Number(copyValues[key])
            }
        })

        const modiFiedData = copyValues;
        dispatch(addOtherIncome(modiFiedData, leadData?.lead_id))
    }

    const formFields: any = [
        {
            label: 'Alimony Received',
            key: 'alimonyReceived',
            elementType: 'INPUT',
            onChangeField: onChangeOtherIncome,
            required: true,
            disable: isReadOnly,
            type: 'number',
            placeholder: 'Enter Alimony Received',
            config: {
                rules: [{ required: true, message: 'Please Enter Alimony Received' }],
            }
        },
        {
            label: 'Jury duty',
            key: 'juryDuty',
            elementType: 'INPUT',
            onChangeField: onChangeOtherIncome,
            required: true,
            disable: isReadOnly,
            type: 'number',
            placeholder: 'Enter Jury duty',
            config: {
                rules: [{ required: true, message: 'Please Enter Jury duty' }],
            }
        },
        {
            label: 'State Income tax refund',
            key: 'stateIncomeTaxRefund',
            elementType: 'INPUT',
            onChangeField: onChangeOtherIncome,
            required: true,
            disable: isReadOnly,
            type: 'number',
            placeholder: 'Enter State Income tax refund',
            config: {
                rules: [{ required: false, message: 'Please Enter State Income tax refund' }],
            }
        },
        {
            label: 'Gambling Lottery winnings',
            key: 'gamblingLotteryWinnings',
            elementType: 'INPUT',
            onChangeField: onChangeOtherIncome,
            required: true,
            disable: isReadOnly,
            type: 'number',
            placeholder: 'Enter Gambling Lottery winnings',
            config: {
                rules: [{ required: false, message: 'Please Enter Gambling Lottery winnings' }],
            }
        },
        {
            label: 'Disability Income',
            key: 'disabilityIncome',
            elementType: 'INPUT',
            onChangeField: onChangeOtherIncome,
            required: true,
            disable: isReadOnly,
            type: 'number',
            placeholder: 'Enter Disability Income',
            config: {
                rules: [{ required: false, message: 'Please Enter Disability Income' }],
            }
        },
    ]

    const others = [
        {
            label: '',
            key: 'others',
            elementType: 'INPUT',
            onChangeField: onChangeOtherIncome,
            required: true,
            disable: isReadOnly,
            type: 'string',
            placeholder: 'Income Type',
            config: {
                rules: [{ required: false, message: 'Please Enter Income Type' }],
            }
        },
        {
            label: '',
            key: 'othersAmountEarned',
            elementType: 'INPUT',
            onChangeField: onChangeOtherIncome,
            required: true,
            disable: isReadOnly,
            type: 'number',
            placeholder: 'Amount Earned',
            config: {
                rules: [{ required: false, message: 'Please Enter Amount Earned' }],
            }
        },
        {
            label: '',
            key: 'othersTaxPaid',
            elementType: 'INPUT',
            onChangeField: onChangeOtherIncome,
            required: true,
            disable: isReadOnly,
            type: 'number',
            placeholder: 'Tax Paid / Withheld',
            config: {
                rules: [{ required: false, message: 'Please Enter Tax Paid / Withheld' }],
            }
        },
    ]

    const others2 = [
        {
            label: '',
            key: 'others2',
            elementType: 'INPUT',
            onChangeField: onChangeOtherIncome,
            required: true,
            disable: isReadOnly,
            type: 'string',
            placeholder: 'Income Type',
            config: {
                rules: [{ required: false, message: 'Please Enter Income Type' }],
            }
        },
        {
            label: '',
            key: 'others2AmountEarned',
            elementType: 'INPUT',
            onChangeField: onChangeOtherIncome,
            required: true,
            disable: isReadOnly,
            type: 'number',
            placeholder: 'Amount Earned',
            config: {
                rules: [{ required: false, message: 'Please Enter Amount Earned' }],
            }
        },
        {
            label: '',
            key: 'others2TaxPaid',
            elementType: 'INPUT',
            onChangeField: onChangeOtherIncome,
            required: true,
            disable: isReadOnly,
            type: 'number',
            placeholder: 'Tax Paid / Withheld',
            config: {
                rules: [{ required: false, message: 'Please Enter Tax Paid / Withheld' }],
            }
        },
    ]


    const others3 = [
        
        {
            label: '',
            key: 'others3',
            elementType: 'INPUT',
            onChangeField: onChangeOtherIncome,
            required: true,
            disable: isReadOnly,
            type: 'string',
            placeholder: 'Income Type',
            config: {
                rules: [{ required: false, message: 'Please Enter Income Type' }],
            }
        },
        {
            label: '',
            key: 'others3AmountEarned',
            elementType: 'INPUT',
            onChangeField: onChangeOtherIncome,
            required: true,
            disable: isReadOnly,
            type: 'number',
            placeholder: 'Amount Earned',
            config: {
                rules: [{ required: false, message: 'Please Enter Amount Earned' }],
            }
        },
        {
            label: '',
            key: 'others3TaxPaid',
            elementType: 'INPUT',
            onChangeField: onChangeOtherIncome,
            required: true,
            disable: isReadOnly,
            type: 'number',
            placeholder: 'Tax Paid / Withheld',
            config: {
                rules: [{ required: false, message: 'Please Enter Tax Paid / Withheld' }],
            }
        },
    ]

     const submitVerifyStatus = (e: any) => {
        if(leadData !== null){
            let obj = {
                verifyOtherIncome: e.target.checked ? "1" : '0'
            }
            dispatch(initUpdateVerifyStatus(leadData?.lead_id, obj))
        }
    }

    useEffect(() => {
        if(leadData && Object.keys(leadData).length > 0 && !Array.isArray(leadData)){
            const { otherIncome } = leadData;
            if(Object.keys(otherIncome).length > 0 && otherIncome){
                const {
                    alimonyReceived,
                    disabilityIncome,
                    gamblingLotteryWinnings,
                    juryDuty,
                    others,
                    others2,
                    others3,
                    stateIncomeTaxRefund,
                    othersAmountEarned,
                    othersTaxPaid,
                    others2AmountEarned,
                    others2TaxPaid,
                    others3AmountEarned,
                    others3TaxPaid
                } = otherIncome;

                form.setFieldsValue({
                    alimonyReceived,
                    disabilityIncome,
                    gamblingLotteryWinnings,
                    juryDuty: juryDuty,
                    others: others || " ",
                    others2: others2 || " ",
                    others3: others3 || " ",
                    stateIncomeTaxRefund,
                    othersAmountEarned,
                    othersTaxPaid,
                    others2AmountEarned,
                    others2TaxPaid,
                    others3AmountEarned,
                    others3TaxPaid
                })
            }
            if(localStoreData){
                setIsReadOnly(!localStoreData?.leadEdit)
            }
        }
    }, [leadData])

  return (
    <div className='others_container'>
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
                          onFinish={onSubmitOtherIncome}
                          onFinishFailed={() => { }}
                          autoComplete="off"
                          layout='vertical'
                      >
                          <div>
                            <p><strong>Note : </strong>In the year 2023, did you or your spouse win cash or prizes through lotteries or gambling? The term Gambling encompasses a variety of activities, such as horse and dog racing, lotteries, raffles and any other game involving chance.</p>
                            <hr />
                        </div>
                          <Row
                              gutter={gutterBlobal}
                          >
                              {
                                  formFields.slice(0,5).map((formItem: any, index: number) => (
                                      <Col className="gutter-row" xl={6} sm={12} xs={24} key={index}>
                                          <GenerateElements elementData={formItem} />
                                      </Col>
                                  ))
                              }
                          </Row>
                            <table >
                                <tr>
                                    <th>S.No</th>
                                    <th>Income Type</th>
                                    <th>Amount</th>
                                    <th>Tax Paid / Withheld</th>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    {
                                        others.map((formItem: any, index: number) => (
                                            <td>
                                                <GenerateElements elementData={formItem} />
                                            </td>
                                        ))
                                    }
                                </tr>
                                <tr>
                                    <td>2</td>
                                    {
                                        others2.map((formItem: any, index: number) => (
                                            <td>
                                                <GenerateElements elementData={formItem} />
                                            </td>
                                        ))
                                    }
                                </tr>
                                <tr>
                                    <td>3</td>
                                    {
                                        others3.map((formItem: any, index: number) => (
                                            <td>
                                                <GenerateElements elementData={formItem} />
                                            </td>
                                        ))
                                    }
                                </tr>
                            </table>
                          {
                            !isReadOnly && (
                                <Row justify={'end'} style={{marginTop: 10}}>
                                    <Col>
                                        <Form.Item>
                                        {localStoreData?.role == "3" &&
                                         ((leadData?.department_id == localStoreData.departmentId) || leadData === null ||  leadData?.assigned_agent == localStoreData.userId  ) &&                                   
                                            <Button disabled={isReadOnly} type="primary" htmlType="submit">
                                                Submit
                                            </Button>
                                        }
                                                {
                                                    false && localStoreData && localStoreData.departmentId !== 1 && (
                                                        <span className="mx-4">
                                                            <Checkbox disabled={leadData ? isReadOnly : true} checked={leadData && leadData?.other_income_verified === '1'} onChange={submitVerifyStatus}>Verify</Checkbox>
                                                            <Checkbox disabled={leadData ? isReadOnly : true} onChange={() => dispatch(setSections('Other Income'))}>Comment</Checkbox>
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

export default OtherIncome
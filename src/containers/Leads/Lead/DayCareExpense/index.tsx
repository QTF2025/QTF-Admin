import React, { useState, useCallback, useEffect } from 'react'
import { Col, Row, Form, Button, Checkbox } from "antd";
import { gutterBlobal } from '../constants';
import { dayCareExpensesContext } from './constants'
import { PlusCircleOutlined } from "@ant-design/icons";
import Skeleton from '../../../../components/Skeletons';
import DayCare from './DayCare';
import localStorageContent from '../../../../utils/localstorage';
import { useDispatch, useSelector } from 'react-redux';
import { IInitialState } from '../../../../store/reducers/models';
import '../styles.scss'
import { isEmptyKeys } from '../../../../utils';
import { addDayCareDetails, initUpdateVerifyStatus } from '../../../../store/actions/creators';
import { setSections } from '../../../../store/reducers';

function DayCareExpense() {
    const [dayCareData, setDayCareData] = useState<any>([{ ...dayCareExpensesContext }])
    const [options, setOptions] = useState<any>([])
    const [isReadOnly, setIsReadOnly] = useState<boolean>(false)
    const [validate, setValidate] = useState<boolean>(false)
    const localStoreData = localStorageContent.getUserData()
    const gloablStore = useSelector((state: any) => state.store)
    const { isleadDetailsLoading, leadData }: IInitialState = gloablStore
    const dispatch = useDispatch()
    
    const onChangeDayCareDetails = useCallback((value: string, name: string, index: number) => {
         setDayCareData((prevdayCareData: any) => {
                const updateddayCareData = [...prevdayCareData];
                updateddayCareData[index][name] = value;
                return updateddayCareData;
            });
    }, []);

    const addDayCare = () => {
        const values = [...dayCareData]
        values.push({ ...dayCareExpensesContext })
        setDayCareData(values);
    }

    const deleteDayCare = (index: number) => {
        const copydayCareData = [...dayCareData]
        setDayCareData(copydayCareData.filter((_: any, i: number) => i !== index))
    }

    const onSubmitDayCare = () => {
        setValidate(true)

        let isValidDayCare: boolean = true;
        isValidDayCare = dayCareData.every((dayCare: any) => isEmptyKeys(dayCare, 'ALL', []));

        if(!isValidDayCare){
            return
        }

        const modifiedData = dayCareData.map((dayCare: any) => {
            const copyValues = {...dayCare}
            copyValues.amountPaid = Number(copyValues.amountPaid)
            return copyValues
        })

        dispatch(addDayCareDetails({ daycareExpenses: modifiedData }, leadData?.lead_id))
    }

    const submitVerifyStatus = (e: any) => {
        if(leadData !== null){
            let obj = {
                verifyDaycareExpenses: e.target.checked ? "1" : '0'
            }
            dispatch(initUpdateVerifyStatus(leadData?.lead_id, obj))
        }
    }

    useEffect(() => {
        if(leadData && Object.keys(leadData).length > 0 && !Array.isArray(leadData)){
            const { dayCareExpenses, dependents, dependentDetails } = leadData;

            if(dayCareExpenses.length > 0 && dependents === "1"){
                setDayCareData(dayCareExpenses.map((dayCare: any) => {
                    const { provider, address, ein_ssn, amount_paid, children_cared_for } = dayCare
                    return {
                        address: address,
                        amountPaid: amount_paid,
                        childrenCaredFor: children_cared_for,
                        einssn: ein_ssn,
                        provider: provider,
                    }
                }))
            }

            if(dependentDetails.length > 0){
                setOptions(dependentDetails.map((dependent: any) => ({
                    label: dependent.first_name,
                    value: Number(dependent.relation)
                })))
            }else{
                setOptions([])
            }

            if(localStoreData){
                setIsReadOnly(!localStoreData?.leadEdit)
            }
        }
    }, [leadData])

  return (
    <div style={{    position: 'relative'}}>
          {
              isleadDetailsLoading ? (
                <>
                    <Row
                        gutter={gutterBlobal}
                    >
                        {
                            new Array(5).fill('null').map((_: any, index: number) => (
                                <Col className="gutter-row" xl={4} sm={12} xs={24} key={index}>
                                    <Skeleton shape="rectangle" styles={{ height: '20px', width: '150px' }} />
                                    <Skeleton shape="rectangle" />
                                </Col>
                            ))
                        }
                    </Row>
                </>
              ) : (
                <>
                {
                    dayCareData.map((dayCare: any, index: number) => (
                        <DayCare 
                            index={index}
                            item={dayCare}
                            data={dayCareData}
                            onChange={onChangeDayCareDetails}
                            ondelete={deleteDayCare}
                            options={options}
                            validate={validate}
                            setValidate={setValidate}
                            isReadOnly={isReadOnly}
                        />
                    ))
                }
                {
                    // leadData.dependentDetails === dayCareData.length || leadData.dependentDetails.length > 1 && (
                        true && (
                        <Button
                            className="add-dependent-btn green mx-2"
                            onClick={addDayCare}
                            disabled={isReadOnly}
                            style={{    position: 'absolute', top: '20px', right: '20px'}}
                        >
                            <PlusCircleOutlined />
                        </Button>
                    )
                }
                {
                    !isReadOnly && (
                        <Row justify={'end'}>
                            <Col>
                                <Form.Item>
                                {localStoreData?.role == "3" &&
                                 ((leadData?.department_id == localStoreData.departmentId) || leadData === null || leadData?.assigned_agent == localStoreData.userId  ) && 
                                    <Button type="primary" disabled={isReadOnly} htmlType="submit" onClick={onSubmitDayCare}>
                                        Submit
                                    </Button>
                                }
                                        {
                                            false && localStoreData && localStoreData.departmentId !== 1 && (
                                                    <span className="mx-4">
                                                        <Checkbox disabled={leadData ? false : true} checked={leadData && leadData?.daycare_expenses_verified === '1'} onChange={submitVerifyStatus}>Verify</Checkbox>
                                                        <Checkbox disabled={leadData ? false : true} onChange={() => dispatch(setSections('Daycare Expense'))}>Comment</Checkbox>
                                                    </span>
                                                )
                                        }
                                </Form.Item>
                            </Col>
                        </Row>
                    )
                }
                </>
              )
          }
    </div>
  )
}

export default DayCareExpense
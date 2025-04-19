import React, { useState, useEffect } from 'react'
import { Col, Row, Form, Button, Checkbox } from "antd";
import { gutterBlobal } from '../constants';
import { PlusCircleOutlined } from "@ant-design/icons";
import { selfEmploymentContext } from './constants'
import Expense from './Expense';
import Skeleton from '../../../../components/Skeletons';
import localStorageContent from '../../../../utils/localstorage';
import { useDispatch, useSelector } from 'react-redux';
import { IInitialState } from '../../../../store/reducers/models';
import { convertToDate, isEmptyKeys } from '../../../../utils';
import { addSelfEmployment, initUpdateVerifyStatus } from '../../../../store/actions/creators';
import { setError, setSections } from '../../../../store/reducers';
import dayjs from 'dayjs';


function SelfEmployment() {
    const [options, setOptions] = useState<any>([])
    const [expenses, setExpenses] = useState<any>([{...selfEmploymentContext}])
    const [validate, setValidate] = useState<boolean>(false)
    const [isReadOnly, setIsReadOnly] = useState<boolean>(false)
    const localStoreData = localStorageContent.getUserData()
    const gloablStore = useSelector((state: any) => state.store)
    const { isleadDetailsLoading, leadData }: IInitialState = gloablStore
    const dispatch = useDispatch()

    const addExpense = () => {
        const values = [...expenses]
        values.push({ ...selfEmploymentContext })
        setExpenses(values);
    }

    const deleteExpense = (index: number) => {
        const copydayCareData = [...expenses]
        setExpenses(copydayCareData.filter((_: any, i: number) => i !== index))
    }

    const onChangeEmployment = (value: string, name: string, index: number) => {
         setExpenses((prevExpenses: any) => {
                const updatedExpenses = [...prevExpenses];
                updatedExpenses[index][name] = value;
                return updatedExpenses;
            });
    }

     const onSubmitSelfEmployment = () => {
        setValidate(true)

        // let isValidData: boolean = true;

        // isValidData = expenses.every((expense: any) => isEmptyKeys(expense, 'ALL',[]));

        // if(!isValidData){
        //     dispatch(setError({ status: true, type: 'error', message: 'Form validation Error' }))
        //     return;
        // }
        const exceptionalCases = ["categoryOfBusiness", "ownerShip", "nameOfBusiness", "addressOfBusiness", "dateStarted"]
        const modifiedData = expenses.map((expense: any) => {
            const copyValues = {...expense}
            if(copyValues.dateStarted){
                copyValues.dateStarted = convertToDate(copyValues.dateStarted)
            }
            const keys = Object.keys(expense)
            keys.forEach((k: any) => {
                if(!isNaN(Number(copyValues[k]))){
                    if(exceptionalCases.indexOf(k) !== -1) {
                        copyValues[k] =  copyValues[k] || " ";
                    } else
                    copyValues[k] = Number(copyValues[k])
                }
            })
            return copyValues
        })

        dispatch(addSelfEmployment({ selfEmploymentInfo: modifiedData }, leadData?.lead_id))
    }

    const submitVerifyStatus = (e: any) => {
        if(leadData !== null){
            let obj = {
                verifySelfEmploymentInformation: e.target.checked ? "1" : '0'
            }
            dispatch(initUpdateVerifyStatus(leadData?.lead_id, obj))
        }
    }

    useEffect(() => {
        if(leadData && Object.keys(leadData).length > 0 && !Array.isArray(leadData)){
            const { selfEmploymentInfo, spouseDetails, first_name  } = leadData;

            if(selfEmploymentInfo.length > 0){
                setExpenses(selfEmploymentInfo.map((expense: any) => {
                    const { 
                        advertisingate,
                        auto_expenses,
                        auto_miles,
                        bank_charges,
                        business,
                        commision_fees,
                        dues_publications,
                        eqipment_rental_expenses,
                        // footage,
                        home,
                        insurance,
                        interest_expense,
                        leagal_professionals,
                        meals_entertainment_paid,
                        office_expenses,
                        office_rent_expenses,
                        others,
                        postage,
                        repairs_expenses,
                        supplies_expenses,
                        tax_payer,
                        taxes,
                        telephone,
                        tools_equipment,
                        travel_expenses,
                        utilities,
                        wages,
                        ownership,
                        name_of_business,
                        address_of_business,
                        category_of_business,
                        date_started,
                        gross_receipts,
                        other_income,
                        cogs,
                     } = expense
                    return {
                        advertisingate,
                        autoExpenses: auto_expenses,
                        autoMiles: auto_miles,
                        bankCharges: bank_charges,
                        business,
                        commisionFees: commision_fees,
                        duesPublications: dues_publications,
                        eqipmentRentalExpenses: eqipment_rental_expenses,
                        // footage,
                        home,
                        insurance,
                        interestExpense: interest_expense,
                        leagalProfessionals: leagal_professionals,
                        mealsEntertainmentPaid: meals_entertainment_paid,
                        officeExpenses: office_expenses,
                        officeRentExpenses: office_rent_expenses,
                        others,
                        postage,
                        repairsExpenses: repairs_expenses,
                        suppliesExpenses: supplies_expenses,
                        taxPayer: tax_payer,
                        taxes,
                        telephone,
                        toolsEquipment: tools_equipment,
                        travelExpenses: travel_expenses,
                        utilities,
                        wages,
                        ownerShip: ownership,
                        nameOfBusiness: name_of_business,
                        addressOfBusiness: address_of_business,
                        categoryOfBusiness: category_of_business,
                        dateStarted: date_started ? dayjs(date_started, 'YYYY-MM-DD') : '',
                        grossReceipts: gross_receipts,
                        otherIncome: other_income,
                        cogs,
                    }
                }))

                
            }
            const optionsValues = [
                {
                    value: first_name ? first_name : '',
                    label: first_name ? first_name : ''
                }
            ]
            if(spouseDetails && Object.keys(spouseDetails).length > 0){
                optionsValues.push({
                    value: spouseDetails.first_name ? spouseDetails.first_name : '',
                    label: spouseDetails.first_name ? spouseDetails.first_name : ''
                })
            }
            setOptions(optionsValues)

            if(localStoreData){
                setIsReadOnly(!localStoreData?.leadEdit)
            }
        }
    }, [leadData])

    
  return (
    <>
          {
              isleadDetailsLoading ? (
                <>
                    <Row
                        gutter={gutterBlobal}
                    >
                        {
                            new Array(24).fill('null').map((_: any, index: number) => (
                                <Col className="gutter-row" xl={4} sm={12} xs={24} key={index}>
                                    <Skeleton shape="rectangle" styles={{ height: '20px', width: '150px' }} />
                                    <Skeleton shape="rectangle" />
                                </Col>
                            ))
                        }
                    </Row>
                </>
              ) : (
                  <div>
                   
                    {
                        expenses.map((expense: any, index: number) => (
                            <Expense 
                                onChange={onChangeEmployment}
                                onDelete={deleteExpense}
                                item={expense}
                                data={expenses}
                                options={options}
                                index={index}
                                validate={validate}
                                setValidate={setValidate}
                                key={index}
                                isReadOnly={isReadOnly}
                            />
                        ))
                    }
                    {
                        // expenses.length < options.length && (
                            <Button
                                className="add-dependent-btn green mx-2"
                                onClick={addExpense}
                                disabled={isReadOnly}
                            >
                                <PlusCircleOutlined />
                            </Button>
                        // )
                    }
                    {
                        !isReadOnly && (
                            <Row justify={'end'}>
                                <Col>
                                    <Form.Item>
                                    {localStoreData?.role == "3" && 
                                    ((leadData?.department_id == localStoreData.departmentId) || leadData === null || leadData?.assigned_agent == localStoreData.userId) &&                                                                           
                                        <Button disabled={isReadOnly} type="primary" htmlType="submit" onClick={onSubmitSelfEmployment}>
                                            Submit
                                        </Button>
                                    }
                                        {
                                            false && localStoreData && localStoreData.departmentId !== 1 && (
                                                <span className="mx-4">
                                                    <Checkbox disabled={leadData ? isReadOnly : true} checked={leadData && leadData?.self_employment_verified === '1'} onChange={submitVerifyStatus}>Verify</Checkbox>
                                                    <Checkbox disabled={leadData ? isReadOnly : true} onChange={() => dispatch(setSections('Self Employment Information'))}>Comment</Checkbox>
                                                </span>
                                            )
                                        }
                                    </Form.Item>
                                </Col>
                            </Row>
                        )
                    }
                  </div>
              )
          }
    </>
  )
}

export default SelfEmployment
import React, { useState, useEffect } from 'react'
import { Col, Row, Form, Button, Checkbox } from "antd";
import { gutterBlobal } from '../constants';
import { PlusCircleOutlined } from "@ant-design/icons";
import { rentalExpensesContext } from './constants'
import Expense from './Expense';
import Skeleton from '../../../../components/Skeletons';
import localStorageContent from '../../../../utils/localstorage';
import { useDispatch, useSelector } from 'react-redux';
import { IInitialState } from '../../../../store/reducers/models';
import dayjs from 'dayjs';
import { convertToDate, isEmptyKeys } from '../../../../utils';
import { addRentalIncomes, initUpdateVerifyStatus } from '../../../../store/actions/creators';
import { setSections } from '../../../../store/reducers';


function RentalIncomeExpense() {
    const [options, setOptions] = useState<any>([])
    const [isReadOnly, setIsReadOnly] = useState<boolean>(false)
    const [expenses, setExpenses] = useState<any>([{...rentalExpensesContext}])
    const [validate, setValidate] = useState<boolean>(false)
    const localStoreData = localStorageContent.getUserData()
    const gloablStore = useSelector((state: any) => state.store)
    const { isleadDetailsLoading, leadData }: IInitialState = gloablStore
    const dispatch = useDispatch()

    const addExpense = () => {
        const values = [...expenses]
        values.push({ ...rentalExpensesContext })
        setExpenses(values);
    }

    const deleteExpense = (index: number) => {
        const copydayCareData = [...expenses]
        setExpenses(copydayCareData.filter((_: any, i: number) => i !== index))
    }

    const onChangeRentalExpenses = (value: string, name: string, index: number) => {
         setExpenses((prevExpenses: any) => {
                const updatedExpenses = [...prevExpenses];
                updatedExpenses[index][name] = value;
                return updatedExpenses;
            });
    }

    const submitVerifyStatus = (e: any) => {
        if(leadData !== null){
            let obj = {
                verifyRentalIncomeExpenses: e.target.checked ? "1" : '0'
            }
            dispatch(initUpdateVerifyStatus(leadData?.lead_id, obj))
        }
    }

    const onSubmitRentalIncome = () => {
        setValidate(true)


        let isValidData: boolean = true;

        //isValidData = expenses.every((expense: any) => isEmptyKeys(expense, 'ALL',[]));

        isValidData = expenses.every((expense: any) => {
            return expense.taxPayer && expense.datePlacedInService;
        });

        if(!isValidData){
            return;
        }
        const modifiedData = expenses.map((expense: any) => {
            const copyValues = {...expense}
            if(copyValues.datePlacedInService){
                copyValues.datePlacedInService = convertToDate(copyValues.datePlacedInService)
            }
            const keys = Object.keys(expense)
            keys.forEach((k: any) => {

                if(!isNaN(Number(copyValues[k]))){
                    if (k === 'datePlacedInService' || k=== 'address') {
                        copyValues[k] = copyValues[k] ||    ' '
                    } else
                    copyValues[k] = Number(copyValues[k])
                }
            })
            return copyValues
        })

        dispatch(addRentalIncomes({ rentalIncomeExpenses: modifiedData }, leadData?.lead_id))
    }

     useEffect(() => {
        if(leadData && Object.keys(leadData).length > 0 && !Array.isArray(leadData)){
            const { rentalIncomeExpenses, spouseDetails, first_name  } = leadData;

            if(rentalIncomeExpenses.length > 0){
                setExpenses(rentalIncomeExpenses.map((expense: any) => {
                    const { 
                        address,
                        advertising,
                        association_dues,
                        auto_miles,
                        auto_travel,
                        clearing_maintainance,
                        commisions_paid,
                        date_placed_in_service,
                        expenses,
                        grounds_gardening,
                        insurance,
                        interest_expense,
                        management_fees,
                        others,
                        others2,
                        others3,
                        ownership,
                        pest_control,
                        property_cost_basics,
                        rent_received,
                        repair_maintainance,
                        supplies,
                        tax_payer,
                        taxes,
                        utilities,
                        fair_rental_days,
                        personal_use_days
                     } = expense
                    return {
                        address,
                        advertising,
                        associationDues: association_dues,
                        autoMiles: auto_miles,
                        autoTravel: auto_travel,
                        clearingMaintainance: clearing_maintainance,
                        commisionsPaid: commisions_paid,
                        datePlacedInService: date_placed_in_service ? dayjs(date_placed_in_service ? date_placed_in_service : '', 'YYYY-MM-DD') : '',
                        // expenses,
                        groundsGardening: grounds_gardening,
                        insurance,
                        interestExpense: interest_expense,
                        managementFees: management_fees,
                        others: others,
                        others2: others2,
                        others3: others3,
                        // ownership: ownership,
                        pestControl: pest_control,
                        propertyCostBasics: property_cost_basics,
                        rentReceived: rent_received,
                        repairMaintainance: repair_maintainance,
                        supplies: supplies,
                        taxPayer: tax_payer,
                        taxes,
                        utilities,
                        fairRentalDays: fair_rental_days || '',
                        personalUseDays: personal_use_days || '',
                    }
                }))
            }

            if(localStoreData){
                setIsReadOnly(!localStoreData?.leadEdit)
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
                                onChange={onChangeRentalExpenses}
                                onDelete={deleteExpense}
                                item={expense}
                                data={expenses}
                                options={options}
                                index={index}
                                key={index}
                                validate={validate}
                                setValidate={setValidate}
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
                                    ((leadData?.department_id == localStoreData.departmentId) || leadData === null ||  leadData?.assigned_agent == localStoreData.userId  ) &&                                   
                                        <Button disabled={isReadOnly} type="primary" htmlType="submit" onClick={onSubmitRentalIncome}>
                                            Submit
                                        </Button>
                                    }
                                        {
                                            false && localStoreData && localStoreData.departmentId !== 1 && (
                                                <span className="mx-4">
                                                    <Checkbox disabled={leadData ? isReadOnly : true} checked={leadData && leadData?.rental_income_verified === '1'} onChange={submitVerifyStatus}>Verify</Checkbox>
                                                    <Checkbox disabled={leadData ? isReadOnly : true} onChange={() => dispatch(setSections('Rental Income Expenses'))}>Comment</Checkbox>
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

export default RentalIncomeExpense
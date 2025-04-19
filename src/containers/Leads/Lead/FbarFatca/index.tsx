import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Col, Row, Form, Button, Checkbox, Radio } from "antd";
import { gutterBlobal } from '../constants';
import GenerateElements from '../../../../components/GenerateElements';
import { singleJointOptions, accountTypeOptions } from './constants';
import Skeleton from '../../../../components/Skeletons';
import localStorageContent from '../../../../utils/localstorage';
import { useDispatch, useSelector } from 'react-redux';
import { IInitialState } from '../../../../store/reducers/models';
import dayjs from 'dayjs';
import { convertToDateYear, isEmptyKeys } from '../../../../utils';
import { addFbarFatca, initUpdateVerifyStatus } from '../../../../store/actions/creators';
import { setError, setSections } from '../../../../store/reducers';
import { emptyFbarFatcaContext } from './constants'
import ForeignInfo from './ForeignInfo';
import { PlusCircleOutlined } from "@ant-design/icons";

function FbarFatca() {
    const [form] = Form.useForm()
    const [taxPayer, setTaxPayer] = useState<any>([{...emptyFbarFatcaContext}])
    const [validate, setValidate] = useState<boolean>(false)
    const [fbarFatcaOptions, setfbarFatcaOptions] = useState<any>({
        fbar: '1',
        fatca: '1'
    })
    const [options, setOptions] = useState<any>([])
    const [isReadOnly, setIsReadOnly] = useState<boolean>(false)
    const localStoreData = localStorageContent.getUserData()
    const gloablStore = useSelector((state: any) => state.store)
    const { isleadDetailsLoading, leadData }: IInitialState = gloablStore
    const dispatch = useDispatch()

    const onChangeFbarFatcaDetails = useCallback((value: string, name: string, index: number) => {
            setTaxPayer((prevResidency: any) => {
                const updatedResidency = [...prevResidency];
                updatedResidency[index][name] = value;
                if(name === "fbarFatcaAccountType" && value === "1"){
                    updatedResidency[index]['jointAccountHolder'] = ''
                    updatedResidency[index]['address'] = ''
                    updatedResidency[index]['ssnItinNumber'] = ''
                    updatedResidency[index]['relationship'] = ''
                    updatedResidency[index]['noOfJointOwners'] = ''
                }
                return updatedResidency;
            });
    }, []);

    const onChangeRadio = (value: any, key: string) => {
        setfbarFatcaOptions((prev: any) => {
            return {
                ...prev,
                [key]: value
            }
        })
    }

    
    const addTaxPayer = useCallback(() => {
        const values = [...taxPayer]
        values.push({ ...emptyFbarFatcaContext })
        setTaxPayer(values);
    }, [taxPayer])

    const deleteTaxPayer = useCallback((index: number) => {
        const copyResidency = [...taxPayer]
        setTaxPayer(copyResidency.filter((_: any, i: number) => i !== index))
    },[taxPayer])

    const onSubmitFbarFatca = (values: any) => {
        setValidate(true)

        let residencyArray = [...taxPayer]
        let isValidData = true;
        if(fbarFatcaOptions.fbar === '0' && fbarFatcaOptions.fatca === '0'){
            isValidData = true
            residencyArray = []
        }else{
            isValidData = residencyArray.every((resident: any) => {
            const copyValues = {...resident}
            if(copyValues.fbarFatcaBankAccountType === "1"){
                    delete copyValues.jointAccountHolder
                    delete copyValues.address
                    delete copyValues.ssnItinNumber
                    delete copyValues.relationship
                    delete copyValues.noOfJointOwners
                }
                return isEmptyKeys(copyValues, 'ALL',['accountClosedYear', 'accountOpenedYear', 'bankMailingAddress', 'currency', 'yearAccountBalance', 'maxAccountBalance', 'fbarFatcaAccountType', 'interestIncome', 'dividendsIncome'])
            }); // In empty Array add keys of fields which are optional
        }
        
        if(isValidData){
            dispatch(setError({ status: true, type: 'error', message: 'Form validation Error' }))
            return;
        }

        const finalModifiedData: any = []
        if (residencyArray.length > 0) {
            taxPayer.forEach((taxPayee: any) => {
                const copyValues = { ...taxPayee };
        
                if (copyValues.fbarFatcaBankAccountType === "1") {
                    delete copyValues.jointAccountHolder;
                    delete copyValues.address;
                    delete copyValues.ssnItinNumber;
                    delete copyValues.relationship;
                    delete copyValues.noOfJointOwners;
                }
        
                // Convert years to the correct format
                if (copyValues.accountClosedYear) {
                    copyValues.accountClosedYear = convertToDateYear(copyValues.accountClosedYear);
                }
                if (copyValues.accountOpenedYear) {
                    copyValues.accountOpenedYear = convertToDateYear(copyValues.accountOpenedYear);
                }
        
                //Ensure mandatory fields are not empty
                
                // copyValues.bankMailingAddress = copyValues.bankMailingAddress || "N/A";
                // copyValues.fbarFatcaAccountType = copyValues.fbarFatcaAccountType || "1";
                // copyValues.maxAccountBalance = copyValues.maxAccountBalance || 1;
                // copyValues.yearAccountBalance = copyValues.yearAccountBalance || 1;
                // copyValues.interestIncome = copyValues.interestIncome || 1;
                // copyValues.dividendsIncome = copyValues.dividendsIncome || 1;
                // copyValues.currency = copyValues.currency || "N/A";
                
                // copyValues.accountClosedYear = copyValues.accountClosedYear || new Date().getFullYear();

                // copyValues.accountOpenedYear = copyValues.accountOpenedYear || new Date().getFullYear();

        
                // Convert numeric fields where applicable
                const keys = Object.keys(copyValues);
                keys.forEach((k: any) => {
                    if (!isNaN(Number(copyValues[k])) && !['fbarFatcaAccountType', 'bankMailingAddress', 'currency'].includes(k)) {
                        copyValues[k] = Number(copyValues[k]);
                    }
                });
        
                finalModifiedData.push(copyValues);
            });
        }
        
        dispatch(addFbarFatca({fbarfatcaSettings: finalModifiedData, ...fbarFatcaOptions }, leadData?.lead_id))
    }

    const submitVerifyStatus = (e: any) => {
        if(leadData !== null){
            let obj = {
                verifyFbarFatca: e.target.checked ? "1" : '0'
            }
            dispatch(initUpdateVerifyStatus(leadData?.lead_id, obj))
        }
    }

        useEffect(() => {
        if(leadData && Object.keys(leadData).length > 0 && !Array.isArray(leadData)){
            const { fbarFatcaSettings, first_name, spouseDetails, fatca, fbar } = leadData;
            // console.log('fbarfatcaSettings', fbarFatcaSettings)
            if(fbarFatcaSettings?.length > 0 && fbarFatcaSettings){
                setTaxPayer(fbarFatcaSettings.map((fbarFatcaSetting: any) => {
                    const {
                    account_closed_year,
                    account_opened_year,
                    address,
                    bank_mailing_address,
                    currency,
                    dividends_income,
                    fbar_fatca_account_number,
                    fbar_fatca_account_type,
                    fbar_fatca_bank_account_type,
                    fbar_fatca_bank_name,
                    interest_income,
                    joint_account_holder,
                    max_account_balance,
                    name_of_account_owner,
                    no_of_joint_owners,
                    relationship,
                    ssn_itin_number,
                    year_account_balance,
                    tax_payer
                } = fbarFatcaSetting;

                return({
                        accountClosedYear: account_closed_year ? dayjs(account_closed_year ? new Date(`${account_closed_year}`).toISOString() : '', 'YYYY') : '',
                        accountOpenedYear: account_opened_year ? dayjs(account_opened_year ? new Date(`${account_opened_year}`).toISOString() : '', 'YYYY') : '',
                        bankMailingAddress: bank_mailing_address || 'N/A',
                        currency,
                        dividendsIncome: dividends_income || '',
                        fbarFatcaAccountNumber: fbar_fatca_account_number || '',
                        fbarFatcaAccountType: fbar_fatca_account_type || '',
                        fbarFatcaBankAccountType: fbar_fatca_bank_account_type || '',
                        fbarFatcaBankName: fbar_fatca_bank_name || '',
                        interestIncome: interest_income || '',
                        maxAccountBalance: max_account_balance || '',
                        nameOfAccountOwner: name_of_account_owner || '',
                        yearAccountBalance: year_account_balance || '',
                        jointAccountHolder: joint_account_holder || '',
                        address,
                        ssnItinNumber: ssn_itin_number || '',
                        relationship,
                        noOfJointOwners: no_of_joint_owners || '',
                        taxPayer: tax_payer || '',
                    })
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

            setfbarFatcaOptions({
                fbar: fbar,
                fatca: fatca
            })
            setOptions(optionsValues)

            if(localStoreData){
                    setIsReadOnly(!localStoreData?.leadEdit)
                }
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
                              new Array(13).fill('null').map((_: any, index: number) => (
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
                  <div>
                            <p><strong>Note : </strong></p>
                            <div style={{display: 'flex', alignItems: ''}}>
                                 <p><strong>FBAR : &nbsp;</strong></p>
                                <Radio.Group onChange={(e) => onChangeRadio(e.target.value, 'fbar')} value={fbarFatcaOptions.fbar}>
                                    <Radio value={'1'}>Yes</Radio>
                                    <Radio value={'0'}>No</Radio>
                                </Radio.Group>
                            </div>
                            <p>The FBAR (Report of Foreign Bank and Financial Accounts) must be filed annually by United States persons (Resident) who have a financial interest in, or signature authority over, foreign financial accounts if the aggregate value of the foreign financial accounts exceeds $10,000 at any time during the calendar year.</p>
                            <div style={{display: 'flex', alignItems: ''}}>
                                 <p><strong>FATCA : &nbsp;</strong></p>
                                <Radio.Group onChange={(e) => onChangeRadio(e.target.value, 'fatca')} value={fbarFatcaOptions.fatca}>
                                    <Radio value={'1'}>Yes</Radio>
                                    <Radio value={'0'}>No</Radio>
                                </Radio.Group>
                            </div>
                            <p>FATCA (Foreign Account Tax Compliance Act) does not have a separate filing requirement like FBAR (Report of Foreign Bank and Financial Accounts). Instead, FATCA compliance is typically integrated into the regular U.S. tax filing process.</p>
                            <p>- You are unmarried and the total value of your specified foreign financial assets is more than $50,000 on the last day of the tax year or more than $75,000 at any time during the tax year</p>
                            <p>- You are married filing a joint income tax return and the total value of your specified foreign financial assets is more than $100,000 on the last day of the tax year or more than $150,000 at any time during the tax year.</p>
                            <hr />
                        </div>
                        {
                            (fbarFatcaOptions.fbar === '1' || fbarFatcaOptions.fatca === '1') && (
                                <div>
                                        {
                                            taxPayer.map((resident: any, index: number) => (
                                                <ForeignInfo 
                                                    key={index}
                                                    deleteResident={deleteTaxPayer} 
                                                    onChangeDetails={onChangeFbarFatcaDetails} 
                                                    resident={resident} 
                                                    index={index} 
                                                    residency={taxPayer}
                                                    validate={validate}
                                                    options={options}
                                                    setValidate={setValidate}
                                                    isReadOnly={isReadOnly}
                                                />
                                            ))
                                        }
                                        <Col>
                                            <Form.Item>
                                                <Button
                                                    className="add-dependent-btn green mx-2"
                                                    onClick={addTaxPayer}
                                                >
                                                    <PlusCircleOutlined />
                                                </Button>
                                            </Form.Item>
                                        </Col>
                        </div>
                            )
                        }
                        {
                            !isReadOnly && (
                                <Row justify={'end'}>
                                    <Col>
                                        <Form.Item>
                                        {localStoreData?.role == "3" &&
                                         ((leadData?.department_id == localStoreData.departmentId) || leadData === null ||  leadData?.assigned_agent == localStoreData.userId ) && 
                                            <Button type="primary" htmlType="submit" disabled={isReadOnly} onClick={onSubmitFbarFatca}>
                                                Submit
                                            </Button>
                                        }                                   
                                            {
                                                    false && localStoreData && localStoreData.departmentId !== 1 && (
                                                        <span className="mx-4">
                                                            <Checkbox disabled={leadData ? false : true} checked={leadData && leadData?.fbar_fatca_verified === '1'} onChange={submitVerifyStatus}>Verify</Checkbox>
                                                            <Checkbox disabled={leadData ? false : true} onChange={() => dispatch(setSections('FBAR / FATCA'))}>Comment</Checkbox>
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

export default FbarFatca
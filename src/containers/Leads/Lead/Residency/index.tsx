import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { Col, Row, Form, Button, Checkbox } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { residencyEmptyContextTaxPayer, residencyEmptyContextSpouse, stateOptions } from './constants'
import Resident from './Resident';
import { gutterBlobal } from '../constants';
import Skeleton from '../../../../components/Skeletons';
import { useDispatch, useSelector } from 'react-redux';
import { IInitialState } from '../../../../store/reducers/models';
import { convertToDate, fileNames, isEmptyKeys } from '../../../../utils';
import localStorageContent from '../../../../utils/localstorage';
import { initUpdateVerifyStatus, updateStateResidency } from '../../../../store/actions/creators';
import { setError, setSections } from '../../../../store/reducers';
import { residencyTaxContext } from './constants'
import { yesNoOptions } from '../GeneralInformation/constants';
import GenerateElements from '../../../../components/GenerateElements';

function Residency() {
    const [form] = Form.useForm()
    const [taxPayer, setTaxPayer] = useState<any>([{...residencyEmptyContextTaxPayer}])
    const [taxPayerDetails, setTaxPayerDetails] = useState<any>({...residencyTaxContext})
    const [spouse, setSpouse] = useState<any>([])
    const [options, setOptions] = useState<any>([])
    const [optionsSpouse, setSpouseOptions] = useState<any>([])
    const [showSpouseTaxes, setShowSpouseTaxes] = useState<boolean>(false)
    const [showTaxPayer, setShowTaxPayer] = useState<boolean>(false)
    const [isReadOnly, setIsReadOnly] = useState<boolean>(false)
    const [validate, setValidate] = useState<boolean>(false)
    const [showFields, setShowFields] = useState<any>({
        monthlyRendPaid: false,
        monthlyRendPaidStates:false,
        massachusettsInsurance: false,
        selfspouseReside: false,
        licenseOrStateId: false
    })
    const inputRef: any = useRef(null)
    const [monthly_other_documents, setMonthly_other_documents] = useState([]);

    const [validateDetails, setValidateDetails] = useState<boolean>(false)
    const [filterFields, setfilterFields] = useState<any[]>([])
    const localStoreData = localStorageContent.getUserData()
    const gloablStore = useSelector((state: any) => state.store)
    const { isleadDetailsLoading, leadData }: IInitialState = gloablStore
    const dispatch = useDispatch()
 
    const onChangeDropDown = (key: string, status: boolean) => {
        setShowFields((prev: any) => {
            return {
                ...prev,
                [key]: status
            }
        })
    }

    const onChangeResidencyTaxPayer = useCallback((value: string, name: string, index: number) => {
        if(name !== 'date'){
            setTaxPayer((prevResidency: any) => {
                const updatedResidency = [...prevResidency];
                updatedResidency[index][name] = value;
                return updatedResidency;
            });
        }else{
            setTaxPayer((prevResidency: any) => {
                const updatedResidency = [...prevResidency];
                if (value !== null && value.length > 0){
                    updatedResidency[index]['startDate'] = value[0];
                    updatedResidency[index]['endDate'] = value[1];
                }
                
                return updatedResidency;
            });
        }
       
    }, []);

    const onChangeResidencySpouse = useCallback((value: string, name: string, index: number) => {
        if(name !== 'date'){
            setSpouse((prevResidency: any) => {
                const updatedResidency = [...prevResidency];
                updatedResidency[index][name] = value;
                return updatedResidency;
            });
        }else{
            setSpouse((prevResidency: any) => {
                const updatedResidency = [...prevResidency];
                if (value !== null && value.length > 0){
                    updatedResidency[index]['startDate'] = value[0];
                    updatedResidency[index]['endDate'] = value[1];
                }
                
                return updatedResidency;
            });
        }
       
    }, []);

    const onChangeResidency = (value: any, name: any) => {
        if(['massachusettsInsurance', 'selfspouseReside', 'licenseOrStateId'].includes(name)){
            setTaxPayerDetails((prev: any) => {
                return {
                    ...prev,
                    [name]: value.files[0]
                }
            })
        }else{
            setTaxPayerDetails((prev: any) => {
                return {
                    ...prev,
                    [name]: value
                }
            })
        }
    }    
    const formFields: any[] = useMemo(() => {
        return [
               {
                    label: 'Did you reside in California, Massachusetts, New Jersey, Minnesota, Wisconsin, or Indiana during the tax year?',
                    key: 'showMonthlyRendPaid' ,
                    childKey: ['monthlyRendPaid'],
                    parentKey: [],
                    elementType: 'SELECT',
                    value: '0',
                    onChangeField: (value: any, name: any, index: any) => {
                        onChangeResidency(value, name)
                        onChangeDropDown('monthlyRendPaid', value === '1')
                        onChangeDropDown('monthlyRendPaidStates', value === '1'); // Add this line to toggle 'state'
                    },
                    options: yesNoOptions,
                    required: true,
                    disable: isReadOnly,
                    type: 'string',
                    placeholder: 'Select option',
                    config: {
                        rules: [{ required: true, message: 'Please Enter option' }],
                    }
                },
                {
                    label: 'State',
                    key: 'monthlyRendPaidStates',
                    childKey: [],
                    parentKey: ['showMonthlyRendPaid'],
                    elementType: 'MULTI_SELECT',
                    onChangeField: onChangeResidency,
                    options: stateOptions,
                    //defaultValue: leadData?.monthly_rent_paid_states && leadData?.monthly_rent_paid_states?.split(","),
                    defaultValue: leadData?.monthly_rent_paid_states && leadData?.monthly_rent_paid_states?.split(","),
                    required: true,
                    disable: isReadOnly,
                    // type: 'string',
                    placeholder: 'Select State',
                    config: {
                        rules: [{ required: true, message: 'Please Enter State' }],
                    },
                    multiple: true, // Enable multiple selections
                    mode: 'multiple',
                },
                {
                    label: 'Monthly Rent Paid',
                    key: 'monthlyRendPaid',
                    childKey: [],
                    parentKey: ['showMonthlyRendPaid'],
                    elementType: 'INPUT',
                    value: taxPayerDetails.monthlyRendPaid ? taxPayerDetails.monthlyRendPaid : '',
                    onChangeField: onChangeResidency,
                    required: true,
                    disable: isReadOnly,
                    type: 'text',
                    config: {
                        rules: [{ required: true, message: 'Please Enter Monthly Rent Paid' }],
                    }
                },

                {
                    label: 'Did you or your Spouse (if Joint Tax Return) reside in Massachusetts during the tax year?',
                    key: 'showMassachusettsInsurance',
                    childKey: ['massachusettsInsurance'],
                    parentKey: [],
                    elementType: 'SELECT',
                    onChangeField: (value: any, name: any, index: any) => {
                        onChangeResidency(value, name)
                        onChangeDropDown('massachusettsInsurance', value === '1')
                    },
                    options: yesNoOptions,
                    required: true,
                    disable: isReadOnly,
                    type: 'string',
                    placeholder: 'Select option',
                    config: {
                        rules: [{ required: true, message: 'Please Enter option' }],
                    }
                },
                {
                    label: 'Are you covered by Massachusetts Health Insurance during tax year?',
                    key: 'massachusettsInsurance',
                    childKey: [],
                    parentKey: ['showMassachusettsInsurance'],
                    elementType: 'INPUT_FILE_TOOLTIP',
                    toolTiptext: 'Attention: Please enclose your 1099-HC with your other documents upon submitting.',
                    onChangeField: onChangeResidency,
                    required: true,
                    value: taxPayerDetails.massachusettsInsurance ? taxPayerDetails.massachusettsInsurance : '',
                    disable: isReadOnly,
                    type: 'file',
                    config: {
                        rules: [{ required: false, message: 'Please Enter Monthly Rent Paid' }],
                    }
                },
                {
                    label: 'Did you or your Spouse (Joint Tax Return) reside in the state of California and New Jersey during the tax year?',
                    key: 'showselfspouseReside',
                    childKey: ['selfspouseReside'],
                    parentKey: [],
                    elementType: 'SELECT',
                    onChangeField: (value: any, name: any, index: any) => {
                        onChangeResidency(value, name)
                        onChangeDropDown('selfspouseReside', value === '1')
                    },
                    options: yesNoOptions,
                    required: true,
                    disable: isReadOnly,
                    type: 'string',
                    placeholder: 'Select option',
                    config: {
                        rules: [{ required: true, message: 'Please Enter option' }],
                    }
                },
                {
                    label: '1095-A/1095-B/1095-C',
                    key: 'selfspouseReside',
                    childKey: [],
                    parentKey: ['showselfspouseReside'],
                    elementType: 'INPUT_FILE_TOOLTIP',
                    toolTiptext: 'Please enclose your 1095-A/1095-B/1095-C with your other documents upon submitting.',
                    onChangeField: onChangeResidency,
                    required: true,
                    value: taxPayerDetails.selfspouseReside ? taxPayerDetails.selfspouseReside : '',
                    disable: isReadOnly,
                    type: 'file',
                    config: {
                        rules: [{ required: false, message: 'Please Enter Monthly Rent Paid' }],
                    }
                },
                {
                    label: 'Did you reside in Alabama during the tax year?',
                    key: 'showLicenseOrStateId',
                    childKey: ['licenseOrStateId'],
                    parentKey: [],
                    elementType: 'SELECT',
                    onChangeField: (value: any, name: any, index: any) => {
                        onChangeResidency(value, name)
                        onChangeDropDown('licenseOrStateId', value === '1')
                    },
                    options: yesNoOptions,
                    required: true,
                    disable: isReadOnly,
                    type: 'string',
                    placeholder: 'Select option',
                    config: {
                        rules: [{ required: true, message: 'Please Enter option' }],
                    }
                },
                {
                    label: 'Driver’s License or State ID',
                    key: 'licenseOrStateId',
                    childKey: [],
                    parentKey: ['showLicenseOrStateId'],
                    elementType: 'INPUT_FILE_TOOLTIP',
                    toolTiptext: 'Attention: Please enclose your Driver’s License or State ID upon submitting.',
                    onChangeField: onChangeResidency,
                    required: true,
                    value: taxPayerDetails.licenseOrStateId ? taxPayerDetails.licenseOrStateId : '',
                    disable: isReadOnly,
                    type: 'file',
                    config: {
                        rules: [{ required: false, message: 'Please Enter Monthly Rent Paid' }],
                    }
                },
        ]
    }, [taxPayerDetails, isReadOnly])

    const addResidentTaxPayer = useCallback(() => {
        const values = [...taxPayer]
        values.push({ ...residencyEmptyContextTaxPayer })
        setTaxPayer(values);
    }, [taxPayer])

    const deleteResidentTaxPayer = useCallback((index: number) => {
        const copyResidency = [...taxPayer]
        setTaxPayer(copyResidency.filter((_: any, i: number) => i !== index))
    },[taxPayer])


    const addResidentSpouse = useCallback(() => {
        const values = [...spouse]
        values.push({ ...residencyEmptyContextSpouse })
        setSpouse(values);
    },[spouse])

    const deleteResidentSpouse = useCallback((index: number) => {
        const copyResidency = [...spouse]
        setSpouse(copyResidency.filter((_: any, i: number) => i !== index))
    },[spouse])

    const onSubmitResidency = useCallback((values: any) => {
        setValidate(true)
         setValidateDetails(true)
        const copyTaxPayerDetails = {...taxPayerDetails}
        if(copyTaxPayerDetails?.showMonthlyRendPaid === '0'){
            delete copyTaxPayerDetails?.monthlyRendPaid
        }
        if(copyTaxPayerDetails?.showMassachusettsInsurance === '0'){
            delete copyTaxPayerDetails?.massachusettsInsurance
        }
        if(copyTaxPayerDetails?.showselfspouseReside === '0'){
            delete copyTaxPayerDetails?.selfspouseReside
        }
        if(copyTaxPayerDetails?.showLicenseOrStateId === '0'){
            delete copyTaxPayerDetails?.licenseOrStateId
        }

         let isValidDetails = true;
        isValidDetails = isEmptyKeys(copyTaxPayerDetails, 'ALL',[]);
        if(!isValidDetails){
            console.log("v", copyTaxPayerDetails)
            dispatch(setError({ status: true, type: 'error', message: 'Form validation Error' }))
            return;
        }

        const residencyArray = [...taxPayer, ...spouse]
        let isValidData = true;

        isValidData = residencyArray.every((resident: any) => isEmptyKeys(resident, 'ALL',[]));

        if(!isValidData){
            console.log("vb", copyTaxPayerDetails)
            dispatch(setError({ status: true, type: 'error', message: 'Form validation Error' }))
            return;
        }

        const modifiedData = residencyArray.map((resident: any) => {
            const copyResident = {...resident}
            if(typeof copyResident.startDate === 'object' || typeof copyResident.endDate === 'object'){
                copyResident.startDate = convertToDate(copyResident.startDate)
                copyResident.endDate = convertToDate(copyResident.endDate)
            }
            return copyResident
        })

        const formData = new FormData()
        Object.keys(copyTaxPayerDetails).forEach((key: any) => {
            if(key === 'monthlyRendPaidStates') {
                if (copyTaxPayerDetails[key].length > 0) {
                    copyTaxPayerDetails[key].map((item:any, index:any) => {
                        formData.append(`${key}[${index}]`, item); // Append each file
                    })                    
                }
            } else  if((typeof copyTaxPayerDetails[key] === 'string' && copyTaxPayerDetails[key].length < 2 ) || typeof copyTaxPayerDetails[key] === 'object' || key === 'monthlyRendPaid'){
                formData.append(key, copyTaxPayerDetails[key])
            }
        }) 
        formData.append('usStatesResidency', JSON.stringify(modifiedData))
        if (monthly_other_documents.length > 0) {
            Array.from(monthly_other_documents).forEach(file => {
                formData.append('others', file); // Append each file
            });
        }
       dispatch(updateStateResidency(formData, leadData?.lead_id))
    },[spouse, taxPayer,localStoreData])

    const submitVerifyStatus = (e: any) => {
        if(leadData !== null){
            let obj = {
                verifyResidencyInfo: e.target.checked ? "1" : '0'
            }
            dispatch(initUpdateVerifyStatus(leadData?.lead_id, obj))
        }
    }

    useEffect(() => {
        let conditionalKeys = Object.keys(showFields)

        // console.log('showFields',showFields)
        let existingKeys = filterFields.map((field: any) => field.key)
        conditionalKeys.forEach((fieldKey: any) => {
            if(showFields[fieldKey]){
                existingKeys.push(fieldKey)
            }else{
                existingKeys = existingKeys.filter((key: any) => key !== fieldKey)
            }
        })
        // console.log('showFields filter',formFields.filter((field: any) => existingKeys.includes(field.key)))

        setfilterFields(formFields.filter((field: any) => existingKeys.includes(field.key)))
    }, [showFields])

    useEffect(() => {
        const yesNoElements = [{ clientKey: 'showselfspouseReside', serverKey: 'spouse_reside'}, { clientKey: 'showLicenseOrStateId', serverKey: 'license_or_state_opt'}, { clientKey: 'showMassachusettsInsurance', serverKey: 'massachusetts_insurance'}, { clientKey: 'showMonthlyRendPaid', serverKey: 'monthly_rent_paid_opt'}]
        if(leadData){
            let residentData = {
            ...leadData,
        }
        let residentKeys = residentData ? Object.keys(residentData) : []
        if(residentKeys.length > 0){
            setfilterFields(formFields.filter((field: any) => {
                const indexs = yesNoElements.findIndex((key: any) => key.clientKey === field.parentKey[0])
                return ((field?.parentKey.length > 0 && indexs > -1 && yesNoElements[indexs].clientKey === field.parentKey[0] && residentData[yesNoElements[indexs].serverKey] === '1') || field?.parentKey.length === 0)
            }))
        }else{
            setfilterFields(formFields.filter((field: any) => field?.parentKey.length === 0))
        }
        }else{
            setfilterFields(formFields.filter((field: any) => field?.parentKey.length === 0))
        }
        
    }, [])

    useEffect(() => {
        if(validate){
            form.submit()
            setValidateDetails(false)
        }
    }, [validate])

    useEffect(() => {
        if(leadData && Object.keys(leadData).length > 0 && !Array.isArray(leadData)){
            const { marital_status, usStatesResidency, spouseDetails, dependentDetails, first_name, spouse_reside,
                license_or_state_opt,
                massachusetts_insurance,
                monthly_rent_paid_opt, 
                monthly_rent_paid_states,
                massachusetts_insurance_path,
                monthly_rent_paid_value,
                license_or_state_path,
                spouse_reside_path } = leadData;
            if(marital_status === "2"){
                setShowSpouseTaxes(true)
                const spouseTaxPayer = usStatesResidency.filter((resident: any) => resident.type === "2")
                if(spouseTaxPayer.length > 0){
                    setSpouse(spouseTaxPayer.map((taxPayer: any) => ({
                        taxPayer: taxPayer.tax_payer,
                        taxYear: taxPayer.tax_year,
                        state: taxPayer.state,
                        startDate: taxPayer.start_date,
                        endDate: taxPayer.end_date,
                        type: taxPayer.type
                    })))
                }else{
                    setSpouse([{...residencyEmptyContextSpouse}])
                }
            }else{
                setShowSpouseTaxes(false)
            }
            setShowTaxPayer(true)
            if(usStatesResidency.length > 0){
                const filterTaxPayer = usStatesResidency.filter((resident: any) => resident.type === "1")
                if(filterTaxPayer.length > 0){
                    setTaxPayer(filterTaxPayer.map((taxPayer: any) => ({
                        taxPayer: taxPayer.tax_payer,
                        taxYear: taxPayer.tax_year,
                        state: taxPayer.state,
                        startDate: taxPayer.start_date,
                        endDate: taxPayer.end_date,
                        type: taxPayer.type
                    })))
                }
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

            setShowFields((prev: any) => {
                return {
                    ...prev,
                    monthlyRendPaid: monthly_rent_paid_opt === '1',
                    massachusettsInsurance: massachusetts_insurance === '1',
                    selfspouseReside: spouse_reside === '1',
                    licenseOrStateId: license_or_state_opt === '1'
                }
            })

            let binedObject = {
                monthlyRendPaidStates: Array.isArray(monthly_rent_paid_states) ? monthly_rent_paid_states : [], // Ensure it's an array
                showMonthlyRendPaid: monthly_rent_paid_opt || '',
                monthlyRendPaid: monthly_rent_paid_value || '',
                showMassachusettsInsurance: massachusetts_insurance || '',
                massachusettsInsurance: massachusetts_insurance_path || '',
                showselfspouseReside: spouse_reside || '',
                selfspouseReside: spouse_reside_path || '',
                showLicenseOrStateId: license_or_state_opt || '',
                licenseOrStateId: license_or_state_path || ''
            }
            setTaxPayerDetails(binedObject)

        
            form.setFieldsValue(binedObject)
        }else{
            setShowTaxPayer(true)
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
                            new Array(3).fill('null').map((_: any, index: number) => (
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
                {
                    <>
                        <Row>
                        {leadData?.monthly_rent_paid_states?.length > 1 && (
                            <h6> Selected States list: {fileNames(leadData?.monthly_rent_paid_states)}</h6>
                        )}
                        </Row> 
                   <Form
                    form={form}
                    autoComplete="off"
                    layout='vertical'
                >
                    <Row
                        gutter={gutterBlobal}
                    >
                        {
                            filterFields.map((formItem: any, i: number) => (
                                <Col className="gutter-row" xl={6} sm={12} xs={24} key={i}>
                                    <GenerateElements elementData={formItem} />
                                </Col>
                            ))
                        }

                    </Row>

                    <Row>
  <div>
    <h5>Upload Other Rental Documents</h5>
    <input
      ref={inputRef}
      style={{ display: "none" }}
      type="file"
      multiple
      onChange={(e: any) => {
        if (e.target.files) {
          // Convert FileList to an array and update state
          setMonthly_other_documents(Array.from(e.target.files));
        }
      }}
    />
    <Button
      type="dashed"
      style={{ padding: "4px" }}
      onClick={() => {
        if (inputRef.current) {
          inputRef.current.click();
        }
      }}
    >
      Select Multiple Files
    </Button>
    {/* Display the selected files */}
    <div style={{ marginTop: "10px" }}>
      {monthly_other_documents.length > 0 ? (
        <ul>
          {monthly_other_documents.map((file: File, index: number) => (
            <li key={index}>
              {file.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No files selected.</p>
      )}
    </div>
  </div>
</Row>


                    {leadData?.monthly_other_documents && fileNames(leadData?.monthly_other_documents)}
                        <hr />

                </Form>
                        {
                            showTaxPayer && (
                                <div style={{    position: 'relative'}}>
                                    <p>Taxpayer</p>
                                    <hr />
                                    {
                                        taxPayer.map((resident: any, index: number) => (
                                        <Resident 
                                            key={index}
                                            deleteResident={deleteResidentTaxPayer} 
                                            onChangeResidency={onChangeResidencyTaxPayer} 
                                            resident={resident} 
                                            index={index} 
                                            residency={taxPayer}
                                            validate={validate}
                                            setValidate={setValidate}
                                            isReadOnly={isReadOnly}
                                            options={options}
                                        />
                                        ))
                                    }
                                    <Col>
                                            <Form.Item>
                                                <Button
                                                    className="add-dependent-btn green mx-2"
                                                    onClick={addResidentTaxPayer}
                                                    disabled={isReadOnly}
                                                    style={{    position: 'absolute', top: '-150px', right: '20px'}}
                                                >
                                                    <PlusCircleOutlined />
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                </div>
                            )
                        }
                        {
                            showSpouseTaxes && (
                                <div style={{    position: 'relative'}}>
                                    <p>Spouse</p>
                                    <hr />
                                    {
                                        spouse.map((resident: any, index: number) => (
                                        <Resident 
                                            key={index}
                                            deleteResident={deleteResidentSpouse} 
                                            onChangeResidency={onChangeResidencySpouse} 
                                            resident={resident} 
                                            index={index} 
                                            residency={spouse}
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
                                                    onClick={addResidentSpouse} 
                                                    disabled={isReadOnly}
                                                    style={{    position: 'absolute', top: '-150px', right: '20px'}}
                                                >
                                                    <PlusCircleOutlined />
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                </div>
                            )
                        }
                    </>
                }
                <div>
                    <p><strong>Note : </strong>The states Kentucky, Michigan, New York, Ohio, Pennsylvania, Indiana, Iowa, or Maryland during Tax Year, are subject to (City or County) Taxes.</p>
                    <hr />
                </div>
                    {
                        !isReadOnly && (
                            <Row justify={'end'}>
                                <Col>
                                    <Form.Item>
                                    {localStoreData?.role == "3" && 
                                    ((leadData?.department_id == localStoreData.departmentId) || leadData === null || leadData?.assigned_agent == localStoreData.userId) &&                                                                           
                                        <Button disabled={isReadOnly} type="primary" htmlType="submit" onClick={onSubmitResidency}>
                                            Submit
                                        </Button>
                                    }
                                        {
                                            false && localStoreData && localStoreData.departmentId !== 1 && (
                                                <span className="mx-4">
                                                    <Checkbox disabled={leadData ? isReadOnly : true} checked={leadData && leadData?.residency_states_verified === '1'} onChange={submitVerifyStatus}>Verify</Checkbox>
                                                    <Checkbox disabled={leadData ? isReadOnly : true} onChange={() => dispatch(setSections('States of Residency'))}>Comment</Checkbox>
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

export default Residency
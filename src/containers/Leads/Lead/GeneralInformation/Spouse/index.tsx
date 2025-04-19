import React, { useEffect, useState, useMemo } from 'react'
import { Col, Row, Form } from "antd";
import GenerateElements from '../../../../../components/GenerateElements';
import { identificationOptions, visaTypeOptions, yesNoOptions } from '../constants';
import { gutterBlobal } from '../../constants';

const Spouse = ({ spouse, onChangeSpouseDetails, validateDependents, setValidateDependents, isReadOnly }: any) => {
    const [form] = Form.useForm()
    const [filterFields, setfilterFields] = useState<any[]>([])
    const [showFields, setShowFields] = useState<any>({
        dateOfChange: false,
        fromVisa: false,
        toVisa: false,
    })

    const onChangeDropDown = (key: string, status: boolean) => {
        if(status){
          setShowFields({
            dateOfChange: true,
            fromVisa: true,
            toVisa: true,
        })
        }else{
          setShowFields({
            dateOfChange: false,
            fromVisa: false,
            toVisa: false,
        })
      }
    }

    const spouseFields: any = useMemo(() => {
        return [
                {
                    label: 'First Name',
                    key: 'firstName',
                    childKey: [],
                    parentKey: [],
                    elementType: 'INPUT',
                    onChangeField: onChangeSpouseDetails,
                    required: true,
                    disable: isReadOnly,
                    type: 'text',
                    config: {
                        rules: [{ required: true, message: 'Please Enter First name!' }],
                    }
                },
                {
                    label: 'Middle Name',
                    key: 'middleName',
                    childKey: [],
                    parentKey: [],
                    elementType: 'INPUT',
                    onChangeField: onChangeSpouseDetails,
                    required: false,
                    disable: isReadOnly,
                    type: 'text',
                    config: {
                        rules: [{ required: false, message: 'Please Enter Middle Name!' }],
                    }
                },
                {
                    label: 'Last Name',
                    key: 'lastName',
                    childKey: [],
                    parentKey: [],
                    elementType: 'INPUT',
                    onChangeField: onChangeSpouseDetails,
                    required: true,
                    disable: isReadOnly,
                    type: 'text',
                    config: {
                        rules: [{ required: true, message: 'Please Enter Last Name!' }],
                    }
                },
                {
                    label: 'Date Of Birth',
                    key: 'dob',
                    childKey: [],
                    parentKey: [],
                    elementType: 'DATE_PICKER_DATE',
                    onChangeField: onChangeSpouseDetails,
                    required: false,
                    disable: isReadOnly,
                    type: 'date',
                    config: {
                        rules: [{ required: false, message: 'Please Enter Date of birth!' }],
                    }
                },
                {
                    label: 'Date Of Marriage',
                    key: 'dom',
                    childKey: [],
                    parentKey: [],
                    elementType: 'DATE_PICKER_DATE',
                    onChangeField: onChangeSpouseDetails,
                    required: false,
                    disable: isReadOnly,
                    type: 'date',
                    config: {
                        rules: [{ required: false, message: 'Please Enter Date Of  Marriage!' }],
                    }
                },
                {
                    label: 'Date Of entry into the U.S',
                    key: 'dateOfEntryInUs',
                    childKey: [],
                    parentKey: [],
                    elementType: 'DATE_PICKER_DATE',
                    onChangeField: onChangeSpouseDetails,
                    required: false,
                    disable: isReadOnly,
                    type: 'date',
                    config: {
                        rules: [{ required: false, message: 'Please Enter Date of birth!' }],
                    }
                },
                {
                    label: 'Occupation',
                    key: 'occupation',
                    childKey: [],
                    parentKey: [],
                    elementType: 'INPUT',
                    onChangeField: onChangeSpouseDetails,
                    required: false,
                    disable: isReadOnly,
                    type: 'text',
                    config: {
                        rules: [{ required: false, message: 'Please Enter Occupation!' }],
                    }
                },
                {
                    label: 'Visa type',
                    key: 'visaType',
                    childKey: [],
                    parentKey: [],
                    elementType: 'SELECT',
                    options: visaTypeOptions,
                    onChangeField: onChangeSpouseDetails,
                    required: false,
                    disable: isReadOnly,
                    type: 'string',
                    config: {
                        rules: [{ required: false, message: 'Please provide Visa type' }],
                    }
                },
                {
                    label: 'Latest Visa Change?',
                    key: 'changeInVisa2022',
                    childKey: ['dateOfChange', 'fromVisa', 'toVisa'],
                    parentKey: [],
                    elementType: 'SELECT',
                    onChangeField: (value: any, name: any, index: any) => {
                        onChangeSpouseDetails(value, name)
                        onChangeDropDown(name, value === '1')
                    },
                    options: yesNoOptions,
                    required: false,
                    disable: isReadOnly,
                    type: 'text',
                    config: {
                        rules: [{ required: false, message: 'Please Enter Visa Change year!' }],
                    }
                },
                {
                    label: 'Date Of Visa Change',
                    key: 'dateOfChange',
                    childKey: [],
                    parentKey: ['changeInVisa2022'],
                    elementType: 'DATE_PICKER_DATE',
                    onChangeField: onChangeSpouseDetails,
                    required: false,
                    disable: isReadOnly,
                    type: 'date',
                    config: {
                        rules: [{ required: false, message: 'Please Enter Date of birth!' }],
                    }
                },
                {
                    label: 'From visa',
                    key: 'fromVisa',
                    childKey: [],
                    parentKey: ['changeInVisa2022'],
                    onChangeField: onChangeSpouseDetails,
                    elementType: 'SELECT',
                    options: visaTypeOptions,
                    required: false,
                    disable: isReadOnly,
                    type: 'text',
                    config: {
                        rules: [{ required: false, message: 'Please Enter Date of birth!' }],
                    }
                },
                {
                    label: 'To Visa',
                    key: 'toVisa',
                    childKey: [],
                    parentKey: ['changeInVisa2022'],
                    onChangeField: onChangeSpouseDetails,
                    elementType: 'SELECT',
                    options: visaTypeOptions,
                    required: false,
                    disable: isReadOnly,
                    type: 'text',
                    config: {
                        rules: [{ required: false, message: 'Please Enter Date of birth!' }],
                    }
                },
                {
                    label: 'Identification Number',
                    key: 'identificationNumber',
                    childKey: [],
                    parentKey: [],
                    elementType: 'SELECT',
                    options: identificationOptions,
                    onChangeField: onChangeSpouseDetails,
                    required: false,
                    disable: isReadOnly,
                    type: 'string',
                    config: {
                        rules: [{ required: false, message: 'Please provide Identification Number' }],
                    }
                },
            ]
    }, [spouse, onChangeSpouseDetails, isReadOnly])

    const SSNITINElement = useMemo(() => {
        return {
        label: 'SSN/ITIN',
        key: 'ssnItinNumber',
        elementType: 'INPUT_FORMATTER',
        onChangeField: onChangeSpouseDetails,
        required: false,
        disable: isReadOnly,
        type: 'number',
        placeholder: 'SSN/ITIN',
        config: {
            rules: [{ required: false, message: 'Please provide SSN/ITIN Number' }],
        }
    }
    }, [])

    const toApplyItInElements = useMemo(() => {
        return [
                {
                    label: 'Visa Number',
                    key: 'itinnVisaNumber',
                    elementType: 'INPUT',
                    onChangeField: onChangeSpouseDetails,
                    required: false,
                    disable: isReadOnly,
                    type: 'string',
                    placeholder: 'Enter Visa Number',
                    config: {
                        rules: [{ required: false, message: 'Please provide Visa Number' }],
                    }
                },
                {
                    label: 'Visa Expiry Date',
                    key: 'foreignHomeAddress',
                    elementType: 'DATE_PICKER_DATE',
                    onChangeField: onChangeSpouseDetails,
                    required: false,
                    disable: isReadOnly,
                    type: 'date',
                    placeholder: 'Enter Visa Expiry Date',
                    config: {
                        rules: [{ required: false, message: 'Please provide Visa Expiry Date' }],
                    }
                },
                {
                    label: 'Passport Number',
                    key: 'passportNumber',
                    elementType: 'INPUT',
                    onChangeField: onChangeSpouseDetails,
                    required: false,
                    disable: isReadOnly,
                    type: 'string',
                    placeholder: 'Enter Passport Number',
                    config: {
                        rules: [{ required: false, message: 'Please provide Passport Number' }],
                    }
                },
                {
                    label: 'Passport Expiry Date',
                    key: 'passportExpiryDate',
                    elementType: 'DATE_PICKER_DATE',
                    onChangeField: onChangeSpouseDetails,
                    required: false,
                    disable: isReadOnly,
                    type: 'date',
                    placeholder: 'Enter Passport Expiry Date',
                    config: {
                        rules: [{ required: false, message: 'Please provide Passport Expiry Date' }],
                    }
                }                
            ]
    }, [spouse, onChangeSpouseDetails, filterFields, isReadOnly])

    useEffect(() => {
        form.setFieldsValue({
            firstName: spouse.firstName,
            middleName: spouse.middleName,
            lastName: spouse.lastName,
            dob: spouse.dob,
            relation: spouse.relation,
            visaType: spouse.visaType,
            changeInVisa2022: spouse.changeInVisa2022,
            countryOfCitizenship: spouse.countryOfCitizenship,
            dateOfEntryInUs: spouse.dateOfEntryInUs,
            identificationNumber: spouse.identificationNumber,
            ssnItinNumber: spouse.ssnItinNumber,
            itinnVisaNumber: spouse.itinnVisaNumber,
            passportNumber: spouse.passportNumber,
            passportExpiryDate: spouse.passportExpiryDate,
            foreignHomeAddress: spouse.foreignHomeAddress,
            dateOfChange: spouse?.dateOfChange,
            fromVisa: spouse?.fromVisa,
            toVisa: spouse?.toVisa,
            dom: spouse?.dom,
            occupation: spouse?.occupation
        })
    })

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
        setfilterFields(spouseFields.filter((field: any) => existingKeys.includes(field.key)))
    }, [showFields])
    
    useEffect(() => {
      const yesNoElements = ['changeInVisa2022']
      let residentData = {
          ...spouse
      }
      let residentKeys = spouse ? Object.keys(residentData) : []
      if(residentKeys.length > 0){
          setfilterFields(spouseFields.filter((field: any) => (field?.parentKey.length > 0 && yesNoElements.includes(field.parentKey[0]) && residentData['changeInVisa2022'] === '1') || field?.parentKey.length === 0))
      }else{
          setfilterFields(spouseFields.filter((field: any) => field?.parentKey.length === 0))
      }
  }, [])

    useEffect(() => {
        if(validateDependents){
            setValidateDependents(false)
            form.submit()
        }
    }, [validateDependents])

    return (
        <Form
            form={form}
            autoComplete="off"
            layout='vertical'
            component={false}
        >
            <Row
                className="bg-body-secondary m-0 my-2 p-3"
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
            {
                spouse.identificationNumber === "1" && (
                    <Row
                        className="bg-body-secondary m-0 my-2 p-3"
                        gutter={gutterBlobal}
                    >
                        <Col className="gutter-row" xl={6} sm={12} xs={24} key={0}>
                            <GenerateElements elementData={SSNITINElement} />
                        </Col>
                    </Row>
                )
            }
            {
                spouse.identificationNumber === "2" && (
                    <Row
                        className="bg-body-secondary m-0 my-2 p-3"
                        gutter={gutterBlobal}
                    >
                        {
                            toApplyItInElements.map((formItem: any, i: number) => (
                                <Col className="gutter-row" xl={6} sm={12} xs={24} key={i}>
                                    <GenerateElements elementData={formItem} />
                                </Col>
                            ))
                        }
                    </Row>
                )
            }
        </Form>
    )
}

export default React.memo(Spouse)
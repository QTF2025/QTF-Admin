import React, { useEffect, useState, useMemo } from 'react'
import {Col, Row, Form, Button } from "antd";
import GenerateElements from '../../../../../components/GenerateElements';
import { GenderOptions, identificationOptions, relationShipOptions, visaTypeOptions, yesNoOptions } from '../constants';
import { gutterBlobal } from '../../constants';
import { DeleteFilled } from "@ant-design/icons";
import './styles.scss'

const Dependent = ({ dependent, dependents, onChangeDependent, addDependent, deleteDependent, index, validateDependents, setValidateDependents, isReadOnly }: any) => {
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

    const dependentsFields: any = useMemo(() => {
        return [
                {
                    label: 'First Name',
                    key: 'firstName',
                    childKey: [],
                    parentKey: [],
                    elementType: 'INPUT',
                    onChangeField: onChangeDependent,
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
                    onChangeField: onChangeDependent,
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
                    onChangeField: onChangeDependent,
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
                    onChangeField: onChangeDependent,
                    required: false,
                    disable: isReadOnly,
                    type: 'date',
                    config: {
                        rules: [{ required: false, message: 'Please Enter Date of birth!' }],
                    }
                },
                {
                    label: 'Gender',
                    key: 'gender',
                    childKey: [],
                    parentKey: [],
                    elementType: 'SELECT',
                    options: GenderOptions,
                    onChangeField: onChangeDependent,
                    required: false,
                    disable: isReadOnly,
                    type: 'string',
                    config: {
                        rules: [{ required: false, message: 'Please provide Gender' }],
                    }
                },
                {
                    label: 'Relationship',
                    key: 'relation',
                    childKey: [],
                    parentKey: [],
                    elementType: 'SELECT',
                    options: relationShipOptions,
                    onChangeField: onChangeDependent,
                    required: false,
                    disable: isReadOnly,
                    type: 'string',
                    config: {
                        rules: [{ required: true, message: 'Please provide Relationship' }],
                    }
                },
                {
                    label: 'Visa type',
                    key: 'visaType',
                    childKey: [],
                    parentKey: [],
                    elementType: 'SELECT',
                    options: visaTypeOptions,
                    onChangeField: onChangeDependent,
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
                        onChangeDependent(value, name, index)
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
                    onChangeField: onChangeDependent,
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
                    onChangeField: onChangeDependent,
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
                    onChangeField: onChangeDependent,
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
                    label: 'Country Of Citizenship',
                    key: 'countryOfCitizenship',
                    childKey: [],
                    parentKey: [],
                    elementType: 'INPUT',
                    onChangeField: onChangeDependent,
                    required: false,
                    disable: isReadOnly,
                    type: 'text',
                    config: {
                        rules: [{ required: false, message: 'Please Enter Country Of Citizenship' }],
                    }
                },
                {
                    label: 'Date of entry into the US',
                    key: 'dateOfEntryInUs',
                    childKey: [],
                    parentKey: [],
                    elementType: 'DATE_PICKER_DATE',
                    onChangeField: onChangeDependent,
                    required: false,
                    disable: isReadOnly,
                    type: 'date',
                    config: {
                        rules: [{ required: false, message: 'Please Enter Date of entry' }],
                    }
                },
                {
                    label: 'Identification Number',
                    key: 'identificationNumber',
                    childKey: [],
                    parentKey: [],
                    elementType: 'SELECT',
                    options: identificationOptions,
                    onChangeField: onChangeDependent,
                    required: false,
                    disable: isReadOnly,
                    type: 'string',
                    config: {
                        rules: [{ required: false, message: 'Please provide Identification Number' }],
                    }
                },
            ]
    }, [dependent, isReadOnly])

    const SSNITINElement = useMemo(() => {
        return {
        label: 'SSN/ITIN',
        key: 'ssnItinNumber',
        elementType: 'INPUT_FORMATTER',
        onChangeField: onChangeDependent,
        required: true,
        disable: isReadOnly,
        type: 'number',
        placeholder: 'SSN/ITIN',
        config: {
            rules: [{ required: false, message: 'Please provide SSN/ITIN Number' }],
        }
    }
}, [])
    const toApplyItInFields = useMemo(() => {
        return [
                {
                    label: 'Visa Number',
                    key: 'itinnVisaNumber',
                    elementType: 'INPUT',
                    onChangeField: onChangeDependent,
                    required: true,
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
                    onChangeField: onChangeDependent,
                    required: true,
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
                    onChangeField: onChangeDependent,
                    required: true,
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
                    onChangeField: onChangeDependent,
                    required: true,
                    disable: isReadOnly,
                    type: 'date',
                    placeholder: 'Enter Passport Expiry Date',
                    config: {
                        rules: [{ required: false, message: 'Please provide Passport Expiry Date' }],
                    }
                }
                
            ]
    }, [dependent, isReadOnly])

    useEffect(() => {
        form.setFieldsValue({
            firstName: dependent.firstName,
            middleName: dependent.middleName,
            lastName: dependent.lastName,
            dob: dependent.dob,
            gender: dependent.gender,
            relation: dependent.relation,
            visaType: dependent.visaType,
            changeInVisa2022: dependent.changeInVisa2022,
            countryOfCitizenship: dependent.countryOfCitizenship,
            dateOfEntryInUs: dependent.dateOfEntryInUs,
            identificationNumber: dependent.identificationNumber,
            ssnItinNumber: dependent.ssnItinNumber,
            itinnVisaNumber: dependent.itinnVisaNumber,
            passportNumber: dependent.passportNumber,
            passportExpiryDate: dependent.passportExpiryDate,
            foreignHomeAddress: dependent.foreignHomeAddress,
            dateOfChange: dependent?.dateOfChange,
            fromVisa: dependent?.fromVisa,
            toVisa: dependent?.toVisa,
        })
    })

    useEffect(() => {
        if(validateDependents){
            form.submit()
            setValidateDependents(false)
        }
    }, [form, validateDependents, setValidateDependents])

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
        setfilterFields(dependentsFields.filter((field: any) => existingKeys.includes(field.key)))
    }, [showFields])
    
    useEffect(() => {
      const yesNoElements = ['changeInVisa2022']
      let residentData = {
          ...dependent
      }
      let residentKeys = dependent ? Object.keys(residentData) : []
      if(residentKeys.length > 0){
          setfilterFields(dependentsFields.filter((field: any) => (field?.parentKey.length > 0 && yesNoElements.includes(field.parentKey[0]) && residentData['changeInVisa2022'] === '1') || field?.parentKey.length === 0))
      }else{
          setfilterFields(dependentsFields.filter((field: any) => field?.parentKey.length === 0))
      }
  }, [])

  return (
      <Form
          form={form}
          autoComplete="off"
          layout='vertical'
          key={index}
          component={false}
          validateMessages={{ required: 'need' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{margin: 0}}>Dependent {dependents.length > 1 ? index : ''}</p>
            <div>
                {dependents.length > 1 && (
                    <Button
                        danger
                        type="text"
                        disabled={isReadOnly}
                        className="add-dependent-btn mx-2"
                        onClick={() => deleteDependent(index)}
                    >
                        <DeleteFilled />
                    </Button>
                )}
            </div>
        </div>
        <hr style={{ borderStyle: 'dashed'}}/>
          <Row
              className="bg-body-secondary m-0 my-2 p-3"
              gutter={gutterBlobal}
          >
              {
                  filterFields.map((formItem: any, i: number) => (
                      <Col className="gutter-row" xl={6} sm={12} xs={24} key={i}>
                          <GenerateElements elementData={formItem} index={index} />
                      </Col>
                  ))
              }
          </Row>
          {
              dependent.identificationNumber === "1" && (
                  <Row
                      className="bg-body-secondary m-0 my-2 p-3"
                      gutter={gutterBlobal}
                  >
                      <Col className="gutter-row" xl={6} sm={12} xs={24} key={0}>
                          <GenerateElements elementData={SSNITINElement} index={index} />
                      </Col>
                  </Row>
            )
          }
          {
              dependent.identificationNumber === "2" && (
                  <Row
                      className="bg-body-secondary m-0 my-2 p-3"
                      gutter={gutterBlobal}
                  >
                      {
                          toApplyItInFields.map((formItem: any, i: number) => (
                              <Col className="gutter-row" xl={6} sm={12} xs={24} key={i}>
                                  <GenerateElements elementData={formItem} index={index} />
                              </Col>
                          ))
                      }
                  </Row>
              )
          }
      </Form>
  )
}

export default React.memo(Dependent)
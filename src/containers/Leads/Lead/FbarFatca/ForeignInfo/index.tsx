import React, { useEffect, useMemo, useState } from 'react'
import { Col, Row, Form, Button } from "antd";
import { DeleteFilled } from "@ant-design/icons";
import { gutterBlobal } from '../../constants';
import { accountTypeOptions, singleJointOptions } from '../constants';
import GenerateElements from '../../../../../components/GenerateElements';

const ForeignInfo = ({ onChangeDetails, resident, index, deleteResident, residency, validate, setValidate, options, isReadOnly }: any) => {
    const [form] = Form.useForm()
    const [showJoint, setShowJoint] = useState<boolean>(false)

    const onChangeJointDetails = (status: any) => {
        if(!status){
            form.setFieldsValue({
                jointAccountHolder: '',
                address: '',
                ssnItinNumber: '',
                relationship: '',
                noOfJointOwners: ''
            })
        }
        setShowJoint(status)
    }

    const formFields: any = useMemo(() => {
        return [
        {
            label: 'Taxpayer',
            key: 'taxPayer',
            elementType: 'SELECT',
            onChangeField: onChangeDetails,
            options: options,
            required: true,
            disable: isReadOnly,
            type: 'string',
            placeholder: 'Select Tax Year',
            config: {
                rules: [{ required: true, message: 'Please Enter Tax Year' }],
            }
        },
        {
            label: 'Single / Joint',
            key: 'fbarFatcaBankAccountType',
            elementType: 'SELECT',
            onChangeField: (value: any, name: any, index: any) => {
                onChangeDetails(value, name, index)
                onChangeJointDetails(value === '2')
            },
            options: singleJointOptions,
            required: true,
            disable: isReadOnly,
            type: 'text',
            placeholder: 'Enter Single/ Joint',
            config: {
                rules: [{ required: true, message: 'Please Enter Single/ Joint' }],
            }
        },
        {
            label: 'Name of Account Owner',
            key: 'nameOfAccountOwner',
            elementType: 'INPUT',
            onChangeField: onChangeDetails,
            required: true,
            disable: isReadOnly,
            type: 'text',
            placeholder: 'Enter Account Owner Name',
            config: {
                rules: [{ required: true, message: 'Please Enter Account Owner Name' }],
            }
        },
        {
            label: 'Bank Name',
            key: 'fbarFatcaBankName',
            elementType: 'INPUT',
            onChangeField: onChangeDetails,
            required: true,
            disable: isReadOnly,
            type: 'text',
            placeholder: 'Enter Bank Name',
            config: {
                rules: [{ required: true, message: 'Please Enter Bank Name' }],
            }
        },
        {
            label: 'Account Number',
            key: 'fbarFatcaAccountNumber',
            elementType: 'INPUT',
            onChangeField: onChangeDetails,
            required: true,
            disable: isReadOnly,
            type: 'number',
            placeholder: 'Enter Account Number',
            config: {
                rules: [{ required: true, message: 'Please Enter Account Number' }],
            }
        },
        {
            label: 'Bank Mailing Address',
            key: 'bankMailingAddress',
            elementType: 'INPUT',
            onChangeField: onChangeDetails,
            required: true,
            disable: isReadOnly,
            type: 'text',
            placeholder: 'Enter Bank Mailing Address',
            config: {
                rules: [{ required: false, message: 'Please Enter Bank Mailing Address' }],
            }
        },
         {
            label: 'Account Type',
            key: 'fbarFatcaAccountType',
            elementType: 'SELECT',
            onChangeField: onChangeDetails,
            options: accountTypeOptions,
            required: true,
            disable: isReadOnly,
            type: 'text',
            placeholder: 'Enter Account Type',
            config: {
                rules: [{ required: false, message: 'Account Type' }],
            }
        },
        {
            label: 'Maximum Account Balance',
            key: 'maxAccountBalance',
            elementType: 'INPUT',
            onChangeField: onChangeDetails,
            required: true,
            disable: isReadOnly,
            type: 'number',
            placeholder: 'Enter Maximum Account Balance',
            config: {
                rules: [{ required: false, message: 'Please Enter Maximum Account Balance' }],
            }
        },
        {
            label: 'Year Account Balance',
            key: 'yearAccountBalance',
            elementType: 'INPUT',
            onChangeField: onChangeDetails,
            required: true,
            disable: isReadOnly,
            type: 'number',
            placeholder: 'Enter Year Account Balance',
            config: {
                rules: [{ required: false, message: 'Please Enter Year Account Balance' }],
            }
        },
        {
            label: 'Currency',
            key: 'currency',
            elementType: 'INPUT',
            onChangeField: onChangeDetails,
            required: true,
            disable: isReadOnly,
            type: 'text',
            placeholder: 'Enter Currency',
            config: {
                rules: [{ type: 'string', required: false, message: 'Please Enter Currency' }],
            }
        },
        {
            label: 'Ac. Closed in the Yr.',
            key: 'accountClosedYear',
            elementType: 'DATE_PICKER_DATE',
            onChangeField: onChangeDetails,
            required: true,
            disable: isReadOnly,
            type: 'year',
            config: {
                rules: [{ required: false, message: 'Please Enter Account closed year' }],
            }
        },
        {
            label: 'Ac. Opened in the Yr.',
            key: 'accountOpenedYear',
            elementType: 'DATE_PICKER_DATE',
            onChangeField: onChangeDetails,
            required: true,
            disable: isReadOnly,
            type: 'year',
            config: {
                rules: [{ required: false, message: 'Please Enter Account opened year' }],
            }
        },
          {
            label: 'Interest Income',
            key: 'interestIncome',
            elementType: 'INPUT',
            onChangeField: onChangeDetails,
            required: true,
            disable: isReadOnly,
            type: 'number',
            placeholder: 'Enter Interest Income',
            config: {
                rules: [{ required: false, message: 'Please Enter Interest Income' }],
            }
        },
          {
            label: 'Dividends Income',
            key: 'dividendsIncome',
            elementType: 'INPUT',
            onChangeField: onChangeDetails,
            required: true,
            disable: isReadOnly,
            type: 'number',
            placeholder: 'Enter Dividends Income',
            config: {
                rules: [{ required: false, message: 'Please Enter Dividends Income' }],
            }
        }
    ]
    }, [resident, options, isReadOnly])

    const joinHolderFields: any = useMemo(() => [
        {
            label: 'Joint Account Holder',
            key: 'jointAccountHolder',
            elementType: 'INPUT',
            onChangeField: onChangeDetails,
            required: true,
            disable: isReadOnly,
            type: 'text',
            placeholder: 'Enter Joint Account Holder',
            config: {
                rules: [{ required: true, message: 'Please Enter Joint Account Holder' }],
            }
        },
        {
            label: 'Address',
            key: 'address',
            elementType: 'INPUT',
            onChangeField: onChangeDetails,
            required: true,
            disable: isReadOnly,
            type: 'text',
            placeholder: 'Enter Address',
            config: {
                rules: [{ required: true, message: 'Please Enter Address' }],
            }
        },
        {
            label: 'SSN-ITIN / PAN',
            key: 'ssnItinNumber',
            elementType: 'INPUT_FORMATTER',
            onChangeField: onChangeDetails,
            required: true,
            disable: isReadOnly,
            type: 'text',
            placeholder: 'Enter SSN-ITIN / PAN',
            config: {
                rules: [{ required: true, message: 'Please Enter SSN-ITIN / PAN' }],
            }
        },
        {
            label: 'Relationship',
            key: 'relationship',
            elementType: 'INPUT',
            onChangeField: onChangeDetails,
            required: true,
            disable: isReadOnly,
            type: 'text',
            placeholder: 'Enter Relationship',
            config: {
                rules: [{ required: true, message: 'Please Enter Relationship' }],
            }
        },
        {
            label: 'No. of Joint Owners',
            key: 'noOfJointOwners',
            elementType: 'INPUT',
            onChangeField: onChangeDetails,
            required: true,
            disable: isReadOnly,
            type: 'number',
            placeholder: 'Enter No. of Joint Owners',
            config: {
                rules: [{ required: true, message: 'Please Enter No. of Joint Owners' }],
            }
        },
    ],[resident, isReadOnly])


    useEffect(() => {
        // console.log('resident', resident)
        if(resident && Object.keys(resident).length > 0 && !Array.isArray(resident)){
            const { 
                accountClosedYear,
                accountOpenedYear,
                bankMailingAddress,
                currency,
                dividendsIncome,
                fbarFatcaAccountNumber,
                fbarFatcaAccountType,
                fbarFatcaBankAccountType,
                fbarFatcaBankName,
                interestIncome,
                maxAccountBalance,
                nameOfAccountOwner,
                yearAccountBalance,
                jointAccountHolder,
                address,
                ssnItinNumber,
                relationship,
                noOfJointOwners,
                taxPayer
            } = resident;
            
            form.setFieldsValue({
                accountClosedYear: accountClosedYear || '',
                accountOpenedYear: accountOpenedYear || '',
                bankMailingAddress : bankMailingAddress || '',
                currency : currency || '',
                dividendsIncome : dividendsIncome || '',
                fbarFatcaAccountNumber : fbarFatcaAccountNumber || '',
                fbarFatcaAccountType : fbarFatcaAccountType || '',
                fbarFatcaBankAccountType : fbarFatcaBankAccountType || '',
                fbarFatcaBankName : fbarFatcaBankName || '',
                interestIncome : interestIncome || '',
                maxAccountBalance : maxAccountBalance || '',
                nameOfAccountOwner : nameOfAccountOwner || '',
                yearAccountBalance : yearAccountBalance || '',
                jointAccountHolder : jointAccountHolder || '',
                address : address || '',
                ssnItinNumber : ssnItinNumber || '',
                relationship : relationship || '',
                noOfJointOwners : noOfJointOwners || '',
                taxPayer: taxPayer || ''
            })

            setShowJoint(fbarFatcaBankAccountType === '2')
        }
    }, [resident])

    useEffect(() => {
        if(validate){
            form.submit()
            setValidate(false)
        }
    }, [validate])

  return (
    <>
        {
            index > 0 && <hr />
        }
        <Form
          form={form}
          autoComplete="off"
          layout='vertical'
          key={index}
      >
          <Row
              gutter={gutterBlobal}
          >
              {
                  formFields.map((formItem: any, i: number) => (
                    <Col className="gutter-row" xl={6} sm={12} xs={24} key={i}>
                        <GenerateElements elementData={formItem} index={index} />
                    </Col>
                  ))
              }
              {
                showJoint && (
                    <>
                        <br />
                        {
                            joinHolderFields.map((formItem: any, i: number) => (
                                <Col className="gutter-row" xl={6} sm={12} xs={24} key={i}>
                                    <GenerateElements elementData={formItem} index={index} />
                                </Col>
                            ))
                        }
                    </>
                )
              }
              <Col className="gutter-row m-auto" span={6}>
                  {residency.length > 1 && (
                      <Button
                          danger
                          type="text"
                          className="add-dependent-btn mx-2"
                          onClick={() => deleteResident(index)}
                      >
                          <DeleteFilled />
                      </Button>
                  )}
              </Col>
          </Row>
      </Form>
    </>
      
  )
}

export default React.memo(ForeignInfo)
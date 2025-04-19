import React, { useEffect, useMemo, useState } from 'react'
import { Col, Row, Form, Button } from "antd";
import { DeleteFilled } from "@ant-design/icons";
import { gutterBlobal } from '../../constants';
import { bankAccountTypeOptions, paymentTypeOptions } from '../constants';
import GenerateElements from '../../../../../components/GenerateElements';
import dayjs from 'dayjs';

const BankAccount = ({ onChangeBankDetails, resident, index, deleteBankResident, residency, validate, setValidate, options, isReadOnly }: any) => {
    const [form] = Form.useForm();
    const [selectedPaymentType, setSelectedPaymentType] = useState<string | null>(null);

    // Memoized formFields
    const formFields: any = useMemo(() => {
      const fields = [
        {
          label: 'Taxpayer',
          key: 'taxPayer',
          elementType: 'SELECT',
          onChangeField: onChangeBankDetails,
          options: options,
          required: true,
          disable: false,
          type: 'string',
          placeholder: 'Select Tax Year',
          config: {
            rules: [{ required: true, message: 'Please Enter Tax Year' }],
          },
        },
        {
          label: 'Bank Name',
          key: 'bankName',
          elementType: 'INPUT',
          onChangeField: onChangeBankDetails,
          required: true,
          disable: false,
          type: 'text',
          placeholder: 'Enter Bank Name',
          config: {
            rules: [{ required: true, message: 'Please Enter Bank Name' }],
          },
        },
        {
          label: 'Account Number',
          key: 'accountNumber',
          elementType: 'INPUT',
          onChangeField: onChangeBankDetails,
          required: true,
          disable: false,
          type: 'number',
          placeholder: 'Enter Account Number',
          config: {
            rules: [{ required: true, message: 'Please Enter Account Number' }],
          },
        },
        {
          label: 'Routing Number',
          key: 'routingNumber',
          elementType: 'INPUT',
          onChangeField: onChangeBankDetails,
          required: true,
          disable: false,
          type: 'number',
          placeholder: 'Enter Routing Number',
          config: {
            rules: [{ required: true, message: 'Please Enter Routing Number' }],
          },
        },
        {
          label: 'Account Type',
          key: 'accountType',
          elementType: 'SELECT',
          onChangeField: onChangeBankDetails,
          options: bankAccountTypeOptions,
          required: true,
          disable: false,
          type: 'text',
          placeholder: 'Select Account Type',
          config: {
            rules: [{ required: true, message: 'Please Enter Account Type' }],
          },
        },
        {
          label: 'Account Owner Name',
          key: 'accountOwnerName',
          elementType: 'INPUT',
          onChangeField: onChangeBankDetails,
          required: true,
          disable: false,
          type: 'text',
          placeholder: 'Enter Account Owner Name',
          config: {
            rules: [{ required: true, message: 'Please Enter Account Owner Name' }],
          },
        },
        {
          label: 'Payment Type',
          key: 'paymentType',
          elementType: 'SELECT',
          onChangeField: onChangeBankDetails,
          options: paymentTypeOptions,
          required: false,
          disable: false,
          type: 'text',
          placeholder: 'Select Payment Type',
          config: {
            rules: [{ required: false, message: 'Please Select Payment Type' }],
          },
        },
        {        
            label: 'Payment Date',
            key: 'paymentDate',
            elementType: 'DATE_PICKER_DATE',
            onChangeField: onChangeBankDetails,
            required: true,
            disable: form.getFieldValue("paymentType") !== '1',
            type: 'date',
            placeholder: 'Select Payment Date', // Add placeholder
            config: {
              rules: [{ required: false, message: 'Please Enter Payment Date' }],
            },
          
        }
      ];

        return fields;
    }, [resident, options, selectedPaymentType]);

    // Set form values when resident data is available
    useEffect(() => {
      console.log(resident, 'resident')
        if (resident && Object.keys(resident).length > 0 && !Array.isArray(resident)) {
            const {
                accountNumber,
                accountOwnerName,
                accountType,
                bankName,
                routingNumber,
                taxPayer,
                paymentType,
                paymentDate,
            } = resident;
            form.setFieldsValue({
                accountNumber: accountNumber || '',
                accountOwnerName: accountOwnerName || '',
                accountType: accountType || '',
                bankName: bankName || '',
                routingNumber: routingNumber || '',
                taxPayer: taxPayer || '',
                paymentType: paymentType || '',
                paymentDate: paymentDate ? dayjs(paymentDate).startOf('day') : null, 
              });
        }
    }, [resident, form]);

    useEffect(() => {
        if(validate){
            form.submit()
            setValidate(false)
        }
    }, [validate])

    return (
        <>
            {index > 0 && <hr />}
            <Form
                form={form}
                autoComplete="off"
                layout='vertical'
                key={index}
            >
                <Row gutter={gutterBlobal}>
                    {formFields.map((formItem: any, i: number) => (
                        <Col className="gutter-row" xl={6} sm={12} xs={24} key={i}>
                            <GenerateElements elementData={formItem} index={index} />
                        </Col>
                    ))}
                    <Col className="gutter-row m-auto" span={6}>
                        {residency.length > 1 && (
                            <Button
                                danger
                                type="text"
                                className="add-dependent-btn mx-2"
                                onClick={() => deleteBankResident(index)}
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

export default React.memo(BankAccount);

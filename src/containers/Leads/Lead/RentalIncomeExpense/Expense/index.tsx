import React, { useEffect, memo, useMemo } from 'react'
import { Col, Row, Form, Button } from "antd";
import { DeleteFilled } from "@ant-design/icons";
import GenerateElements from '../../../../../components/GenerateElements';
import { gutterBlobal } from '../../constants';

const Expense = ({ onChange, item, index, onDelete, data, options, validate, setValidate, isReadOnly }: any) => {
    const [form] = Form.useForm();

    const formFields: any = useMemo(() => {
        return [
            {
                label: 'Taxpayer',
                key: 'taxPayer',
                elementType: 'SELECT',
                onChangeField: onChange,
                options: options,
                required: true,
                disable: isReadOnly,
                type: 'string',
                placeholder: 'Select Tax Payer',
                config: {
                    rules: [{ required: true, message: 'Please Enter Tax Payer' }],
                }
            },
            // {
            //     label: 'Owner Ship',
            //     key: 'ownership',
            //     elementType: 'INPUT',
            //     onChangeField: onChange,
            //     required: true,
            //     disable: isReadOnly,
            //     type: 'text',
            //     placeholder: 'Enter Owner Ship',
            //     config: {
            //         rules: [{ required: false, message: 'Please Enter Owner Ship' }],
            //     }
            // },
            {
                label: 'Address',
                key: 'address',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: false,
                disable: isReadOnly,
                type: 'text',
                placeholder: 'Enter Address',
                config: {
                    rules: [{ required: false, message: 'Please Enter Address' }],
                }
            },
            {
                label: 'Date Placed in Service',
                key: 'datePlacedInService',
                elementType: 'DATE_PICKER_DATE',
                onChangeField: onChange,
                required: true,
                disable: isReadOnly,
                type: 'date',
                config: {
                    rules: [{ required: true, message: 'Please Enter Placed in Service!' }],
                }
            },
            {
                label: 'Property Value',
                key: 'propertyCostBasics',
                elementType: 'INPUT_MAX',
                onChangeField: onChange,
                required: false,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Property Value',
                config: {
                    rules: [{ required: false, message: 'Please Enter Property Value' }],
                }
            },
            {
                label: 'Fair Rental Days ',
                key: 'fairRentalDays',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: false,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Fair Rental Days ',
                config: {
                    rules: [{ required: false, message: 'Please Enter Fair Rental Days ' }],
                }
            },
            {
                label: 'Personal Use Days',
                key: 'personalUseDays',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: false,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Personal Use Days',
                config: {
                    rules: [{ required: false, message: 'Please Enter Personal Use Days' }],
                }
            },
            {
                label: 'Total Rents Received in the Tax Year',
                key: 'rentReceived',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: false,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Rent Received',
                config: {
                    rules: [{ required: false, message: 'Please Enter Rent Received' }],
                }
            },
            // {
            //     label: 'Expenses',
            //     key: 'expenses',
            //     elementType: 'INPUT',
            //     onChangeField: onChange,
            //     required: false,
            //     disable: isReadOnly,
            //     type: 'number',
            //     placeholder: 'Enter Expenses',
            //     config: {
            //         rules: [{ required: false, message: 'Please Enter Expenses' }],
            //     }
            // },
            {
                label: 'Advertising',
                key: 'advertising',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: false,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Advertising',
                config: {
                    rules: [{ required: false, message: 'Please Enter Advertising' }],
                }
            },
            {
                label: 'Commissions',
                key: 'commisionsPaid',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: false,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Commissions Paid',
                config: {
                    rules: [{ required: false, message: 'Please Enter Commissions Paid' }],
                }
            },
            {
                label: 'Mortgage Interest',
                key: 'others3',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: false,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Other2',
                config: {
                    rules: [{ required: false, message: 'Please Enter Other2' }],
                }
            },
            {
                label: 'Cleaning Maintenance',
                key: 'clearingMaintainance',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: false,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Cleaning Maintenance',
                config: {
                    rules: [{ required: false, message: 'Please Enter Cleaning Maintenance' }],
                }
            },
            {
                label: 'Repairs',
                key: 'repairMaintainance',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: false,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Repairs & Maintenance',
                config: {
                    rules: [{ required: false, message: 'Please Enter Repairs & Maintenance' }],
                }
            },
            {
                label: 'Supplies',
                key: 'supplies',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: false,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Supplies',
                config: {
                    rules: [{ required: false, message: 'Please Enter Supplies' }],
                }
            },
            {
                label: 'Management Fees',
                key: 'managementFees',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: false,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Management Fees',
                config: {
                    rules: [{ required: false, message: 'Please Enter Management Fees' }],
                }
            },
            
            {
                label: 'Utilities',
                key: 'utilities',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: false,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Utilities',
                config: {
                    rules: [{ required: false, message: 'Please Enter Utilities' }],
                }
            },
            {
                label: 'Taxes',
                key: 'taxes',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: false,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Taxes',
                config: {
                    rules: [{ required: false, message: 'Please Enter Taxes' }],
                }
            },
            {
                label: 'Insurance',
                key: 'insurance',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: false,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Insurance',
                config: {
                    rules: [{ required: false, message: 'Please Enter Insurance' }],
                }
            },
             {
                label: 'Auto Travel',
                key: 'autoTravel',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: false,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Auto Travel',
                config: {
                    rules: [{ required: false, message: 'Please Enter Auto Travel' }],
                }
            },
            {
                label: 'Legal Expenses',
                key: 'others',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: false,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Other',
                config: {
                    rules: [{ required: false, message: 'Please Enter Other' }],
                }
            },
            {
                label: 'Misc. Expenses (Others)',
                key: 'others2',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: false,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Other1',
                config: {
                    rules: [{ required: false, message: 'Please Enter Other1' }],
                }
            },
            {
                label: 'Association Dues',
                key: 'associationDues',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: false,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Association Dues',
                config: {
                    rules: [{ required: false, message: 'Please Enter Association Dues' }],
                }
            },
           
            {
                label: 'Auto Miles',
                key: 'autoMiles',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: false,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Auto Miles',
                config: {
                    rules: [{ required: false, message: 'Please Enter Auto Miles' }],
                }
            },
            
            
            {
                label: 'Grounds Gardening',
                key: 'groundsGardening',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: false,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Grounds Gardening',
                config: {
                    rules: [{ required: false, message: 'Please Enter Grounds Gardening' }],
                }
            },
            
            {
                label: 'Interest Expense',
                key: 'interestExpense',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: false,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Interest Expense',
                config: {
                    rules: [{ required: false, message: 'Please Enter Interest Expense' }],
                }
            },
            {
                label: 'Pest Control',
                key: 'pestControl',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: false,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Pest Control',
                config: {
                    rules: [{ required: false, message: 'Please Enter Pest Control' }],
                }
            },
            
            
        ]
    },[item, options, isReadOnly])
    
    useEffect(() => {
        form.setFieldsValue({
            address: item.address,
            advertising: item.advertising,
            associationDues: item.associationDues,
            autoMiles: item.autoMiles,
            autoTravel: item.autoTravel,
            clearingMaintainance: item.clearingMaintainance,
            commisionsPaid: item.commisionsPaid,
            datePlacedInService: item.datePlacedInService,
            // expenses: item.expenses,
            groundsGardening: item.groundsGardening,
            insurance: item.insurance,
            interestExpense: item.interestExpense,
            managementFees: item.managementFees,
            others: item.others,
            others2: item.others2,
            others3: item.others3,
            // ownership: item.ownership,
            pestControl: item.pestControl ,
            propertyCostBasics: item.propertyCostBasics ,
            rentReceived: item.rentReceived,
            repairMaintainance: item.repairMaintainance,
            supplies: item.supplies,
            taxPayer: item.taxPayer,
            taxes: item.taxes,
            utilities: item.utilities,
            fairRentalDays: item?.fairRentalDays,
            personalUseDays: item?.personalUseDays,
        })
    })

    useEffect(() => {
        if(validate){
            form.submit()
            setValidate(false)
        }
    }, [validate])

  return (
      <>
        <Form
          form={form}
          autoComplete="off"
          layout='vertical'
          key={index}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{margin: 0}}>Expense {data.length > 1 ? index : ''}</p>
            <div>
                {data.length > 1 && (
                    <Button
                        danger
                        type="text"
                        className="add-dependent-btn mx-2"
                        onClick={() => onDelete(index)}
                        disabled={isReadOnly}
                    >
                        <DeleteFilled />
                    </Button>
                )}
            </div>
        </div>
        <hr style={{ borderStyle: 'dashed'}}/>
        <Row
            gutter={gutterBlobal}
        >
            {
                formFields.map((formItem: any, i: number) => (
                <Col className="gutter-row" xl={4} sm={12} xs={24} key={i}>
                    <GenerateElements elementData={formItem} index={index} />
                </Col>
                ))
            }
        </Row>
      </Form>
      </>
  )
}

export default memo(Expense)
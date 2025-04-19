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
            {
                label: 'Ownership',
                key: 'ownerShip',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: true,
                disable: isReadOnly,
                type: 'text',
                placeholder: 'Enter Ownership',
                config: {
                    rules: [{ required: false, message: 'Please Enter Ownership' }],
                }
            },
            {
                label: 'Name Of the Business',
                key: 'nameOfBusiness',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: false,
                disable: isReadOnly,
                type: 'text',
                placeholder: 'Enter Name Of the Business',
                config: {
                    rules: [{ required: false, message: 'Please Enter Name Of the Business' }],
                }
            },
            {
                label: 'Address Of the Business',
                key: 'addressOfBusiness',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: true,
                disable: isReadOnly,
                type: 'text',
                placeholder: 'Enter Address Of the Business',
                config: {
                    rules: [{ required: false, message: 'Please Enter Address Of the Business' }],
                }
            },
            {
                label: 'Category Of Business',
                key: 'categoryOfBusiness',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: true,
                disable: isReadOnly,
                type: 'text',
                placeholder: 'Enter Category Of Business',
                config: {
                    rules: [{ required: false, message: 'Please Enter Category Of Business' }],
                }
            },
            {
                label: 'Date Started',
                key: 'dateStarted',
                elementType: 'DATE_PICKER_DATE',
                onChangeField: onChange,
                required: true,
                disable: isReadOnly,
                type: 'date',
                placeholder: 'Enter Date Started',
                config: {
                    rules: [{ required: true, message: 'Please Enter Date Started' }],
                }
            },
            {
                label: 'Gross Receipts',
                key: 'grossReceipts',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: true,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Gross Receipts',
                config: {
                    rules: [{ required: false, message: 'Please Enter Gross Receipts' }],
                }
            },
            {
                label: 'Other Income',
                key: 'otherIncome',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: true,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Other Income',
                config: {
                    rules: [{ required: false, message: 'Please Enter Other Income' }],
                }
            },
            {
                label: 'COGS',
                key: 'cogs',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: true,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter COGS',
                config: {
                    rules: [{ required: false, message: 'Please Enter COGS' }],
                }
            },
            {
                label: 'Advertisingate',
                key: 'advertisingate',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: true,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Advertisingate',
                config: {
                    rules: [{ required: false, message: 'Please Enter Advertisingate' }],
                }
            },
            {
                label: 'Commissions Fees',
                key: 'commisionFees',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: true,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Commissions Fees',
                config: {
                    rules: [{ required: false, message: 'Please Enter Commissions Fees!' }],
                }
            },
            {
                label: 'Dues Publications',
                key: 'duesPublications',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: true,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Dues Publications',
                config: {
                    rules: [{ required: false, message: 'Please Enter Dues Publications' }],
                }
            },
            {
                label: 'Interest Expense',
                key: 'interestExpense',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: true,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Interest Expense',
                config: {
                    rules: [{ required: false, message: 'Please Enter Interest Expense' }],
                }
            },
            {
                label: 'Insurance',
                key: 'insurance',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: true,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Insurance',
                config: {
                    rules: [{ required: false, message: 'Please Enter Insurance' }],
                }
            },
            {
                label: 'Legal Professional',
                key: 'leagalProfessionals',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: true,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Legal Professional',
                config: {
                    rules: [{ required: false, message: 'Please Enter Legal Professional' }],
                }
            },
            {
                label: 'Office Expenses',
                key: 'officeExpenses',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: true,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Office Expenses',
                config: {
                    rules: [{ required: false, message: 'Please Enter Office Expenses' }],
                }
            },
            {
                label: 'Office Rent Expenses',
                key: 'officeRentExpenses',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: true,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Office Rent Expenses',
                config: {
                    rules: [{ required: false, message: 'Please Enter Office Rent Expenses' }],
                }
            },
            {
                label: 'Equipment Rental',
                key: 'eqipmentRentalExpenses',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: true,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Equipment Rental Expenses',
                config: {
                    rules: [{ required: false, message: 'Please Enter Equipment Rental Expenses' }],
                }
            },
            {
                label: 'Repairs Expenses',
                key: 'repairsExpenses',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: true,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Repairs Expenses',
                config: {
                    rules: [{ required: false, message: 'Please Enter Repairs Expenses' }],
                }
            },
            {
                label: 'Supplies Expenses',
                key: 'suppliesExpenses',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: true,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Supplies Expenses',
                config: {
                    rules: [{ required: false, message: 'Please Enter Supplies Expenses' }],
                }
            },
            {
                label: 'Taxes',
                key: 'taxes',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: true,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Taxes',
                config: {
                    rules: [{ required: false, message: 'Please Enter Taxes' }],
                }
            },
            {
                label: 'Travel Expenses',
                key: 'travelExpenses',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: true,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Travel Expenses',
                config: {
                    rules: [{ required: false, message: 'Please Enter Travel Expenses' }],
                }
            },
            {
                label: 'Meals Entertainment Paid',
                key: 'mealsEntertainmentPaid',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: true,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Meals Entertainment Paid',
                config: {
                    rules: [{ required: false, message: 'Please Enter Meals Entertainment Paid' }],
                }
            },
            {
                label: 'Telephone',
                key: 'telephone',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: true,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Telephone',
                config: {
                    rules: [{ required: false, message: 'Please Enter Telephone' }],
                }
            },
            {
                label: 'Utilities',
                key: 'utilities',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: true,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Utilities',
                config: {
                    rules: [{ required: false, message: 'Please Enter Utilities' }],
                }
            },
            {
                label: 'Wages',
                key: 'wages',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: true,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Wages',
                config: {
                    rules: [{ required: false, message: 'Please Enter Wages' }],
                }
            },
            {
                label: 'Postage',
                key: 'postage',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: true,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Postage',
                config: {
                    rules: [{ required: false, message: 'Please Enter Postage' }],
                }
            },
            {
                label: 'Auto Expenses',
                key: 'autoExpenses',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: true,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Auto Expenses',
                config: {
                    rules: [{ required: false, message: 'Please Enter Auto Expenses' }],
                }
            },
            {
                label: 'Auto Milesl',
                key: 'autoMiles',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: true,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Auto Milesl',
                config: {
                    rules: [{ required: false, message: 'Please Enter Auto Milesl' }],
                }
            },
            {
                label: 'Bank Charges',
                key: 'bankCharges',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: true,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Bank Charges',
                config: {
                    rules: [{ required: false, message: 'Please Enter Bank Charges' }],
                }
            },
            {
                label: 'Tools Equipment',
                key: 'toolsEquipment',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: true,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Tools Equipment',
                config: {
                    rules: [{ required: false, message: 'Please Enter Tools Equipment' }],
                }
            },
            {
                label: 'Other',
                key: 'others',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: true,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Other',
                config: {
                    rules: [{ required: false, message: 'Please Enter Other' }],
                }
            },
            {
                label: 'Area used for business',
                key: 'business',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: true,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Business',
                config: {
                    rules: [{ required: false, message: 'Please Enter Business' }],
                }
            },
            {
                label: 'Total area of home',
                key: 'home',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: true,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Home',
                config: {
                    rules: [{ required: false, message: 'Please Enter Home' }],
                }
            },
        ]
    },[item, options, isReadOnly])
    
    useEffect(() => {
        form.setFieldsValue({
            advertisingate: item.advertisingate,
            autoExpenses: item.autoExpenses,
            autoMiles: item.autoMiles,
            bankCharges: item.bankCharges,
            business: item.business,
            commisionFees: item.commisionFees,
            duesPublications: item.duesPublications,
            eqipmentRentalExpenses: item.eqipmentRentalExpenses,
            footage: item.footage,
            home: item.home,
            insurance: item.insurance,
            interestExpense: item.interestExpense,
            leagalProfessionals: item.leagalProfessionals,
            mealsEntertainmentPaid: item.mealsEntertainmentPaid,
            officeExpenses: item.officeExpenses,
            officeRentExpenses: item.officeRentExpenses,
            others: item.others,
            postage: item.postage,
            repairsExpenses: item.repairsExpenses,
            suppliesExpenses: item.suppliesExpenses,
            taxPayer: item.taxPayer,
            taxes: item.taxes,
            telephone: item.telephone,
            toolsEquipment: item.toolsEquipment,
            travelExpenses: item.travelExpenses,
            utilities: item.utilities,
            wages: item.wages,
            ownerShip: item?.ownerShip,
            nameOfBusiness: item?.nameOfBusiness,
            addressOfBusiness: item?.addressOfBusiness,
            categoryOfBusiness: item?.categoryOfBusiness,
            dateStarted: item?.dateStarted,
            grossReceipts: item?.grossReceipts,
            otherIncome: item?.otherIncome,
            cogs: item?.cogs,
        })
    })
    

    useEffect(() => {
        if (validate) {
            form.submit();
            setValidate(false);
        }
    }, [validate, form, setValidate]);

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
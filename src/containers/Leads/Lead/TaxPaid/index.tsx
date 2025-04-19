import React, { useState, useEffect, useMemo } from 'react'
import { Col, Row, Form, Button, Checkbox } from "antd";
import { gutterBlobal } from '../constants';
import GenerateElements from '../../../../components/GenerateElements';
import Skeleton from '../../../../components/Skeletons';
import localStorageContent from '../../../../utils/localstorage';
import { useDispatch, useSelector } from 'react-redux';
import { IInitialState } from '../../../../store/reducers/models';
import { addTaxFile, initUpdateVerifyStatus } from '../../../../store/actions/creators';
import { setSections } from '../../../../store/reducers';

function MedicalExpenses() {
    const [form] = Form.useForm()
    const [propertyTaxFile, setPropertyTaxFile] = useState('');
    const [fileChanged, setFileChanged] = useState<boolean>(false) 
    const [isReadOnly, setIsReadOnly] = useState<boolean>(false)
    const localStoreData = localStorageContent.getUserData()
    const gloablStore = useSelector((state: any) => state.store)
    const { isleadDetailsLoading, leadData }: IInitialState = gloablStore
    const dispatch = useDispatch()

    const onChanggeTaxPaid = (value: any) => {
        setFileChanged(true)
        setPropertyTaxFile(value.files[0])
    }

    const formFields: any = useMemo(() => {
        return [
        {
            label: 'Tax File',
            key: 'realPropertyTax',
            elementType: 'INPUT_FILE',
            onChangeField: onChanggeTaxPaid,
            value: typeof propertyTaxFile === 'string' ? propertyTaxFile : '',
            required: true,
            disable: isReadOnly,
            type: 'file',
            placeholder: 'Enter Tax File',
            config: {
                rules: [{ required: false, message: 'Please Enter Tax File' }],
            }
        },
        {
            label: 'Personal property tax',
            key: 'personelPropertyTax',
            elementType: 'INPUT',
            onChangeField: () => {},
            required: true,
            disable: isReadOnly,
            type: 'number',
            placeholder: 'Enter Personal property tax',
            config: {
                rules: [{ required: true, message: 'Please Enter Personal property tax' }],
            }
        },
        {
            label: 'Other',
            key: 'others',
            elementType: 'INPUT',
            onChangeField: () => {},
            required: true,
            disable: isReadOnly,
            type: 'number',
            placeholder: 'Enter Other',
            config: {
                rules: [{ required: false, message: 'Please Enter Other' }],
            }
        },
        {
            label: 'Other 1',
            key: 'others2',
            elementType: 'INPUT',
            onChangeField: () => {},
            required: true,
            disable: isReadOnly,
            type: 'number',
            placeholder: 'Enter Other1',
            config: {
                rules: [{ required: false, message: 'Please Enter Other 1' }],
            }
        },
    ]
    }, [propertyTaxFile, isReadOnly])
    
     const onSubmitTaxFile = (values: any) => {
        const copyValues = {...values}
        if(propertyTaxFile === '' || propertyTaxFile === undefined){
            return;
        }
        const keys = Object.keys(values)
        const form = new FormData();
        if(fileChanged){
            form.append('file', propertyTaxFile)
        }
        keys.forEach((k: any) => {
            if(!isNaN(Number(copyValues[k])) && k !== 'realPropertyTax'){
                const value: any = Number(copyValues[k])
                form.append(k, value)
            }
        })
        dispatch(addTaxFile(form, leadData?.lead_id))
    }

    const submitVerifyStatus = (e: any) => {
        if(leadData !== null){
            let obj = {
                verifyTaxesPaid: e.target.checked ? "1" : '0'
            }
            dispatch(initUpdateVerifyStatus(leadData?.lead_id, obj))
        }
    }

    useEffect(() => {
        if(leadData && Object.keys(leadData).length > 0 && !Array.isArray(leadData)){
            const { taxesPaid } = leadData;
            if(Object.keys(taxesPaid).length > 0 && taxesPaid){
                const {
                    others,
                    others2,
                    personelPropertyTax,
                    realPropertyTax,                   
                } = taxesPaid;

               form.setFieldsValue({
                    personelPropertyTax,
                    others,
                    others2,
                })

                if(realPropertyTax){
                    setPropertyTaxFile(realPropertyTax)
                }
            }
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
                              new Array(4).fill('null').map((_: any, index: number) => (
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
                      <Form
                          form={form}
                          onFinish={onSubmitTaxFile}
                          onFinishFailed={() => { }}
                          autoComplete="off"
                          layout='vertical'
                      >
                          <Row
                              gutter={gutterBlobal}
                          >
                              {
                                  formFields.map((formItem: any, index: number) => (
                                      <Col className="gutter-row" xl={6} sm={12} xs={24} key={index}>
                                          <GenerateElements elementData={formItem} />
                                      </Col>
                                  ))
                              }
                          </Row>
                          {
                            !isReadOnly && (
                                <Row justify={'end'}>
                                    <Col>
                                        <Form.Item>
                                        {localStoreData?.role == "3" && 
                                        ((leadData?.department_id == localStoreData.departmentId) || leadData === null || leadData?.assigned_agent == localStoreData.userId ) && 
                                            <Button disabled={isReadOnly} type="primary" htmlType="submit">
                                                Submit
                                            </Button>
                                        }
                                                {
                                                    false && localStoreData && localStoreData.departmentId !== 1 && (
                                                        <span className="mx-4">
                                                            <Checkbox disabled={leadData ? isReadOnly : true} checked={leadData && leadData?.taxes_paid_verified === '1'} onChange={submitVerifyStatus}>Verify</Checkbox>
                                                            <Checkbox disabled={leadData ? isReadOnly : true} onChange={() => dispatch(setSections('Taxes Paid'))}>Comment</Checkbox>
                                                        </span>
                                                    )
                                                }
                                        </Form.Item>
                                    </Col>
                                </Row>
                            )
                          }
                      </Form>
                  </>
              )
          }
    </div>
  )
}

export default MedicalExpenses
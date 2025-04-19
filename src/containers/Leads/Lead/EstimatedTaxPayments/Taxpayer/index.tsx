import React, { useEffect, memo, useMemo } from 'react'
import { Col, Row, Form, Button } from "antd";
import { DeleteFilled } from "@ant-design/icons";
import GenerateElements from '../../../../../components/GenerateElements';
import { gutterBlobal } from '../../constants';
import { stateOptions } from '../../Residency/constants';

const TaxPayer = ({ onChange, item, index, onDelete, data, options, validate, setValidate, isReadOnly }: any) => {
    const [form] = Form.useForm();

    const formFields: any = useMemo(() => {
        return [
            {
                label: 'Tax Payer',
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
                label: 'Date',
                key: 'date',
                elementType: 'DATE_PICKER_DATE',
                onChangeField: onChange,
                required: true,
                disable: isReadOnly,
                type: 'date',
                config: {
                    rules: [{ required: true, message: 'Please Enter Date!' }],
                }
            },
            {
                label: 'Federal',
                key: 'federal',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: true,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter Federal',
                config: {
                    rules: [{ required: false, message: 'Please Enter Federal' }],
                }
            },
               {
                label: 'State',
                key: 'state',
                elementType: 'SELECT',
                onChangeField: onChange,
                required: true,
                disable: isReadOnly,
                options: stateOptions,
                type: 'text',
                placeholder: 'Enter State',
                config: {
                    rules: [{ required: false, message: 'Please Enter State' }],
                }
            },
             {
                label: 'State Amount',
                key: 'stateCnt',
                elementType: 'INPUT',
                onChangeField: onChange,
                required: false,
                disable: isReadOnly,
                type: 'number',
                placeholder: 'Enter State Amount',
                config: {
                    rules: [{ required: false, message: 'Please Enter State Amount' }],
                }
            },
        ]
    },[options, onChange,isReadOnly])
    
    useEffect(() => {
        form.setFieldsValue({
            taxPayer: item.taxPayer,
            date: item.date,
            federal: item.federal,
            state: item.state,
            stateCnt: item.stateCnt
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
            <p style={{margin: 0}}>Taxpayer {data.length > 1 ? index : ''}</p>
            <div>
                {data.length > 1 && (
                    <Button
                        danger
                        type="text"
                        className="add-dependent-btn mx-2"
                        onClick={() => onDelete(index)}
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

export default memo(TaxPayer)
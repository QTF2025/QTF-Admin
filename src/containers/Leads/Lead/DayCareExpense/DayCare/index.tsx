import React, { useEffect, useMemo } from 'react'
import { Col, Row, Form, Button } from "antd";
import { DeleteFilled } from "@ant-design/icons";
import GenerateElements from '../../../../../components/GenerateElements';
import { gutterBlobal } from '../../constants';

const DayCare = ({ onChange, item, index, ondelete, data, options, validate, setValidate, isReadOnly }: any) => {
    const [form] = Form.useForm();

    const formFields: any = useMemo(() => {
        return [
                {
                    label: 'Provider',
                    key: 'provider',
                    elementType: 'INPUT',
                    onChangeField: onChange,
                    required: true,
                    disable: isReadOnly,
                    type: 'text',
                    placeholder: 'Enter Provider',
                    config: {
                        rules: [{ required: true, message: 'Please Enter Provider' }],
                    }
                },
                {
                    label: 'Address',
                    key: 'address',
                    elementType: 'INPUT',
                    onChangeField: onChange,
                    required: true,
                    disable: isReadOnly,
                    type: 'text',
                    placeholder: 'Enter Address',
                    config: {
                        rules: [{ required: true, message: 'Please Enter Address' }],
                    }
                },
                {
                    label: 'EIN-SSN',
                    key: 'einssn',
                    elementType: 'INPUT_FORMATTER',
                    onChangeField: onChange,
                    required: true,
                    disable: isReadOnly,
                    type: 'text',
                    placeholder: 'Enter EIN-SSN',
                    config: {
                        rules: [{ required: true, message: 'Please Enter EIN-SSN' }],
                    }
                },
                {
                    label: 'Amount Paid',
                    key: 'amountPaid',
                    elementType: 'INPUT',
                    onChangeField: onChange,
                    required: true,
                    disable: isReadOnly,
                    type: 'number',
                    placeholder: 'Enter Amount Paid',
                    config: {
                        rules: [{ required: true, message: 'Please Enter Amount Paid' }],
                    }
                },
                {
                    label: 'Children Cared for',
                    key: 'childrenCaredFor',
                    elementType: 'SELECT',
                    onChangeField: onChange,
                    options: options,
                    required: true,
                    disable: isReadOnly,
                    type: 'string',
                    placeholder: 'Select Children Cared for',
                    config: {
                        rules: [{ required: true, message: 'Please Enter Children Cared for' }],
                    }
                },
            ]
    }, [options, isReadOnly])

    useEffect(() => {
        form.setFieldsValue({
            address: item.address,
            amountPaid: item.amountPaid,
            childrenCaredFor: item.childrenCaredFor,
            einssn: item.einssn,
            provider: item.provider,
        })
    })


    useEffect(() => {
        if(validate){
            form.submit()
            setValidate(false)
        }
    }, [validate])

  return (
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
                    <Col className="gutter-row" xl={4} sm={12} xs={24} key={i}>
                        <GenerateElements elementData={formItem} index={index} />
                    </Col>
                  ))
              }
              <Col className="gutter-row m-auto" span={4}>
                  {data.length > 1 && (
                      <Button
                          danger
                          type="text"
                          className="add-dependent-btn mx-2"
                          onClick={() => ondelete(index)}
                      >
                          <DeleteFilled />
                      </Button>
                  )}
              </Col>
          </Row>
      </Form>
  )
}

export default React.memo(DayCare)
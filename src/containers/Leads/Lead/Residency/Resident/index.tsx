import React, { useEffect, useMemo } from 'react'
import { stateOptions, taxYearOptions } from '../constants'
import { Col, Row, Form, Button } from "antd";
import { DeleteFilled } from "@ant-design/icons";
import GenerateElements from '../../../../../components/GenerateElements';
import { gutterBlobal } from '../../constants';
import dayjs from 'dayjs';
import { generateTaxYearMonth } from '../../../../../utils';

const Resident = ({ onChangeResidency, resident, index, deleteResident, residency, validate, setValidate, isReadOnly, options }: any) => {
    const [form] = Form.useForm();
    const currentYear = new Date().getFullYear()
    const lastSixYearsOptions = Array.from({ length: 6 }, (v, i) => {
        const year = currentYear - 1 - i; // Start from -1 year
        return { value: year, label: year };
      });
     const formFields: any = useMemo(() => {
        return [
                {
                    label: 'Taxpayer',
                    key: 'taxPayer',
                    childKey: [],
                    parentKey: [],
                    elementType: 'SELECT',
                    onChangeField: onChangeResidency,
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
                    label: 'Tax Year',
                    key: 'taxYear',
                    childKey: [],
                    parentKey: [],
                    elementType: 'SELECT',
                    onChangeField: onChangeResidency,
                    options: lastSixYearsOptions,
                    required: true,
                    disable: isReadOnly,
                    type: 'string',
                    placeholder: 'Select Tax Year',
                    config: {
                        rules: [{ required: true, message: 'Please Enter Tax Year' }],
                    }
                },
                {
                    label: 'State',
                    key: 'state',
                    childKey: [],
                    parentKey: [],
                    elementType: 'SELECT',
                    onChangeField: onChangeResidency,
                    options: stateOptions,
                    required: true,
                    disable: isReadOnly,
                    type: 'string',
                    placeholder: 'Select State',
                    config: {
                        rules: [{ required: true, message: 'Please Enter State' }],
                    }
                },
                {
                    label: 'Select Date',
                    key: 'date',
                    childKey: [],
                    parentKey: [],
                    elementType: 'DATE_PICKER_DATE_RANGE',
                    onChangeField: onChangeResidency,
                    required: true,
                    disable: isReadOnly,
                    type: 'date',
                    value: resident.startDate ? [dayjs(resident.startDate, 'YYYY/MM/DD'), dayjs(resident.endDate, 'YYYY/MM/DD')] : '',
                    config: {
                        rules: [{ required: true, message: 'Please Enter Date!' }],
                    }
                },
            ]
    }, [resident, options, isReadOnly])

    useEffect(() => {
        form.setFieldsValue({
            taxPayer: resident.taxPayer,
            taxYear: resident.taxYear,
            state: resident.state,
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
                    <Col className="gutter-row" xl={6} sm={12} xs={24} key={i}>
                        <GenerateElements elementData={formItem} index={index} />
                    </Col>
                  ))
              }
              <Col className="gutter-row m-auto" span={6}>
                  {residency.length > 1 && (
                      <Button
                          danger
                          type="text"
                          className="add-dependent-btn mx-2"
                          onClick={() => deleteResident(index)}
                          disabled={isReadOnly}
                      >
                          <DeleteFilled />
                      </Button>
                  )}
              </Col>
          </Row>
      </Form>
  )
}

export default React.memo(Resident)
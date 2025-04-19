import React, { useCallback, useState } from 'react';
import { Col, Row, Form, Button, Select } from 'antd';
import dayjs from 'dayjs';
import GenerateElements from '../GenerateElements';
import './styles.scss';
import localStorageContent from '../../utils/localstorage';

const documents = [
  { value: '1', label: 'Yes' },
  { value: '2', label: 'No' },
  { value: '0', label: 'All' },
];

const signature = [
  { value: '1', label: 'Yes' },
  { value: '2', label: 'No' },
  { value: '0', label: 'All' },
];

// Define types for props
interface Field {
  key: string;
  elementType: string;
  [key: string]: any;
}

interface SearchFilterProps {
  fields: Field[];
  onSubmit: (queryString: string) => void;
  clearSearch: () => void;
  showButtons?: boolean;
  colVal?: number;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ fields, onSubmit, clearSearch, showButtons, colVal }) => {
  const [disableBtn, setDisableBtn] = useState<boolean>(true);
  const [form] = Form.useForm();
  const localUserData = localStorageContent.getUserData()

  const generateStateValues = useCallback(() => {
    const emptyValues: Record<string, string> = {
      onlineOfflineAttachemnts: '',
      onlineFinalAttachments: '',
      onlineSignature: '',
    };

    fields.forEach((field) => {
      emptyValues[field.key] = '';
    });

    return emptyValues;
  }, [fields]);

  const onSubmitSearch = (values: Record<string, any>) => {
    const copyValues = { ...values };

    if (fields.some((field) => field.elementType === 'DATE_PICKER_DATE_RANGE') && copyValues.date?.length === 2) {
      copyValues.startDate = dayjs(copyValues.date[0]?.$d).format('YYYY-MM-DD');
      copyValues.endDate = dayjs(copyValues.date[1]?.$d).format('YYYY-MM-DD');
      delete copyValues.date;
    }

    if (fields.some((field) => field.elementType === 'DATE_PICKER_DATE_TIME') && copyValues.date) {
      copyValues.date = new Date(copyValues.date?.$d).toISOString();
    }

    const query: Record<string, any> = {};
    Object.keys(copyValues).forEach((key) => {
      if (copyValues[key] !== '' && copyValues[key] !== undefined) {
        query[key] = copyValues[key];
      }
    });

    const queryString = new URLSearchParams(query).toString();
    onSubmit(queryString);
  };

  const onClearSearch = () => {
    const stateValues = generateStateValues();
    form.setFieldsValue(stateValues);
    setDisableBtn(true);
    clearSearch();
  };

  const onChangeFieldValues = () => {
    if (form.isFieldsTouched()) {
      setDisableBtn(false);
    }
  };

  return (
    <div className="search-filter">
      <Form
        form={form}
        autoComplete="off"
        layout="horizontal"
        onFinish={onSubmitSearch}
        onValuesChange={onChangeFieldValues}
      >
        <Row gutter={{ xs: 0, sm: 10, xl: 15 }}>
          {fields.map((formItem, i) => (
            <Col className="gutter-row" xl={colVal || 6} sm={12} xs={24} key={i}>
              <GenerateElements elementData={formItem} index={i} />
            </Col>
          ))}

          {localUserData && localUserData?.departmentId === 6 && (
            <>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="onlineOfflineAttachemnts"
                  label="Documents"
                  rules={[{ required: false, message: 'Please select an attachment option!' }]}
                >
                  <Select placeholder="Select Attachments">
                    {documents.map((doc) => (
                      <Select.Option key={doc.value} value={doc.value}>
                        {doc.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="onlineFinalAttachments"
                  label="Final Documents"
                  rules={[{ required: false, message: 'Please select a final attachment option!' }]}
                >
                  <Select placeholder="Select Final Attachments">
                    {documents.map((doc) => (
                      <Select.Option key={doc.value} value={doc.value}>
                        {doc.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="onlineSignature"
                  label="Signature"
                  rules={[{ required: false, message: 'Please select a onlineSignature option!' }]}
                >
                  <Select placeholder="Select Signature">
                    {signature.map((doc) => (
                      <Select.Option key={doc.value} value={doc.value}>
                        {doc.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </>
          )}

          {showButtons && (
            <>
              <Col className="gutter-row">
                <Form.Item>
                  <Button type="primary" htmlType="submit" disabled={disableBtn}>
                    Submit
                  </Button>
                </Form.Item>
              </Col>
              <Col className="gutter-row">
                <Form.Item>
                  <Button type="default" onClick={onClearSearch} disabled={disableBtn}>
                    Clear Search
                  </Button>
                </Form.Item>
              </Col>
            </>
          )}
        </Row>
      </Form>
    </div>
  );
};

export default SearchFilter;

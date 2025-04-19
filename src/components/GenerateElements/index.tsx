import React, { useRef, useState } from 'react'
import {
    Input,
    DatePicker,
    Select,
    Form,
    Checkbox,
    InputNumber,
    Button
} from "antd";
import { MdInfoOutline } from "react-icons/md";
import { DeleteOutlined } from '@ant-design/icons';
import LeadService from '../../services/Lead.services';
import { useDispatch } from 'react-redux';
import { setError } from '../../store/reducers';
import localStorageContent from '../../utils/localstorage';


const { RangePicker } = DatePicker;
const localUserData = localStorageContent.getUserData()
const {deleteleadDocuments} = LeadService

function GenerateElements({ elementData, index }: any) {
    const ref:any = useRef('')
    const { elementType, key, label, options,onChangeField, value, config, type, disable, placeholder, Icon, toolTiptext, defaultValue } = elementData;
    const dispatch = useDispatch();

    const handleDeleteFile = async (filepath:any, key:any, label:any) => {
        let leadId = filepath.split("Lead-")?.[1]?.split("/")?.[0]
        //console.log("rrrrr", filepath)
        await deleteleadDocuments(leadId, {[key]: true})
         dispatch(setError({ status: true, type: 'success', message: `${label} Document deleted successfully!` }))
         document.getElementById(`${label}`)?.remove();
         document.getElementById(`${label}1`)?.remove();
         //window.location.reload();
    }

    let Element: JSX.Element;
    switch (elementType) {
        case 'INPUT':
            Element = (
                <Form.Item label={label} key={key} name={key} {...config} initialValue={value}>
                    <Input 
                        onChange={(e) => onChangeField(e.target.value, key, index)} 
                        name={key}
                        type={type}
                        disabled={disable}
                        placeholder={placeholder}
                    />
                </Form.Item>
            )
            break;
            case 'INPUT_MAX':
                Element = (
                    <Form.Item label={label} key={key} name={key} {...config} initialValue={value}>
                        <Input 
                            onChange={(e) => {
                                // Extract digits and preserve leading zeros
                                const newValue = e.target.value.replace(/[^\d]/g, '').slice(0, 9); 
            
                                // Update the state with the new value
                                onChangeField(newValue, key, index);
                            }} 
                            name={key}
                            type="text" // Use "text" to ensure leading zeros are preserved
                            disabled={disable}
                            placeholder={placeholder}
                            maxLength={9} // Limit the input length to 9 characters
                            value={value || ''} // Bind the value from state
                        />
                    </Form.Item>
                );
                break;
            


        case 'INPUT_CHECKBOX':
            Element = (
                <Form.Item label={label} key={key} name={key} {...config} initialValue={value}>
                    <Input 
                        onChange={(e) => onChangeField(e, key, index)} 
                        name={key}
                        type={type}
                        checked={value}
                        disabled={disable}
                        placeholder={placeholder}
                    />
                </Form.Item>
            )
            break
        case 'INPUT_PASSWORD':
            Element = (
                <Form.Item label={label} key={key} name={key} {...config} initialValue={value}>
                    <Input.Password 
                        onChange={(e) => onChangeField(e.target.value, key, index)} 
                        name={key}
                        type={type}
                        disabled={disable}
                        placeholder={placeholder}
                    />
                </Form.Item>
            )
            break;
            case 'INPUT_FORMATTER':
                const formatter = (value: any) => {
                    if (!value) return '';
                    
                    // Remove non-numeric characters but preserve leading zeros
                    const newValue = value.replace(/[^\d]/g, '');
                    
                    if (newValue) {
                        onChangeField(newValue, key, index);
                        
                        // Format as XXX-XX-XXXX, where X can be a digit including leading zeros
                        return newValue
                            .slice(0, 9) // Limit to 9 digits to fit the SSN format
                            .replace(/^(\d{3})(\d{2})(\d{0,4})$/, "$1-$2-$3");
                    } else {
                        return '';
                    }
                };

            

            const parser = (value: any) => {
                 if (!value) return '';
                return value.replace(/\D/g, '');
            };
            
            Element = (
                <Form.Item label={label} name={key} {...config} initialValue={value}>
                      <InputNumber 
                        name={key}
                        formatter={formatter}
                        parser={parser}
                        style={{ width: '100%' }}
                        maxLength={11}
                    />
                </Form.Item>
            )
            break;
        case 'INPUT_FILE':
            Element = (
                <Form.Item label={label} name={key} initialValue={value} {...config} >
                      <Input 
                        name={key}
                        type={type}
                        disabled={disable}
                        accept=".pdf,.jpg,.jpeg,.png" 
                        onChange={(e) => onChangeField(e.target, key, index)}
                    />
                    {value  && 
                        <><br></br>
                        <a href={value} target="_blank" rel="noopener noreferrer" id={`${label}1`}>{value.split('/').pop().replace(/%20/g, '')}</a>
                        {localUserData?.role === "1" && (
                            <Button
                                id={label}
                                ref={ref}
                                icon={<DeleteOutlined />}
                                onClick={() => handleDeleteFile(value, key, label)}
                                style={{ marginLeft: "5px", marginTop: "5px" }}
                            />
                        )}

                    </>
                    }
                </Form.Item>
            )
            break;
        case 'INPUT_FILE_TOOLTIP':
            Element = (
                <Form.Item label={label} name={key} initialValue={value} {...config} tooltip={{ icon: <MdInfoOutline style={{cursor: 'pointer'}} size={20}/>, title: toolTiptext }}>
                      <Input 
                        name={key}
                        type={type}
                        accept=".pdf,.jpg,.jpeg,.png" 
                        onChange={(e) => onChangeField(e.target, key, index)}
                    />
                    {value && 
                        <a href={value} target="_blank" rel="noopener noreferrer" id={`${label}1`}>{label} Document</a>
                    }
                </Form.Item>
            )
            break;
        case 'INPUT_ICON':
            Element = (
                <Form.Item label={label} key={key} name={key} {...config} initialValue={value}>
                    <Input 
                        onChange={(e) => onChangeField(e.target.value, key, index)} 
                        name={key}
                        type={type}
                        disabled={disable}
                        placeholder={placeholder}
                        prefix={<Icon />}
                    />
                </Form.Item>
            )
            break
        case 'SELECT':
            const filterOption = (input: string, option?: { label: string; value: string }) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
            Element = (
                <Form.Item label={label} key={key} name={key} {...config}>
                    <Select
                        showSearch
                        options={options}
                        // value={value}
                        onChange={(e) => onChangeField(e, key, index)}
                        placeholder={placeholder}
                        disabled={disable}
                        filterOption={filterOption}
                    />
                </Form.Item>
            )
            break;
        case 'MULTI_SELECT':
            Element = (
                <Form.Item label={label} key={key} name={key} {...config}>
                    <Select
                        mode="multiple"
                        allowClear
                        placeholder="Please select"
                        onChange={(e) => onChangeField(e, key, index)}
                        options={options}
                        disabled={disable}
                        defaultValue={defaultValue}
                    />
                </Form.Item>
            )
            break;
        case 'CHECKBOX_GROUP':
            Element = (
                <Form.Item label={label} key={key} name={key} {...config} initialValue={value}>
                    <Checkbox.Group options={options} onChange={(e) => onChangeField(e, key, index)} disabled={disable}/>
                </Form.Item>
            )
            break;
        case 'DATE_PICKER_DATE':
            Element = (
                <Form.Item label={label} key={key} name={key} {...config}>
                    <DatePicker format={'MM/DD/YYYY'} disabled={disable} picker={type} style={{ width: '100%' }} onChange={(e: any) => onChangeField(e, key, index)}/>
                </Form.Item>
            )
            break;
        case 'DATE_PICKER_DATE_TIME':
            Element = (
                <Form.Item label={label} key={key} name={key} {...config}>
                    <DatePicker format={'MM/DD/YYYY'} disabled={disable} showTime picker={type} style={{ width: '100%' }} onChange={(e: any) => onChangeField(e, key, index)}/>
                </Form.Item>
            )
            break;
        case 'DATE_PICKER_DATE_RANGE':
            Element = (
                <Form.Item label={label} key={key} name={key} {...config} initialValue={value}>
                    <RangePicker format={'MM/DD/YYYY'} disabled={disable} picker={type} style={{ width: '100%' }} onChange={(e: any) => onChangeField(e, key, index)}/>
                </Form.Item>
            )
            break;
        default:
            Element = <></>
    }

    return Element;
}

export default React.memo(GenerateElements)
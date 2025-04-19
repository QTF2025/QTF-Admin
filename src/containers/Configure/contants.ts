import { EnvironmentOutlined } from '@ant-design/icons';

export const fieldsData = [
        {
            label: 'IP Address',
            key: 'ipAddress',
            elementType: 'INPUT_ICON',
            onChangeField: () => {},
            required: true,
            disable: false,
            Icon: EnvironmentOutlined,
            type: 'text',
            placeholder: 'Enter IP Address',
            config: {
                rules: [{ required: true, message: 'Please Provide IP Address' }],
            }
        },
    ]
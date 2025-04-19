export const fieldsData = [
    {
        label: 'Children Cared for',
        key: 'childrenCaredFor',
        elementType: 'SELECT',
        onChangeField: () => {},
        options: [
            {
            value: '1',
            label: "Single",
            },
            {
            value: '2',
            label: "Joint",
            }
        ],
        required: true,
        disable: false,
        type: 'string',
        placeholder: 'Select Children Cared for',
        config: {
            rules: [{ required: false, message: 'Please Enter Children Cared for' }],
        }
    },
    {
        label: 'Name',
        key: 'name',
        elementType: 'INPUT',
        required: true,
        disable: false,
        onChangeField: () => {},
        type: 'text',
        placeholder: 'Search by Name',
        config: {
            rules: [{ required: false, message: 'Please Enter Name' }],
        }
    },
]
export const isSeniorOptions = [
  { label: '', value: 'isSenior' }
];

export const isSeniorField = {
    label: 'Is Senior',
    key: 'isSenior',
    elementType: 'CHECKBOX_GROUP',
    required: true,
    options: isSeniorOptions,
    disable: false,
    onChangeField: () => {},
    type: 'text',
    placeholder: '',
    config: {
        rules: [{ required: true, message: 'Please Select Is Senior' }],
    }
}

export const isActiveOptions = [
  { label: '', value: 'status' }
];

export const isActiveField = {
    label: 'Is Active ',
    key: 'isActive',
    elementType: 'CHECKBOX_GROUP',
    required: true,
    options: isActiveOptions,
    disable: false,
    onChangeField: () => {},
    type: 'text',
    placeholder: '',
    config: {
        rules: [{ required: true, message: 'Please Select Is Active' }],
    }
}
export const accessOptions = [
  { label: 'View', value: 'viewLead' },
  { label: 'New Lead', value: 'newLead' },
  { label: 'Edit', value: 'editLead' },
];

export const responseKeys: any = {
  assign_lead: 'assignLead',
  edit_lead: 'editLead',
  new_lead: 'newLead',
  view_lead: 'viewLead'
}

export const assignLeadOptions = [
  { label: 'Assign', value: 'assignLead' }
];

export const fieldsData = [
        {
            label: 'Department',
            key: 'departmentName',
            elementType: 'INPUT',
            required: true,
            disable: false,
            onChangeField: () => {},
            type: 'text',
            placeholder: 'Enter Department',
            config: {
                rules: [{ required: true, message: 'Please Enter Department' }],
            }
        },
        {
            label: 'Access',
            key: 'access',
            elementType: 'CHECKBOX_GROUP',
            required: true,
            options: accessOptions,
            disable: false,
            onChangeField: () => {},
            type: 'text',
            placeholder: '',
            config: {
                rules: [{ required: true, message: 'Please Select any one access' }],
            }
        },
        {
            label: 'Assign to Lead',
            key: 'assignLeads',
            elementType: 'CHECKBOX_GROUP',
            required: true,
            options: assignLeadOptions,
            disable: false,
            onChangeField: () => {},
            type: 'text',
            placeholder: '',
            config: {
                rules: [],
            }
        },
    ]
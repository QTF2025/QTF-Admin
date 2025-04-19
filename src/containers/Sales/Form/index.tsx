import React, { useEffect, useMemo, useState } from 'react'
import { Form, Button, Table, Popconfirm, Space, Select, Modal } from "antd";
import ContentHeader from '../../../components/ContentHeader'
import GenerateElements from '../../../components/GenerateElements';
import { formLayout, formTailLayout } from '../../../utils';
import useIsMobile from '../../../utils/isMobile';
import { useDispatch } from 'react-redux';
import { setError } from '../../../store/reducers';
import '../../../utils/styles/formStyles.scss'
import { options } from './constants';
import SalesService from '../../../services/Sales.services';
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import ModalDelete from './Modal';
import moment from 'moment';
import TeamService from '../../../services/Team.services';
import localStorageContent from '../../../utils/localstorage';
import { fileNames } from './../../../utils';


const TeamForm = () => {
    const [form] = Form.useForm();
    const [fileType, setFileType] = useState<any>(null)
    const [status, setStatus] = useState('')
    const [salesFilesList, setSalesFilesList] = useState<any[]>([])
    const [teamList, setTeamList] = useState<any[]>([])
    const [isAll, setIsAll] = useState<boolean>(false)
    const [selectedFile, setSelectedFile] = useState<any>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
    const [currentDeleteData, setCurrentDeleteData] = useState<any>(null)
    const { uploadSalesData, salesFileList, reassignRandomData, getFileDataPath, reassignCallmData } = SalesService
    const dispatch = useDispatch()
    const isMobile = useIsMobile()
    const userData = localStorageContent.getUserData()
    const { getTeamList } = TeamService
    const [dataLoaded, setDataLoaded] = useState<boolean>(false);
    const localUserData = localStorageContent.getUserData()
    const [error, setErrorState] = useState<string | null>(null);
    const [filteredTeamList, setFilteredTeamList] = useState<any[]>([]);

    const onChangeFiles = (e: any) => {
      const fileData = e.files;
      var file = fileData[0];
      setSelectedFile(file)
    };

    const onFinish =  async (values: any) => {
      if (selectedFile === null || fileType === null){
        return;
      }
      try {
        const formData = new FormData();
        formData.append("file", selectedFile)
        formData.append("type", fileType)
        if(!isAll){
          formData.append('agent', values?.agent)
        }
        const response = await uploadSalesData(formData);
        if(response){
          dispatch(setError({ status: true, type: 'success', message: 'Uploaded Data successfully' }))
          fetchSalesFilesList()
          form.setFieldsValue({
            status: '',
            file: '',
            agent: ''
          })
          setIsAll(false)
        }
      } catch (err: any) {
        dispatch(setError({ status: true, type: 'error', message: err }))
      }
    }

    const fetchSalesFilesList =  async () => {
      try {
        setIsLoading(true)
        const response = await salesFileList()
        if(response && response?.data){          
          setSalesFilesList(response?.data)
        }
        setIsLoading(false)
      } catch (err: any) {
        setIsLoading(false)
        dispatch(setError({ status: true, type: 'error', message: err }))
      }
    }

    // Define the type of the team member
interface TeamMember {
  label: string;
  value: string | number;
  is_senior: string; // Assuming this is '1' or '0' as a string
}

// Fetch Team List with Dynamic Parameters
const fetchTeamList = async (isSenior?: string, departmentId: number = 1) => {
  try {
    const url = isSenior
      ? `/team/search-teams?isSenior=${isSenior}&departmentId=${departmentId}`
      : `/team/search-teams?departmentId=${departmentId}`;

    const response = await getTeamList(url);

    if (response && response.data) {
      const teams: TeamMember[] = response.data.map((team: any) => ({
        label: `${team.first_name} ${team.last_name}`,
        value: team.user_id,
        is_senior: team.is_senior,
      }));

      setTeamList(teams); // Set original teamList
      setFilteredTeamList(teams); // Initially show all teams
    }
  } catch (error) {
    console.error('Error fetching team list:', error);
  }
};

// Handle Status Change
const handleStatusChange = (e: string | number) => {
  const selectedStatus = Number(e);
  setFileType(selectedStatus);

  if (selectedStatus === 0) {
    // Automatically select 'All'
    setIsAll(true);
    setFilteredTeamList(teamList); // Show all team members
  } else {
    setIsAll(false);

    // Determine the value for isSenior based on the selected status
    const isSenior = selectedStatus === 1 ? '1' : '0'; // '1' for Senior, '0' for Junior

    // Filter the team list based on the isSenior value
    const filteredList = teamList.filter((team) => team.is_senior === isSenior);

    setFilteredTeamList(filteredList); // Update with the filtered list
  }
};

    
    const getFileData = async (id: any) => {
      try {
        const response = await getFileDataPath({ "fileId": id });
    
        // Use fileNames function to clean up the URL and get an array of file links
        const cleanedUrls = fileNames(response?.csvPath);
    
        // Assuming csvPath is a single URL and using only the first returned URL
        const downloadUrl = cleanedUrls[0]?.props?.children?.props?.href;
    
        if (downloadUrl) {
          const a = window.document.createElement('a');
          a.href = downloadUrl;
          window.document.body.appendChild(a);
          a.click();
          window.document.body.removeChild(a);
    
          // Dispatch success message if download triggered
          dispatch(setError({ status: true, type: 'success', message: response?.message }));
        } else {
          throw new Error("File URL not available");
        }
    
        console.log('response', response);
      } catch (err: any) {
        // Dispatch error message if there's an issue
        dispatch(setError({ status: true, type: 'error', message: err.message || 'An error occurred' }));
      }
    };
    

    const reassignData =  async () => {
      try {
        setIsLoading(true)
        await reassignRandomData()
        setIsLoading(false)
      } catch (err: any) {
        setIsLoading(false)
        dispatch(setError({ status: true, type: 'error', message: err }))
      }
    }

    const reassignCallData =  async () => {
      try {
        setIsLoading(true)
        await reassignCallmData()
        setIsLoading(false)
      } catch (err: any) {
        setIsLoading(false)
        dispatch(setError({ status: true, type: 'error', message: err }))
      }
    }

    const onChangeAll = (e: any) => {
      if (e.target.checked)
        setIsAll(true);
      else 
      setIsAll(false)
    }

    const fieldsData = [
      {
        label: 'Status',
        key: 'status',
        elementType: 'SELECT',
        required: true,
        disable: false,
        options: options,
        onChangeField: handleStatusChange,
        type: 'text',
        placeholder: 'Select Status',
        config: {
          rules: [{ required: true, message: 'Please Select Status' }],
        }
      },
      {
            label: 'All',
            key: 'all',
            elementType: 'INPUT_CHECKBOX',
            onChangeField: onChangeAll,
            required: true,
            checked: isAll,            
            type: 'checkbox',
            placeholder: 'Select All',
            config: {
                rules: [{ required: false, message: 'Please Select ALL' }],
            }
        },
         {
            label: 'Agent',
            key: 'agent',
            elementType: 'SELECT',
            onChangeField: () => {},
            options: filteredTeamList,
            required: true,
            disable: fileType  === 0 ? false: true,
            type: 'text',
            placeholder: 'Enter Account Type',
            config: {
                rules: [{ required: !isAll, message: 'Please Enter Account Type' }],
            }
        },
      {
          label: 'File',
          key: 'file',
          elementType: 'INPUT_FILE',
          options: [],
          onChangeField: onChangeFiles,
          required: true,
          disable: false,
          type: 'file',
          placeholder: 'Enter File',
          config: {
              rules: [{ required: true, message: 'Please Select file' }],
          }
      },
    ]
    
  const generateSearchFields = useMemo(() => {
    const copyFields = fieldsData
    let fields: any [] = [];
      fields = copyFields
      fields.map((item) => {
      if(item.label === 'All') {
        if (fileType === 0) {
          item.disable = true
          item.checked = true
          item.value = true
         }
      }
       else if(item.label === 'Agent') {
         if(fileType === 0) {
          item.disable = true;
        } else if (isAll) {
          item.disable = true
        } else {
          item.disable = false;
        }
        console.log(item)
      }
    })
    return fields
  },[fileType, isAll])
    const columns = [
         {
          title: "S.No",
          dataIndex: "index",
          render: (_: any, __: any, i: any) => <>{i + 1}</>
        },
        {
          title: "Uploaded Date",
          dataIndex: "created_dt",
          key: "created_dt",
          render: (created_dt: any) => <>{moment(created_dt).format('YYYY-MM-DD h:s A')}</>
        },
        {
          title: "File Name",
          dataIndex: "value",
          key: "value",
        },
        {
          title: "Agent Name",
          dataIndex: "agent_name",
          key: "agent_name",
          render: (agent_name: any) => <>{agent_name ? agent_name : '--'}</>
        },
        {
          title: "Assigned To",
          dataIndex: "is_senior",
          key: "is_senior",
          render: (is_senior: any) => <>{is_senior ? is_senior === '1' ? 'Senior' : is_senior === '2' ? 'All' : 'Junior' : '--'}</>
        },
        {
          title: "Count",
          dataIndex: "cnt",
          key: "cnt",
          render: (cnt: any) => <>{cnt ? cnt : '--'}</>
        },
        {
            title: 'Actions',
            render: (_: any, record: any) => {
              return (
                <Space >
                 <span >
                    <DeleteOutlined  onClick={() => {
                      setCurrentDeleteData(record)
                      setShowDeleteModal(true)
                    }} style={{ color: "#3AA0E9" }} />
                    <Button type="primary" style={{marginLeft: 10}}  onClick={() => getFileData(record.id)}>Download</Button>
                </span>
            </Space>
            )
          },
        }
      ];

      useEffect(() => {
        fetchSalesFilesList()
        if (!dataLoaded) {
      fetchTeamList();
    }
      }, [])

  return ( <>
    <div className='form-container'>
        <ContentHeader 
            showBtn={false}
            redirectPath=''
            buttonText=''
            title={`Upload Data`}
            showIcon={false}
        />
        <div className='form-container__body'>
        <Form
          {...formLayout}
          form={form}
          onFinish={onFinish}
          className='form-container__form-body'
          layout={isMobile ? 'vertical' : 'horizontal'}
      >
             {
                  generateSearchFields.map((formItem: any, i: number) => (
                        <GenerateElements elementData={formItem} index={i} key={i} />
                  ))
              }
              <Form.Item {...formTailLayout}>
                <Button htmlType="button" onClick={() => window.history.back()}>
                  Back
                </Button>
                <Button type="primary" htmlType="submit">
                  Upload
                </Button>
              </Form.Item>
        </Form>
        </div>
    </div>
    <div style={{marginTop: '25px'}}>
      <div style={{display: 'flex'}}>
        <p style={{marginRight: 10}}>Re-assign Data :  </p>
        <Button onClick={reassignData} type="primary">
          Re-assign data equal share
        </Button>
        <p style={{marginRight: 10, marginLeft: 30}}>  Re-assign Voicemail and Not interested :  </p>
        <Button onClick={reassignCallData} type="primary">
          Re-assign call data
        </Button>
      </div>
    </div>
    <div style={{marginTop: '25px'}}>
      {
        showDeleteModal && (
          <ModalDelete
          show={showDeleteModal}
          hideModal={() => {
            setShowDeleteModal(false)
            setCurrentDeleteData(null)
          }}
          data={currentDeleteData}
          setCurrentData={() => setCurrentDeleteData(null)}
          fetchList={fetchSalesFilesList}
        />
        )
      }
      <Table
          rowClassName="editable-row"
          bordered
          columns={columns}
          dataSource={salesFilesList}
          loading={isLoading}
        />
    </div>
</>
  )
}

export default TeamForm
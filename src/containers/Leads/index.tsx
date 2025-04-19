import React, { useEffect, useMemo, useState, useCallback } from 'react'
import ContentHeader from '../../components/ContentHeader'
import { FiPlusCircle } from "react-icons/fi";
import SearchFilter from '../../components/SearchFilter';
import { Button, Col, Divider, Pagination, Radio, Row, Select, Space, Table } from 'antd';
import moment from 'moment';
import localStorageContent from '../../utils/localstorage';
import {
  EditOutlined,
  EyeOutlined,
  GoldOutlined, 
  DownloadOutlined
} from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import LeadService from '../../services/Lead.services';
import TeamService from '../../services/Team.services';
import reportsService from '../../services/Reports.services';
import TaxConfigModal from './TaxConfigModal';
import { useDispatch } from 'react-redux';
import { setError } from '../../store/reducers';
import History from '../../components/History';
import DownloadCsv from '../../utils/downloadCSV';
import { HTMLDecode, convertToCSVText, extractTextFromHTML } from '../../utils';
import { timeZoneOptions } from '../Sales/Sales-Report/constants';
import Timer from '../../components/Timer';
import LeadHistory from '../../components/LeadHistory';
import { BiSolidPhoneCall, BiLogoWhatsapp  } from "react-icons/bi";
import axios from 'axios';

const Leads = ({ isLeads }: any) => {
  const [tableColumns, setTableColumns] = useState<any[]>([])
  const [leadList, setLeadList] = useState<any[]>([])
  const [selectedTaxConfigData, setSelectedTaxConfigData] = useState<any>(null)
  const [selectedLeads, setSelectedLeads] = useState<any[]>([])
  const [showTaxConfigModal, setShowTaxConfigModal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [assignedAgents, setAssignedAgents] = useState<any[]>([]);
  const [showReopenLeads, setReopenLeads] = useState(false)
  const [reOpenLeadsData, setReOpenLeadsData] = useState<any[]>([])
  const [reOpenLeadsdisableBtns, setreOpenLeadsdisableBtns] = useState<any[]>([])
  const [teamList, setTeamList] = useState<any[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [queryString, setQueryString] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [currentLeadId, setCurrentLeadId] = useState<any>(null)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [showModalName, setIsShowModalName] = useState<boolean>(false)
  const localUserData = localStorageContent.getUserData()
  const multiDep = localStorageContent.getMultiDepartment()
  
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { getAgentleadList, getleadList, updateAgentlead, updatePaymentStatus, reopenLead, generateUnknowLeadsJob } = LeadService
  const { getTeamList } = TeamService
  const { getreportsList } = reportsService

  const paymentStatus: any = [
    { label: 'No', value: '0' },
    { label: 'Yes', value: '1' },
  ]

  const docStatus: any = [
    { label: 'No', value: '' },
    { label: 'Yes', value: '1' },
  ]

  const handleApiCall = async (associatename: string, name: string, phone: string,) => {
    const url = 'https://api.quickreply.ai/webhook/company/XHTDFhWZmXbqWNMWR_c/key/xWWu5abb3fMGZy5i3';
    try {
        const response = await axios.post(url, { associatename, name, phone });
        console.log('API response:', response.data);
    } catch (error) {
        console.error('Error calling API:', error);
    }
};
  
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      if(selectedRowKeys.length > 0) {
        const data = selectedRowKeys?.toString().split(",")
        const mappedData = data.map((item) => {
          return {lead_id:item}
        });
        setSelectedLeads(mappedData)  
      } else {
        setSelectedLeads([]);  
      }
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.name == 'Disabled User', // Column configuration not to be checked
      lead_id: record.lead_id,
    }),
  };
  //{"id":4732}
  const modalToggle = () => {
    if(showModal){
        setCurrentLeadId(null)
    }
    setShowModal(!showModal)
  }

  const handleAgents = async (e: any, leadId: any) => {
    try {
      const response = await updateAgentlead(leadId, { id: e })
      if(response){
        dispatch(setError({ status: true, type: 'success', message: response?.message }))
        if(!showReopenLeads){
          fetchLeadList(currentPage, queryString)
        }else{
          fetchReopenLeadsList(currentPage, queryString)
        }
      }
    } catch (err: any) {
      dispatch(setError({ status: true, type: 'error', message: err }))
    }
  }

  const handlePaymentStatus = async (e: any, leadId: any) => {
    try {
      const response = await updatePaymentStatus(leadId, { status: e })
      if (response) {
        dispatch(setError({ status: true, type: 'success', message: response?.message }))
        if (!showReopenLeads) {
          fetchLeadList(currentPage, queryString)
        } else {
          fetchReopenLeadsList(currentPage, queryString)
        }
      }
    } catch (err: any) {
      dispatch(setError({ status: true, type: 'error', message: err }))
    }
  }

  const acceptReopenLead = async (leadId: any) => {
    try {
      const response = await reopenLead(leadId)
      if(response){
        dispatch(setError({ status: true, type: 'success', message: response?.message }))
        fetchReopenLeadsList(currentPage, queryString)
      }
    } catch (err: any) {
      dispatch(setError({ status: true, type: 'error', message: err }))
    }
  }

  const filterOption = (input: string, option?: { label: string; value: string }) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const toggleConfigModal = () => {
    if(showTaxConfigModal){
      setSelectedTaxConfigData(null)
    }
    setShowTaxConfigModal(!showTaxConfigModal)
  }

  const getPaymentOption = (val:any) => val === "1" ? 'Due' : 'Refund';   

  const modalToggeleCleintName = () => {
    setIsShowModalName(!showModalName)
  }

  const exportFormates: any = {
    updated_dt: (value: any) => value ? moment(value).format('YYYY-MM-DD') : '',
    lead_id: (value: any) => value ? `Lead #${value}` : '',
    assigned_agent: (value: any) => value ? value : '',
    comments: (value: any) => value ? convertToCSVText(HTMLDecode(value)) : ''
  }

  const adminColumns: any[] = useMemo(() => [
    // {
    //   title: "Date",
    //   dataIndex: "updated_dt",
    //   key: "updated_dt",
    //   render: (text: any, record: any) => {
    //     return (
    //       <>
    //         {new Date(record?.updated_dt).toLocaleString('en-US', {
    //          year: 'numeric',
    //       month: '2-digit',
    //        day: '2-digit',
    //           hour: '2-digit',
    //           minute: '2-digit',
    //           second: '2-digit',
    //           hour12: true, // Set to false for 24-hour format
    //           timeZone: 'UTC', // Adjust as needed
    //         })}
    //       </>
    //     );
    //   },
    // },
    localUserData?.departmentId === 2 && {
      title: "Date",
      dataIndex: "process_start_datetime",
      key: "process_start_datetime",
      render: (text: any, record: any) => {
        const dateValue = record?.process_start_datetime || record?.updated_dt;
        return dateValue ? (
          <>
            {new Date(dateValue).toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
              timeZone: "UTC",
            })}
          </>
        ) : (
          "N/A"
        );
      },
    },

    localUserData?.departmentId === 3 && {
      title: "Date",
      dataIndex: "verification_start_datetime",
      key: "verification_start_datetime",
      render: (text: any, record: any) => {
        const dateValue = record?.verification_start_datetime || record?.updated_dt;
        return dateValue ? (
          <>
            {new Date(dateValue).toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
              timeZone: "UTC",
            })}
          </>
        ) : (
          "N/A"
        );
      },
    },

    localUserData?.departmentId === 4 && {
      title: "Date",
      dataIndex: "review_start_datetime",
      key: "review_start_datetime",
      render: (text: any, record: any) => {
        const dateValue = record?.review_start_datetime || record?.updated_dt;
        return dateValue ? (
          <>
            {new Date(dateValue).toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
              timeZone: "UTC",
            })}
          </>
        ) : (
          "N/A"
        );
      },
    },

    localUserData?.departmentId === 5 && {
      title: "Date",
      dataIndex: "finance_start_datetime",
      key: "finance_start_datetime",
      render: (text: any, record: any) => {
        const dateValue = record?.finance_start_datetime || record?.updated_dt;
        return dateValue ? (
          <>
            {new Date(dateValue).toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
              timeZone: "UTC",
            })}
          </>
        ) : (
          "N/A"
        );
      },
    },

    localUserData?.departmentId === 6 && {
      title: "Date",
      dataIndex: "submission_start_datetime",
      key: "submission_start_datetime",
      render: (text: any, record: any) => {
        const dateValue = record?.submission_start_datetime || record?.updated_dt;
        return dateValue ? (
          <>
            {new Date(dateValue).toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
              timeZone: "UTC",
            })}
          </>
        ) : (
          "N/A"
        );
      },
    },
    {
      title: "Lead",
      dataIndex: "lead_id",
      key: "lead_id",
      render: (leadId: any) => <span onClick={() => {
        setCurrentLeadId(leadId)
        modalToggle()
      }}>Lead #{leadId}</span>,
    },
    {
      title: "Agent",
      dataIndex: "updated_by",
      key: "updated_by",
      render: (updated_by: any, leadId: any) => <span onClick={() => {
        setCurrentLeadId(leadId)
        modalToggeleCleintName()
      }}>{updated_by}</span>,
    },  
    {
      title: "Client Name",
      dataIndex: "first_name",
      key: "first_name",
      render: (first_name: any, leadId: any) => <span onClick={() => {
        setCurrentLeadId(leadId)
        modalToggeleCleintName()
      }}>{first_name}</span>,
    },

    {
      title: "Submission type",
      dataIndex: "lead_type",
      key: "lead_type",
      render: (lead_type: any) => lead_type === "1" ? "E-Filing" : "Paper-Filing"
    },
    // {
    //   title: "Documents",
    //   dataIndex: "online_offline_attachments",
    //   key: "online_offline_attachments",
    //   className: "noselect",
    //   render: (offline: any) => <span>{ offline && offline?.length > 0 ? 'Yes' : 'No'}</span>
    // },
    // {
    //   title: "Final Documents",
    //   dataIndex: "online_final_attachments",
    //   key: "online_final_attachments",
    //   className: "noselect",
    //   render: (online: any) => <span>{online && online?.length > 0 ? 'Yes' : 'No'}</span>
    // },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      className: !(localUserData?.role === "2" && localUserData?.departmentId === 5) ? "noselect" : undefined,
    },
    {
      title: "Phone Number",
      dataIndex: "mobile",
      key: "mobile",
      className: "noselect",
      render: (mobile: any) => <a href={`callto:1${mobile}`}>
            <BiSolidPhoneCall size={25}/></a>
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
    },
    {
      title: "Assign Member",
      dataIndex: "assigned_agent",
      key: "assigned_agent",
      render: (record: any, list: any) => <span> {(list?.lead_status === "7" || list?.department_id !== localUserData?.departmentId) ? list.assigned_agent : (
        <Select
              style={{
              width: '100%',
              }}
              key={record}
              defaultValue={record}
              placeholder="Select Team Member"
              onChange={(e: any) => handleAgents(e, list?.lead_id)}
              options={assignedAgents}
              showSearch
              filterOption={filterOption}
          />
      )}</span>,
    },
    // {
    //   title: "Payment Status",
    //   dataIndex: "paid_status",
    //   key: "paid_status",
    //   render: (record: any, list: any) => <span> {(list?.lead_status === "7" || list?.department_id !== localUserData?.departmentId) ? list.paid_status : (
    //     <Select
    //       style={{
    //         width: '100%',
    //       }}
    //       key={record}
    //       defaultValue={record}
    //       placeholder="Select status"
    //       onChange={(e: any) => handlePaymentStatus(e, list?.lead_id)}
    //       options={paymentStatus}
    //       showSearch
    //       filterOption={filterOption}
    //     />
    //   )}</span>,
    // },
    
    {
      title: "Comments",
      dataIndex: "comments",
      key: "comments",
      render: (text: any) => text ? <p style={{margin: 0}} dangerouslySetInnerHTML={{__html: extractTextFromHTML(text)}} /> : '--',
    },
  ].filter(Boolean), [leadList, assignedAgents]);

  const adminColumns1: any[] = [
    {
        title: "Actual Amount",
        dataIndex: "actual_amount",
        key: "actual_amount",
        render: (_: any, record: any) => {
          return <span onClick={() => {
            toggleConfigModal()
            setSelectedTaxConfigData(record)
          }}>{record?.actual_amount ? record?.actual_amount : '--'}</span>
        }
    },
    {
      title: "Selected Review",
      key: "selected_review",
      render: (_: any, record: any) => {
        return (<Space size="middle">
          <a 
          href={record.selected_review} target="_blank" rel="noreferrer"
            >            
            {record.selected_review ? <DownloadOutlined style={{ color: "#3AA0E9" }} />:'--'}
          </a>
        </Space>
          )
      },
    }
];

const adminColumns3: any[] = [
  localUserData?.departmentId === 2 && {
    title: "Date",
    dataIndex: "process_start_datetime",
    key: "process_start_datetime",
    render: (text: any, record: any) => (
      <>
        {new Date(record?.process_start_datetime).toLocaleString('en-US', {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
          timeZone: "UTC",
        })}
      </>
    ),
  },
  localUserData?.departmentId === 3 && {
    title: "Date",
    dataIndex: "verification_start_datetime",
    key: "verification_start_datetime",
    render: (text: any, record: any) => (
      <>
        {new Date(record?.verification_start_datetime).toLocaleString('en-US', {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
          timeZone: "UTC",
        })}
      </>
    ),
  },
  localUserData?.departmentId === 4 && {
    title: "Date",
    dataIndex: "review_start_datetime",
    key: "review_start_datetime",
    render: (text: any, record: any) => (
      <>
        {new Date(record?.review_start_datetime).toLocaleString('en-US', {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
          timeZone: "UTC",
        })}
      </>
    ),
  },
  localUserData?.departmentId === 5 && {
    title: "Dateffff",
    dataIndex: "finance_start_datetime",
    key: "finance_start_datetime",
    render: (text: any, record: any) => (
      <>
        {new Date(record?.finance_start_datetime).toLocaleString('en-US', {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
          timeZone: "UTC",
        })}
      </>
    ),
  },
  localUserData?.departmentId === 6 && {
    title: "Date",
    dataIndex: "submission_start_datetime",
    key: "submission_start_datetime",
    render: (text: any, record: any) => (
      <>
        {new Date(record?.submission_start_datetime).toLocaleString('en-US', {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
          timeZone: "UTC",
        })}
      </>
    ),
  },
].filter(Boolean);

 const teamsColumns0: any[] = [
  localUserData?.departmentId === 2 && {
    title: "Date",
    dataIndex: "process_start_datetime",
    key: "process_start_datetime",
    render: (text: any, record: any) => {
      const dateValue = record?.process_start_datetime || record?.updated_dt;
      return dateValue ? (
        <>
          {new Date(dateValue).toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
            timeZone: "UTC",
          })}
        </>
      ) : (
        "N/A"
      );
    },
  },

  localUserData?.departmentId === 3 && {
    title: "Date",
    dataIndex: "verification_start_datetime",
    key: "verification_start_datetime",
    render: (text: any, record: any) => {
      const dateValue = record?.verification_start_datetime || record?.updated_dt;
      return dateValue ? (
        <>
          {new Date(dateValue).toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
            timeZone: "UTC",
          })}
        </>
      ) : (
        "N/A"
      );
    },
  },

  localUserData?.departmentId === 4 && {
    title: "Date",
    dataIndex: "review_start_datetime",
    key: "review_start_datetime",
    render: (text: any, record: any) => {
      const dateValue = record?.review_start_datetime || record?.updated_dt;
      return dateValue ? (
        <>
          {new Date(dateValue).toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
            timeZone: "UTC",
          })}
        </>
      ) : (
        "N/A"
      );
    },
  },

  localUserData?.departmentId === 5 && {
    title: "Date",
    dataIndex: "finance_start_datetime",
    key: "finance_start_datetime",
    render: (text: any, record: any) => {
      const dateValue = record?.finance_start_datetime || record?.updated_dt;
      return dateValue ? (
        <>
          {new Date(dateValue).toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
            timeZone: "UTC",
          })}
        </>
      ) : (
        "N/A"
      );
    },
  },

  localUserData?.departmentId === 6 && {
    title: "Date",
    dataIndex: "submission_start_datetime",
    key: "submission_start_datetime",
    render: (text: any, record: any) => {
      const dateValue = record?.submission_start_datetime || record?.updated_dt;
      return dateValue ? (
        <>
          {new Date(dateValue).toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
            timeZone: "UTC",
          })}
        </>
      ) : (
        "N/A"
      );
    },
  },
    
  {
      title: "Lead",
      dataIndex: "lead_id",
      key: "lead_id",
      render: (leadId: any) => <span onClick={() => {
        setCurrentLeadId(leadId)
        modalToggle()
      }}>Lead #{leadId}</span>,
    },
    {
      title: "Client Name",
      dataIndex: "first_name",
      key: "first_name",
      render: (first_name: any, leadId: any) => <span onClick={() => {
        setCurrentLeadId(leadId)
        modalToggeleCleintName()
      }}>{first_name}</span>,
    },
    {
      title: "Submission type",
      dataIndex: "lead_type",
      key: "lead_type",      
      render: (lead_type: any) => lead_type === "1" ? "E-Filing" : !lead_type ? '': "Paper-Filing"
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      className: "noselect"
    },
    {
      title: "Phone Number",
      dataIndex: "mobile",
      key: "mobile",
      className: "noselect",
      render: (mobile: any) => <a href={`callto:1${mobile}`}>
            <BiSolidPhoneCall size={25}/></a>
    },
    {
                title: '',
                dataIndex: 'phone_number',
                key: 'phone_number',
                render: (text: any, data: any) => (
                    <a 
                        onClick={(e) => {
                            e.preventDefault(); // Prevent the default `callto:` action
                            const fullName = `${localUserData.firstName} ${localUserData.lastName}`;
                            alert("Message sent successfully");
    
                            handleApiCall(fullName, data.name, `+1${data.phone_number}`); // Trigger the API call
                        }}
                    >
                        <BiLogoWhatsapp size={25} />
                    </a>
                ),
            },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
    },
    {
      title: "Actions",
      key: "action",
      render: (_: any, record: any) => {
        return (<Space size="middle">
          <span 
            onClick={() => navigate(`/leads/edit/${record.lead_id}`, {
              state: record
            })}
            >
            <EyeOutlined style={{ color: "#3AA0E9" }} />
          </span>
        </Space>
          )
        
      },
    },
    {
      title: "Comments",
      dataIndex: "comments",
      key: "comments",
      render: (text: any) => text ? <p style={{margin: 0}} dangerouslySetInnerHTML={{__html: extractTextFromHTML(text)}} /> : '--',
    }
  ].filter(Boolean);

  
  const adminColumns2: any[] = [
    {
      title: "Documentss",
      dataIndex: "online_offline_attachments",
      key: "online_offline_attachments",
      className: "noselect",
      render: (offline: any) => <span>{ offline && offline?.length > 0 ? 'Yes' : 'No'}</span>
    },
    // {
    //   title: "Signature Document",
    //   dataIndex: "online_signature",
    //   key: "online_signature",
    //   className: "noselect",
    //   render: (online: any, record: any) => (
    //     record.lead_type === "1" ? (
    //       <span>{online && online.length > 0 ? 'Yes' : 'No'}</span>
    //     ) : null // Return nothing if lead_type is not "Online"
    //   )
    // },
    {
      title: "Final Documentss",
      dataIndex: "online_final_attachments",
      key: "online_final_attachments",
      className: "noselect",
      render: (online: any) => <span>{online && online?.length > 0 ? 'Yes' : 'No'}</span>
    },
]


  const teamColumns2: any[] = [
    {
      title: "Tax Documents",
      dataIndex: "online_offline_attachments",
      key: "online_offline_attachments",
      className: "noselect",
      render: (offline: any) => <span>{ offline && offline?.length > 0 ? 'Yes' : 'No'}</span>
    },
    {
      title: "Signature",
      dataIndex: "online_signature",
      key: "online_signature",
      className: "noselect",
      render: (online: any, record: any) => (
        record.lead_type === "1" ? (
          <span>{online === "1" ? "Yes" : "No"}</span>
        ) : null // Return nothing if lead_type is not "Online"
      )
    },    
    {
      title: "Final Documents",
      dataIndex: "online_final_attachments",
      key: "online_final_attachments",
      className: "noselect",
      render: (online: any) => <span>{online && online?.length > 0 ? 'Yes' : 'No'}</span>
    },
    {
      title: "Actions",
      key: "action",
      render: (_: any, record: any) => {
        return (<Space size="middle">
          <span 
            onClick={() => navigate(`/leads/edit/${record.lead_id}`, {
              state: record
            })}
            >
            <EditOutlined style={{ color: "#3AA0E9" }} />
          </span>
        </Space>
          )
        
      },
    }
]

  const teamColumns1: any[] = [
    {
        title: "Scharge Comment",
        dataIndex: "service_charge_comment",
        key: "service_charge_comment",
        render: (_: any, record: any) => {
          return <span onClick={() => {
            toggleConfigModal()
            setSelectedTaxConfigData(record)
          }}>{record?.service_charge_comment ? record?.service_charge_comment : '--'}</span>
        }
    },
    {
      title: "Actual Amount",
      dataIndex: "actual_amount",
      key: "actual_amount",
      render: (_: any, record: any) => {
        return <span onClick={() => {
          toggleConfigModal()
          setSelectedTaxConfigData(record)
        }}>{record?.actual_amount ? record?.actual_amount : '--'}</span>
      }
  },
    {
      title: "Payment Status",
      dataIndex: "paid_status",
      key: "paid_status",
      render: (record: any, list: any) => <span> {(list?.lead_status === "7" || list?.department_id !== localUserData?.departmentId) ? list.paid_status : (
        <Select
          style={{
            width: '100%',
          }}
          key={record}
          defaultValue={record}
          placeholder="Select status"
          disabled
          onChange={(e: any) => handlePaymentStatus(e, list?.lead_id)}
          options={paymentStatus}
          showSearch
          filterOption={filterOption}
        />
      )}</span>,
    },
    {
      title: "Docs Status",
      dataIndex: "client_payment_status",
      key: "client_payment_status",
      render: (status: any) => <span>{status === "4" ? "Yes" : "No"}</span>
    },
    {
      title: "Selected Review",
      key: "selected_review",
      render: (_: any, record: any) => {
        return (<Space size="middle">
          {
            record.selected_review ? (
              <a 
                href={record.selected_review} rel="noreferrer" target="_blank"
                >
                <DownloadOutlined style={{ color: "#3AA0E9" }} />
              </a>
            ) : <span>Empty</span>
          }
          
        </Space>
          )
      },
    },
    {
          title: "Actions",
          key: "action",
          render: (_: any, record: any) => {
            return (<Space size="middle">
              <span 
                onClick={() => navigate(`/leads/edit/${record.lead_id}`, {
                  state: record
                })}
                >
                <EditOutlined style={{ color: "#3AA0E9" }} />
              </span>
            </Space>
              )
            
          },
        }
]
  const reopenLeadsColumns: any[] = [
    {
      title: "Date",
      dataIndex: "updated_dt",
      key: "updated_dt",
      render: (text: any, record: any) => {
        return (
          <>
            {new Date(record?.updated_dt).toLocaleString('en-US', {
             year: 'numeric',
          month: '2-digit',
           day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true, // Set to false for 24-hour format
              timeZone: 'UTC', // Adjust as needed
            })}
          </>
        );
      },
    },
    {
      title: "Lead",
      dataIndex: "lead_id",
      key: "lead_id",
      render: (leadId: any) => <span onClick={() => {
        setCurrentLeadId(leadId)
        modalToggle()
      }}>Lead #{leadId}</span> 
    },
    {
      title: "Client Name",
      dataIndex: "first_name",
      key: "first_name",
      render: (first_name: any, leadId: any) => <span onClick={() => {
        setCurrentLeadId(leadId)
        modalToggeleCleintName()
      }}>{first_name}</span>,
    },
    {
      title: "Submission type",
      dataIndex: "lead_type",
      key: "lead_type",      
      render: (lead_type: any) => lead_type === "1" ? "E-Filing" : "Paper-Filing"
    },
    {
      title: "Documents",
      dataIndex: "online_offline_attachments",
      key: "online_offline_attachments",
      className: "noselect",
      render: (offline: any) => <span>{ offline && offline?.length > 0 ? 'Yes' : 'No'}</span>
    },
    {
      title: "Final Documents",
      dataIndex: "online_final_attachments",
      key: "online_final_attachments",
      className: "noselect",
      render: (online: any) => <span>{online && online?.length > 0 ? 'Yes' : 'No'}</span>
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      className: 'noselect',
    },
    {
      title: "Phone Number",
      dataIndex: "mobile",
      key: "mobile",
      className: 'noselect',
      render: (mobile: any) => <a href={`callto:1${mobile}`}>
            <BiSolidPhoneCall size={25}/></a>
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {

      title: "Comments",
      dataIndex: "reopen_comments",
      key: "reopen_comments",
      render: (text: any) => text ? <p style={{margin: 0}} dangerouslySetInnerHTML={{__html: extractTextFromHTML(text)}} /> : '--',
    },{
      title: "Actions",
      key: "action",
      render: (_: any, record: any) => {
        return (
          <div style={{display: 'flex', justifyContent: 'flex-start'}}>
            <Button onClick={() => acceptReopenLead(record.lead_id)} style={{margin: '0 5px'}}>Accept</Button>
            <Button disabled={reOpenLeadsdisableBtns.includes(record.lead_id)} style={{margin: '0 5px'}} onClick={() => {
              let copyReops = [...reOpenLeadsdisableBtns, record?.lead_id]
              setreOpenLeadsdisableBtns(copyReops)
            }}>Reject</Button>
          </div>
        )
      },
    }

  ];

  const fieldsData = [
    {
      label: 'Team',
      key: 'teamId',
      elementType: 'SELECT',
      onChangeField: () => {},
      options: assignedAgents,
      required: true,
      disable: false,
      type: 'string',
      placeholder: 'Select status',
      config: {
          rules: [{ required: false, message: 'Please select status' }],
      }
  },
    {
        label: 'Client Search',
        key: 'user',
        elementType: 'INPUT',
        required: true,
        disable: false,
        onChangeField: () => {},
        type: 'text',
        placeholder: 'Search by user name',
        config: {
            rules: [{ required: false, message: 'Please Enter user name' }],
        }
    },
    {
      label: "Search With Lead Id",
      key: "leadId",
      elementType: "INPUT",
      type: "text",
      placeholder: "Search by Lead id",
      onChangeField: () => {},
    },
    {
        label: 'Select Date',
        key: 'date',
        elementType: 'DATE_PICKER_DATE_RANGE',
        onChangeField: () => {},
        required: true,
        disable: false,
        type: 'date',
        value: '',
        config: {
            rules: [{ required: false, message: 'Please Enter Date!' }],
        }
    },
    localUserData?.departmentId === 5 && {
      label: 'Payment Status',
      key: 'paidStatus',
      elementType: 'SELECT',
      onChangeField: () => { },
      options: paymentStatus,
      required: true,
      type: 'string',
      placeholder: 'Select status',
      config: {
        rules: [{ required: false, message: 'Please select status' }],
      }
    },
    localUserData?.departmentId === 5 && {
      label: 'Pending Docs',
      key: 'isPendingDocs',
      elementType: 'SELECT',
      onChangeField: () => { },
      options: docStatus,
      required: true,
      type: 'string',
      placeholder: 'Select Docs',
      config: {
        rules: [{ required: false, message: 'Please select docs' }],
      }
    },
]

  const generateSearchFields = useMemo(() => {
    const copyFields = fieldsData
    let fields: any [] = [];
    if(localUserData && localUserData?.role === '2'){
    fields = copyFields
    }else{
      copyFields.splice(0,1)
      fields = copyFields;
    }
    return fields
  },[teamList])


  const fetchTeamList = async () => {
    try {
         if(localUserData === null){
          return;
        }
       const response = await getTeamList(`/team/search-teams?deptId=${localUserData?.role === '1' ? 1 : localUserData?.departmentId}`)
      if(response && response?.data?.length > 0){
        const filterData: any[] = []
        response.data.forEach((team: any) => {
          if(team?.departments?.length > 0 && team?.departments?.some((dep: any) => dep.id === (localUserData?.role === '1' ? 1 : localUserData?.departmentId))){
            filterData.push({
              label: team?.first_name + ' ' + team?.last_name,
              value: team.user_id
            });
          }
        })
        setTeamList(filterData)
      }
    } catch (err: any) {
      dispatch(setError({ status: true, type: 'error', message: err }))
    }
  }

  const fetchAgentList = async () => {
    try {
      const response = await getAgentleadList()
      if(response && response?.data?.length > 0){
        const { data } = response;
        setAssignedAgents(data.map((dt: any) => ({
          value: dt.id,
          label: dt.name
        })))
      }
    } catch (err: any) {
      dispatch(setError({ status: true, type: 'error', message: err }))
    }
  }

  const fetchLeadList = async (page: number, query: string | null) => {
    try {
      setIsLoading(true)
      let URL = ''
      if(multiDep !== null && multiDep && localUserData){
        if(isLeads){
          URL = query ? `/leads?deptId=${localUserData.departmentId}&page=${page + '&' + query}` : `/leads?deptId=${localUserData.departmentId}&page=${page}`
        }else{
          URL = query ? `/leads?walkout=1&deptId=${localUserData.departmentId}&page=${page + '&' + query}` : `/leads?walkout=1&deptId=${localUserData.departmentId}&page=${page}`
        }
      }else{
        if(isLeads){
          URL = query ? `/leads?page=${page + '&' + query}` : `/leads?page=${page}`
        }else{
          URL = query ? `/leads?walkout=1&page=${page + '&' + query}` : `/leads?walkout=1&page=${page}`
        }
      }
      const response = await getleadList(URL)
      if(response && response?.data?.length > 0){
         let leads = response.data?.filter((t: any) => t.lead_status !== '7')
          setLeadList(leads);
          setTotalCount(response.totalrows ? response.totalrows : 0)
      }else{
        setLeadList([])
        setTotalCount(0)
      }
      setIsLoading(false)
    } catch (err: any) {
      setIsLoading(false)
      dispatch(setError({ status: true, type: 'error', message: err }))
    }
  }

  const fetchReopenLeadsList = async (page: number, query: string | null) => {
    try {
      setIsLoading(true)
      let URL = ''
      if(multiDep !== null && multiDep && localUserData){
        URL = query ? `/dashboard/reports?reOpenStatus=1&deptId=${localUserData.departmentId}&page=${page + '&' + query}` : `/dashboard/reports?reOpenStatus=1&deptId=${localUserData.departmentId}&page=${page}`
      }else{
        URL = query ? `/dashboard/reports?reOpenStatus=1&page=${page + '&' + query}` : `/dashboard/reports?reOpenStatus=1&page=${page}`
      }
      const response = await getreportsList(URL)
      if(response && response?.data?.length > 0){
        setReOpenLeadsData(response.data)
        setTotalCount(response?.totalRows ? response?.totalRows : 0)
      }else{
        setTotalCount(0)
      }
      setIsLoading(false)
    } catch (err: any) {
      setIsLoading(false)
      dispatch(setError({ status: true, type: 'error', message: err }))
    }
  }

  const generateUnknowLeads = async () => {
    try {
        dispatch(setError({ status: true, type: 'success', message: 'Cron Job Initiated' }))
        const response = await generateUnknowLeadsJob()
        if(response){
          dispatch(setError({ status: true, type: 'success', message: 'Cron Job Successfull' }))
        }
    } catch (err: any) {
        dispatch(setError({ status: true, type: 'error', message: err }))
    }
  }

  useEffect(() => {
    if(!showReopenLeads){
      fetchLeadList(currentPage, queryString)
    }else{
      fetchReopenLeadsList(currentPage, queryString)
    }
  }, [showReopenLeads, queryString, currentPage]);

  useEffect(() => {
    if(!showReopenLeads){
      if(localUserData?.role !== '1'){
        fetchAgentList()
      }
      if(localUserData?.role === '2'){
        fetchTeamList();
      }
     }
  }, [showReopenLeads]);

  const teamCloumnsVal = () => {
    if (localUserData?.role === "3" && localUserData?.departmentId === 5) {
      return teamsColumns0.concat(teamColumns1);
    }
    if (localUserData?.role === "3" && localUserData?.departmentId === 6) {
      return teamsColumns0.concat(teamColumns2);
    } else {
      let newTeamColumns = teamsColumns0;
  
      if ([2, 3, 4].includes(localUserData?.departmentId)) {
        newTeamColumns = newTeamColumns.filter((item) => item.title !== 'Submission type');
        newTeamColumns = newTeamColumns.filter((item) => item.title !== 'Documents');
        newTeamColumns = newTeamColumns.filter((item) => item.title !== 'Final Documents');
      }
  
      if (localUserData?.role !== "5") {
        newTeamColumns = newTeamColumns.concat([
          {
            title: "Actions",
            key: "action",
            render: (_: any, record: any) => {
              return (
                <Space size="middle">
                  <span
                    onClick={() =>
                      navigate(`/leads/edit/${record.lead_id}`, {
                        state: record,
                      })
                    }
                  >
                    <EditOutlined style={{ color: "#3AA0E9" }} />
                  </span>
                </Space>
              );
            },
          },
        ]);
      }
  
      return newTeamColumns;
    }
  };
  

  const adminColumnsVal = () => {
    if(localUserData?.role === "2" && (localUserData?.departmentId === 5 || localUserData?.departmentId === 6)){
      return adminColumns.concat(adminColumns1)
    }
    
    else{
      return adminColumns.concat(adminColumns3)
    }
  }
   useEffect(() => {
    if(localUserData){
      if(localUserData?.role === "2"){
        let copyColumnsValsAdmin = adminColumnsVal()
        if(localUserData?.departmentId === 5 && localUserData?.departmentId === 6){
          copyColumnsValsAdmin.splice(copyColumnsValsAdmin.length - 1, 0, {
                title: "Service Charge",
                dataIndex: "service_charge",
                key: "service_charge",
                render: (_: any, record: any) => <span>{record?.service_charge} {record?.client_payment_status && `${record?.client_payment_status === '1' ? '(Is Ready)' : '(Is Not Ready)'}`}</span>
              })
        }
        if(localUserData?.role === "2" && localUserData?.departmentId === 5){
          copyColumnsValsAdmin.splice(copyColumnsValsAdmin.length - 4, 0, {
                title: "Pay tax type",
                dataIndex: "lead_payable_option, lead_payable_amount",
                key: "lead_payable_option, lead_payable_amount",
                render: (_: any, record: any) => <span>{record?.lead_payable_option ? getPaymentOption(record?.lead_payable_option) : ''} / {record.lead_payable_amount}</span>
              })
        }
        if(localUserData?.role === "2" && localUserData?.departmentId === 5){
          copyColumnsValsAdmin.splice(copyColumnsValsAdmin.length - 4, 0, {
                title: "Payment Status",
                dataIndex: "paid_status",
                key: "paid_status",
                render: (record: any, list: any) => <span> {(list?.lead_status === "7" || list?.department_id !== localUserData?.departmentId) ? list.paid_status : (
                  <Select
                    style={{
                      width: '100%',
                    }}
                    key={record}
                    defaultValue={record}
                    placeholder="Select status"
                    onChange={(e: any) => handlePaymentStatus(e, list?.lead_id)}
                    options={paymentStatus}
                    showSearch
                    filterOption={filterOption}
                  />
                )}</span>,              })
        }
         if([2, 3,4].includes(localUserData?.departmentId) && ["2","3","5"].includes(localUserData?.role)) {
          copyColumnsValsAdmin = copyColumnsValsAdmin.filter((item) => item.title !== 'Submission type')
        }
        if([2, 3,4].includes(localUserData?.departmentId) && ["2","3","5"].includes(localUserData?.role)) {
          copyColumnsValsAdmin = copyColumnsValsAdmin.filter((item) => item.title !== 'Documents')
        }
        if([2, 3,4].includes(localUserData?.departmentId) && ["2","3","5"].includes(localUserData?.role)) {
          copyColumnsValsAdmin = copyColumnsValsAdmin.filter((item) => item.title !== 'Final Documents')
        }
        setTableColumns(copyColumnsValsAdmin)
      }else{
        let copyColumnsValsTeam: any[] = teamCloumnsVal()
         if(localUserData?.role === "3" && localUserData?.departmentId === 5 && localUserData?.departmentId === 6){
          copyColumnsValsTeam.splice(copyColumnsValsTeam.length - 1, 0, {
                title: "Service Charge",
                dataIndex: "service_charge",
                key: "service_charge",
                render: (_: any, record: any) => <span>{record?.service_charge} {record?.client_payment_status && `${record?.client_payment_status === '1' ? '(Is Ready)' : '(Is Not Ready)'}`}</span>
              })
        }
        if([2, 3,4].includes(localUserData?.departmentId) && ["2","3","5"].includes(localUserData?.role)) {
          copyColumnsValsTeam = copyColumnsValsTeam.filter((item) => item.title !== 'Submission type')
        }
        if([2, 3,4].includes(localUserData?.departmentId) && ["2","3","5"].includes(localUserData?.role)) {
          copyColumnsValsTeam = copyColumnsValsTeam.filter((item) => item.title !== 'Documents')
        }
        if([2, 3,4].includes(localUserData?.departmentId) && ["2","3","5"].includes(localUserData?.role)) {
          copyColumnsValsTeam = copyColumnsValsTeam.filter((item) => item.title !== 'Final Documents')
        }
        
        setTableColumns((!isLeads && localUserData?.role === "1") ? copyColumnsValsTeam.filter((col: any) => col.key !== 'action') : copyColumnsValsTeam)
      }
    }
  }, [assignedAgents])

  const doMultipleAssign = async (id:any) => {
    for(let i = 0; i < selectedLeads.length; i++) {
      let lead_id = selectedLeads[i].lead_id;
      await handleAgents(id, lead_id);
    }
    setSelectedLeads([])    
  }
  
  return (
    <div>
      {showModal && (
        <History
          show={showModal}
          hideModal={modalToggle}
          leadId={currentLeadId}
          isLeads={isLeads}
        />
      )}
      {
        showModalName && (
          <LeadHistory
            show={showModalName}
            hideModal={modalToggeleCleintName}
            leadId={currentLeadId}
            isLeads={isLeads}
        />
        )
      }
      {showTaxConfigModal && (
        <TaxConfigModal
          show={showTaxConfigModal}
          selectedLead={selectedTaxConfigData}
          hideModal={toggleConfigModal}
        />
      )}
      {/* {
        localUserData && localUserData?.departmentId === 5 && localUserData?.role === '3' && (
          <div style={{display: 'flex',  margin: 10}}>
             {
                    timeZoneOptions.map((time: any) => <Timer timer={time}/>)
                }
           </div>
        )
      } */}
      <ContentHeader
        showBtn={false}
        redirectPath="/sales-data"
        buttonText=""
        title="Leads"
        showIcon
        Icon={FiPlusCircle}
      />
      <SearchFilter
        fields={generateSearchFields}
        onSubmit={(queryStrings: string) => {
          setCurrentPage(1);
          setQueryString(queryStrings);
        }}
        clearSearch={() => {
          setCurrentPage(1);
          setQueryString(null);
        }}
        showButtons={true}
        
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "15px 0",
        }}
      >
        {localUserData && localUserData?.role === "1" && (
          <DownloadCsv
            headers={(showReopenLeads ? reopenLeadsColumns : tableColumns).map(
              (col: any) => ({
                title: col.title,
                key: col.key,
                formate: col?.render ? exportFormates[col.key] : false,
              })
            )}
            filename={isLeads ? "Leads" : "Walkouts"}
            URL={
              isLeads
                ? queryString
                  ? `/leads?download=1&${queryString}`
                  : "/leads?download=1"
                : queryString
                ? `/leads?walkout=1&download=1&${queryString}`
                : "/leads?walkout=1&download=1"
            }
            disabled={false}
          />
        )}
        {localUserData?.role === "3" && localUserData?.departmentId === 2 && (
          <Button onClick={() => setReopenLeads(!showReopenLeads)}>
            {showReopenLeads && "Close"} Reopen leads
          </Button>
        )}
      </div>
      {localUserData?.role === "2" &&  (
        <>
          <Row style={{ marginTop: "5px", marginBottom: "10px" }}>
            <Col span={3}>Assign Multiple:</Col>

            <Col span={6}>
              <Select
                style={{
                  width: "100%",
                }}
                placeholder="Select Team Member"
                onChange={(e: any) => doMultipleAssign(e)}
                options={assignedAgents}
                showSearch
                filterOption={filterOption}
                className="ant-col ant-form-item-control css-dev-only-do-not-override-3rel02"
              />
            </Col>
            {localUserData?.role === "2" && localUserData?.departmentId === 2 &&  (
            <Col span={8}><Button onClick={generateUnknowLeads} style={{float: "right"}}>Unknow leads</Button></Col>
          )}
          </Row>
        </>
    )}
      <Table
        rowClassName="editable-row"
        bordered
        columns={showReopenLeads ? reopenLeadsColumns : tableColumns}
        dataSource={showReopenLeads ? reOpenLeadsData : leadList}
        pagination={false}
        loading={isLoading}
        rowSelection={rowSelection}
        rowKey="lead_id"
      />
      <Pagination
        onChange={(pagination: any) => {
          setCurrentPage(pagination);
        }}
        style={{ marginTop: "15px" }}
        current={currentPage}
        defaultPageSize={25}
        showSizeChanger={false}
        hideOnSinglePage
        total={totalCount}
      />
    </div>
  );
}

export default Leads
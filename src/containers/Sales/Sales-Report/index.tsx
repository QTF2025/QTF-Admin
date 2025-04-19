import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios';
import ContentHeader from '../../../components/ContentHeader'
import SearchFilter from '../../../components/SearchFilter';
import { Button, Pagination, Select, Space, Table, Modal } from 'antd';
import { followUpOptions, options, salesLinks, timeoptionsLables } from '../constants';
import moment from 'moment';
import SalesService from '../../../services/Sales.services';
import LeadService from '../../../services/Lead.services';
import { TfiSkype } from "react-icons/tfi";
import { IoIosMail } from "react-icons/io";
import { BiSolidPhoneCall, BiLogoWhatsapp  } from "react-icons/bi";
import { FiPlusCircle } from "react-icons/fi";
import { useLocation, useNavigate } from 'react-router-dom';
import FollowUpModal from './Modal';
import {getLeadStatusIndex, stepItems} from './constants'
import {
  EyeOutlined,
} from "@ant-design/icons";
import './styles.scss'
import DashboardService from '../../../services/Dashboard.services';
import formateNum from 'format-thousands'
import { setError } from '../../../store/reducers';
import { useDispatch } from 'react-redux';
import History from '../../../components/History';
import DownloadCsv from '../../../utils/downloadCSV';
import localStorageContent from '../../../utils/localstorage';
import { HTMLDecode, convertToCSVText, extractTextFromHTML } from '../../../utils';
import {
  EditOutlined,
} from "@ant-design/icons";
import EditUserModal from '../EditModal';

const fieldsData = [
    {
        label: 'Status',
        key: 'status',
        elementType: 'SELECT',
        onChangeField: () => {},
        options: options,
        required: true,
        disable: false,
        type: 'string',
        placeholder: 'Select Status',
        config: {
            rules: [{ required: false, message: 'Please select Status' }],
        }
    },
     {
        label: 'Time Zone',
        key: 'timezone',
        elementType: 'SELECT',
        onChangeField: () => {},
        options: timeoptionsLables,
        required: true,
        disable: false,
        type: 'string',
        placeholder: 'Select Time Zone',
        config: {
            rules: [{ required: false, message: 'Please select Time Zone' }],
        }
    },
    {
        label: 'Select Date',
        key: 'date',
        elementType: 'DATE_PICKER_DATE_TIME',
        onChangeField: () => {},
        required: true,
        disable: false,
        type: 'date',
        value: '',
        config: {
            rules: [{ required: false, message: 'Please Select Date!' }],
        }
    },
    {
        label: 'Client Search',
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

const SalesDataReports = () => {
    const [totalCount, setTotalCount] = useState<number>(0)
    const [queryString, setQueryString] = useState<any>(null)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [isLoading, setIsLoading] = useState<boolean>(false) 
    const [salesList, setSalesList] = useState<any[]>([])
    const [followupData, setFollowUpData] = useState<null | string>(null)
    const [showModal, setShowModal] = useState<boolean>(false)
    const [showHostoryModal, setShowHostoryModal] = useState<boolean>(false)
    const [interestedUsersIds, setInterestedUsersIds] = useState<any[]>([]);
    const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [currentEditUser, setCurrentEditUser] = useState<boolean>(false)
    const [filterCount, setFilterCount] = useState<any>({
        interested: 0,
        notInterested: 0,
        voicemail: 0,
        invalidNumber: 0,
        notInService: 0,
        dND: 0,
        citizens: 0
    })
    const [isButtonDisabled, setIsButtonDisabled] = useState(false); // To track the button state
    const [message, setMessage] = useState(""); // To store success or info message  
    const [timeZoneData, setTimeZoneData] = useState<null | any>(null)
    const [currentContactId, setCurrentContactId] = useState<any>(null)
    const [currentLeadId, setCurrentLeadId] = useState<any>(null)
    const { getsalesList, patchFollowps, leadExist } = SalesService;
    const { reopenLead } = LeadService;
    const { getDashboardDetails } = DashboardService;
    const { Option } = Select;
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const { pathname, hash } = location
    const localUserData = localStorageContent.getUserData()
    const fullName = `${localUserData.firstName} ${localUserData.lastName}`;

    const [data, setData] = useState({
        email: '',
        lead_id: null,
        status: '',
        lead_status: '',
        // Add other initial values as needed
      });

     const toggleEditModal = (data: any) => {
    setShowEditModal(!showEditModal)
    setCurrentEditUser(data)
  }

    const modalToggle = () => {
    if(showHostoryModal){
        setCurrentContactId(null)
        setCurrentLeadId(null)
    }
    setShowHostoryModal(!showHostoryModal)
  }

    const handleSelectChange = (value: any, data: any) => {
        if (value === '3') {
            setShowModal(true);
            setFollowUpData(data)
        }else{
            updateData(value, data.id)
            setShowModal(false);
        }

        if(value === "1"){
             setInterestedUsersIds([...interestedUsersIds, data.id])
        }else{
            if(interestedUsersIds.includes(data.id)){
                setInterestedUsersIds(interestedUsersIds.filter((dtId) => dtId !== data.id))
            }
        }
    }

    const updateData = async (value: any, id: any) => {
        try {
            let URL: string = ''
            if(pathname === '/sales/report'){
                URL = `/sales/${id}/update-contact-status`
            }else{
                URL = `/sales/${id}/update-followup-status`
            }
            const response = await patchFollowps(URL, { status: value })
            dispatch(setError({ status: true, type: 'success', message: response?.message }))
            fetchData(currentPage, queryString)
        } catch (err: any) {
            dispatch(setError({ status: true, type: 'error', message: err }))
        }
    }

    const fetchData = async (page: any, query: string | null) => {
        try {
            setIsLoading(true)
            let URL: string = ''
            if(pathname === '/sales/report'){
                URL = !query ? `/sales/contacts?page=${currentPage}` : `/sales/contacts?page=${page + '&' + query}`
            }else{
                URL = !query ? `/sales/follow-ups?page=${currentPage}` : `/sales/follow-ups?page=${page + '&' + query}`
            }
            const response = await getsalesList(URL);
            if(response && response?.data?.length > 0){
                setSalesList(response?.data) 
                setTotalCount(response?.totalRows)
                if(pathname === '/sales/followup-calls'){
                    setTimeZoneData(response.timezones)
                }
            }else{
                setSalesList([])
                setTotalCount(0)
            }
            setIsLoading(false)
        } catch (error: any) {
            setIsLoading(false)
            dispatch(setError({ status: true, type: 'error', message: error }))
        }
    } 

    const handleApiCall = async (associatename: string, name: string, phone: string,) => {
        const url = 'https://api.quickreply.ai/webhook/company/XHTDFhWZmXbqWNMWR_c/key/xWWu5abb3fMGZy5i3';
        try {
            const response = await axios.post(url, { associatename, name, phone });
            console.log('API response:', response.data);
        } catch (error) {
            console.error('Error calling API:', error);
        }
    };

    const getSalesDashboard = async (query: any) => {
        try {
            setIsLoading(true)
            let URL = query ? `/dashboard/sales-reports?${query}` : '/dashboard/sales-reports'
            const response = await getDashboardDetails(URL)
            if(response){
                const dashboard = response?.data;
                const { total, pending, interested, followup, notInterested, voicemail, invalidNumber, notInService, dnd, citizens   } = dashboard
                setFilterCount({
                    total: total,
                    pending: pending,
                    interested: interested,
                    followup: followup,
                    notInterested: notInterested,
                    voicemail: voicemail,
                    invalidNumber: invalidNumber,
                    notInService: notInService,
                    dnd: dnd,
                    citizens : citizens


                })
            }
            setIsLoading(false)
        } catch (err: any) {
            setIsLoading(false)
            dispatch(setError({ status: true, type: 'error', message: err }))
        }
    }

    const exportFormates: any = {
        name: (value: any) => value ? value : '',
        phone_number: (value: any) => value ? value : '',
        follow_up_date: (value: any) => value ? moment(value).format("DD-MM-YYYY hh:mm A") : '',
        comment: (value: any) => value ? convertToCSVText(HTMLDecode(value)) : ''
    }

    const renderLeadStatus = (lead_status: string): JSX.Element => {
        switch (lead_status) {
          case "1":
            return <p>Process</p>;
          case "2":
            return <p>Verification</p>;
          case "3":
            return <p>Review</p>;
          case "4":
            return <p>Finance</p>;
          case "6":
            return <p>Submission</p>;
          case "7":
            return <p>Completed</p>;
          default:
            return <p>Unknown Status</p>;
        }
      };

    const statusList = ["UnPaid Data","Paid Data", "All Data", "Server Data", "Referral Data"]
    
    const salesReportColumns = [
        {
        title: 'S.No',
        dataIndex: 'id',
        key: 'id',
        className: 'noselect',
        },   
        
        {
        title: 'Name',
        key: 'name',
        render: (text: any, record: any) => `${record.name}`,
        className: 'noselect',
        },
        {
            title: 'Email ID',
            dataIndex: 'email',
            key: 'email',
            render: (text: any,data: any) => <a href={`mailto:${data.email}`}><IoIosMail  size={25}/></a>
        },
        
        {
            title: 'Number',
            dataIndex: 'phone_number',
            key: 'phone_number',
            className: 'noselect',
            },
        {
        title: 'Call',
        dataIndex: 'phone_number',
        key: 'phone_number',
        render: (text: any,data: any) => <a href={`callto:1${data.phone_number}`}><BiSolidPhoneCall size={25}/></a>
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
            title: 'Upload type',
            dataIndex: 'is_senior',
            key: 'is_senior',
                  render: (record: any) => {
              return (
                <div>
                  <p>{statusList[record]}</p>
                </div>
              );
            }
          },       
        {
        title: 'Actions',
        
        render: (data: any) => {
            return (
                <div>
                {/* Select Box */}
                <Select
                  style={{ width: 150 }}
                  disabled={data?.lead_id !== null} // Disable if lead_id exists
                  defaultValue="Pending"
                  value={
                    data?.status !== null
                      ? options.find((opt: any) => opt.value === data?.status)
                      : ''
                  }
                  onChange={(e) => handleSelectChange(e, data)} // Update status
                >
                  {options.map((opt: any) => (
                    <Option value={opt.value} key={opt.value}>
                      {opt.label}
                    </Option>
                  ))}
                </Select>
              
                {/* Conditional Rendering Based on lead_id */}
                {data?.lead_id !== null ? (
                  <>
                    {/* Go to Lead Button */}
                    <Button
                      className="salesButton"
                      style={{ marginLeft: '10px' }}
                      onClick={() =>
                        navigate(`/leads/edit/${data.lead_id}`, {
                          state: { id: data.lead_id },
                        })
                      }
                    >
                      Go to Lead
                    </Button>
                    {/* Display Lead Status */}
                    <span style={{ display: 'inline-block', marginLeft: '10px' }}>
                      <b>{renderLeadStatus(data.lead_status)}</b>
                    </span>
                  </>
                ) : (
                  data?.status === '1' && (
                    // Create Lead Button
                    <>
                    <Button
                      className="salesButton"
                      style={{ marginLeft: '10px' }}
                      disabled={isButtonDisabled} // Disable button when state is true
                      onClick={async () => {
                        try {
                          const emailPayload = { email: data.email }; // Ensure email exists
                          const response = await leadExist(emailPayload); // Check if lead exists
              
                          if (response?.data?.status === true) {
                            // Lead exists, reopen it
                            const reopenResponse = await reopenLead(response.data.lead_id);
                            console.log('Reopen Lead Response:', reopenResponse);
                            alert('Lead reopened successfully!');
           
                            // Update lead_id in data to reflect state change
                            setData((prevData) => ({
                              ...prevData,
                              lead_id: response.data.lead_id,
                            }));
                                // Disable the button and show a success message
                                setIsButtonDisabled(true);
                                setMessage('Lead is created. Please update the tax year.');
                          } else if (response?.data?.status === false) {
                            // Lead does not exist, navigate to create lead
                            navigate('/leads/create', {
                              state: { redirectFrom: 'Sales_calls', ...data },
                            });
                          } else {
                            console.error('Unexpected API response:', response);
                          }
                        } catch (error) {
                          console.error('Error processing lead:', error);
                          alert('An error occurred while processing the request.');
                        }
                      }}
                    >
                      Create Lead
                    </Button>
                          {message && <div style={{ marginTop: '10px', color: 'green' }}>{message}</div>}
                          </>
                  )
                )}
                
              </div>
              
            )
        }
        },
    //      {
    //   title: 'Edit User',
    //   render: (record: any) => {
    //     return (
    //       <Space size="middle">
    //           <span 
    //             onClick={() => toggleEditModal(record)}
    //             >
    //             <EditOutlined style={{ color: "#3AA0E9" }} />
    //           </span>
    //         </Space>
    //     );
    //   }
    // },
    ];

    const followupsColumns = [
        {
        title: 'S.No',
        dataIndex: 'id',
        key: 'id',
        className: 'noselect',
        },
        
        {
        title: 'Name',
        key: 'name',
        className: 'noselect',
        render: (text: any, record: any) => `${record.name}`,
        },
        {
            title: 'Email ID',
            dataIndex: 'email',
            key: 'email',
            className: 'noselect',
            render: (email: any) => <a href={`mailto:${email}`}><IoIosMail size={25}/></a>
        },
        {
        title: 'Number',
        dataIndex: 'phone_number',
        key: 'phone_number',
        className: 'noselect',
        },
        
        {
        title: 'Call',
        dataIndex: 'phone_number',
        className: 'noselect',
        key: 'phone_number',
        render: (phone_number: any) => <a href={`callto:1${phone_number}`}>
            <BiSolidPhoneCall size={25}/>
        </a>
        },
        {
            title: 'Upload type',
            dataIndex: 'is_senior',
            key: 'is_senior',
                  render: (record: any) => {
              return (
                <div>
                  <p>{statusList[record]}</p>
                </div>
              );
            }
          }, 
        {
        title: 'Follow Up Date',
        dataIndex: 'follow_up_date',
        className: 'noselect',
        key: 'follow_up_date',
        render: (record: any) => {
            return (
            <div>
                <p>{moment(record).format("DD-MM-YYYY hh:mm A")}</p>
            </div>
            );
        }
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
        title: 'TimeZone',
        dataIndex: 'timezone',
        key: 'timezone',
        className: 'noselect',
        },
        {
        title: 'History',
        render: (data: any) => {
          return (<Space size="middle">
            <span 
                onClick={() => {
                    setCurrentContactId(data?.contact_id)
                    setCurrentLeadId(data?.id)
                    console.log(data)
                    modalToggle()
                }}
              >
              <EyeOutlined style={{ color: "#3AA0E9" }} />
            </span>
          </Space>
            )
        },
        },
        {
        title: 'Note',
        dataIndex: 'comment',
        key: 'comment',
        render: (text: any) => text ? <p style={{margin: 0}} dangerouslySetInnerHTML={{__html: extractTextFromHTML(text)}} /> : '--',
        },
        {
        title: 'Actions',
        render: (data: any) => {
            return (
            <div>
                <Select style={{ width: 150 }} defaultValue="Pending" value={data?.status !== null ? followUpOptions.find((opt: any) => opt.value === data?.status) : ''} onChange={(e) => handleSelectChange(e, data)}>
                {
                    followUpOptions.map((opt: any) => <Option value={opt.value}>{opt.label}</Option>)
                }
                </Select>
                {
                interestedUsersIds.includes(data.id) && (
                    <Button className="slaesButton" style={{marginLeft: '10px'}} onClick={() => {
                    navigate('/new-lead', { state: {
                    redirectFrom: 'FOLLOW_UPS',
                    ...data 
                    }})
                    }}>Create Lead</Button>
                )
                }
            </div>
            )
        }
        },
    ];

    const generateSearchFields = useMemo(() => {
            const copyFields = [...fieldsData]
            let fields: any [] = [];
            if(pathname === '/sales/report'){
                copyFields.splice(1, 2)
                fields = copyFields
            }
            if(pathname === '/sales/followup-calls'){
                copyFields.splice(0, 1)
                fields = copyFields
            }
            return fields
    },[pathname])

    useEffect(() => {
        fetchData(currentPage, queryString)
    }, [currentPage, pathname, queryString])

    useEffect(() => {
        if(pathname === '/sales/report'){
            getSalesDashboard(null)
        }
        setCurrentPage(1)
    }, [pathname])

  return (
    <div className='sales-data-report'>
        <EditUserModal 
          showEditModal={showEditModal}
          toggleEditModal={toggleEditModal}
          editUser={currentEditUser}
          currentPage={currentPage}
          queryString={queryString}
          getSalesListData={fetchData}
       />
        {
        showHostoryModal && (
          <History 
            show={showHostoryModal}
            hideModal={modalToggle}
            leadId={currentLeadId}
            contactId={currentContactId}
            section={'FOLLOWUP'}
          />
        )
      }
        {
            showModal && (
                <FollowUpModal 
                    show={showModal} 
                    hideModal={() => setShowModal(false)} 
                    followUpData={followupData}
                    page={currentPage}
                    refreshData={fetchData}
                    updateFollowUpData={setFollowUpData}
                />
            )
        }
          {
            pathname === '/sales/followup-calls' && timeZoneData && (
                <div className='sales-data-report__timezones'>
                    {
                        Object.keys(timeZoneData).map((key: any) => {
                            if(timeZoneData){
                                return <div className='sales-data-report__timezones--time fllowup-data-report__timezones--time'>{key.toUpperCase() + ' : ' + timeZoneData[key]}</div>
                            }
                        })
                    }
                </div>
            )
        }
        <div className='sales-data-report__timezones' style={{display: 'flex', justifyContent: 'space-between'}}>          
            <div>
                {/* <p style={{margin: 0, fontWeight: 'bold'}}>Total Data : {totalCount}</p> */}
            </div>
        </div>
        {
            <div className='sales-data-report__sales-links'>
                {/* {
                    salesLinks.map((links: any, i: number) => <Button key={i} onClick={() => {
                        setCurrentPage(1)
                        navigate(links.link)
                        setQueryString(null)
                    }}>{links.label} {(pathname === links.link && hash ==='' && isLoading === false) && `- ${links.key === 'followups' ? formateNum(salesList.length, ",") : totalCount ? formateNum(totalCount, ",") : 0}`}</Button>)
                } */}
                {
                    pathname === '/sales/report' && (
                        <>
                            <Button onClick={() => {
                                setCurrentPage(1)
                                setQueryString(null)
                            }}>Total Data - {formateNum(filterCount.total, ",")}</Button>
                            <Button onClick={() => {
                                setCurrentPage(1)
                                setQueryString('status=0')
                                window.location.hash = "#pending"
                            }}>Pending - {formateNum(filterCount.pending, ",")}</Button>
                            <Button onClick={() => {
                                setCurrentPage(1)
                                setQueryString('status=1')
                                window.location.hash = "#Interested"
                            }}>Interested - {formateNum(filterCount.interested, ",")}</Button>
                            <Button onClick={() => {
                                setCurrentPage(1)
                                setQueryString(null)
                                navigate('/sales/followup-calls')
                            }}>Follow Ups - {formateNum(filterCount.followup, ",")}</Button>
                            <Button onClick={() => {
                                setCurrentPage(1)
                                setQueryString('status=2')
                                window.location.hash = "#notInterested"
                            }}>Not Interested - {formateNum(filterCount.notInterested, ",")}</Button>
                            <Button onClick={() => {
                                setCurrentPage(1)
                                setQueryString('status=4')
                                window.location.hash = "#voicemail"
                            }}>Voicemail - {formateNum(filterCount.voicemail, ",")}</Button>
                            <Button onClick={() => {
                                setCurrentPage(1)
                                setQueryString('status=5')
                                window.location.hash = "#invalidNumber"
                            }}>Invalid Number - {formateNum(filterCount.invalidNumber, ",")}</Button>
                            <Button onClick={() => {
                                setCurrentPage(1)
                                setQueryString('status=6')
                                window.location.hash = "#notInService"
                            }}>Not In Service - {formateNum(filterCount.notInService, ",")}</Button>
                            <Button onClick={() => {
                                setCurrentPage(1)
                                setQueryString('status=7')
                                window.location.hash = "#dnd"
                            }}>DND- {formateNum(filterCount.dnd, ",")}</Button>
                            <Button onClick={() => {
                                setCurrentPage(1)
                                setQueryString('status=8')
                                window.location.hash = "#citizens"
                            }}>Citizens - {formateNum(filterCount.citizens, ",")}</Button>
                        </>
                    )
                }
            </div>
        }
        <ContentHeader 
            showBtn
            redirectPath={pathname.includes('followup-calls') ? '/sales/report' : '/sales/followup-calls'}
            buttonText={pathname.includes('followup-calls') ? 'Sales Reports' : 'Follow Up Calls'}
            title={pathname.includes('report') ? 'Sales Reports' : 'Follow Up Calls'}
            showIcon={false}
            Icon={FiPlusCircle}
        />
        <SearchFilter 
          fields={generateSearchFields}
          onSubmit={(queryStrings: any) => {
            setCurrentPage(1)
            setQueryString(queryStrings)
          }}
          clearSearch={() => {
            setCurrentPage(1)
            setQueryString(null)
          }}
          showButtons={true}
        />
        {
          localUserData && localUserData?.role === '1' && (
            <div>
              <DownloadCsv 
                headers={(pathname === '/sales/report' ? salesReportColumns : followupsColumns).map((col: any) => ({ title: col.title, key: col.key, formate: col?.render ? exportFormates[col.key] : false }))}
                filename={pathname === '/sales/report' ? 'Sales-reports' : 'followups'} 
                URL={pathname === '/sales/report' ? queryString ? `/sales/contacts?download=1&${queryString}` : '/sales/contacts?download=1' : queryString ? `/sales/follow-ups?download=1&${queryString}` : '/sales/follow-ups?download=1'} disabled={false} />
            </div>
          )
        }
         <Table
          rowClassName="editable-row"
          bordered
          columns={pathname === '/sales/report' ? salesReportColumns : followupsColumns}
          dataSource={salesList}
          pagination={false}
          loading={isLoading}
        />
        <Pagination 
          onChange={(pagination: any) => {
            setCurrentPage(pagination)
          }} 
          style={{marginTop: '15px'}}
          current={currentPage} 
          defaultPageSize={25} 
          showSizeChanger={false}
          hideOnSinglePage
          total={totalCount}   
        />
    </div>
  )
}

export default SalesDataReports
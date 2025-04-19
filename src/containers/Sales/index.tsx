import React, { useState, useEffect, useMemo } from 'react'
import ContentHeader from '../../components/ContentHeader'
import { FiPlusCircle } from "react-icons/fi";
import SearchFilter from '../../components/SearchFilter';
import { Button, Dropdown, Menu, Pagination, Space, Table } from 'antd';
import { options, options_issenior_0, options_issenior_3 } from './constants';
import moment from 'moment';
import SalesService from '../../services/Sales.services';
import TeamService from '../../services/Team.services';
import localStorageContent from '../../utils/localstorage';
import DashboardService from '../../services/Dashboard.services';
import { useLocation, useNavigate } from 'react-router-dom';
import formateNum from 'format-thousands'
import './styles.scss'
import { useDispatch } from 'react-redux';
import { setError } from '../../store/reducers';
import DownloadCsv from '../../utils/downloadCSV';
import {
  EditOutlined,
} from "@ant-design/icons";
import EditUserModal from './EditModal';

const Sales = () => {
  const [totalCount, setTotalCount] = useState<number>(0);
  const [status, setStatus] = useState('');
  const [queryString, setQueryString] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [salesList, setSalesList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [teamList, setTeamList] = useState<any[]>([])
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [currentEditUser, setCurrentEditUser] = useState<boolean>(false)
  const [filterCount, setFilterCount] = useState<any>({
        interested: 0,
        notInterested: 0,
        notReachable: 0
    })
  const localUserData = localStorageContent.getUserData()
  const { getsalesList, generateCronJob, generateSubmissionLeadsJob, generateWalkoutLeadsJob, generateVoicemailsJob } = SalesService;
  const { getTeamList } = TeamService
  const { getDashboardDetails } = DashboardService;
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation();
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [error, setErrorState] = useState<string | null>(null);
  
  const exportFormates: any = {
    created_dt: (value: any) => value ? `${moment(value).format("DD-MM-YYYY")}` : '',
    name: (value: any) => value ? value : '',
    status: (value: any) => value ? options.find((opt) => opt.value === value)?.label : ''
  }

  const toggleEditModal = (data: any) => {
    setShowEditModal(!showEditModal)
    setCurrentEditUser(data)
  }

  const statusList = ["UnPaid Data","Paid Data", "All Data", "Server Data", "Referral Data"]
  const fieldsData = [
    {
        label: 'Team List',
        key: 'teamId',
        elementType: 'SELECT',
        onChangeField: () => {},
        options: teamList,
        required: true,
        disable: false,
        type: 'string',
        placeholder: 'Select an team member',
        config: {
            rules: [{ required: false, message: 'Please select an team member' }],
        }
    },
    {
        label: 'Status',
        key: 'status',
        elementType: 'SELECT',
        onChangeField: (e:any) => setStatus(e),
        options: options,
        required: true,
        disable: false,
        type: 'string',
        placeholder: 'Select Status',
        config: {
            rules: [{ required: false, message: 'Please Enter Status' }],
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
    {
      label: 'Upload type',
      key: 'isSenior',
      elementType: 'SELECT',
      onChangeField: (e:any) => {},
      options: [],
      required: true,
      disable: false,
      type: 'string',
      placeholder: 'Select Status',
      config: {
          rules: [{ required: false, message: 'Please Enter Status' }],
      }
  },
]

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'id',
      key: 'id',
      className: 'noselect',
    },
    {
      title: 'Team Member',
      dataIndex: 'team_member',
      key: 'team_member',
      className: 'noselect',
    },
    {
      title: 'Added Date',
      dataIndex: 'created_dt',
      className: 'noselect',
      key: 'created_dt',
      render: (record: any) => {
        return (
          <div>
            <p>{moment(record.created_dt).format("DD-MM-YYYY")}</p>
          </div>
        );
      }
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
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone_number',
      key: 'phone_number',
      className: 'noselect',
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
      title: 'Action',
      key: 'status',
      render: (record: any) => {
        return (
          <div>
            <p>{record?.status !== null ? options.find((opt) => opt.value === record?.status)?.label : '--'}</p>
          </div>
        );
      }
    },
    {
      title: 'Edit User',
      render: (record: any) => {
        return (
          <Space size="middle">
              <span 
                onClick={() => toggleEditModal(record)}
                >
                <EditOutlined style={{ color: "#3AA0E9" }} />
              </span>
            </Space>
        );
      }
    },
  ];

  const generateSearchFields = useMemo(() => {
    const copyFields = fieldsData
    let fields: any [] = [];
    if((localUserData?.role === '1' || localUserData?.role === '2') || localUserData?.departmentId === 1){
      fields = copyFields
    }else{
      copyFields.splice(0,1)
      fields = copyFields;
    }
    fields.map((item) => {
      if(item.label === 'Upload type') {
        item.options = (status === "0" )? options_issenior_0 : options_issenior_3
      }
    })
    return fields
  },[teamList, status])

  const fetchTeamList = async () => {
    try {
      if (localUserData === null) {
        return;
      }
      setIsLoading(true); // Start loading
      // const response = await getTeamList(`/team?deptId=${localUserData?.role === '1' ? 1 : localUserData?.departmentId}`);
      const response = await getTeamList(`/team/search-teams?deptId=${localUserData?.role === '1' ? 1 : localUserData?.departmentId}`);
      
      // Check if response and response.data are defined
      if (response && response.data) {
        const filterData: any[] = [];
        response.data.forEach((team: any) => {
          // if (team?.departments?.length > 0 && team?.departments?.some((dep: any) => dep.id === (localUserData?.role === '1' ? 1 : localUserData?.departmentId))) {
            filterData.push({
              label: team?.first_name + ' ' + team?.last_name,
              value: team.user_id
            });
          // }
        });
        setTeamList(filterData);
        setDataLoaded(true); // Mark data as loaded
      } else {
        // Handle case where response or response.data is undefined
        setTeamList([]);
        setDataLoaded(false); // Mark data as not loaded
      }
    } catch (err: any) {
      setTeamList([]); // Clear teamList on error
      setDataLoaded(false); // Mark data as not loaded
      setErrorState(err.message || 'An error occurred while fetching team data');
      dispatch(setError({ status: true, type: 'error', message: err.message || 'An error occurred' }));
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const getSalesDashboardReports = async (query: any) => {
    try {
      setIsLoading(true);
      let URL = query ? `/dashboard/sales-reports?${query}` : '/dashboard/sales-reports';
      const response = await getDashboardDetails(URL);

      if (response) {
        const dashboard = response?.data || {};
        const { pending = 0, interested = 0, followup = 0, notInterested = 0, voicemail = 0, invalidNumber = 0, notInService = 0, dnd = 0, citizens = 0 } = dashboard;
        setFilterCount({
          pending,
          interested,
          followup,
          notInterested,
          voicemail,
          invalidNumber,
          notInService,
          dnd,
          citizens
        });
        setDataLoaded(true);
      } else {
        setFilterCount({});
        setDataLoaded(false);
      }
    } catch (err: any) {
      setFilterCount({});
      setDataLoaded(false);
      setErrorState(err.message || 'An error occurred while fetching sales dashboard reports');
      dispatch(setError({ status: true, type: 'error', message: err.message || 'An error occurred' }));
    } finally {
      setIsLoading(false);
    }
  };

  const getSalesListData = async (page: number, query: string | null) => {
      try {
        setIsLoading(true);
        const response = await getsalesList(query ? `/sales/contacts?page=${page + '&' + query}` : `/sales/contacts?page=${page}`);
        
        // Check if response and response.data are defined
        if (response && response.data) {
          setSalesList(response.data);
          setTotalCount(response.totalRows || 0); // Use a default value if totalRows is undefined
          setDataLoaded(true); // Mark data as loaded
        } else {
          // Handle case where response or response.data is undefined
          setSalesList([]);
          setTotalCount(0);
          setDataLoaded(false); // Mark data as not loaded
        }
      } catch (err: any) {
        setSalesList([]); // Clear salesList on error
        setTotalCount(0); // Reset total count on error
        setError(err.message || 'An error occurred while fetching sales data');
        dispatch(setError({ status: true, type: 'error', message: err.message || 'An error occurred' }));
      } finally {
        setIsLoading(false);
      }
    };
    

  const genarateCronData = async () => {
  try {
      dispatch(setError({ status: true, type: 'success', message: 'Cron Job Initiated' }))
      const response = await generateCronJob()
      if(response){
        dispatch(setError({ status: true, type: 'success', message: 'Cron Job Successfull' }))
      }
  } catch (err: any) {
      dispatch(setError({ status: true, type: 'error', message: err }))
  }
}
  const generateSubmissionLeads = async () => {
  try {
      dispatch(setError({ status: true, type: 'success', message: 'Cron Job Initiated' }))
      const response = await generateSubmissionLeadsJob()
      if(response){
        dispatch(setError({ status: true, type: 'success', message: 'Cron Job Successfull' }))
      }
  } catch (err: any) {
      dispatch(setError({ status: true, type: 'error', message: err }))
  }
}
  const generateWalkoutLeads = async () => {
  try {
      dispatch(setError({ status: true, type: 'success', message: 'Cron Job Initiated' }))
      const response = await generateWalkoutLeadsJob()
      if(response){
        dispatch(setError({ status: true, type: 'success', message: 'Cron Job Successfull' }))
      }
  } catch (err: any) {
      dispatch(setError({ status: true, type: 'error', message: err }))
  }
}

const generateVoicemails = async () => {
  try {
      dispatch(setError({ status: true, type: 'success', message: 'Cron Job Initiated' }))
      const response = await generateVoicemailsJob()
      if(response){
        dispatch(setError({ status: true, type: 'success', message: 'Cron Job Successfull' }))
      }
  } catch (err: any) {
      dispatch(setError({ status: true, type: 'error', message: err }))
  }
}

useEffect(() => {
  // Only fetch data if it has not been loaded already
 // if (!dataLoaded) {
    getSalesListData(currentPage, queryString);
 // }
}, [currentPage, queryString]);

useEffect(() => {
  if((localUserData?.role === '1' || localUserData?.role === '2') || localUserData?.departmentId === 1){
    if (!dataLoaded) {
      fetchTeamList();
    }
  }
  if (!dataLoaded) {
    getSalesDashboardReports(null); // Fetch sales dashboard reports if data has not been loaded
  }
},[])

  return (
    <div>
        <div className='sales-data-report__sales-links'>
        <EditUserModal 
          showEditModal={showEditModal}
          toggleEditModal={toggleEditModal}
          editUser={currentEditUser}
          currentPage={currentPage}
          queryString={queryString}
          getSalesListData={getSalesListData}
       />
          {
            localUserData && localUserData?.role === '1' && (
              <div>
                <Button onClick={genarateCronData}>Generate Cron Job</Button>
                <Button onClick={generateVoicemails}>Generate Voicemail Job</Button>
                <Button onClick={generateSubmissionLeads}>Submission Leads</Button>
                <Button onClick={generateWalkoutLeads}>Walkout Leads</Button>
                <hr />
              </div>
            )
          }
            {
                <div className='sales-data-report__header'>
                    <div>
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
                                setQueryString('status=3')
                                window.location.hash = "#followup"
                            }}>followup - {formateNum(filterCount.followup, ",")}</Button>
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
                    <Button disabled={location.hash === ''} onClick={() => {
                        setCurrentPage(1)
                        setQueryString(null)
                        navigate('/sales')
                    }}>Reset</Button>
                    </div>
                    {/* <div>
                      <p>Total Records : {formateNum(totalCount, ",")}</p>
                    </div> */}
                </div>
            }
        </div>
        <ContentHeader 
            showBtn
            redirectPath='/sales/data-upload'
            buttonText='Upload Data'
            title='Sales'
            showIcon
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
          colVal={4}
        />
        {
          localUserData && localUserData?.role === '1' && (
            <div>
              <DownloadCsv headers={columns.slice(0, columns.length - 1).map((col: any) => ({ title: col.title, key: col.key, formate: col?.render ? exportFormates[col.key] : false }))} filename={'Sales'} disabled={queryString ? false : true} URL={queryString ? `/sales/contacts?download=1&${queryString}` : '/sales/contacts?download=1'} />
            </div>
          )
        }
        {/* {JSON.stringify(filteredData)} */}
         <Table
          rowClassName="editable-row"
         
          bordered
          columns={columns.slice(0, localUserData && localUserData?.role === '2' ? columns.length + 1 : columns.length - 1)}
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

export default Sales
import React, { useEffect, useState, useMemo, useRef } from 'react'
import ContentHeader from '../../components/ContentHeader'
import { FiPlusCircle } from "react-icons/fi";
import SearchFilter from '../../components/SearchFilter';
import { Table, Space, Popconfirm, Pagination } from 'antd';
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import TeamService from '../../services/Team.services';
import { setError } from '../../store/reducers';
import DepartmentService from '../../services/Departments.services';
import localStorageContent from '../../utils/localstorage';
import dayjs from 'dayjs';
import TeamLeadService from '../../services/TeamLead.services';




const Team = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [teamList, setTeamList] = useState<any[]>([])
  const [departmentList, setDepartmentList] = useState<any[]>([])
  const [teamLeadList, setTeamLeadList] = useState<any[]>([])
  const localUserData = localStorageContent.getUserData()
  const { getDepartmentList } = DepartmentService
  const { getTeamList, deleteTeam, filterTeamLeadByDept } = TeamService;
  const { getTeamLeadList } = TeamLeadService;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const isFirstRender = useRef(true);

  const fieldsData = [
    {
      label: 'Departments',
      key: 'departmentId',
      elementType: 'SELECT',
      onChangeField: async (val: any) => {
        if (val) {
           setTeamLeadList([])
            fetchTeamLeadList([val])
        }
      },
      options: departmentList,
      required: true,
      disable: false,
      type: 'string',
      placeholder: 'Select Department',
      config: {
        rules: [{ required: false, message: 'Please Enter Departments' }],
      }
    },
    // {
    //   label: 'Team Lead',
    //   key: 'teamLeadIds',
    //   elementType: 'SELECT',
    //   required: true,
    //   disable: teamLeadList ? false : true,
    //   options: teamLeadList,
    //   onChangeField: () => { },
    //   type: 'string',
    //   placeholder: 'Select Team Lead',
    //   config: {
    //     rules: [{ required: false, message: 'Please Select Team Lead' }],
    //   }
    // },
    // {
    //   title: "Id",
    //   key: "user_id",
    //   render: (record: any) => <span>{record?.user_id}</span>
    // },
    {
      label: 'Name',
      key: 'name',
      elementType: 'INPUT',
      required: true,
      disable: false,
      onChangeField: () => { },
      type: 'text',
      placeholder: 'Search by Name',
      config: {
        rules: [{ required: false, message: 'Please Enter Name' }],
      }
    },
    {
      label: 'Is Senior',
      key: 'isSenior',
      elementType: 'SELECT',
      onChangeField: () => { },
      options: [
        {
          value: '1',
          label: 'Is Senior'
        },
        {
          value: '0',
          label: 'Junior'
        }
      ],
      required: true,
      disable: false,
      type: 'string',
      placeholder: 'Select Status',
      config: {
        rules: [{ required: false, message: 'Please Enter Status' }],
      }
    },
    {
      label: 'Status',
      key: 'status',
      elementType: 'SELECT',
      onChangeField: () => { },
      options: [
        {
          value: '1',
          label: 'Active'
        },
        {
          value: '0',
          label: 'In Active'
        }
      ],
      required: true,
      disable: false,
      type: 'string',
      placeholder: 'Select Status',
      config: {
        rules: [{ required: false, message: 'Please Enter Status' }],
      }
    },
  ]


  const superAdminColumns = [
    {
      title: "Id",
      key: "user_id",
      render: (record: any) => <span>{record?.user_id}</span>
    },
    {
      title: "Name",
      key: "name",
      render: (record: any) => <span>{record?.first_name + ' ' + record?.last_name}</span>
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Department",
      key: "dept",
      render: (record: any) => <span>{record?.departments?.map((dep: any, i: number) => `${dep?.value}${record?.departments.length - 1 === i ? '' : ', '}`)}</span>
    },
    // {
    //   title: "Team Lead(s)",
    //   key: "teamleads",
    //   render: (record: any) => <span>{record?.teamLeads?.map((dep: any, i: number) => `${dep?.first_name} ${dep?.last_name}${record?.teamLeads.length - 1 === i ? '' : ', '}`)}</span>
    // },
    {
      title: 'Is Senior',
      dataIndex: 'is_senior',
      key: 'is_senior',
      editable: true,
      render: (value: any) => <>{value === "1" ? "Yes" : "No"}</>
    },
    {
      title: 'Status',
      editable: true,
      render: (record: any) => <>{record.status === "1" ? <span style={{ color: 'green' }}>Active</span> : <span style={{ color: 'red' }}>In Active on {record?.inactive_datetime && dayjs(record?.inactive_datetime).format('YYYY-MM-DD HH:MM:ss')}</span>}</>
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_: any, record: any) => {
        return (
          <Space size="middle">
            <span onClick={() => navigate(`/team/edit/${record?.user_id}`, {
              state: {
                record
              }
            })}><EditOutlined style={{ color: '#3AA0E9' }} /></span>

            {record.status === "0" && (<Popconfirm
              title="Delete the Admin"
              description="Are you sure to delete this admin?"
              onConfirm={() => deleteTeamData(record)}
              okText="Yes"
              cancelText="No"
            >
              <span>
                <DeleteOutlined style={{ color: "#3AA0E9" }} />
              </span>
            </Popconfirm>)}

          </Space>)
      },
    }
  ];

  const columns = [
    {
      title: "Id",
      key: "user_id",
      render: (record: any) => <span>{record?.user_id}</span>
    },
    {
      title: "Name",
      key: "name",
      render: (record: any) => <span>{record?.first_name + ' ' + record?.last_name}</span>
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      editable: true
    },
    {
      title: 'Is Senior',
      dataIndex: 'is_senior',
      key: 'is_senior',
      editable: true,
      render: (value: any) => <>{value === "1" ? "Yes" : "No"}</>
    },
  ];

  const fetchTeamLeadList = async (selected: any) => {
    try {
      setIsLoading(true)
      const response = await filterTeamLeadByDept({ departmentIds: selected });
      const { data } = response
      if (data && data.length > 0) { 
        setTeamLeadList(data?.map((dt: any) => ({
          value: dt.user_id,
          label: `${dt.first_name} ${dt.last_name}`,
        })))        
      } else {
        setTeamLeadList([])
      }
      setIsLoading(false)
    } catch (err: any) {
      setIsLoading(false)
      dispatch(setError({ status: true, type: 'error', message: err }))
    }
  }
  const fetchDepartmentList = async () => {
    try {
      setIsLoading(true)
      const response = await getDepartmentList();
      const { data } = response
      if (data && data.length > 0) {
        setDepartmentList(data.map((dt: any) => ({
          value: dt.dept_id,
          label: dt.name,
        })))
      }
      setIsLoading(false)
    } catch (err: any) {
      setIsLoading(false)
      dispatch(setError({ status: true, type: 'error', message: err }))
    }
  }

  const fetchTeamList = async (query: any) => {
    try {
      if (localUserData === null) {
        return;
      }
      setIsLoading(true)
      let response: any = null
      if (localUserData?.role === '1') {
        response = await getTeamList(query ? `/team?page=1&${query}` : `/team?page=`+currentPage);
      } else {
        response = await getTeamList(query ? `/team?page=1&deptId=${localUserData?.departmentId + '&' + query}` : `/team?page=${currentPage}&deptId=${localUserData?.departmentId}`);
      }
      if (response) {
        setTeamList(response.data)
        setTotalCount(response.totalRows || 0); // Use a default value if totalRows is undefined

      }
      setIsLoading(false)
    } catch (err: any) {
      setIsLoading(false)
      dispatch(setError({ status: true, type: 'error', message: err }))
    }
  }

  const deleteTeamData = async (record: any) => {
    try {
      setIsLoading(true)
      if (record === null || record === undefined) {
        dispatch(setError({ status: true, type: 'error', message: 'Record Not found' }))
        return;
      }
      await deleteTeam(record?.user_id);
      fetchTeamList(null)
      setIsLoading(false)
    } catch (err: any) {
      setIsLoading(false)
      dispatch(setError({ status: true, type: 'error', message: err }))
    }
  }

  const generateFormFields = useMemo(() => {
    let copyfields: any[] = [...fieldsData]
    if (localUserData && localUserData?.role !== '1') {
      copyfields.splice(0, 1)
      copyfields = copyfields
    } else {
      copyfields = copyfields
    }
    return copyfields
  }, [departmentList, teamLeadList])

  useEffect(() => {
    (localUserData && localUserData?.role === '1') && fetchDepartmentList()
    if (localUserData?.role !== '1') {
      fetchTeamLeadList([localUserData?.departmentId])
    }
    fetchTeamList(null)
  }, [])
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    fetchTeamList(null);
  }, [currentPage]);



  return (
    <div>
      <ContentHeader
        showBtn
        redirectPath='/team/create'
        buttonText='Add Team'
        title='Team'
        showIcon
        Icon={FiPlusCircle}
      />
      {
        <SearchFilter
          fields={generateFormFields}
          onSubmit={fetchTeamList}
          clearSearch={() => fetchTeamList(null)}
          showButtons={true}
        />
      }

      <Table
        rowClassName="editable-row"
        bordered
        columns={(localUserData && localUserData?.role === '1') ? superAdminColumns : columns}
        dataSource={teamList}
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

export default Team
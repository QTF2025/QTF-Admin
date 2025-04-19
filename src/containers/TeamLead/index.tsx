import React, { useEffect, useRef, useState } from 'react'
import ContentHeader from '../../components/ContentHeader'
import { FiPlusCircle } from "react-icons/fi";
import { Table, Space, Popconfirm, Pagination } from 'antd';
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import TeamLeadService from '../../services/TeamLead.services';
import { setError } from '../../store/reducers';

const TeamLead = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [teamLeadList, setTeamLeadList] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const isFirstRender = useRef(true);
  const { getTeamLeadList, deleteTeamLead } = TeamLeadService;

  const columns: any = [
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
        render: (record: any) => <span>{record?.departments.map((dep: any, i: number) => `${dep?.value}${record?.departments.length - 1 === i ? '' : ', '}`)}</span>
      },
      {
        title: "Actions",
        key: "action",
        render: (_: any, record: any) => {
        return (
          <Space size="middle">
            <span onClick={() => navigate(`/teamlead/edit/${record?.user_id}`, {
                state: {
                  record
                }
              })}>
              <EditOutlined style={{ color: "#3AA0E9" }} />
            </span>
            <Popconfirm
                title="Delete the Team Lead"
                description="Are you sure to delete this Team Lead?"
                onConfirm={() => deleteTeamLeadData(record)}
                okText="Yes"
                cancelText="No"
              >
                <span>
                  <DeleteOutlined style={{ color: "#3AA0E9" }} />
                </span>
              </Popconfirm>
          </Space>
        )
        },
      },
  ];

  const fetchTeamLeadList = async () => {
    try {
        setIsLoading(true)
        const response = await getTeamLeadList(currentPage);
        setTeamLeadList(response.data)
        setTotalCount(response.totalRows || 0); // Use a default value if totalRows is undefined
        setIsLoading(false)
    } catch (err: any) {
        setIsLoading(false)
        dispatch(setError({ status: true, type: 'error', message: err }))
    }
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    fetchTeamLeadList()
  }, [currentPage])

  const deleteTeamLeadData = async (record: any) => {
    try {
        setIsLoading(true)
        if(record === null || record === undefined){
          dispatch(setError({ status: true, type: 'error', message: 'Record Not found' }))
          return;
        }
        await deleteTeamLead(record?.user_id);
        fetchTeamLeadList()
        setIsLoading(false)
    } catch (err: any) {
        setIsLoading(false)
        dispatch(setError({ status: true, type: 'error', message: err }))
    }
  }

  useEffect(() => {
    fetchTeamLeadList()
  }, [])

  return (
    <div>
        <ContentHeader 
            showBtn
            redirectPath='/teamlead/create'
            buttonText='Add Team Lead'
            title='Team Lead'
            showIcon
            Icon={FiPlusCircle}
        />
         <Table
          loading={isLoading}
          rowClassName="editable-row"
          bordered
          columns={columns}
          dataSource={teamLeadList}
          pagination={false}
        />
        <Pagination 
          onChange={(pagination: any) => {
            setCurrentPage(pagination)
          }} 
          style={{marginTop: '15px'}}
          current={currentPage} 
          defaultPageSize={10} 
          showSizeChanger={false}
          hideOnSinglePage
          total={totalCount}   
        />
    </div>
  )
}

export default TeamLead
import React, { useEffect, useState } from 'react'
import ContentHeader from '../../components/ContentHeader'
import { FiPlusCircle } from "react-icons/fi";
import { useNavigate } from 'react-router-dom'
import { Space, Table } from 'antd';
import { EditOutlined } from "@ant-design/icons";
import DepartmentService from '../../services/Departments.services';
import { useDispatch } from 'react-redux';
import { setError } from '../../store/reducers';
import './styles.scss'

const Departments = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [departmentList, setDepartmentList] = useState<any[]>([])
  const { getDepartmentList } = DepartmentService;

  const columns = [
    {
      title: "Department",
      dataIndex: "name",
      key: "name",
      editable: true,
    },
    {
      title: "View Permission",
      dataIndex: "view_lead",
      key: "view_lead",
      render: (text: any) => <span className={text === "1" ? 'permission_success' : 'permission_danger'}>{text === "1" ? 'Yes' : 'No'}</span>
    },
    {
      title: "Edit Permission",
      dataIndex: "edit_lead",
      key: "edit_lead",
      render: (text: any) => <span className={text === "1" ? 'permission_success' : 'permission_danger'}>{text === "1" ? 'Yes' : 'No'}</span>
    },
    {
      title: "New Lead Permission",
      dataIndex: "new_lead",
      key: "new_lead",
      render: (text: any) => <span className={text === "1" ? 'permission_success' : 'permission_danger'}>{text === "1" ? 'Yes' : 'No'}</span>
    },
    {
      title: "Assign Permission",
      dataIndex: "assign_lead",
      key: "assign_lead",
      render: (text: any) => <span className={text === "1" ? 'permission_success' : 'permission_danger'}>{text === "1" ? 'Yes' : 'No'}</span>
    },
    {
      title: "Actions",
      key: "action",
      render: (_: any, record: any) => {
        return (<Space size="middle">
          <span onClick={() => navigate(`/departments/edit/${record.dept_id}`, {
              state: {
                record
              }
            })}>
            <EditOutlined style={{ color: "#3AA0E9", cursor: 'pointer' }} />
          </span>
        </Space>
        )
      },
    },
  ];

  const fetchDepartmentList = async () => {
    try {
        setIsLoading(true)
        const response = await getDepartmentList();
        setDepartmentList(response.data)
        setIsLoading(false)
    } catch (err: any) {
        setIsLoading(false)
        dispatch(setError({ status: true, type: 'error', message: err }))
    }
  }

  useEffect(() => {
    fetchDepartmentList()
  }, [])

  return (
    <div className='departments-container'>
        <ContentHeader 
            showBtn
            redirectPath='/departments/create'
            buttonText='Add Department'
            title='Departments'
            showIcon
            Icon={FiPlusCircle}
        />
         <Table
          loading={isLoading}
          rowClassName="editable-row"
          bordered
          columns={columns}
          dataSource={departmentList}
          pagination={false}
        />
    </div>
  )
}

export default Departments
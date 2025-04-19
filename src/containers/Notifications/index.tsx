import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { useLocation, useNavigate } from "react-router-dom"
import moment from "moment/moment";
import ContentHeader from "../../components/ContentHeader";
import './styles.scss'
import NotificationsService from "../../services/Notifications.services";
import { useDispatch } from "react-redux";
import { setError } from "../../store/reducers";
import localStorageContent from "../../utils/localstorage";

const Notifications = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState<boolean>(false) 
  const [notificationsList, setNotificationsList] = useState([]);
  const localUserData = localStorageContent.getUserData();
    const multiDep = localStorageContent.getMultiDepartment();
  const { getNotifications } = NotificationsService
  const dispatch = useDispatch()

  const decodeHtml = (html: string): string => {
    // Create a temporary DOM element to decode HTML entities
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
  
    // Get the decoded text content
    const decodedText = tempDiv.textContent || '';
  
    // Remove unwanted tags like <p>
    return decodedText.replace(/<\/?p>/g, '');
  };

   const columns = [
    {
      title: 'Lead Id',
      dataIndex: 'lead_id',
       key: 'lead_id',
      render: (_: any, record: any) => <span onClick={(e) => navigate(`/leads/edit/${record?.lead_id}`)} >{record?.lead_id}</span>
    }, 
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      render: (text: string) => <>{decodeHtml(text)}</>
    },
    {
      title: 'Created Date',
      dataIndex: 'phone_1',
      key: 'phone_1',
      render: (_: any, record: any) => <>{moment(record.created_dt).format('DD/MM/YYYY HH:MM:SS')}</>
    },
  ];

  const fetchNotifications = async () => {
    try {
      setIsLoading(true)
       let URL = ''
        if (multiDep !== null && multiDep) {
          URL = `/dashboard/notifications?deptId=${localUserData.departmentId}`
        } else {
          URL = '/dashboard/notifications'
        }
        
      const response = await getNotifications(URL)
      if(response && response?.data){
        setNotificationsList(response?.data)
      }
      setIsLoading(false)
    } catch (err: any) {
      setIsLoading(false)
      dispatch(setError({ status: true, type: 'error', message: err }))
    }
  } 

  useEffect(() => {
    fetchNotifications()
  }, [location.pathname])

  return (
    <div className="notifications-container">
      <ContentHeader 
            showBtn={false}
            redirectPath=''
            buttonText=''
            title={`Notifications`}
            showIcon={false}
        />
      <div className="notifications-container__table">
        <Table columns={columns} dataSource={notificationsList} loading={isLoading} />
      </div>
    </div>
  );
};

export default Notifications;

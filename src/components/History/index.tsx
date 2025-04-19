import { Button, Modal, Table, message } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import moment from 'moment'
import { extractTextFromHTML, getLeadStatus } from '../../utils';
import LeadService from '../../services/Lead.services';
import './styles.scss'
import { setError } from '../../store/reducers';
import { useDispatch } from 'react-redux';
import localStorageContent from '../../utils/localstorage';
import { DeleteOutlined } from '@ant-design/icons';


const History = ({ show, hideModal, leadId, contactId, section, isLeads }: any) => {
    const [currentLeadData, setcurrentLeadData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [historyData, setHistoryData] = useState<any[]>([]);
    const [walkoutshistoryData, setWalkoutsHistoryData] = useState<any[]>([]);
    const localUserData = localStorageContent.getUserData()

    const { getleadHistory, deletereviewDocuments } = LeadService;
    const dispatch = useDispatch()
    
    const handleDeleteFile = async (leadId: any, commentId: any) => {
        try {
            const select = true; 
            // Call deletereviewDocuments to delete the comment based on leadId and commentId
            await deletereviewDocuments(leadId, commentId, select);
            
            // Show success message
            message.success('Comment deleted successfully');
            await getLeadDataHistory(leadId);
            // Optionally, refresh the comments list or update state here
        } catch (error) {
            message.error('Error deleting the comment');
        }
    };
    
    const DeleteButton = ({ leadId, commentId }: any) => {
        return (
            <Button
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteFile(leadId, commentId)}
                style={{ marginLeft: '5px', marginTop: '5px' }}
            >
                Delete
            </Button>
        );
    };
    
    

    const columns: any= [
        {
        title: 'Date',
        dataIndex: 'created_dt',
        key: 'created_dt',
        render: (date: any) => moment(date).format('YYYY-MM-DD'),
        },
        {
        title: 'Department',
        dataIndex: 'department_name',
        key: 'department_name',
        render: (text: any, record: any) => (
            <>
                {record.department_name} / {record.team}
            </>
        ),
        },
        {
        title: 'CTF Comment',
        dataIndex: 'teamComments',
        key: 'teamComments',
        render: (record: any) => {
            if (record.length > 0) {
            return record.map((comment: any, i: any) => (
                <div className='reportdata' key={comment.comment_id} >
                    <p>{new Date(comment.created_dt).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true, // Use `false` for 24-hour format
    timeZone: 'UTC', // Adjust this if you want to use a specific time zone
  })}</p>
                    {comment.comment && <p style={{margin: 0}} dangerouslySetInnerHTML={{__html: extractTextFromHTML(comment.comment)}} />}
                    {
                        comment.attachment && 
                        <p><a href={comment.attachment} rel="noreferrer" target="_blank"> Review {comment?.status === '1' && '(Selected)'} </a>
                        {
                            localUserData?.role === "1" && (
                                <DeleteButton leadId={comment.lead_id} commentId={comment.comment_id} />
                            )
                            }
                        </p>
                    }
                    <p>{comment.service_charge}</p>
                    {
                        record.length > 1 && <hr style={{margin: '5px 0'}} />
                    }
                </div>
            ));
            }
            return '--'; // Return an empty string if there are no comments
        },
        },
        {
        title: 'Client Comment',
        dataIndex: 'userComments',
        key: 'userComments',
        render: (record: any) => {
            if (record.length > 0) {
            return record.map((comment: any) => (
                <div className='reportdata' key={comment.comment_id}>
                    <p>{new Date(comment.created_dt).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true, // Use `false` for 24-hour format
    timeZone: 'UTC', // Adjust this if you want to use a specific time zone
  })}</p>
                    {comment.comment && <p style={{margin: 0}} dangerouslySetInnerHTML={{__html: extractTextFromHTML(comment.comment)}} />}
                    {
                        record.length > 1 && <hr style={{margin: '5px 0'}} />
                    }
                </div>
            ));
            }
            return '--'; // Return an empty string if there are no comments
        },
        }
    ];

     const followUpColumns: any= [
        {
        title: 'Follow Up Date',
        dataIndex: 'follow_up_date',
        key: 'follow_up_date',
        render: (date: any) => moment(date).format('YYYY-MM-DD'),
        },
        {
        title: 'Followup Comment',
        dataIndex: 'comment',
        key: 'comment',
        render: (text: any) => text ? <p style={{margin: 0}} dangerouslySetInnerHTML={{__html: extractTextFromHTML(text)}} /> : '--',
        },
    ];

    const walkoutColumns: any = [
        {
        title: 'Date',
        dataIndex: 'created_dt',
        key: 'created_dt',
        render: (date: any) => moment(date).format('YYYY-MM-DD'),
        },
        {
        title: 'Name',
        key: 'first_name',
        render: (data: any) => <span>{data?.first_name + ' ' + data?.last_name}</span>,
        },
        {
        title: 'Service Charge',
        dataIndex: 'service_charge',
        key: 'service_charge',
        },
        {
        title: 'Comment',
        dataIndex: 'comment',
        key: 'comment',
        render: (text: any) => text ? <p style={{margin: 0}} dangerouslySetInnerHTML={{__html: extractTextFromHTML(text)}} /> : '--',

        },
    ]


    const getLeadDataHistory = async (leadId: any) => {
        
        try {
            setIsLoading(true)
            const response = await getleadHistory(
                `/leads/${leadId}/lead-history?deptId=${localUserData.departmentId}`
              );            if(response && response.data){
                const { data } = response
                setcurrentLeadData(data)
                setHistoryData(data.History)
            }
            setIsLoading(false)
        } catch (err: any) {
            setIsLoading(false)
            dispatch(setError({ status: true, type: 'error', message: err }))
        }
    }

    const followupsLeadHistory = async (contactId: any) => {
        try {
            setIsLoading(true)
            const response = await getleadHistory(`/sales/follow-ups?contactId=${contactId}`)
            if(response && response.data){
                const { data } = response
                setcurrentLeadData(data)
                setHistoryData(data)
            }
            setIsLoading(false)
        } catch (err: any) {
            setIsLoading(false)
            dispatch(setError({ status: true, type: 'error', message: err }))
        }
    }

    const walkoutsLeadHistory = async (leadId: any) => {
        try {
            setIsLoading(true)
            const response = await getleadHistory(`/leads/${leadId}/service-charge-comments`)
            if(response && response.data){
                const { data } = response
                setWalkoutsHistoryData(data)
            }
            setIsLoading(false)
        } catch (err: any) {
            setIsLoading(false)
            dispatch(setError({ status: true, type: 'error', message: err }))
        }
    }

    console.log('walkoutshistoryData', walkoutshistoryData)

    const modalTitle = useMemo(() => {
        let title: string = ''
        if(currentLeadData){
            const formattedDate = currentLeadData.created_dt ? moment(currentLeadData.created_dt).format('YYYY-MM-DD') : 'Unknown Date';
            title = `#Lead ${currentLeadData.lead_id}, ${currentLeadData.first_name}, ${currentLeadData.last_name}, Created Date: ${formattedDate}, Lead Status: ${getLeadStatus(currentLeadData?.lead_status)}`;
        }else{
            title = 'Something Went Wrong!'
        }
        return title
    }, [currentLeadData]) 

    useEffect(() => {
        const department_id = localUserData?.departmentId;  // Fetch deptId from userData
    
        if(section && section === 'FOLLOWUP'){
            if(contactId){
                followupsLeadHistory(contactId)
            }
        }else{
            if(leadId){
                getLeadDataHistory(leadId)
            }
        }
        
        return () => {
            setcurrentLeadData(null)
        }
    }, [])


    useEffect(() => {
        const department_id = localUserData?.departmentId;  // Fetch deptId from userData
        
        if (section === 'FOLLOWUP') {
            if(contactId){
            followupsLeadHistory(contactId);
            }
        } else 
        if (leadId) {
            getLeadDataHistory(leadId,);
        }
    
        return () => {
            setcurrentLeadData(null);
        };
    }, [section, contactId, leadId, localUserData?.departmentId]);


    // useEffect(() => {
    //     const department_id = localUserData?.departmentId;

    //     if(!isLeads && leadId && department_id !== 1){
    //         walkoutsLeadHistory(leadId)
    //     }
    // }, [isLeads, leadId])

    useEffect(() => {
        const department_id = localUserData?.departmentId;
        if (!isLeads && leadId && department_id !== 1) {
            walkoutsLeadHistory(leadId);  // Pass deptId here
        }
    }, [isLeads, leadId, localUserData?.departmentId]);

  return (
    <div className='lead-history'>
    <Modal
        title={section === 'FOLLOWUP' ? 'Follow Up Details' : !isLoading && modalTitle}
        open={show}
        onCancel={hideModal}
        footer={() => <Button onClick={hideModal}>Close</Button>}
        className='lead-history__modal'
    >
        {
            // Check if department_id is not 1 and isLeads is false, then show the Service Charge History
            localUserData?.departmentId !== 1 && !isLeads && (
                <>
                    <p style={{ margin: '15px 0' }}>Service Charge History</p>
                    <hr />
                    <Table
                        rowClassName="editable-row"
                        bordered
                        columns={walkoutColumns}
                        dataSource={walkoutshistoryData}
                        pagination={false}
                        loading={isLoading}
                    />
                </>
            )
        }
        
        {
            // Show Lead History or Follow Up Details based on department_id
            localUserData?.departmentId === 1 ? (
                <>
                    <p style={{ margin: '15px 0' }}>Follow Up History</p>
                    <hr />
                    <Table
                        rowClassName="editable-row"
                        bordered
                        columns={followUpColumns} // Show Follow Up columns when department_id is 1
                        dataSource={historyData}
                        pagination={false}
                        loading={isLoading}
                    />
                </>
            ) : (
                <>
                    {!isLeads && (
                        <>
                            <p style={{ margin: '15px 0' }}>Lead History</p>
                            <hr />
                        </>
                    )}
                    <Table
                        rowClassName="editable-row"
                        bordered
                        columns={section === 'FOLLOWUP' ? followUpColumns : columns} // Render based on section and department_id
                        dataSource={historyData}
                        pagination={false}
                        loading={isLoading}
                    />
                </>
            )
        }
    </Modal>
</div>

  )
}

export default History
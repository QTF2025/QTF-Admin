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


const LeadHistory = ({ show, hideModal, leadId}: any) => {
    const [currentLeadData, setcurrentLeadData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [historyData, setHistoryData] = useState<any[]>([]);
    const [walkoutshistoryData, setWalkoutsHistoryData] = useState<any[]>([]);
    const localUserData = localStorageContent.getUserData()

    const { getleadTrackingHistory, deletereviewDocuments } = LeadService;
    const dispatch = useDispatch()

    const walkoutColumns: any = [
        {
            title: 'Lead',
            dataIndex: 'lead_id',
            key: 'lead_id',
        },
        {
            title: "Date",
            dataIndex: "created_dt",
            key: "created_dt",
            render: (date: string | number | Date) => 
              new Date(date).toLocaleString("en-US", { 
                year: "numeric",
                month: "long",  // e.g., "February"
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true, // Change to `false` for 24-hour format
                timeZone: "UTC", // Adjust as needed
              }),
          },
        {
            title: 'Name',
            key: 'first_name',
            render: (data: any) => <span>{data?.first_name + ' ' + data?.last_name}</span>,
        },
        {
            title: 'Type',
            key: 'created_type',

            // 1=End User,2=Agent,3=Admin
            render: (data: any) => {
                return (
                    <span>
                        {data?.created_type === '1' ? "Client" : data?.created_type === '2' ? "Agent" : "Admin"}
                    </span>
                );
            }
        },
        {
            title: 'note',
            dataIndex: 'note',
            key: 'note',
        },
        
    ]


    const getleadsTrackingHistory = async (leadId: any) => {
        try {
            setIsLoading(true)
            const response = await getleadTrackingHistory(`/leads/${leadId?.lead_id}/lead-tracking-history`);
             if (response && response.data) {
                const { data } = response
                setWalkoutsHistoryData(data)
                setHistoryData(data.History)
            }
            setIsLoading(false)
        } catch (err: any) {
            setIsLoading(false)
            dispatch(setError({ status: true, type: 'error', message: err }))
        }
    }

    useEffect(() => {
        getleadsTrackingHistory(leadId)
    }, [])

    return (
        <div className='lead-history'>
            <Modal
                title="Lead Tracking History"
                open={show}
                onCancel={hideModal}
                footer={() => <Button onClick={hideModal}>Close</Button>}
                className='lead-history__modal'
            >
                {
                    // Check if department_id is not 1 and isLeads is false, then show the Service Charge History
                    // localUserData?.departmentId !== 1 && !isLeads && (
                    <>
                        {/* <p style={{ margin: '15px 0' }}>Service Charge History</p>
                        <hr /> */}
                        <Table
                            rowClassName="editable-row"
                            bordered
                            columns={walkoutColumns}
                            dataSource={walkoutshistoryData}
                            pagination={false}
                            loading={isLoading}
                        />
                    </>
                    // )
                }
            </Modal>
        </div>

    )
}

export default LeadHistory
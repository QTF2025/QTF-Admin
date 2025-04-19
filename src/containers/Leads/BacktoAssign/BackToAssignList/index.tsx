import { Collapse, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs';
const { Panel } = Collapse;

function BackToAssignList({ leadData }: any) {
    const [commentList, setCommentList] = useState<any[]>([])

    const columns: any[] = [
         {
            title: 'User Name',
            dataIndex: 'team_name',
            key: 'team_name',
        },
         {
            title: 'Comment',
            dataIndex: 'comment',
            key: 'comment',
            render: (value: any) => <>{value ? value : '--'}</>
        },
        {
            title: 'Date',
            dataIndex: 'created_dt',
            key: 'created_dt',
            render: (value: any) => <>{value ? dayjs(value).format('DD/MM/YYYY') : '--'}</>
        },
    ]

    useEffect(() => {
        if(leadData && leadData?.backAssignDetails && leadData?.backAssignDetails?.length > 0){
            setCommentList(leadData.backAssignDetails)
        }
    }, [leadData])

    if(leadData && leadData?.backAssignDetails && leadData?.backAssignDetails?.length === 0){
        return <></>
    }

  return (
    <>
        <Collapse accordion style={{marginBottom: 15}}>
            <Panel header={'Assign Back Comments'} key={0}>
                <Table bordered columns={columns} dataSource={commentList} />
            </Panel>
        </Collapse>
    </>
  )
}

export default BackToAssignList
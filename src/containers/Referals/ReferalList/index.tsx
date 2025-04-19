import React, { useState } from 'react'
import { Table, Select, Pagination } from "antd";
import ReferalsService from '../../../services/Referals.services';
import { setError } from '../../../store/reducers';
import { useDispatch } from 'react-redux';
import localStorageContent from '../../../utils/localstorage';
import SearchFilter from '../../../components/SearchFilter';
import DownloadCsv from '../../../utils/downloadCSV';
import moment from 'moment'

function ReferalList({ referals, getReferals, totalCount, currentPage, setCurrentPage, setQueryString }: any) {
 
    const [queryStringList, setQueryStringList] = useState<any>(null)
    const { editReferal } = ReferalsService
    const { Option } = Select;
    const localUserData = localStorageContent.getUserData()
    const dispatch = useDispatch()
    
    const options = [
        { value: '1', label: 'Interested' },
        { value: '2', label: 'Not Interested' },
    ];

    const updateReferalStatus = async (value: any, referal: any) => {
        try {
            if(referal?.referal_id){
              const response = await editReferal(`/referral/${referal.referal_id}/update-status`, { status: value });
              dispatch(setError({ status: true, type: 'success', message: response?.message }))
              getReferals(1,null)
            }
        } catch (err: any) {
          dispatch(setError({ status: true, type: 'error', message: err }))
        }
    }

    const genarateStatus = (status: any) => {
      let currentStatus = ''

        switch(true){
          case status === null:
            currentStatus = 'Pending'
            break;
          case status === '1':
            currentStatus = 'Interested'
            break;
          case status === '2':
            currentStatus = 'Not Interested'
            break;
          default:
            currentStatus = '--'
        }

        return currentStatus
    }

    const exportFormates: any = {
      name: (value: any) => value ? value : '',
      status: (value: any) => value ? genarateStatus(value) : ''

    }

    const columns = [
      {
        title: 'Name',
        key: 'name',
        render: (text: any, record: any) => `${record.name}`,
      },
      {
        title: 'Phone Number',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: 'Email ID',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Created By',
        dataIndex: 'team_member',
        key: 'team_member',
      },
      {
        title: 'Created Date',
        dataIndex: 'created_dt',
        key: 'created_dt',
        render: (date: any) => moment(date).format('YYYY-MM-DD'),
      },
      {
        title: 'Refered By',
        dataIndex: 'referred_by',
        key: 'referred_by',
      },
      {
        title: 'Status',
        key: 'status',
        render: (data: any) => {
          return <>{genarateStatus(data.status)}</>;
        },
      },
      // Conditionally add the 'Actions' column if the user's role is '1'
      ...(localUserData && localUserData.role !== '5'
        ? [
            {
              title: 'Actions',
              render: (data: any) => {
                return (
                  <div>
                    <Select
                      style={{ width: 150 }}
                      defaultValue="Pending"
                      value={
                        data?.status !== null
                          ? options.find((opt) => opt.value === data?.status)
                          : ''
                      }
                      onChange={(e) => updateReferalStatus(e, data)}
                    >
                      {options.map((opt) => (
                        <Option key={opt.value} value={opt.value}>
                          {opt.label}
                        </Option>
                      ))}
                    </Select>
                  </div>
                );
              },
            },
          ]
        : []), // Empty array if condition is false (no 'Actions' column)      
    ];
    

  const searchFields = [
            {
              label: 'Client Search',
              key: 'name',
              elementType: 'INPUT',
              required: true,
              disable: false,
              onChangeField: () => {},
              type: 'text',
              placeholder: 'Search User',
              config: {
                  rules: [{ required: false, message: 'Please Enter something' }],
              }
          },
          {
            label: 'Status',
            key: 'status',
            elementType: 'SELECT',
            onChangeField: () => {},
            options: [
              {
                value: '0',
                label: 'Pending'
              },
              {
                value: '1',
                label: 'Interested'
              },
              {
                value: '2',
                label: 'Not Interested'
              },
            ],
            required: true,
            disable: false,
            type: 'string',
            placeholder: 'Select status',
            config: {
                rules: [{ required: false, message: 'Please select status' }],
            }
        },
      ]

  return (
    <div>
        <SearchFilter 
          fields={searchFields}
          onSubmit={(queryStrings: any) => {
            setCurrentPage(1)
            setQueryString(queryStrings)
            setQueryStringList(queryStrings)
          }}
          clearSearch={() => {
            setCurrentPage(1)
            setQueryString(null)
            setQueryStringList(null)
          }}
          showButtons={true}
          colVal={4}
        />
         <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              {(localUserData && (localUserData?.role === '1')) && <DownloadCsv 
                headers={
                  columns
                  .map((col: any) => ({ title: col.title, key: col.key, formate: col?.render ? exportFormates[col.key] : false }))} 
                filename={'Referals'}  URL={queryStringList ? `/referral?download=1&${queryStringList}` : `/referral?download=1`} disabled={false}/>}
              <p><strong>Total Records : {totalCount}</strong></p>
          </div>
        <Table pagination={false} columns={columns.slice(0, 8)} dataSource={referals} />
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

export default ReferalList
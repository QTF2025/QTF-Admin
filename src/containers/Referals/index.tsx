import React, { useEffect, useState } from 'react'
import CreateReferal from './CreateReferal'
import { Tabs } from 'antd';
import ReferalList from './ReferalList';
import ReferalsService from '../../services/Referals.services';
import ContentHeader from '../../components/ContentHeader';
import { setError } from '../../store/reducers';
import { useDispatch } from 'react-redux';
import localStorageContent from '../../utils/localstorage';

function Referals() {
    const [totalCount, setTotalCount] = useState<number>(0);
    const [queryString, setQueryString] = useState<any>(null)
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [referals, setReferals] = useState<any[]>([]);
    const [currentTab, setCurrentTab] = useState<string>('1')
    const { getReferalsList } = ReferalsService
    const dispatch = useDispatch()
    const userData = localStorageContent.getUserData()

    const getReferals = async (page: number, query: string | null) => {
        try {
            const response = await getReferalsList(query ? `/referral?page=${page + '&' + query}` : `/referral?page=${page}`);
            const data = response.data
            setTotalCount(response.totalRows)
            setReferals(data)
        } catch (err: any) {
            dispatch(setError({ status: true, type: 'error', message: err }))
        }
    }

    const onChangeTab = (tab: any) => {
        setCurrentTab(tab)
    }

    useEffect(() => {
        if(currentTab === '2'){
            getReferals(currentPage, queryString)
        }
    }, [currentTab])

    useEffect(() => {
        // if(userData.role === '1' || userData.role === '2'){
            getReferals(currentPage, queryString)
        // }
    }, [currentPage, queryString])

    const items = [
        {
            key: '1',
            label: 'Create Referal',
            children: <CreateReferal getReferals={getReferals} />,
        },
        {
            key: '2',
            label: 'Referal List',
            children: <ReferalList 
                setQueryString={setQueryString}
                setCurrentPage={setCurrentPage}
                totalCount={totalCount}
                currentPage={currentPage}
                referals={referals} 
                getReferals={getReferals} />,
        }
    ];
  return (
    <div>
        <ContentHeader
            showBtn={false}
            redirectPath=''
            buttonText=''
            title='Referals'
            showIcon={false}
            Icon={() => <></>}
        />
        <Tabs defaultActiveKey={'1'} items={items.slice((userData.role === '1' || userData.role === '2') ? 1 : 0, 3)} onChange={onChangeTab}/>
    </div>
  )
}

export default Referals
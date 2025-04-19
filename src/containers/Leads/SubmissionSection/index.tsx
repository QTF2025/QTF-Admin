import React, { useState, useEffect } from 'react'
import Online from './Online';
import Offline from './Offline';
import localStorageContent from '../../../utils/localstorage';

const SubmissionSections = ({ leadData, fetchReviews }: any) => {
    const [selectedOption, setSelectedOption] = useState('1');
    const userData = localStorageContent.getUserData();

    useEffect(() => {
        if(leadData){
            setSelectedOption(leadData?.lead_type)
        }
    }, [leadData])

  return (
    <>
        {
            userData && userData?.role === "3" && userData?.departmentId === 6 && (
                <div>
                    <Online leadData={leadData} selectedOption={selectedOption} fetchReviews={fetchReviews} />
                    <Offline leadData={leadData} selectedOption={selectedOption} fetchReviews={fetchReviews} />
                </div> 
            )
        }
    </>
    
  )
}

export default SubmissionSections
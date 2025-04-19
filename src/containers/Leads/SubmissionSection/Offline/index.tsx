import { Button } from 'antd';
import React, { useState, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import LeadService from '../../../../services/Lead.services';
import { initGetLead } from '../../../../store/actions/creators';
import { setError } from '../../../../store/reducers';
import '../styles.scss'
import { fileNames } from '../../../../utils';

const Offline = ({ leadData, selectedOption, fetchReviews }: any) => {
    const [selectedFiles, setSelectedFiles] = useState<any>({});
    const [selectedMultipleFiles, setSelectedMultipleFiles] = useState<any[]>([])
    const [offlineFiles, setOfflineFiles] = useState<any>([])
    const inputRef: any = useRef(null)
    const dispatch = useDispatch()
    const [secondFinalTaxFile, setSecondFinalTaxFile] = useState<any>({})
    const [showSecondOnlineSubmitFile, setShowSecondOnlineSubmitFile] = useState(false);
    const { onlineOfflineSubmission, onlineFinalSubmission } = LeadService

    const handleOnlineFileChange = (e: any) => {
        const { name, files } = e.target;
        setSelectedFiles((prevState: any) => ({
            ...prevState,
            [name]: files[0] // Assuming you're selecting one file at a time
        }));
    };

    const removeSelectedFile = (index: any) => {
        if(selectedMultipleFiles.length > 0){
            const copyFiles = [...selectedMultipleFiles]
            setSelectedMultipleFiles(copyFiles.filter((_, i) => i !== index))
        }
    }

    const onChangeMultipleFiles = (e: any) => {
        setSelectedMultipleFiles([...selectedMultipleFiles, ...e.target.files])
    }

    const submitOnline = async ()  => {
    try {
        if(leadData === null){
            return;
        }
        const formData = new FormData();
        for (const key in selectedFiles) {
            if (selectedFiles[key]) {
                formData.append('files', selectedFiles[key]);
            }
        }
        formData.append('leadType', selectedOption);
        if(selectedOption === '2'){
        if(selectedMultipleFiles.length > 0){
                selectedMultipleFiles.forEach((file) => {
                    formData.append('others', file)
                })
            }
        }
        const response = await onlineOfflineSubmission(leadData?.lead_id, formData)
        if(response){
            fetchReviews()
            dispatch(initGetLead(leadData?.lead_id))
            if(selectedMultipleFiles.length > 0){
            setSelectedMultipleFiles([])
          }
        }
    } catch (err: any) {
        dispatch(setError({ status: true, type: 'error', message: err }))
    }
  };

  const finalsubmitOnline = async ()  => {
    try {
        if(leadData === null){
            return;
        }
        const formData = new FormData();
        formData.append('files', secondFinalTaxFile);
        formData.append('leadType', selectedOption);
        const response = await onlineFinalSubmission(leadData?.lead_id, formData)
        if(response){
            setSecondFinalTaxFile('')
            dispatch(setError({ status: true, type: 'success', message: response?.message }))
            fetchReviews()
            dispatch(initGetLead(leadData?.lead_id))
            if(selectedOption === '1'){
                setShowSecondOnlineSubmitFile(true)
            }
        }
    } catch (err: any) {
        dispatch(setError({ status: true, type: 'error', message: err }))
    }
};

  useEffect(() => {
    if(leadData && leadData?.online_offline_attachments){
        const files = leadData?.online_offline_attachments || '';
        const fileArray = files.split(',');
        setOfflineFiles(fileArray)
    }
  }, [leadData])
  return (
    <>
      {selectedOption === "2" && (
        <div>
 
            <div className="document-section">
              <h5>Offline Tax Submission </h5>
              <br></br>
              <div className="onlineoffline">
                Upload Tax file
                <input
                  type="file"
                  name="offline1"
                  onChange={handleOnlineFileChange}
                />
              </div>

              <div className="onlineoffline">
                Upload Tax file
                <input
                  type="file"
                  name="offline2"
                  onChange={handleOnlineFileChange}
                />
              </div>

              <div className="onlineoffline">
                Upload Tax file
                <input
                  type="file"
                  name="offline3"
                  onChange={handleOnlineFileChange}
                />
              </div>

              {selectedMultipleFiles.length > 0 && (
                <>
                  <p style={{ textAlign: "left" }}>
                    Multiple Selected files :{" "}
                  </p>
                  {selectedMultipleFiles.map((file, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        minWidth: "300px",
                        alignItems: "center",
                        justifyContent: "space-between",
                        border: "1px solid grey",
                        margin: "5px",
                      }}
                    >
                      <p style={{ margin: "10px" }}>File : {file.name}</p>
                      <p
                        onClick={() => removeSelectedFile(i)}
                        style={{
                          width: "20px",
                          border: "1px solid black",
                          margin: "10px",
                          cursor: "pointer",
                        }}
                      >
                        <strong>X</strong>
                      </p>
                    </div>
                  ))}
                </>
              )}

              <div className="onlineoffline">
                <input
                  ref={inputRef}
                  style={{ display: "none" }}
                  type="file"
                  multiple
                  onChange={onChangeMultipleFiles}
                />
                <Button
                  type="dashed"
                  style={{ padding: "4px" }}
                  onClick={() => {
                    if (inputRef.current) {
                      inputRef.current.click();
                    }
                  }}
                >
                  Select Multiple Files
                </Button>
              </div>

              <Button className='dbutton' style={{ margin: "5px 30px" }} onClick={submitOnline}>
                  Submit
                </Button>
            
           
              <div className="mt-3" style={{ textAlign: "left", background: "#fff", padding: "10px" }}>
                <p>
                  <strong>Uploaded Offline s : </strong>
                </p>
                {offlineFiles.length > 0 ? (
                  <>
                    {offlineFiles.map((file: any, i: number) =>  offlineFiles && fileNames(file))}
                  </>
                ) : (
                  <span> Empty</span>
                )}
                 {(leadData?.others_offline_attachments !== null ||
                  leadData?.others_offline_attachments !== "") &&
                  leadData?.others_offline_attachments?.length > 0 && (
                    <>                     
                        {leadData?.others_offline_attachments && fileNames(leadData?.others_offline_attachments) || 'Tax file'}
                    </>
                )} </div>
            </div>

          {
          offlineFiles.length > 0 &&
          <div className="document-section">
            <h5>Final Offline Tax Submission </h5> <br></br>
              <div className="onlineoffline">
                Upload <strong>Final</strong> Tax file{" "}
                <input
                  type="file"
                  onChange={(e: any) =>
                    setSecondFinalTaxFile(e.target.files[0])
                  }
                />{" "}
              </div>
              <p>
                <Button className='dbutton' style={{ margin: "5px 0" }} onClick={finalsubmitOnline}>
                  Submit
                </Button>
              </p>
                      
              {
              leadData?.online_final_attachments && 
             
                <span><p  className="mt-3" style={{ textAlign: "left", background: "#fff", padding: "10px" }}> <strong>Uploaded Offline Tax Files : </strong></p>
                  {/* <a href={leadData?.online_final_attachments.replace('//uploads','/uploads')} target="_blank" rel="noopener noreferrer">
                  <strong> Final Tax file </strong>
                  </a> */}
                  <a href={leadData?.online_final_attachments} target="_blank" rel="noopener noreferrer">
    {leadData?.online_final_attachments?.split('/').pop().replace(/%20/g, '') || 'Final Tax file'}
  </a>
                </span>
              
              }
          </div>
          }
                 

        </div>
      )}
    </>
  );
}

export default Offline
import { Button } from "antd";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import LeadService from "../../../../services/Lead.services";
import { initGetLead } from "../../../../store/actions/creators";
import { setError } from "../../../../store/reducers";
import "../styles.scss";
import { fileNames } from "../../../../utils";

const Online = ({ leadData, selectedOption, fetchReviews }: any) => {
  const [showSecondOnlineSubmitFile, setShowSecondOnlineSubmitFile] =
    useState(false);
  const [secondFinalTaxFile, setSecondFinalTaxFile] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState<any>({});
  const [selectedMultipleFiles, setSelectedMultipleFiles] = useState<any[]>([]);
  const [offlineFiles, setOfflineFiles] = useState<any>([]);
  const [manuFiles, setManuFiles] = useState<any>([]);
  const dispatch = useDispatch();
  const { onlineOfflineSubmission, onlineFinalSubmission } = LeadService;
  const inputRef: any = useRef(null);

  const onChangeMultipleFiles = (e: any) => {
    setSelectedMultipleFiles([...selectedMultipleFiles, ...e.target.files]);
  };

  const handleOnlineFileChange = (e: any) => {
    const { name, files } = e.target;
    setSelectedFiles((prevState: any) => ({
      ...prevState,
      [name]: files[0], // Assuming you're selecting one file at a time
    }));
  };
  const finalsubmitOnline = async () => {
    try {
      if (leadData === null) {
        return;
      }
      const formData = new FormData();
      formData.append("leadType", selectedOption);
      if (secondFinalTaxFile.length > 0) {
        Array.from(secondFinalTaxFile).forEach((file) => {
          formData.append("files", file); // Append each file
        });
      }
      const response = await onlineFinalSubmission(leadData?.lead_id, formData);
      if (response) {
        dispatch(
          setError({
            status: true,
            type: "success",
            message: response?.message,
          })
        );
        fetchReviews();
        dispatch(initGetLead(leadData?.lead_id));
        if (selectedOption === "1") {
          setShowSecondOnlineSubmitFile(true);
        }
      }
    } catch (err: any) {
      dispatch(setError({ status: true, type: "error", message: err }));
    }
  };

  const submitOnline = async () => {
    try {
      if (leadData === null) {
        return;
      }
      const formData = new FormData();
      for (const key in selectedFiles) {
        if (selectedFiles[key]) {
          formData.append("files", selectedFiles[key]);
        }
      }
      formData.append("leadType", selectedOption);
      if (selectedOption === "2") {
        if (selectedMultipleFiles.length > 0) {
          selectedMultipleFiles.forEach((file) => {
            formData.append("others", file);
          });
        }
      }
      const response = await onlineOfflineSubmission(
        leadData?.lead_id,
        formData
      );
      if (response) {
        dispatch(
          setError({
            status: true,
            type: "success",
            message: response?.message,
          })
        );
        fetchReviews();
        dispatch(initGetLead(leadData?.lead_id));
        if (selectedOption === "1") {
          setShowSecondOnlineSubmitFile(true);
        }
      }
    } catch (err: any) {
      dispatch(setError({ status: true, type: "error", message: err }));
    }
  };

  useEffect(() => {
    if (leadData && leadData?.online_offline_attachments) {
      const files = leadData?.online_offline_attachments;
      const fileArray = files.split(",");
      setOfflineFiles(fileArray);
    }
  }, [leadData]);

  useEffect(() => {
    if (leadData && leadData?.manual_signature_attachments) {
      const mfiles = leadData?.manual_signature_attachments;
      const mfileArray = mfiles.split(",");
      setManuFiles(mfileArray);
    }
  }, [leadData]);

  return (
    <>
      {selectedOption === "1" && (
        <div>
          <>
            <div className="document-section">
              <h5>Online Tax Submission  </h5>
              <div className="onlineoffline">
                Upload Tax file
                <input type="file" onChange={handleOnlineFileChange} />
              </div>
              <div className="onlineoffline">
                <Button
                  className="dbutton"
                  style={{ margin: "5px 0" }}
                  onClick={submitOnline}
                >
                  Submit
                </Button>
              </div>
            </div>
          </>

          <div className="document-section">
            <>
              <h5>Upload Final Tax Submission  </h5>
              <div className="onlineoffline">
                Upload <strong>Final</strong> Tax file
                <input
                  ref={inputRef}
                  style={{ display: "none" }}
                  type="file"
                  multiple
                  onChange={(e: any) => setSecondFinalTaxFile(e.target.files)}
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

              <div className="onlineoffline">
                <Button
                  className="dbutton"
                  style={{ margin: "5px 0" }}
                  onClick={finalsubmitOnline}
                >
                  Submit
                </Button>
              </div>
            </>
          </div>

          <>
            <div className="document-section">
              <h6 className="mt-3">
                Online Tax file: &nbsp;
                {offlineFiles.length > 0 ? (
                  <>
                    {offlineFiles.map((file: any) => (
                      <span key={file}>
                        <a
                          href={file}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          
                          <strong>{file.split("/").pop().replace(/%20/g, '') || "Tax file"}</strong>
                        </a>
                        <br></br>
                      </span>
                    ))}
                  </>
                ) : (
                  <span>Empty</span>
                )}
              </h6>
              <h6 className="mt-3">
              Manual Signature: &nbsp;
                {manuFiles.length > 0 ? (
                  <>
                    {manuFiles.map((file: any) => (
                      <span key={file}>
                        <a
                          href={file}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          
                          <strong>{file.split("/").pop().replace(/%20/g, '') || "Tax file"}</strong>
                        </a>
                        <br></br>
                      </span>
                    ))}
                  </>
                ) : (
                  <span>Empty</span>
                )}
              </h6>
              <hr></hr>
              {leadData?.online_final_attachments && (
                <h6 className="mt-3" style={{ textAlign: "left" }}>
                  Online Final Tax file: &nbsp;
                  <span>
                    {(leadData?.online_final_attachments &&
                      fileNames(leadData?.online_final_attachments)) ||
                      "Final Tax file"}
                    <br></br>
                  </span>
                </h6>
              )}
            </div>
          </>
        </div>
      )}
    </>
  );
};

export default Online;

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Button, Collapse, Form, Input, InputNumber, Select, Modal, Checkbox } from 'antd';
import { useDispatch, useSelector } from 'react-redux'
import GeneralInformation from './GeneralInformation';
import Residency from './Residency';
import BankAccountDetails from './BankAccountDetails';
import DayCareExpense from './DayCareExpense';
import RentalIncomeExpense from './RentalIncomeExpense';
import SelfEmployment from './SelfEmployment';
import EstimatedTaxPayments from './EstimatedTaxPayments';
import FbarFatca from './FbarFatca';
import OtherIncome from './OtherIncome';
import AdjustmentIncome from './AdjustmentIncome';
import MedicalExpenses from './MedicalExpenses';
import TaxPaid from './TaxPaid';
import Documents from './Document\'s';
import localStorageContent from '../../../utils/localstorage';
import { initGetLead } from '../../../store/actions/creators';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './styles.scss'
import { IInitialState } from '../../../store/reducers/models';
import { clearLeadDetails, clearSections, setError } from '../../../store/reducers';
import Comments from '../../../components/Comments';
import TextArea from 'antd/es/input/TextArea';
import LeadService from '../../../services/Lead.services';
import ReviewSection from '../ReviewSection';
import SubmissionSections from '../SubmissionSection';
import IncomeInformation from './IncomeInformation';
import BackToAssign from '../BacktoAssign';
import BackToAssignList from '../BacktoAssign/BackToAssignList';
import { toolbarConfigs } from '../../../components/CommentBox/constants';
import RichTextEditor from 'react-rte';
import { localeData } from 'moment';
const { Panel } = Collapse;

const Lead = () => {
  const [leadId, setLeadId] = useState<null | string>(null)
  const [comments, setComments] = useState<any[]>([])
  const [reviewComments, setReviewComments] = useState<any[]>([])
  const [mergedComments, setMergedComments] = useState<any[]>([])
  const [commentValue, setCommentValue] = useState<any>(RichTextEditor.createEmptyValue())
  const [reviewFile, setReviewFile] = useState<any>(null)
  const [panels, setPanels] = useState<any[number]>([0])
  const [showBackStepModal, setBackStepModal] = useState<boolean>(false)
  const [currentBackStepDep, setCurrentBackStepDep] = useState<any>(null)
  const [isVerified, setIsVerified] = useState(false);
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsVerified(e.target.checked);
  };
  
  const [currentBackStepObj, setCurrentBackStepObj] = useState<any>({
    deptId: null,
    comment: ''
  })
  const gloablStore = useSelector((state: any) => state.store)
  const { leadData, selectedSections }: IInitialState = gloablStore;
  const userData = localStorageContent.getUserData()
  const fileInputRef: any = useRef(null);
  const dispatch = useDispatch();
  const location = useLocation()
  const params: any = useParams()
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { createComment, getComments, createReview, getReviews, submissionBack, submissionNext  } = LeadService


  useEffect(() => {
    if (location.pathname.includes('edit') && params.id) {
      setLeadId(params.id);
      dispatch(initGetLead(params.id));
    }
  }, [location, params.id]);

  useEffect(() => {
    if(sessionStorage.getItem("clonenewleadid")) {
      setLeadId(sessionStorage.getItem("clonenewleadid"));
      dispatch(initGetLead(sessionStorage.getItem("clonenewleadid")));
    }

    console.log("Disabled Conditions:", {
      departmentId: userData?.departmentId,
  paid_status: leadData?.paid_status,
  department5Condition:
  userData?.departmentId === 5 &&
    (leadData?.paid_status === '0' || leadData?.paid_status === 0),
    });

  }, [])

  const panelItems: any = [
    {
      Component: GeneralInformation,
      header: 'General Information',
      verifyKey: 'personel_info_verified',
      accessNo: 0,
    },
    {
      Component: Residency,
      header: 'States (US) of Residency',
      verifyKey: 'residency_states_verified',
      accessNo: 1,
    },
    {
      Component: BankAccountDetails,
      header: 'Bank Account Details',
      verifyKey: 'bank_details_verified',
      accessNo: 2,
    },
    {
      Component: DayCareExpense,
      header: 'Day Care Expense',
      verifyKey: 'daycare_expenses_verified',
      accessNo: 3,
    },
    {
      Component: RentalIncomeExpense,
      header: 'Rental Income and Expenses',
      verifyKey: 'rental_income_verified',
      accessNo: 4,
    },
    {
      Component: SelfEmployment,
      header: 'Self Employment Information',
      verifyKey: 'self_employment_verified',
      accessNo: 5,
    },
    {
      Component: EstimatedTaxPayments,
      header: 'Estimated Tax Payments',
      verifyKey: 'estimated_tax_verified',
      accessNo: 6,
    },
    {
      Component: IncomeInformation,
      header: 'Income Information',
      verifyKey: 'income_information_verified',
      accessNo: 13,
    },
    {
      Component: FbarFatca,
      header: 'FBAR / FATCA',
      verifyKey: 'fbar_fatca_verified',
      accessNo: 7,
    },
    {
      Component: OtherIncome,
      header: 'Other Income',
      verifyKey: 'other_income_verified',
      accessNo: 8,
    },
    {
      Component: AdjustmentIncome,
      header: 'Adjustments Income',
      verifyKey: 'adjustmenst_income_verified',
      accessNo: 9,
    },
    {
      Component: MedicalExpenses,
      header: 'Medical Expenses',
      verifyKey: 'medical_expenses_verified',
      accessNo: 10,
    },
    {
      Component: TaxPaid,
      header: 'Taxes Paid',
      verifyKey: 'taxes_paid_verified',
      accessNo: 11,
    },
    {
      Component: Documents,
      header: 'Documents',
      verifyKey: 'documents_verified',
      accessNo: 12,
    },
  ]

  const isFormSubmitted = useCallback((key: string) => {
    if(leadData && leadData[key] && leadData[key] === '1'){
      return true
    }

    return false;
  },[leadData])

  const finalSteps = () => {
    let showSubmission = false;
    const keysToValidate = [
      'bank_details_verified',
      'personel_info_verified',
      'residency_states_verified',
      'daycare_expenses_verified',
      'rental_income_verified',
      'self_employment_verified',
      'estimated_tax_verified',
      'fbar_fatca_verified',
      'other_income_verified',
      'adjustmenst_income_verified',
      'medical_expenses_verified',
      'taxes_paid_verified',
      'documents_verified',
      'income_information_verified',
    ]

    switch(true){
      // case userData.departmentId === 2 && keysToValidate.every((key) => leadData[key] === '1') : // uncomment this code in future if verify functionality needed
      //   showSubmission = true;
      //   break;
      case userData.departmentId === 2 && leadData !== null :
        showSubmission = true;
        break;
      case userData.departmentId === 3 && leadData !== null :
        showSubmission = true;
        break;
      case userData.departmentId === 4 && leadData?.actual_amount > 0 && comments.length > 0 && comments.some((comment: any) => comment.type === '2'):
        showSubmission = true;
        break;
      case userData.departmentId === 5 && leadData?.service_charge > 0 :
        showSubmission = true;
        break;
      case userData.departmentId === 6 && leadData?.lead_type === '1' && (leadData?.online_final_attachments !== null ||  leadData?.online_final_attachments !== ''):
        showSubmission = true;
        break;
      case userData.departmentId === 7 && leadData?.lead_type === '2' && (leadData?.online_offline_attachments !== null ||  leadData?.online_final_attachments !== ''):
        showSubmission = true;
        break;
      case  leadData && leadData?.online_final_attachments !== '':
        showSubmission = true;
        break;
      default:
        return false 
    }


    return showSubmission
  }

  const fetchComments = async () => {
    try {
      const response = await getComments(leadId, userData?.departmentId)
      if(response && response?.data?.length > 0){
        setComments(response.data)
      }
    } catch (err: any) {
      dispatch(setError({ status: true, type: 'error', message: err }))
    }
  }

  const submitComment = async (values: any) => {
    try {
      if(commentValue.toString('html') === '<p><br></p>'){
        dispatch(setError({ status: true, type: 'error', message: 'Please provide comment' }))
        return;
      }
      const copyValues: any = {comment: commentValue.toString('html')}
      if(selectedSections.length > 0){
        copyValues.sections = selectedSections.toString()
      }
      const response = await createComment(leadId, copyValues, )
      dispatch(setError({ status: true, type: 'success', message: response?.message }))
      fetchComments()
      dispatch(initGetLead(leadId))
      dispatch(clearSections(''))
      // form.setFieldsValue({
      //   comment: ''
      // })
      setCommentValue(RichTextEditor.createEmptyValue())
    } catch (err: any) {
      dispatch(setError({ status: true, type: 'error', message: err }))
    }
  }

  const submitReviews = async () => {
    try {
      const formData = new FormData();
      if (reviewFile) {   
        formData.append('file', reviewFile);
        formData.append('comment', commentValue.toString('html'));
      }else{
        formData.append('comment', commentValue.toString('html'));
      }
      const response = await createReview(leadId, formData)
      dispatch(setError({ status: true, type: 'success', message: response?.message }))
      // form.setFieldsValue({
      //   comment: '',
      //   taxFile: null
      // })
      setCommentValue(RichTextEditor.createEmptyValue())
      setReviewFile('')
      fetchComments()
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
      dispatch(initGetLead(leadId))
      
    } catch (err: any) {
      setReviewFile('')
      dispatch(setError({ status: true, type: 'error', message: err }))
    }
  }

  const onChangeSubmitBack = (value: any, name: any) => {
    setCurrentBackStepObj((prev: any) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }
  const submitBackStep = async () => {
    try {
      let copyvalues: any = {...currentBackStepObj}
      //alert(JSON.stringify(copyvalues))
      // if(userData?.role === '3' && (userData?.departmentId === 5 || userData?.departmentId === 6)){
      //   copyvalues = currentBackStepObj
      // }

      // if(userData?.role === '3' && userData?.departmentId === 4){
      //   copyvalues.deptId = 2
      // }
      const response = await submissionBack(leadId, copyvalues);
      if(response){
        setBackStepModal(false)
        setCurrentBackStepDep(null)
        dispatch(setError({ status: true, type: 'success', message: response?.message }))
        setCurrentBackStepObj({
          deptId: null,
          comment: ''
        })
        navigate("/leads");
      }
    } catch (err: any) {
      dispatch(setError({ status: true, type: 'error', message: err }))
    }
  }

  const handleBackSteps = async () => {
    setBackStepModal(true)
    // if(userData?.role === '3' && (userData?.departmentId === 4 || userData?.departmentId === 5)){
    //   setBackStepModal(true)
    // }
    // else{
    //   submitBackStep()
    // }
  }

   const handleNextSteps = async () => {
    try {
      const response = await submissionNext(leadId, { status: "2" });
      if(response){
        dispatch(setError({ status: true, type: 'success', message: response?.message }))
        navigate("/leads");
      }
    } catch (err: any) {
      dispatch(setError({ status: true, type: 'error', message: err }))
    }
  };

  useEffect(() => {
    if(location.pathname.includes('edit') && Object.keys(params).length > 0){
      setLeadId(params.id)
      dispatch(initGetLead(params.id))
    }

    return () => {
      dispatch(clearLeadDetails(''))
    }
  }, [location])

  useEffect(() => {
    if(leadData && userData && userData?.departmentId !== 1){
      fetchComments();
    }
  }, [leadData])

  return (
    <div className="user-details">
                <>
  {Number(leadData?.lead_status) === 7 && (
    
    <>
    <div className="user-details__collapses-menu__header">
          <p className="user-details__collapses-menu__header--title">
            Tax Documents 
          </p>
        </div>

      {/* Online and Offline Tax Files */}
      {leadData.selected_review && (
        <div style={{ marginBottom: '20px'}}>
          <div>selected review tax files: </div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.open(leadData.selected_review.trim(), '_blank', 'noopener,noreferrer');
            }}
          >
            {leadData.selected_review.split('/').pop().replace(/%20/g, '') || 'Tax file'}
          </a>
        </div>
      )}

      {leadData.online_offline_attachments && (
        <div style={{ marginBottom: '20px'}}>
          <div>Online and offline tax files:</div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.open(leadData.online_offline_attachments.trim(), '_blank', 'noopener,noreferrer');
            }}
          >
            {leadData.online_offline_attachments.split('/').pop().replace(/%20/g, '') || 'Tax file'}
          </a>
        </div>
      )}

      {/* Final Tax Files */}
      {leadData.online_final_attachments && (
        <div style={{ marginBottom: '20px'}}>
          Final tax files:
          {leadData.online_final_attachments.split(',').map((file: any, index: any) => (
            <div key={index}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(file.trim(), '_blank', 'noopener,noreferrer');
                }}
              >
                {file.split('/').pop().replace(/%20/g, '') || `Tax file ${index + 1}`}
              </a>
            </div>
          ))}
        </div>
      )}
    </>
  )}
</>

      {showBackStepModal && (
        <BackToAssign
          submitBackStep={submitBackStep}
          setCurrentBackStepDep={setCurrentBackStepDep}
          showBackStepModal={showBackStepModal}
          setBackStepModal={setBackStepModal}
          onChangeSubmitBack={onChangeSubmitBack}
        />
      )}
      <div className="user-details__collapses-menu">
        <div>
          <SubmissionSections
            leadData={leadData}
            fetchReviews={fetchComments}
          />
          <ReviewSection leadData={leadData} fetchReviews={fetchComments} />
        </div>
        <div className="user-details__collapses-menu__header">
          <p className="user-details__collapses-menu__header--title">
            Fill Lead Tax Information
          </p>
        </div>

        <Collapse accordion defaultActiveKey={["0"]}>
          {panelItems.map(
            ({ header, Component, verifyKey, accessNo }: any, index: any) => {
              return (
                <Panel
                  header={header}
                  key={index}
                  className={
                    isFormSubmitted(verifyKey)
                      ? "user-details__collapses-menu__success"
                      : ""
                  }
                >
                  <Component />
                </Panel>
              );
            }
          )}
          {/* {
            panelItems.map(({ header, Component, verifyKey, accessNo }: any, index: any) => {
              if(accessNo === 0 || panels.includes(header)){
                return (
                  <Panel header={header} key={index} className={isFormSubmitted(verifyKey) ? 'user-details__collapses-menu__success' : ''}>
                    <Component />
                  </Panel>
                )
              }
            })
          } */}
        </Collapse>
        {/* <div className='user-details__collapses-menu__header--multi-section-search'> */}
        {/* <Checkbox.Group options={panelItems.slice(1, panelItems.length).map((panel: any) => ({
                label: panel.header,
                value: panel.header
              }))} onChange={(e: any) => setPanels([...e])}/> */}
        {/* <Select
              mode="multiple"
              allowClear
              showSearch
              style={{ width: '100%', marginBottom: 10, cursor: 'pointer'}}
              placeholder="Select section"
              onChange={(e: any) => setPanels([...e])}
              options={panelItems.slice(1, panelItems.length).map((panel: any) => ({
                label: panel.header,
                value: panel.header
              }))}
          /> */}
        {/* </div> */}
        {leadData && (
          <>
            {comments?.length > 0 && (
              <div className="border my-4 p-3 text-black rounded">
                {(userData?.role === "3" || userData?.role === "2") &&
                  userData?.departmentId !== 4 && (
                    <h3 className="p-2">Comments</h3>
                  )}
                {(userData?.role === "3" || userData?.role === "2") &&
                  userData?.departmentId === 4 && <h3>Reviews</h3>}
                <Comments comments={comments} />
              </div>
            )}
            <div className="m-auto my-4">
              {userData?.role === "3" &&
                leadData?.department_id === userData.departmentId && (
                  <h3>Message to Client</h3>
                )}
              {userData?.role === "3" && userData?.departmentId !== 3 && (
                <ul className="comment-details">
                  {selectedSections.map((section: any, index: number) => (
                    <li key={index}>{section}</li>
                  ))}
                </ul>
              )}
              {userData?.role === "3" &&
                leadData?.department_id === userData.departmentId && (
                  <Form form={form} onFinish={submitComment}>
                    <RichTextEditor
                      value={commentValue}
                      onChange={(e: any) => setCommentValue(e)}
                      toolbarConfig={toolbarConfigs}
                    />
                    {userData?.role === "3" &&
                      userData?.departmentId !== 4 &&  userData?.departmentId !== 5 &&
                      leadData?.department_id === userData.departmentId && (
                        <Form.Item
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            margin: "10px 0",
                          }}
                        >
                          <Button
                            type="primary"
                            htmlType="submit"
                            className="float-right"
                          >
                            Submit
                          </Button>
                        </Form.Item>
                      )}
                  </Form>
                )}
              {userData?.role === "3" &&
                (userData?.departmentId === 4 || userData?.departmentId === 5) &&
                  leadData?.department_id === userData.departmentId && (
                  <Form form={form} layout="vertical">
                    <Form.Item
                      name="file"
                      label="Upload Tax File"
                      initialValue={reviewFile}
                    >
                      <Input
                        name="taxFile"
                        type={"file"}
                        ref={fileInputRef}
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e: any) => {
                          setReviewFile(e.target.files[0]);
                        }}
                      />
                    </Form.Item>
                    <Form.Item
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Button type="primary" onClick={submitReviews}>
                        Submit
                      </Button>
                    </Form.Item>
                  </Form>
                )}
            </div>
  


            <div>
              <BackToAssignList leadData={leadData} />
            </div>
            <div className="sectionactions">
              {leadData?.lead_status !== "7" &&
                userData?.role == "3" &&
                leadData?.department_id == userData.departmentId &&
                userData?.departmentId &&
                [3, 4, 5, 6].includes(userData?.departmentId) && (
                  <Button className="backNext" onClick={handleBackSteps}>
                    Back to assign
                  </Button>
                )}
              <>
                {finalSteps() && (
                  <>
                    {userData?.role == "3" &&
                      leadData?.department_id == userData.departmentId &&
                      leadData?.client_payment_status !== "3" && (
                        <Button
                          className="float-end completeNext"
                          onClick={handleNextSteps}
                          disabled={
                            userData?.departmentId === 5 &&
                            (leadData?.paid_status === '0' || leadData?.paid_status === 0) ||
                            (userData?.departmentId === 3 && !isVerified) || // This block handles departmentId 3
                            (leadData?.department_id === 4 &&
                              leadData.lead_type === null &&
                              comments?.filter(
                                (item) =>
                                  item?.department_id === 4 &&
                                  item?.attachment === ""
                              )?.length <= 0) || // This block handles departmentId 4
                            (leadData?.department_id === 6 &&
                              leadData.online_final_attachments === null) // This block handles departmentId 6
                          }
                        >
                          {leadData?.department_id === 6
                            ? "Final tax submission"
                            : "Complete next steps"}
                        </Button>

                      )}
                    {userData?.departmentId === 3 && (
                      <div className="float-end completeNext">
                        <input
                          type="checkbox"
                          checked={isVerified}
                          onChange={handleCheckboxChange}
                        />
                        &nbsp; &nbsp;Verified lead &nbsp;&nbsp;&nbsp;
                      </div>
                    )}
                  </>
                )}
              </>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Lead

import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, List, Select, Input, Upload } from "antd";
import { ToastContainer, toast } from "react-toastify";
import ContentHeader from "../../../components/ContentHeader";
import { formLayout, formTailLayout } from "../../../utils";
import useIsMobile from "../../../utils/isMobile";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../../../utils/styles/formStyles.scss";
import "./index.scss";
import { useDispatch } from "react-redux";
import { setError } from "../../../store/reducers";
import SuppoertService from "../../../services/Support.services";
import { categoryList, priorityList } from "./constants";
import TextArea from "antd/es/input/TextArea";
import Title from "antd/es/typography/Title";
import localStorageContent from "../../../utils/localstorage";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile, UploadChangeParam } from "antd/es/upload/interface";
import { UploadFile } from "antd/es/upload/interface";

interface Ticket {
  ticket_id: number;
  subject: string;
  category: string;
  priority: string;
  description: string;
  created_dept: string | null;
  created_agent: string | null;
  assign_dept: string | null;
  assigned_agent: string | null;
  ticket_status: string;
  created_dt: string;
  updated_dt: string;
  file_path: string;
}
interface Comment {
  id: number;
  comment: string;
  created_dt: Date;
  added_name: any;
  created_agent: string;
  path: string;
}

const Comments = () => {
  const [form] = Form.useForm();
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const { getTicketById, getComments, postComments, updateTicketStatus } =
    SuppoertService;
  const localUserData = localStorageContent.getUserData();
  const { TextArea } = Input;
  const { Option } = Select;

  const handleRemove = () => {
    setFile(null); // Clear file when removed
  };
  // Handle file removal
  const handleFileChange = (info: UploadChangeParam<UploadFile>) => {
    if (info.fileList.length > 0) {
      setFile(info.fileList[0].originFileObj as RcFile);
    } else {
      setFile(null); // Clear file if none is selected
    }
  };

  const [file, setFile] = useState<any>({});

  const fetchTicket = async (id: any) => {
    try {
      setIsLoading(true);
      const response = await getTicketById(id);
      const { data } = response;
      if (data) {
        setTicket(data);
        form.setFieldValue('status', data.ticket_status)
      }
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      dispatch(
        setError({ status: true, type: "error", message: "No data found!" })
      );
    }
  };
  const fetchComments = async (id: any) => {
    try {
      setIsLoading(true);
      const response = await getComments(id);
      const { data } = response;
      if (data) {
        setComments(data);
      }
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      dispatch(
        setError({ status: true, type: "error", message: "No data found!" })
      );
    }
  };

  const onFormSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      if (!isEditable) {
        delete data.status;
        const formData = new FormData();
        formData.append("comment", data?.comment);

        if (Object.entries(file).length > 0){
          formData.append("file", file);
        }
        setFile("");
        const post = postComments(params.id, formData);
        toast.promise(post, {
          pending: "Posting your comment",
          success: "Comment posted👌",
          error: "Comment is not saved, try again🤯",
        });
        await fetchTicket(params.id);
        await fetchComments(params.id);
        // form.resetFields();
        form.setFieldValue('comment', '')
      }
      setIsLoading(false);
      //   navigate("/support");
    } catch (err: any) {
      setIsLoading(false);
      dispatch(setError({ status: true, type: "error", message: err.message }));
    }
  };

  useEffect(() => {
    if (Object.keys(params).length > 0 && location.pathname.includes("edit")) {
      setIsEditable(true);
    }

    fetchTicket(params.id);
    fetchComments(params.id);

    return () => {
      form.resetFields();
      setIsEditable(false);
    };
  }, [location]);

  const statusHandler = async (a: any) => {
    const body = {
      status: a,
    };
    await updateTicketStatus(params.id, body);
    dispatch(
      setError({
        status: true,
        type: "success",
        message: "Status changed successfully!",
      })
    );
  };

  return (
    <div className="form-container">
      <ContentHeader
        showBtn={false}
        redirectPath=""
        buttonText=""
        title={`View Ticket`}
        showIcon={false}
      />
      <div className="form-container__body">
        <div className="labelname">
          {ticket ? (
            <>
              <Row>
                <Col sm={24}>
                  <strong>Subject:</strong> {ticket.subject}
                </Col>
              </Row>
              <Row>
                <Col sm={24}>
                  <strong>Description:</strong> {ticket.description}
                </Col>
              </Row>
              <Row>
                <Col sm={12}>
                  <strong>Category:</strong>{" "}
                  {categoryList.find(
                    (item: any) => item.value === ticket.category
                  )?.label || "N/A"}
                </Col>
                <Col sm={12}>
                  <strong>Priority: </strong>
                  {priorityList.find(
                    (item: any) => item.value === ticket.priority
                  )?.label || "N/A"}
                </Col>
              </Row>
              <Row>
                <Col sm={12}>
                  <strong>Created Department:</strong>{" "}
                  {ticket.created_dept || "N/A"}
                </Col>
                <Col sm={12}>
                  <strong>Assigned Agent:</strong>{" "}
                  {ticket.assigned_agent || "N/A"}
                </Col>
                <Col sm={12}>
                  <strong>Created Agent:</strong>{" "}
                  {ticket.created_agent || "N/A"}
                </Col>

                <Col sm={12}>
                  <strong>Created Date:</strong>{" "}
                  {new Date(ticket.created_dt).toLocaleString()}
                </Col>

                <Col sm={12}>
                  {!(ticket.file_path === "N/A" || ticket.file_path === "" ) && (
                    <a href={ticket.file_path} target="_blank">
                      Attachment
                    </a>
                  )}
                </Col>
              </Row>
            </>
          ) : (
            <p>Loading ticket details...</p>
          )}
        </div>
        {localUserData && localUserData.role === "3" && (
          <>
            <h3 style={{ marginTop: "10px", marginBottom: "10px" }}>
              Comments
            </h3>

            <div className="comments-list">
              {comments?.length > 0 ? (
                comments?.map((item) => (
                  <div
                    key={item.id}
                    className={`comment-item ${
                      item.added_name ===
                      `${localUserData.firstName} ${localUserData.lastName}`
                        ? "right"
                        : "left"
                    }`}
                    style={{ marginTop: "5px", marginBottom: "5px" }}
                  >
                    <div className="comment-content">
                      <strong>{item.added_name} /</strong>{" "}
                      <small>
                        Posted date:{" "}
                        {new Date(item.created_dt).toLocaleString()}
                      </small>
                      <br /> <br />
                      <strong>Comments:</strong> {item.comment}
                      <br />
                      <small>
                        {!(item.path === "N/A" || item.path === "") && (
                          <a href={item.path} target="_blank" style={{marginLeft:"5px"}}>
                            Attachment
                          </a>
                        )}
                      </small>
                    </div>
                  </div>
                ))
              ) : (
                <p>No comments yet.</p>
              )}
            </div>
          </>
        )}
        {localUserData && localUserData.role === "3" && (
          <div>
            <Form
              {...formLayout}
              style={{ marginTop: "20px" }}
              form={form}
              onFinish={onFormSubmit}
              layout={isMobile ? "vertical" : "horizontal"}
            >
              {!(
                localUserData &&
                localUserData?.role === "3" &&
                localUserData.departmentId !== 22
              ) && (
                <Form.Item
                  name="status"
                  label="Status"
                >
                  <Select
                    placeholder="Select a status"
                    onChange={statusHandler}
                    // defaultValue={ticket?.ticket_status}
                    // value={ticket?.ticket_status}
                  >
                    <Option value="1">Open</Option>
                    <Option value="2">Closed</Option>
                    <Option value="3">Pending</Option>
                  </Select>
                </Form.Item>
              )}
              <Form.Item
                label="comment"
                name="comment"
                style={{ marginTop: "10px" }}
                rules={[
                  { required: true, message: "Please enter your comment" },
                ]}
              >
                <TextArea rows={4} placeholder="Add a comment..." />
              </Form.Item>

              <Form.Item name="file_path" label="Attachment">
                <Upload
                  fileList={
                    file
                      ? [
                          {
                            uid: "1",
                            name: file.name,
                            status: "done",
                            originFileObj: file,
                          },
                        ]
                      : []
                  }
                  onChange={handleFileChange}
                  onRemove={handleRemove}
                  beforeUpload={() => false} // Prevent automatic upload
                  maxCount={1} // Allow only one file
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
              <Form.Item>
                <Button
                  style={{ float: "right" }}
                  type="primary"
                  htmlType="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Submit Comment"}
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}
        <Button htmlType="button" onClick={() => window.history.back()}>
          Back
        </Button>
      </div>
    </div>
  );
};

export default Comments;

import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Select, Upload } from "antd";
import { categoryList, priorityList } from "./constants"; // import 'antd/dist/antd.css'; // Import Ant Design styles
import { UploadOutlined } from "@ant-design/icons";
import localStorageContent from "../../../utils/localstorage";
import { RcFile, UploadChangeParam } from "antd/es/upload/interface";
import { UploadFile } from "antd/es/upload/interface";

// Define interface for form values
export interface CreateTicketFormValues {
  subject: string;
  category: string;
  priority: string;
  description: string;
  file_path: string;
  deptId?: any;
}

// Props interface for modal component
interface CreateSupportTicketModalProps {
  visible: boolean;
  onCreate: (values: any) => void;
  onUpdate: (values: any, ticket_id: any) => void;
  onCancel: () => void;
  record: any;
}

const CreateSupportTicketModal: React.FC<CreateSupportTicketModalProps> = ({
  visible,
  onCreate,
  onCancel,
  record,
  onUpdate,
}) => {
  const [form] = Form.useForm();
  const [priority, setPriority] = useState(undefined);
  const localUserData = localStorageContent.getUserData();

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
  const handlePriorityChange = (value: any) => {
    setPriority(value);
  };

  const createTicket = () => {
    form
      .validateFields()
      .then((values: CreateTicketFormValues) => {
        const formData = new FormData();
        formData.append("subject", values.subject);
        formData.append("category", values.category);
        formData.append("priority", values.priority);
        formData.append("description", values.description);
        formData.append("deptId", localUserData?.departmentId);
        if (file) formData.append("file", file);
        setFile("");
        onCreate(formData);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const updateTicket = () => {
    form
      .validateFields()
      .then((values: CreateTicketFormValues) => {
        const formData = new FormData();
        formData.append("subject", values.subject);
        formData.append("category", values.category);
        formData.append("priority", values.priority);
        formData.append("description", values.description);
        formData.append("deptId", localUserData?.departmentId);
        if (file) formData.append("file", file);
        setFile("");
        onUpdate(formData, record.ticket_id);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  useEffect(() => {
    if (Object.keys(record).length > 0) {
      form.setFieldsValue({
        subject: record.subject,
        category: record.category,
        priority: record.priority,
        description: record.description,
        file_path: record.file_path,
      });
    } else {
      form.resetFields();
    }
  }, [record]);

  return (
    <Modal
      visible={visible}
      title={`${
        Object.keys(record).length > 0 ? "Update" : "Create"
      } Support Ticket`}
      okText={`${Object.keys(record).length > 0 ? "Update" : "Create"}`}
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={Object.keys(record).length > 0 ? updateTicket : createTicket}
    >
      <Form form={form} layout="vertical" name="create_ticket_form">
        <Form.Item
          name="subject"
          label="Subject"
          rules={[{ required: true, message: "Please enter the subject" }]}
        >
          <Input placeholder="Subject" />
        </Form.Item>
        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select placeholder="Select Category">
            {categoryList?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="priority"
          label="Priority"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select
            value={priority}
            onChange={handlePriorityChange}
            placeholder="Select priority"
          >
            {priorityList?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter the description" }]}
        >
          <Input.TextArea rows={4} />
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
      </Form>
    </Modal>
  );
};

export default CreateSupportTicketModal;

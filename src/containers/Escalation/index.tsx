import React, { useEffect, useState, useMemo } from "react";
import ContentHeader from "../../components/ContentHeader";
import { FiDelete, FiPlusCircle } from "react-icons/fi";
import { Table, Space, Popconfirm, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import localStorageContent from "../../utils/localstorage";
import Modal from "antd/es/modal/Modal";
import CreateSupportTicketModal, {
  CreateTicketFormValues,
} from "./Form/CreateSupportTicketModal";
import SuppoertService from "../../services/Support.services";
import { categoryList, priorityList, statusList } from "./Form/constants";
import { setError } from "../../store/reducers";
import { BiEdit } from "react-icons/bi";
import { FaDeleteLeft } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import SearchFilter from "../../components/SearchFilter";
import { toast } from "react-toastify";
import moment from 'moment'

const Support = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ticketsList, setticketsList] = useState<any[]>([]);
  const [record, setRecord] = useState({});
  const localUserData = localStorageContent.getUserData();
  const { createTicket, getTickets, updateTicket, deleteTicket, getTicketsUser } =
    SuppoertService;

  const [visible, setVisible] = useState(false);

  const LoadTickets = async (query: any) => {
    try {
      setIsLoading(true);
      const data = await getTicketsUser(query);
      setticketsList(Array.isArray(data?.data) ? data.data : []); // Ensure data is an array
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (error instanceof Error) {
        dispatch(setError({ status: true, type: "error", message: error.message }));
      } else {
        dispatch(setError({ status: true, type: "error", message: "An unknown error occurred." }));
      }
    }
  };
  

  const onCreate = async (values: any) => {
    try {
      values.deptId = localUserData.departmentId;
      const create = createTicket(values);
      toast.promise(create, {
        pending: "Creating your ticket",
        success: "Ticket created👌",
        error: "Ticket creation failed, try again🤯",
      });
      await LoadTickets(
        localUserData.departmentId
          ? `?deptId=${localUserData.departmentId}`
          : ""
      );
      setIsLoading(false);
      setVisible(false);
    } catch (err: any) {
      setIsLoading(false);
      dispatch(setError({ status: true, type: "error", message: err }));
      setVisible(false);
    }
  };
  const onUpdate = async (values: any, ticket_id: any) => {
    try {
      values.deptId = localUserData.departmentId;
      await updateTicket(values, ticket_id);
      dispatch(
        setError({
          status: true,
          type: "success",
          message: "Ticket updated successfully!",
        })
      );
      await LoadTickets(
        localUserData.departmentId
          ? `?deptId=${localUserData.departmentId}`
          : ""
      );
      setIsLoading(false);
      setVisible(false);
    } catch (err: any) {
      setIsLoading(false);
      dispatch(setError({ status: true, type: "error", message: err }));
      setVisible(false);
    }
  };
  const EditHandler = (record: any) => {
    setVisible(true);
    setRecord(record);
  };

  const DeleteHandler = async (record: any) => {
    try {
      await deleteTicket(record.ticket_id);
      dispatch(
        setError({
          status: true,
          type: "success",
          message: "Ticket deleted successfully!",
        })
      );
      await LoadTickets(
        localUserData.departmentId
          ? `?deptId=${localUserData.departmentId}`
          : ""
      );
    } catch (err: any) {
      dispatch(setError({ status: true, type: "error", message: err }));
    }
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "created_dt",
      key: "created_dt",
      render: (date: any) => moment(date).format('YYYY-MM-DD'),
      
    },
    {
      title: "Created By",
      dataIndex: "is_user",
      key: "is_user",
      render: (is_user: string | number) => (is_user === "0" || is_user === 0 ? "Admin" : "User"),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (record: any) =>
        priorityList.filter((item) => item.value === record)[0].label,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (record: any) =>
        categoryList.filter((item) => item.value === record)[0].label,
    },
    {
      title: "Subject",
      key: "subject",
      render: (record: any) => <span>{record.subject}</span>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Status",
      dataIndex: "ticket_status",
      key: "ticket_status",
      render: (record: any) =>
        statusList.filter((item) => item.value === record)[0].label,
    },
    {
      title: "Action",
      key: "action",
      render: (text: any, record: any) => (
        <div>
          {localUserData &&
          localUserData?.role === "3" &&
          localUserData.departmentId !== 22 ? (
            <>
              <EyeOutlined
                onClick={() => navigate(`/support/view/${record.ticket_id}`)}
                style={{ cursor: "pointer", marginRight: 20 }}
              />
              {/* <EditOutlined
                  onClick={() => EditHandler(record)}
                  style={{ cursor: "pointer", marginRight: 20 }}
                /> */}
              {/* <Popconfirm
                  title="Are you sure you want to delete this ticket?"
                  onConfirm={() => DeleteHandler(record)}
                  okText="Yes"
                  cancelText="No"
                >
                  <DeleteOutlined style={{ cursor: "pointer" }} />
                </Popconfirm> */}
            </>
          ) : (
            <EyeOutlined
              onClick={() => navigate(`/support/view/${record.ticket_id}`)}
              style={{ cursor: "pointer", marginRight: 20 }}
            />
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    LoadTickets(
      localUserData.departmentId ? `?deptId=${localUserData.departmentId}` : ""
    );
  }, []);

  const cancelHandler = () => {
    setVisible(false);
    setRecord({});
  };
  const fieldsData = [
    {
      label: "Category",
      key: "category",
      elementType: "SELECT",
      required: true,
      options: categoryList,
      onChangeField: () => {},
      type: "string",
      placeholder: "Select category",
      config: {
        rules: [{ required: false, message: "Please Select category" }],
      },
    },
    {
      label: "Priority",
      key: "priority",
      elementType: "SELECT",
      options: priorityList,
      required: true,
      onChangeField: () => {},
      type: "string",
      placeholder: "Select priority",
      config: {
        rules: [{ required: false, message: "Please Select priority" }],
      },
    },
  ];

  const generateFormFields = useMemo(() => {
    let copyfields: any[] = [...fieldsData];
    return copyfields;
  }, []);
  return (
    <div>
      <div className="content-header">
        <p>Escalations</p>

        {/* {localUserData &&
          localUserData?.role === "3" &&
          localUserData.departmentId !== 22 && (
            <Button icon={<FiPlusCircle />} onClick={() => setVisible(true)}>
              Create Ticket
            </Button>
          )} */}
      </div>
      <SearchFilter
        fields={generateFormFields}
        onSubmit={(queryStrings: any) => {
          LoadTickets(
            `?${queryStrings}${
              localUserData.departmentId
                ? `&deptId=${localUserData.departmentId}`
                : ""
            }`
          );
        }}
        clearSearch={() => {
          LoadTickets(
            `?${
              localUserData.departmentId
                ? `&deptId=${localUserData.departmentId}`
                : ""
            }`
          );
        }}
        showButtons={true}
      />
      <CreateSupportTicketModal
        visible={visible}
        onCreate={onCreate}
        onUpdate={onUpdate}
        onCancel={cancelHandler}
        record={record}
      />
      {/* <ChatWindow /> */}
      {Object.keys(ticketsList).length > 0 && (
        <Table
          rowClassName="editable-row"
          bordered
          columns={columns}
          dataSource={ticketsList}
          loading={isLoading}
        />
      )}
    </div>
  );
};

export default Support;

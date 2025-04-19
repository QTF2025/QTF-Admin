//testing department wise
import React, { useEffect, useMemo, useState } from "react";
import ContentHeader from "../../components/ContentHeader";
import { FiPlusCircle } from "react-icons/fi";
import SearchFilter from "../../components/SearchFilter";
import { Table, Space, Pagination, Button } from "antd";
import { statusOptions, sourceOptions, departmentOptions } from "./constants";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { BiSolidPhoneCall } from "react-icons/bi";

import {
  EditOutlined,
  EyeOutlined,
  LockOutlined,
  DeleteOutlined,
  UserOutlined,
  GoldOutlined,
  ReconciliationFilled,
} from "@ant-design/icons";
import localStorageContent from "../../utils/localstorage";
import { extractTextFromHTML, getLeadStatus } from "../../utils";
import reportsService from "../../services/Reports.services";
import TeamService from "../../services/Team.services";
import History from "../../components/History";
import { setError } from "../../store/reducers";
import DownloadCsv from "../../utils/downloadCSV";
import DashboardService from "../../services/Dashboard.services";
import LeadHistory from "../../components/LeadHistory";

const Reports = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [reportsList, setReportsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [teamList, setTeamList] = useState<any[]>([]);
  const [tableColumns, setTableColumns] = useState<any[]>([]);
  const [currentLeadId, setCurrentLeadId] = useState<any>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showModalName, setIsShowModalName] = useState<boolean>(false)
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [queryString, setQueryString] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false); // Add this state
  const [teamDataLoaded, setTeamDataLoaded] = useState<boolean>(false);
  const localUserData = localStorageContent.getUserData();
  const multiDep = localStorageContent.getMultiDepartment();
  const { getreportsList } = reportsService;
  const { getTeamList } = TeamService;


  const { getDashboardLeadwiseWiseteammembersDetails } = DashboardService;
  
  const exportFormates: any = {
    updated_dt: (value: any) =>
      value ? `${new Date(value).toLocaleDateString()}` : "",
    lead_id: (value: any) => (value ? `Lead #${value}}` : ""),
    comments: (value: any) => (value ? value : ""),
    lead_status: (value: any) => (value ? getLeadStatus(value) : ""),
  };

  const modalToggle = () => {
    if (showModal) {
      setCurrentLeadId(null);
    }
    setShowModal(!showModal);
  };

  const modalToggeleCleintName = () => {
    setIsShowModalName(!showModalName)
  }

  const adminColumns = [
    // {
    //   title: "Date",
    //   dataIndex: "updated_dt",
    //   key: "updated_dt",
    //   render: (text: any, record: any) => {
    //     return (
    //       <>
    //         {new Date(record?.updated_dt).toLocaleString('en-US', {
    //          year: 'numeric',
    //       month: '2-digit',
    //        day: '2-digit',
    //           hour: '2-digit',
    //           minute: '2-digit',
    //           second: '2-digit',
    //           hour12: true, // Set to false for 24-hour format
    //           timeZone: 'UTC', // Adjust as needed
    //         })}
    //       </>
    //     );
    //   },
    // },
    localUserData?.departmentId === 2 && {
      title: "Date ",
      dataIndex: "process_end_datetime",
      key: "process_end_datetime",
      render: (text: any, record: any) => {
        const dateValue = record?.process_end_datetime || record?.updated_dt;
        return dateValue ? (
          <>
            {new Date(dateValue).toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
              timeZone: "UTC",
            })}
          </>
        ) : (
          "N/A"
        );
      },
    },

    localUserData?.departmentId === 3 && {
      title: "Date",
      dataIndex: "verification_end_datetime",
      key: "verification_end_datetime",
      render: (text: any, record: any) => {
        const dateValue = record?.verification_end_datetime || record?.updated_dt;
        return dateValue ? (
          <>
            {new Date(dateValue).toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
              timeZone: "UTC",
            })}
          </>
        ) : (
          "N/A"
        );
      },
    },

    localUserData?.departmentId === 4 && {
      title: "Date",
      dataIndex: "review_end_datetime",
      key: "review_end_datetime",
      render: (text: any, record: any) => {
        const dateValue = record?.review_end_datetime || record?.updated_dt;
        return dateValue ? (
          <>
            {new Date(dateValue).toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
              timeZone: "UTC",
            })}
          </>
        ) : (
          "N/A"
        );
      },
    },

    localUserData?.departmentId === 5 && {
      title: "Date",
      dataIndex: "finance_end_datetime",
      key: "finance_end_datetime",
      render: (text: any, record: any) => {
        const dateValue = record?.finance_end_datetime || record?.updated_dt;
        return dateValue ? (
          <>
            {new Date(dateValue).toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
              timeZone: "UTC",
            })}
          </>
        ) : (
          "N/A"
        );
      },
    },

    localUserData?.departmentId === 6 && {
      title: "Date",
      dataIndex: "submission_end_datetime",
      key: "submission_end_datetime",
      render: (text: any, record: any) => {
        const dateValue = record?.submission_end_datetime || record?.updated_dt;
        return dateValue ? (
          <>
            {new Date(dateValue).toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
              timeZone: "UTC",
            })}
          </>
        ) : (
          "N/A"
        );
      },
    },
    {
      title: "Lead",
      dataIndex: "lead_id",
      key: "lead_id",
      render: (leadId: any) => (
        <span
          onClick={() => {
            setCurrentLeadId(leadId);
            modalToggle();
          }}
        >
          Lead #{leadId}
        </span>
      ),
    },
    
    // {
    //   title: "Client Name",
    //   dataIndex: "first_name",
    //   key: "first_name",
    //   render: (text: any, record: any) => (
    //     <span
    //       onClick={() => {
    //         setCurrentLeadId(record?.leadId);
    //         modalToggeleCleintName();
    //       }}
    //     >
    //       {`${record?.first_name || ""} ${record?.last_name || ""}`.trim()}
    //     </span>
    //   ),
    // },
    {
      title: "Client Name",
      dataIndex: "first_name",
      key: "first_name",
      render: (first_name: any, leadId: any) => <span onClick={() => {
        setCurrentLeadId(leadId)
        modalToggeleCleintName()
      }}>{first_name}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      className: !(localUserData?.role === "2" && localUserData?.departmentId === 5) ? "noselect" : undefined,
    },
    {
      title: "Phone Number",
      dataIndex: "mobile",
      key: "mobile",
      className: "noselect",
      render: (mobile: any) => (
        <a href={`callto:1${mobile}`}>
          <BiSolidPhoneCall size={25} />
        </a>
      ),
    },
    {
      title: "Agent",
      dataIndex: "team_member",
      key: "team_member",
      className: "noselect",
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
    },
    {
      title: "Comments",
      dataIndex: "comments",
      key: "comments",
      render: (text: any) =>
        text ? (
          <p
            style={{ margin: 0 }}
            dangerouslySetInnerHTML={{ __html: extractTextFromHTML(text) }}
          />
        ) : (
          "--"
        ),
    },
    {
      title: "Actions",
      key: "action",
      render: (_: any, record: any) => {
        return (
          <Space size="middle">
            <span
              onClick={() =>
                navigate(`/leads/edit/${record.lead_id}`, {
                  state: record,
                })
              }
            >
              <EyeOutlined style={{ color: "#3AA0E9" }} />
            </span>
          </Space>
        );
      },
    },
    {
      title: "Create",
      key: "create",
      render: (text: any, record: any) => {
        const userDetails = JSON.parse(localStorage.getItem("user_details") || "{}");
        const { departmentId } = userDetails;
        return (<Space size="middle">
          {departmentId === 2 && ( // Conditionally render the button
          <Button
            className="slaesButton"
            style={{ marginLeft: "10px" }}
            onClick={() => {
              sessionStorage.setItem("clonenewleadid", record.lead_id)
              console.log("Lead ID passed:", record.lead_id); // Log the lead ID
              navigate(`/leads/create`, { state: { id: record.lead_id } });
            }}            >
            Create Lead
          </Button>
          )}
        </Space>
          )
      },
    }
  ].filter(Boolean);

  let teamsColumns = [

    {
      title: "Date",
      dataIndex: "updated_dt",
      key: "updated_dt",
      render: (text: any, record: any) => {
        return (
          <>
            {new Date(record?.updated_dt).toLocaleString('en-US', {
             year: 'numeric',
          month: '2-digit',
           day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true, // Set to false for 24-hour format
              timeZone: 'UTC', // Adjust as needed
            })}
          </>
        );
      },
    },
    
    localUserData?.departmentId === 2 && {
      title: "Date",
      dataIndex: "process_end_datetime",
      key: "process_end_datetime",
      render: (text: any, record: any) => {
        const dateValue = record?.process_end_datetime || record?.updated_dt;
        return dateValue ? (
          <>
            {new Date(dateValue).toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
              timeZone: "UTC",
            })}
          </>
        ) : (
          "N/A"
        );
      },
    },

    localUserData?.departmentId === 3 && {
      title: "Date",
      dataIndex: "verification_end_datetime",
      key: "verification_end_datetime",
      render: (text: any, record: any) => {
        const dateValue = record?.verification_end_datetime || record?.updated_dt;
        return dateValue ? (
          <>
            {new Date(dateValue).toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
              timeZone: "UTC",
            })}
          </>
        ) : (
          "N/A"
        );
      },
    },

    localUserData?.departmentId === 4 && {
      title: "Date",
      dataIndex: "review_end_datetime",
      key: "review_end_datetime",
      render: (text: any, record: any) => {
        const dateValue = record?.review_end_datetime || record?.updated_dt;
        return dateValue ? (
          <>
            {new Date(dateValue).toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
              timeZone: "UTC",
            })}
          </>
        ) : (
          "N/A"
        );
      },
    },

    localUserData?.departmentId === 5 && {
      title: "Date",
      dataIndex: "finance_end_datetime",
      key: "finance_end_datetime",
      render: (text: any, record: any) => {
        const dateValue = record?.finance_end_datetime || record?.updated_dt;
        return dateValue ? (
          <>
            {new Date(dateValue).toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
              timeZone: "UTC",
            })}
          </>
        ) : (
          "N/A"
        );
      },
    },

    localUserData?.departmentId === 5 && {
      title: "Date",
      dataIndex: "submission_end_datetime",
      key: "submission_end_datetime",
      render: (text: any, record: any) => {
        const dateValue = record?.submission_end_datetime || record?.updated_dt;
        return dateValue ? (
          <>
            {new Date(dateValue).toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
              timeZone: "UTC",
            })}
          </>
        ) : (
          "N/A"
        );
      },
    },
    {
      title: "Lead",
      dataIndex: "lead_id",
      key: "lead_id",
      render: (leadId: any) => (
        <span
          onClick={() => {
            setCurrentLeadId(leadId);
            modalToggle();
          }}
        >
          Lead #{leadId}
        </span>
      ),
    },
    {
      title: "Agent",
      dataIndex: "team_member",
      key: "team_member",
      className: "noselect",
    },
    {
      title: "Client Name",
      dataIndex: "first_name",
      key: "first_name",
      render: (first_name: any, leadId: any) => <span onClick={() => {
        setCurrentLeadId(leadId)
        modalToggeleCleintName()
      }}>{first_name}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      className: "noselect",
    },
    {
      title: "Phone Number",
      dataIndex: "mobile",
      key: "mobile",
      className: "noselect",
      render: (mobile: any) => (
        <a href={`callto:1${mobile}`}>
          <BiSolidPhoneCall size={25} />
        </a>
      ),
    },
    {
      title: "Department",
      dataIndex: "dept_name",
      key: "dept_name",
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
    },
    {
      title: "Status",
      dataIndex: "lead_status",
      key: "lead_status",
      render: (record: any) => (
        <span className={`lead_status status_${record}`}>
          {getLeadStatus(record)}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (_: any, record: any) => {
        return (
          <Space size="middle">
            <span
              onClick={() =>
                navigate(`/leads/edit/${record.lead_id}`, {
                  state: record,
                })
              }
            >
              <EyeOutlined style={{ color: "#3AA0E9" }} />
            </span>
          </Space>
        );
      },
    },
  ].filter(Boolean);

  let roleColumns: any = [
    {
      title: "Federal Count",
      dataIndex: "federal_count",
      key: "federal_count",
    },
    {
      title: "State Count",
      dataIndex: "state_count",
      key: "state_count",
    },
    {
      title: "Local Count",
      dataIndex: "local_count",
      key: "local_count",
    },
    {
      title: "Actual Amount",
      dataIndex: "actual_amount",
      key: "actual_amount",
    },
    {
      title: "Committed Amount",
      dataIndex: "commited_amount",
      key: "commited_amount",
    },
    {
      title: "Actions",
      key: "action",
      render: (_: any, record: any) => {
        return (
          <Space size="middle">
            <span
              onClick={() =>
                navigate(`/leads/edit/${record.lead_id}`, {
                  state: {
                    id: record.lead_id,
                  },
                })
              }
            >
              <EditOutlined style={{ color: "#3AA0E9" }} />
            </span>
          </Space>
        );
      },
    },
  ];

  const fieldsData = [
    {
      label: "Status",
      key: "status",
      elementType: "SELECT",
      // onChangeField:async (value: any) => await fetchTeamList(value),
      onChangeField: () => {},
      options: statusOptions,
      required: true,
      disable: false,
      type: "string",
      placeholder: "Select status",
      config: {
        rules: [{ required: false, message: "Please select status" }],
      },
    },
    {
      label: "Department",
      key: "departmentId",
      elementType: "SELECT",
      onChangeField: async (value: any) => await fetchTeamList(value),
      options: departmentOptions,
      required: true,
      disable: false,
      type: "string",
      placeholder: "Select status",
      config: {
        rules: [{ required: false, message: "Please select status" }],
      },
    },
    {
      label: "Team",
      key: "teamId",
      elementType: "SELECT",
      onChangeField: () => {},
      options: teamList,
      required: true,
      disable: false,
      type: "string",
      placeholder: "Select status",
      config: {
        rules: [{ required: false, message: "Please select status" }],
      },
    },
    {
      label: "Search With Lead Id",
      key: "leadId",
      elementType: "INPUT",
      type: "text",
      placeholder: "Search by Lead id",
      onChangeField: () => {},
    },
    {
      label: "Client Search",
      key: "user",
      elementType: "INPUT",
      required: true,
      disable: false,
      onChangeField: () => {},
      type: "text",
      placeholder: "Search by user name",
      config: {
        rules: [{ required: false, message: "Please Enter user name" }],
      },
    },
    {
      label: "Select Date",
      key: "date",
      elementType: "DATE_PICKER_DATE_RANGE",
      onChangeField: () => {},
      required: true,
      disable: false,
      type: "date",
      value: "",
      config: {
        rules: [{ required: false, message: "Please Enter Date!" }],
      },
    },
    {
      label: "Source",
      key: "source",
      elementType: "SELECT",
      onChangeField: () => {},
      options: sourceOptions,
      required: true,
      disable: false,
      type: "string",
      placeholder: "Select Source",
      config: {
        rules: [{ required: false, message: "Please select Source" }],
      },
    },
  ];

  const getReportsList = async (page: number, query: string | null) => {
    try {
      setIsLoading(true);
      let URL = "";
      if (multiDep !== null && multiDep && localUserData) {
        URL = query
          ? `/dashboard/reports?deptId=${localUserData.departmentId}&page=${
              page + "&" + query
            }`
          : `/dashboard/reports?deptId=${localUserData.departmentId}&page=${page}`;
      } else {
        URL = query
          ? `/dashboard/reports?page=${page + "&" + query}`
          : `/dashboard/reports?page=${page}`;
      }
      const response = await getreportsList(URL);
      if (response) {
        setReportsList(response.data);
        setTotalCount(response.totalRows);
      }
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      dispatch(setError({ status: true, type: "error", message: err }));
    }
  };

  const fetchReportsList = async (page: number, query: string | null) => {
    try {
      setIsLoading(true);
  
      let URL = "";
  
      if (query) {
        // Include deptId only if role is not 1 and departmentId exists
        if (localUserData.role !== 1 && localUserData.departmentId) {
          URL = `/dashboard/reports?deptId=${localUserData.departmentId}&page=${page}&${query}`;
        } else {
          URL = `/dashboard/reports?page=${page}&${query}`;
        }
      } else {
        // Exclude deptId if role is 1 or departmentId doesn't exist
        if (localUserData.role === 1 || !localUserData.departmentId) {
          URL = `/dashboard/reports?page=${page}`;
        } else {
          URL = `/dashboard/reports?deptId=${localUserData.departmentId}&page=${page}`;
        }
      }
  
      const response = await getreportsList(URL);
  
      if (response) {
        setReportsList(response.data || []);
        setTotalCount(response.totalRows || 0);
        setDataLoaded(true); // Set dataLoaded to true after data is fetched
      }
  
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      console.error("Error fetching reports:", err);
      dispatch(setError({ status: true, type: "error", message: err }));
    }
  };
  

  const fetchTeamList = async (value: any) => {
    try {
      if (localUserData === null) {
        return;
      }
      const departmentId = value
        ? value
        : localUserData?.role === "1"
        ? 1
        : localUserData?.departmentId;
      // const response = await getTeamList(
      //   `/dashboard/department-wise-team-members?departmentId=${departmentId}`
      // );
      let response;
      if(localUserData?.role === '5'){
        response = await getDashboardLeadwiseWiseteammembersDetails(value);
      } else {
        response = await getTeamList(`/dashboard/department-wise-team-members?departmentId=${departmentId}`);
      }
      console.log(response, 'response__')
      // const departmentId = value ? value : (localUserData?.role === '1' ? 1 : localUserData?.departmentId);
      // let response;
      // if(localUserData?.role === "1" || localUserData?.role === "2"){
      //   response = await getTeamList(`/dashboard/department-wise-team-members?departmentId=${departmentId}`);
      // } else {
      //   response = await getDashboardLeadwiseWiseteammembersDetails(value);
      // }

      // Check if response and response.data are defined
      if (response && response.data && Array.isArray(response.data)) {
        if (response.data.length > 0) {
          const filterData: any[] = [];
          setTeamList([]);
          response.data.forEach((team: any) => {
            if (team?.user_id) {
              // Ensure team data is valid
              filterData.push({
                // label: team.value,
                // value: team.user_id
                label: localUserData?.role !== "5" ? team?.value : `${team?.first_name} ${team?.last_name}`,
                value: team.user_id,
              });
            }
          });
          setTeamList(filterData);
          setTeamDataLoaded(true);
        } else {
          // Handle case where data length is 0 or response.data is empty
          setTeamList([]);
        }
      } else {
        // Handle case where response or response.data is undefined
        setTeamList([]);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching the team list");
      dispatch(
        setError({
          status: true,
          type: "error",
          message: err.message || "An error occurred",
        })
      );
    }
  };

  const generateSearchFields = useMemo(() => {
    let copyFields = fieldsData;
    //fields arrays
    // const role1Fields = ["Department", "Team", "Status", "Client Search", "Select Date", "Source"];
    // const role2and5Fields = ["Team", "Client Search", "Select Date"];
    const role1Fields = [
      "Department",
      "Team",
      "Search With Lead Id",
      "Status",
      "Client Search",
      "Select Date",
      "Source",
    ];
    const role2and5Fields = [
      "Team",
      "Search With Lead Id",
      "Client Search",
      "Select Date",
    ];
    const role3ordept_id7Fields = ["Client Search", "Select Date",];
    const dept9marketing = ["Select Date"];
    //conditions to show the fields
    if (localUserData?.role === "1") {
      copyFields = fieldsData.filter(
        (item) => role1Fields.indexOf(item.label) >= 0
      );
    } else if (
      (localUserData?.role === "2" || localUserData?.role === "5") &&
      localUserData?.departmentId !== 9 &&
      localUserData?.departmentId !== 7
    ) {
      copyFields = fieldsData.filter(
        (item) => role2and5Fields.indexOf(item.label) >= 0
      );
    } else if (
      localUserData?.role === "3" ||
      localUserData?.departmentId === 7
    ) {
      copyFields = fieldsData.filter(
        (item) => role3ordept_id7Fields.indexOf(item.label) >= 0
      );
    } else if (localUserData?.departmentId === 9) {
      copyFields = fieldsData.filter(
        (item) => dept9marketing.indexOf(item.label) >= 0
      );
    }
    return copyFields;
  }, [teamList]);

  useEffect(() => {
    if (localUserData?.departmentId !== 8 || isSearched) {
      fetchReportsList(currentPage, queryString);
    }
  }, [currentPage, queryString, isSearched, dataLoaded]);

  useEffect(() => {
    if (localUserData) {
      if (localUserData?.role !== "1") {
        if (localUserData?.departmentId && localUserData?.departmentId === 8) {
          setTableColumns(
            adminColumns.filter(
              (_: any, i: number) => i !== adminColumns.length - 1
            )
          );
        } else {
          if (
            localUserData?.departmentId &&
            localUserData?.departmentId === 9 &&
            localUserData?.role === "2"
          ) {
            const newConditions = ["Lead", "Comments", "Actions"];
            // const newadminColumns = adminColumns.filter(
            //   (item) => newConditions.indexOf(item.title) === -1
            // );
            // setTableColumns(newadminColumns);
          } else {
            const newConditions = ["Actions"];
            // const newadminColumns = adminColumns.filter(
            //   (item) => newConditions.indexOf(item.title) === -1
            // );
            if (localUserData?.departmentId === 7) {
              setTableColumns(adminColumns);
            } else {
              setTableColumns(adminColumns);
            }
          }
        }
      } else {
        if (
          localUserData?.role === "3" &&
          (localUserData?.departmentId === 4 ||
            localUserData?.departmentId === 5)
        ) {
          setTableColumns(teamsColumns.concat(roleColumns));
        } else {
          setTableColumns(teamsColumns);
        }
      }
    }
  }, [teamDataLoaded]);

  const userData = localStorageContent.getUserData();

  useEffect(() => {
    if(localUserData?.role === '5'){
      fetchTeamList(userData?.userId);
    }else {
      fetchTeamList(null);
    }
  }, []);

  return (
    <div>
      {showModal && (
        <History
          show={showModal}
          hideModal={modalToggle}
          leadId={currentLeadId}
          setCurrentLeadId={setCurrentLeadId}
          isLeads={true}
        />
      )}
       {
        showModalName && (
          <LeadHistory
            show={showModalName}
            hideModal={modalToggeleCleintName}
            leadId={currentLeadId}
            setCurrentLeadId={setCurrentLeadId}
        />
        )
      }
      <ContentHeader
        showBtn={false}
        redirectPath="/reports"
        buttonText=""
        title="Reports"
        showIcon
        Icon={FiPlusCircle}
      />
      <SearchFilter
        fields={generateSearchFields}
        onSubmit={(queryStrings: any) => {
          setCurrentPage(1);
          setQueryString(queryStrings);
          if (localUserData?.departmentId === 7) {
            setIsSearched(true);
          }
        }}
        clearSearch={() => {
          setCurrentPage(1);
          setQueryString(null);
          if (localUserData?.departmentId === 7) {
            setIsSearched(false);
            setReportsList([]);
          }
        }}
        showButtons={true}
      />
      {localUserData &&
        (localUserData?.role === "1" ||
          (localUserData?.departmentId === 9 &&
            localUserData?.role === "2")) && (
          <div>
            <DownloadCsv
              disabled={false}
              headers={tableColumns.map((col: any) => ({
                title: col.title,
                key: col.key,
                formate: col?.render ? exportFormates[col.key] : false,
              }))}
              filename={"Reports"}
              URL={
                queryString
                  ? `/dashboard/reports?download=1&${queryString}`
                  : "/dashboard/reports?download=1"
              }
            />
          </div>
        )}
      {reportsList.length > 0 && (
        <>
          <Table
            rowClassName="editable-row"
            bordered
            columns={tableColumns}
            dataSource={
              localUserData?.departmentId === 7 && !isSearched
                ? []
                : reportsList
            }
            pagination={false}
            loading={isLoading}
          />
          <Pagination
            onChange={(pagination: any) => {
              setCurrentPage(pagination);
            }}
            style={{ marginTop: "15px" }}
            current={currentPage}
            defaultPageSize={25}
            showSizeChanger={false}
            hideOnSinglePage
            total={totalCount}
          />
        </>
      )}
    </div>
  );
};

export default Reports;

import React, { useState, useEffect, useMemo } from "react";
import { FaUserClock } from "react-icons/fa";
import { FaUserEdit } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { FaUserLock } from "react-icons/fa6";
import { FaUserCheck } from "react-icons/fa6";
import { GiReceiveMoney } from "react-icons/gi";
import { GrMoney } from "react-icons/gr";
import { FaMoneyCheck } from "react-icons/fa";
import { FaDollarSign } from "react-icons/fa";
import { BsPersonFillGear } from "react-icons/bs";
import { BsPersonFillUp } from "react-icons/bs";
import { MdPersonOff } from "react-icons/md";
import { BsPersonFillDash } from "react-icons/bs";
import { BsPersonVcardFill } from "react-icons/bs";
import { RiTeamFill } from "react-icons/ri";
import { FaUserTag } from "react-icons/fa6";
import { FaUserTimes } from "react-icons/fa";
import "./styles.scss";
import DashboardService from "../../services/Dashboard.services";
import localStorageContent from "../../utils/localstorage";
import Skeleton from "../../components/Skeletons";
import dayjs from "dayjs";
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { Col, DatePicker, Row, Select } from "antd";
import { useDispatch } from "react-redux";
import { setError } from "../../store/reducers";
import TeamService from "../../services/Team.services";
import { gutterBlobal } from "../Leads/Lead/constants";
import { getWeekDates } from "./constants";
import TeamLeadService from "../../services/TeamLead.services";
import LeadService from "../../services/Lead.services";
const { RangePicker } = DatePicker;
const currentYear = new Date().getFullYear(); // 2025
const lastSixYearsOptions = Array.from({ length: 6 }, (_, i) => {
  const year = currentYear - 1 - i; // Start from the previous year
  return { value: String(year), label: String(year) };
});

console.log(lastSixYearsOptions);


const Dashboard = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [leadsData, setLeadsData] = useState<null | any>(null);
  const [itrYear, setItrYear] = useState<string | undefined>(undefined);
  const [processCurrentPage, setProcessCurrentPage] = useState<number>(1);
  const [financeCurrentPage, setFinanceCurrentPage] = useState<number>(1);
  const [processData, setProcessData] = useState<any[]>([]);
  const [financeData, setFinanceData] = useState<any[]>([]);
  const [animationActive, setAnimationActive] = useState(true);
  const [paymentsData, setPaymentsData] = useState<null | any>(null);
  const [ticketsData, setTicketsData] = useState<null | any>(null);
  const [salesData, setSalesData] = useState<null | any>(null);
  const [dateRangeValue, setDateRangeValue] = useState<any>([]);
  const [teamList, setTeamList] = useState<any[]>([]);
  const [dateFilter, setDateFilter] = useState<any>("");
  const [leadList, setLeadList] = useState<any[]>([]);
  const [digitalQueryString, setDigitalQueryString] = useState<any>("");
  const [teamFilter, setTeamFilter] = useState<any>(null);
  const [itrFilter, setItrFilter] = useState<any>(null);

  const userData = localStorageContent.getUserData();
  const multiDep = localStorageContent.getMultiDepartment();
  const dispatch = useDispatch();
  const { getDashboardDetails, getDashboardLeadwiseWiseteammembersDetails } =
    DashboardService;
  const { getTeamList, getTeam } = TeamService;
  const { getleadList } = LeadService;
  const { getTeamLeadList, getTeamLead, getTeamLeadSearchDropdownList } =
    TeamLeadService;
  const itemsPerPage = 150;
  const localUserData = localStorageContent.getUserData();
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [error, setErrorState] = useState<string | null>(null);
  const [isTeamDropdownDisabled, setIsTeamDropdownDisabled] = useState(true); // Initially disabled

  const cards = [
    // {
    //   title: "Process Leads",
    //   Icon: FaUserClock,
    //   count: 100,
    //   keys: ["processLeads"],
    // },
    // {
    //   title: "Preparation Leads",
    //   Icon: FaUserEdit,
    //   count: 10,
    //   keys: ["verificationLeads"],
    // },
    {
      title: "Preparation Leads",
      Icon: FaUserEdit,
      count: 10,
      keys: ["reviewLeads"],
    },
    {
      title: "Total Leads",
      Icon: FaUsers,
      count: 40,
      keys: ["totalLeads"],
    },
    {
      title: "Filling Leads",
      Icon: FaUserLock,
      count: 80,
      keys: ["submissionLeads"],
    },
    {
      title: "Payments Leads",
      Icon: FaUserLock,
      count: 80,
      keys: ["processPayments"],
    },
    {
      title: "Completed Leads",
      Icon: FaUserCheck,
      count: 105,
      keys: ["completedLeads"],
    },
    {
      title: "Open Contacts",
      Icon: BsPersonFillGear,
      count: 105,
      keys: ["openContacts"],
    },
    {
      title: "Closed Contacts",
      Icon: FaUserTimes,
      count: 105,
      keys: ["closedContacts"],
    },
    {
      title: "Pending",
      Icon: BsPersonVcardFill,
      count: 105,
      keys: ["pending"],
    },
    {
      title: "Total",
      Icon: RiTeamFill,
      count: 100,
      keys: ["total"],
    },
    {
      title: "Open Leads",
      Icon: BsPersonFillGear,
      count: 105,
      keys: ["openLeads"],
    },
    {
      title: "Closed Leads",
      Icon: FaUserCheck,
      count: 105,
      keys: ["closedLeads"],
    },
    {
      title: "ReOpen Leads",
      Icon: FaUserCheck,
      count: 155,
      keys: ["reOpenLeads"],
    },
    {
      title: "Walkout Leads",
      Icon: FaUserCheck,
      count: 105,
      keys: ["walkoutLeads"],
    },
    {
      title: "Received Fee",
      Icon: GiReceiveMoney,
      count: 100,
      keys: ["ReceivedAmount"],
    },
    {
      title: "Actual Fee",
      Icon: GrMoney,
      count: 101,
      keys: ["TotalAmount"],
    },
    {
      title: "Variance",
      Icon: FaMoneyCheck,
      count: 40,
      keys: ["pendingAmount"],
    },
    {
      title: "Average",
      Icon: FaMoneyCheck,
      count: 40,
      keys: ["Average"],
    },
    {
      title: "Follow Up",
      Icon: FaUserTag,
      count: 105,
      keys: ["followup"],
    },
    {
      title: "Interested",
      Icon: BsPersonFillUp,
      count: 100,
      keys: ["interested"],
    },
    {
      title: "Not Interested",
      Icon: MdPersonOff,
      count: 10,
      keys: ["notInterested"],
    },
    {
      title: "Voicemail",
      Icon: BsPersonFillDash,
      count: 40,
      keys: ["voicemail"],
    },
    {
      title: "Invalid Number",
      Icon: BsPersonFillDash,
      count: 40,
      keys: ["invalidNumber"],
    },
    {
      title: "Not  InService",
      Icon: BsPersonFillDash,
      count: 40,
      keys: ["notInService"],
    },
    {
      title: "DND",
      Icon: BsPersonFillDash,
      count: 40,
      keys: ["dnd"],
    },
    {
      title: "Citizens",
      Icon: BsPersonFillDash,
      count: 40,
      keys: ["citizens"],
    },
    {
      title: "closed  tickets",
      Icon: BsPersonFillDash,
      count: 40,
      keys: ["closedTicket"],
    },
    {
      title: "Pending tickets",
      Icon: BsPersonFillDash,
      count: 40,
      keys: ["pendingTickets"],
    },
    {
      title: "Processing tickets",
      Icon: BsPersonFillDash,
      count: 40,
      keys: ["processingTickets"],
    },
  ];

  const fetchTeamList = async (e?: any) => {
    try {
      if (localUserData === null) {
        return;
      }
      setIsLoading(true); // Start loading
      const response = await getTeamList(`/team/search-teams?deptId=${userData.departmentId}`);
      setIsTeamDropdownDisabled(false); // Keep the dropdown disabled if no data
      // const response = await getTeamList(
      //   `/team/search-teams?teamId=${
      //     localUserData?.role === "1" ? 1 : localUserData?.departmentId
      //   }`
      // );

      // Check if response and response.data are defined
      if (response && response.data) {
        const filterData: any[] = [];
        response.data.forEach((team: any) => {
          // Directly map the user data as department info is no longer available
          filterData.push({
            label: `${team?.first_name} ${team?.last_name}`, // Full name
            value: team.user_id, // User ID
          });
        });
        setTeamList(filterData);
        setDataLoaded(true); // Mark data as loaded
      } else {
        // Handle case where response or response.data is undefined
        setTeamList([]);
        setDataLoaded(false); // Mark data as not loaded
      }
    } catch (err: any) {
      setTeamList([]); // Clear teamList on error
      setDataLoaded(false); // Mark data as not loaded
      setErrorState(
        err.message || "An error occurred while fetching team data"
      );
      dispatch(
        setError({
          status: true,
          type: "error",
          message: err.message || "An error occurred",
        })
      );
    } finally {
      setIsLoading(false); // End loading
    }
  };


  const onChangeData = (e: any, type: string) => {
    dayjs.extend(utc);
    dayjs.extend(timezone);
  
    if (type === "RANGE") {
      setDateRangeValue(e);
      let dateQueryString: any = null;
      if (e && e.length === 2) {
        const start = dayjs(e[0]?.$d).utc().startOf("day").format("YYYY-MM-DD HH:mm:ss"); // 00:00:00
      const end = dayjs(e[1]?.$d).utc().endOf("day").format("YYYY-MM-DD HH:mm:ss"); // 23:59:59
  
        console.log("Selected UTC Dates:", start, end);
  
        dateQueryString = `startDate=${start}&endDate=${end}`;
      }
      setFinanceCurrentPage(1);
      setProcessCurrentPage(1);
      setDateFilter(dateQueryString);
    }
  
    if (type === "ITR_YEAR") {
      setItrFilter(e);
    }
  
    if (type === "TEAM") {
      setTeamFilter(e);
    }
  };

  
  // const onChangeData = (e: any, type: string) => {

  //   dayjs.extend(utc);
  //   dayjs.extend(timezone);

  //   if (type === "RANGE") {
  //     setDateRangeValue(e);
  //     let dateQueryString: any = null;
  //     if (e && e.length === 2) {
  //       //  const start = dayjs(e[0]?.$d).tz('Asia/Kolkata').format("YYYY-MM-DD");
  //       //  const end = dayjs(e[1]?.$d).tz('Asia/Kolkata').format("YYYY-MM-DD");
  //       // const start = dayjs(e[0]?.$d).format("YYYY-MM-DD");
  //       // const end = dayjs(e[1]?.$d).format("YYYY-MM-DD");

  //       const start = dayjs(e[0]?.$d).utc().format("YYYY-MM-DD HH:mm:ss");
  //       const end = dayjs(e[1]?.$d).utc().format("YYYY-MM-DD HH:mm:ss");


  //       console.log("veeru", start, end);


  //       dateQueryString = itrYear
  //         ? `startDate=${start}&endDate=${end}`
  //         : `startDate=${start}&endDate=${end}`;
  //     }
  //     setFinanceCurrentPage(1);
  //     setProcessCurrentPage(1);
  //     setDateFilter(dateQueryString);
  //   }

  //   if (type === "ITR_YEAR") {
  //     setItrFilter(e);
  //   }

  //   if (type === "TEAM") {
  //     setTeamFilter(e);
  //   }
  // };

  const fetchDashboardDetails = async (query: string) => {
    try {
      setIsLoading(true);
      let URL = "";
      if (multiDep !== null && multiDep && userData) {
        URL = query
          ? `/dashboard?deptId=${userData.departmentId}&${query}`
          : `/dashboard?deptId=${userData.departmentId}`;
      } else {
        URL = query ? `/dashboard?${query}` : "/dashboard";
      }

      // Add itrYear if it exists and is valid
      if (itrYear && itrYear.trim() !== "") {
        URL += URL.includes("?")
          ? `&itrYear=${itrYear}`
          : `?itrYear=${itrYear}`;
      }

      //console.log("Constructed URL:", URL);

      const response = await getDashboardDetails(URL);

      if (response && response.data) {
        const dashboard = response.data;
        setTicketsData(dashboard["tickets"] || []);
        setSalesData(dashboard["salesReports"] || []);
        setDataLoaded(true);

        const dashboardKeys = Object.keys(dashboard);
        if (dashboardKeys.length > 0) {
          dashboardKeys.forEach((key: any, index: any) => {
            if (index === 0) {
              setLeadsData(dashboard[key] || []);
            }
            if (index === 1) {
              setPaymentsData(dashboard[key] || []);
            }
          });
        }
      } else {
        // Handle case where response.data is undefined or empty
        setTicketsData([]);
        setSalesData([]);
        setLeadsData([]);
        setPaymentsData([]);
      }
    } catch (err: any) {
      setTicketsData([]);
      setSalesData([]);
      setLeadsData([]);
      setPaymentsData([]);
      dispatch(
        setError({
          status: true,
          type: "error",
          message:
            err.message || "An error occurred while fetching dashboard data.",
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getSalesDashboard = async (query: any) => {
    try {
      setIsLoading(true);
      let URL = query
        ? `/dashboard/sales-reports?${query}`
        : "/dashboard/sales-reports";
      const response = await getDashboardDetails(URL);
      if (response) {
        const dashboard = response?.data;
        setLeadsData(dashboard);
      }
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      dispatch(setError({ status: true, type: "error", message: err }));
    }
  };

  const getDigitalDashboard = async (query: any) => {
    try {
      setIsLoading(true);
      let URL = `/dashboard/agent-statistics?deptId=${userData.departmentId}`;
      const response = await getDashboardDetails(URL);
      setFinanceCurrentPage(1);
      setProcessCurrentPage(1);
      if (response) {
        const dashboard = response?.data;
        setLeadsData(dashboard);
      }
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      dispatch(setError({ status: true, type: "error", message: err }));
    }
  };

  const filterOption = useMemo(
    () => (input: string, option?: { label: string; value: string }) =>
      (option?.label ?? "").toLowerCase().includes(input.toLowerCase()),
    []
  );

  const getItemsForPage = (page: number, data: any) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    // console.log('pages', startIndex, endIndex, data.slice(startIndex, endIndex))
    return data.slice(startIndex, endIndex);
  };

  const LoadLeadList = async () => {
    const response = await getTeamLeadSearchDropdownList();
    if (response && response?.data?.length > 0) {
      const Leads: any = [];
      response?.data?.map((team: any) => {
        Leads.push({
          label: team?.first_name + " " + team?.last_name,
          value: team.user_id,
        });
      });
      setLeadList(Leads);
    } else {
      setLeadList([]);
    }
  };

  // const LoadLeadTeamList = async (id: any) => {
  //   const response = await getDashboardLeadwiseWiseteammembersDetails(id);
  //   if (response && response?.data?.length > 0) {
  //     console.log(response);
  //     const teamMembers: any = [];
  //     response?.data?.map((team: any) => {
  //       teamMembers.push({
  //         label: `${team?.first_name} ${team?.last_name}`, // Combine first and last name
  //         value: team.user_id,
  //       });
  //     });
  //     setTeamList(teamMembers);
  //     setIsTeamDropdownDisabled(false); // Enable the team dropdown after successful load
  //   } else {
  //     setTeamList([]);
  //     setIsTeamDropdownDisabled(true); // Keep the dropdown disabled if no data
  //   }
  // };

  // useEffect(() => {
  //   userData?.role === "2" && LoadLeadList();
  //   userData?.role === "5" && LoadLeadTeamList(userData?.userId);
  // }, []);

  const LoadLeadTeamList = async (id: any) => {
    try {
      const response = await getDashboardLeadwiseWiseteammembersDetails(id);

      if (response && response?.data?.length > 0) {
        //console.log("API Response Data:", response.data);
        const teamMembers: any = [];
        response?.data?.forEach((team: any) => {
          teamMembers.push({
            label: `${team?.first_name} ${team?.last_name}`, // Combine first and last name
            value: team.user_id,
          });
        });
        setTeamList(teamMembers);
        setIsTeamDropdownDisabled(false); // Enable the team dropdown after successful load
      } else {
       // console.log("No data received or response is empty");
        setTeamList([]);
        setIsTeamDropdownDisabled(true); // Keep the dropdown disabled if no data
      }
    } catch (error) {
      console.error("Error loading lead team list:", error);
    }
  };

  useEffect(() => {
    if (userData?.role === "2") {
      LoadLeadList();
    }
    if (userData?.role === "5" && userData?.userId) {
      LoadLeadTeamList(userData.userId);
    }
  }, []);

  useEffect(() => {
    const searchObject: any = {
      date: dateFilter,
      teamId: teamFilter,
      //itr: itrFilter,
    };

    const objKeys = Object.keys(searchObject);

    let queryString: string = "";
    objKeys.forEach((key: any) => {
      if (key === "date" && searchObject[key]) {
        console.log("ravi", searchObject[key])
        queryString = searchObject[key];
      }
      // if (key === "itr" && searchObject[key]) {
      //   queryString += queryString
      //     ? `&itrYear=${searchObject[key]}` // Append if queryString already has content
      //     : `itrYear=${searchObject[key]}`; // Start with itrYear if queryString is empty
      // }
      if (
        (userData?.role === "1" ||
          userData?.role === "2" ||
          userData?.role === "5") &&
        key === "teamId" &&
        searchObject[key]
      ) {
        if (searchObject.date) {
          queryString = `${queryString + "&" + key + "=" + searchObject[key]}`;
        } else {
          queryString = `${key + "=" + searchObject[key]}`;
        }
      }
    });

    if (dateFilter !== "") {
      if (
        userData &&
        userData.departmentId === 1 &&
        (userData.role === "3" ||
          userData.role === "2" ||
          userData.role === "5")
      ) {
        getSalesDashboard(queryString);
      } else if (userData && userData.departmentId === 8) {
        getDigitalDashboard(queryString);
        setDigitalQueryString(queryString);
      } else {
        fetchDashboardDetails(queryString);
      }
    }
  //}, [teamFilter, dateFilter, itrFilter]);
}, [teamFilter, dateFilter]);

  useEffect(() => {
    dayjs.extend(utc);
    dayjs.extend(timezone);

  const startDate = dayjs().utc().startOf("day"); // UTC Start of the day
  const endDate = dayjs().utc().endOf("day"); // UTC End of the day

    if ((userData && userData?.departmentId <= 8) || userData?.role === "1") {
      setDateFilter([startDate, endDate]);
      setDateRangeValue([startDate, endDate]);
    } else {
      setDateFilter("initial");
    }

    if (
      (userData?.role === "1" ||
        userData?.role === "2" ||
        userData?.role === "5") &&
      userData?.departmentId !== 8
    ) {
      if (!dataLoaded) {
         fetchTeamList();
      }
    }
  }, []);

  useEffect(() => {
    let intervalId: any = null;

    if (leadsData && userData && userData.departmentId === 8) {
      const processData = getItemsForPage(
        processCurrentPage,
        leadsData?.processData?.length > 0 ? leadsData?.processData : []
      );
      const financeData = getItemsForPage(
        financeCurrentPage,
        leadsData?.financeData?.length > 0 ? leadsData?.financeData : []
      );
      setProcessData(
        processData.filter((process: any) => process.totalLeads >= 0)
      );
      setFinanceData(
        financeData.filter((finance: any) => finance.totalLeads >=0)
      );

      intervalId = setInterval(() => {
        const maxData: any = [
          leadsData?.processData?.length,
          leadsData?.financeData?.length,
        ];
        const page =
          leadsData?.processData?.length > leadsData?.financeData?.length
            ? processCurrentPage
            : financeCurrentPage;
        if (page >= Math.ceil(Math.max(...maxData) / itemsPerPage)) {
          let timeout: any = null;
          timeout = setTimeout(() => {
            getDigitalDashboard(digitalQueryString);
            clearTimeout(timeout);
          }, 100);
        }
        if (leadsData?.financeData.length > itemsPerPage) {
          const financeCopyData =
            leadsData?.financeData?.length > 0 ? leadsData?.financeData : [];
          const financeData = getItemsForPage(
            financeCurrentPage,
            financeCopyData
          );
          setFinanceData(financeData);
          if (
            financeCurrentPage >=
            Math.ceil(financeCopyData.length / itemsPerPage)
          ) {
            setFinanceCurrentPage(1);
            return;
          }
        }

        if (leadsData?.processData.length > itemsPerPage) {
          const processCopyData =
            leadsData?.processData?.length > 0 ? leadsData?.processData : [];
          const processData = getItemsForPage(
            processCurrentPage,
            processCopyData
          );
          setFinanceData(processData);
          if (
            processCurrentPage >=
            Math.ceil(leadsData?.processData?.length / itemsPerPage)
          ) {
            setProcessCurrentPage(1);
            return;
          }
          setProcessCurrentPage(processCurrentPage + 1);
        }

        setAnimationActive(false);

        setTimeout(() => {
          setAnimationActive(true);
        }, 100);
      }, 15000);
    }
    return () => clearInterval(intervalId);
  }, [leadsData, processCurrentPage, financeCurrentPage]);

  return (
    <div className="dashboard-container">
      <div>
        <Row gutter={gutterBlobal}>
          {userData?.departmentId !== 8 && (
            <>
              {/* <Col xl={2} sm={12} xs={24}>
                <Select
                  placeholder="ITR Year"
                  defaultValue={String(dayjs().year()-1)} // Preselect the current year
                  onChange={(e: any) => onChangeData(e, "ITR_YEAR")}
                >
                  {lastSixYearsOptions.map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Col> */}
              <Col xl={6} sm={12} xs={24}>
                <RangePicker
                  picker={"date"}
                  value={dateRangeValue}
                  style={{ width: "100%" }}
                  onChange={(e: any) => onChangeData(e, "RANGE")}
                />
              </Col>
            </>
           )}

          {/* {userData?.role === "2" && ![8].includes(userData?.departmentId) && (
            <Col xl={6} sm={12} xs={24}>
              <Select
                showSearch
                options={leadList}
                style={{ width: "100%" }}
                onChange={(e: any) => fetchTeamList(e)}
                placeholder={"Select Team Lead"}
                filterOption={filterOption}
                onClear={() => {
                  setTeamFilter(null);
                  setIsTeamDropdownDisabled(true); // Disable the team dropdown if lead is cleared
                }}
                allowClear
              />
            </Col>
          )} */}

          {(userData?.role === "5" || userData?.role === "2") &&
            ![8, 9].includes(userData?.departmentId) && (
              <Col xl={6} sm={12} xs={24}>
                <Select
                  showSearch
                  options={teamList}
                  style={{ width: "100%" }}
                  onChange={(e: any) => onChangeData(e, "TEAM")}
                  placeholder={"Select Team"}
                  filterOption={filterOption}
                  onClear={() => setTeamFilter(null)}
                  allowClear
                />
              </Col>
            )}
        </Row>
      </div>
      {isLoading ? (
        <>
          {new Array(userData && userData?.role === "1" ? 3 : 1)
            .fill("")
            .map((_: any, index: number) => (
              <div style={{ marginTop: "30px" }} key={index}>
                <Skeleton styles={{ height: "20px", width: "100%" }} />
                <div
                  className="dashboard-container__leads--content"
                  style={{ marginTop: "30px" }}
                >
                  {new Array(5).fill("").map((_: any, i: number) => (
                    <Skeleton key={i} styles={{ height: "200px" }} />
                  ))}
                </div>
              </div>
            ))}
        </>
      ) : (
        <>
          {userData && ![8, 22].includes(userData.departmentId) && (
            <>
              {leadsData && (
                <div className="dashboard-container__leads">
                  <div className="dashboard-container__leads--header">
                    <div className="dashboard-container__leads--header__title">
                      {userData.departmentId === 1 &&
                      (userData.role === "3" ||
                        userData.role === "2" ||
                        userData.role === "5") ? (
                        <p>Contacts</p>
                      ) : (
                        <p>Leads</p>
                      )}
                    </div>
                    <hr />
                  </div>
                  <div className="dashboard-container__leads--content">
                    {leadsData && Object.keys(leadsData).length > 0 && (
                      <>
                        {Object.keys(leadsData).map(
                          (key: any, index: number) => {
                            const findLead = cards.find((lead: any) =>
                              lead.keys.includes(key)
                            );
                            // if(findLead && leadsData[key] && leadsData[key] > 0){ // commented
                            if (findLead) {
                              const { title, Icon } = findLead;
                              return (
                                <div
                                  className="dashboard-container__leads--content__item"
                                  key={index}
                                >
                                  <div>
                                    <div className="dashboard-container__leads--content__item--icon">
                                      <Icon size={45} />
                                    </div>
                                    <div className="dashboard-container__leads--content__item--text">
                                      <p>{leadsData[key]}</p>
                                      <p>{title}</p>
                                    </div>
                                  </div>
                                </div>
                              );
                            } else {
                              return <></>;
                            }
                          }
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
              {userData &&
                (userData.role === "1" ||
                  ([5].includes(userData.departmentId) &&
                    (userData.role === "2" ||
                      userData.role === "3" ||
                      userData.role === "5"))) &&
                paymentsData && (
                  <div className="dashboard-container__leads">
                    <div className="dashboard-container__leads--header">
                      <div className="dashboard-container__leads--header__title">
                        <p>Payments</p>
                      </div>
                      <hr />
                    </div>
                    <div className="dashboard-container__leads--content">
                      {paymentsData && Object.keys(paymentsData).length > 0 && (
                        <>
                          {Object.keys(paymentsData).map(
                            (key: any, index: number) => {
                              const findLead = cards.find((lead: any) =>
                                lead.keys.includes(key)
                              );
                              // if(findLead && paymentsData[key] && paymentsData[key] > 0){ // commented
                              if (findLead) {
                                const { title, Icon } = findLead;
                                return (
                                  <div
                                    className="dashboard-container__leads--content__item"
                                    key={index}
                                  >
                                    <div>
                                      <div className="dashboard-container__leads--content__item--icon">
                                        <Icon size={45} />
                                      </div>
                                      <div className="dashboard-container__leads--content__item--text">
                                        <p><FaDollarSign />
                                        {new Intl.NumberFormat("en-US", { style: "decimal", minimumFractionDigits: 2 }).format(paymentsData[key])}</p>
                                        <p>{title}</p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              } else {
                                return <></>;
                              }
                            }
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              {userData &&
                (userData.role === "1" ||
                  ([1].includes(userData.departmentId) &&
                    (userData.role === "2" || userData.role === "3"))) &&
                salesData && (
                  <div className="dashboard-container__leads">
                    <div className="dashboard-container__leads--header">
                      <div className="dashboard-container__leads--header__title">
                        <p>Sales Reports</p>
                      </div>
                      <hr />
                    </div>
                    <div className="dashboard-container__leads--content">
                      {/* <p>{JSON.stringify (salesData)}</p> */}
                      {salesData && Object.keys(salesData).length > 0 ? (
                        <>
                          {Object.keys(salesData).map(
                            (key: any, index: number) => {
                              const findLead = cards.find((lead: any) =>
                                lead.keys.includes(key)
                              );

                              // Debugging: Logging the key and findLead result
                             // console.log("Processing key:", key);
                             // console.log("Matching card:", findLead);

                              // Ensure findLead exists before rendering
                              if (findLead) {
                                const { title, Icon } = findLead;
                                return (
                                  <div
                                    className="dashboard-container__leads--content__item"
                                    key={index}
                                  >
                                    <div>
                                      <div className="dashboard-container__leads--content__item--icon">
                                        <Icon size={45} />
                                      </div>
                                      <div className="dashboard-container__leads--content__item--text">
                                        <p>{salesData[key]}</p>
                                        <p>{title}</p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              } else {
                                return null; // Return null instead of empty fragment for clarity
                              }
                            }
                          )}
                        </>
                      ) : (
                        <p>No sales data available.</p>
                      )}
                    </div>
                  </div>
                )}
              {paymentsData === null &&
                leadsData === null &&
                salesData === null && (
                  <div>
                    <p>No Data to Display</p>
                  </div>
                )}
            </>
          )}
          {userData && [8].includes(userData.departmentId) && (
            <>
              {processData.length > 0 ? (
                <div className="dashboard-container__leadsContactPerson">
                  <div className="dashboard-container__leadsContactPerson--header">
                    <div className="dashboard-container__leadsContactPerson--header__title">
                      <p>Process</p>
                    </div>
                    <hr style={{ margin: 8 }} />
                  </div>
                  <div className="dashboard-container__leadsContactPerson--contentPerson">
                    {processData.map((process: any, i: number) => (
                      <div
                        className={`dashboard-container__leadsContactPerson--contentPerson__item ${
                          animationActive ? "active" : ""
                        }`}
                        key={process?.user_id}
                      >
                        <div>
                          <p className="dashboard-container__leadsContactPerson--contentPerson__item--title">
                            {process?.first_name + " " + process?.last_name}
                          </p>
                        </div>
                        <div className="dashboard-container__leadsContactPerson--contentPerson__item--text">
                          <p>
                            Leads : {process?.totalLeads} / Ref :{" "}
                            {process?.referals}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="dashboard-container__leadsContactPerson">
                  <div className="dashboard-container__leadsContactPerson--header">
                    <div className="dashboard-container__leadsContactPerson--header__title">
                      <p>Process</p>
                    </div>
                    <hr style={{ margin: 8 }} />
                  </div>
                  <p style={{ textAlign: "center", padding: 10 }}>
                    No Process Data to display
                  </p>
                </div>
              )}
              {financeData.length > 0 ? (
                <div className="dashboard-container__leadsContactPerson">
                  <div className="dashboard-container__leadsContactPerson--header">
                    <div className="dashboard-container__leadsContactPerson--header__title">
                      <p>Finance</p>
                    </div>
                    <hr style={{ margin: 8 }} />
                  </div>
                  <div className="dashboard-container__leadsContactPerson--contentPerson">
                    {financeData.map((process: any, i: number) => (
                      <div
                        className={`dashboard-container__leadsContactPerson--contentPerson__item ${
                          animationActive ? "active" : ""
                        }`}
                        key={process.user_id}
                      >
                        <div>
                          <p className="dashboard-container__leadsContactPerson--contentPerson__item--title">
                            {process?.first_name + " " + process?.last_name}
                          </p>
                        </div>
                        <div className="dashboard-container__leadsContactPerson--contentPerson__item--text">
                          <p>Leads : {process?.totalLeads}</p>
                          {/* <p>Referrals : {process?.referals}</p> */}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="dashboard-container__leadsContactPerson">
                  <div className="dashboard-container__leadsContactPerson--header">
                    <div className="dashboard-container__leadsContactPerson--header__title">
                      <p>Finance</p>
                    </div>
                    <hr style={{ margin: 8 }} />
                  </div>
                  <p style={{ textAlign: "center", padding: 10 }}>
                    No Finance Data to display
                  </p>
                </div>
              )}
            </>
          )}
          {userData &&
            userData &&
            (["1"].indexOf(userData.role) !== -1 ||
              ([22].indexOf(userData.departmentId) !== -1 &&
                ["2", "3", "5"].indexOf(userData.role) !== -1)) &&
            ticketsData && (
              <div className="dashboard-container__leads">
                <div className="dashboard-container__leads--header">
                  <div className="dashboard-container__leads--header__title">
                    <p>Tickets</p>
                  </div>
                  <hr />
                </div>
                <div className="dashboard-container__leads--content">
                  {ticketsData && Object.keys(ticketsData).length > 0 && (
                    <>
                      {Object.keys(ticketsData).map(
                        (key: any, index: number) => {
                          const findLead = cards.find((lead: any) =>
                            lead.keys.includes(key)
                          );
                          // if(findLead && paymentsData[key] && paymentsData[key] > 0){ // commented
                          if (findLead) {
                            const { title, Icon, count } = findLead;

                            return (
                              <div
                                className="dashboard-container__leads--content__item"
                                key={index}
                              >
                                <div>
                                  <div className="dashboard-container__leads--content__item--icon">
                                    <Icon size={45} />
                                  </div>
                                  <div className="dashboard-container__leads--content__item--text">
                                    <p>{ticketsData[key]}</p>
                                    <p>{ticketsData[count]}</p>
                                    <p>{title}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          } else {
                            return <></>;
                          }
                        }
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
        </>
      )}
    </div>
  );
};

export default Dashboard;

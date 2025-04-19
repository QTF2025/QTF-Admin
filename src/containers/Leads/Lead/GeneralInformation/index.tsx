import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Col, Row, Form, Button, Checkbox } from "antd";
import {
  GenderOptions,
  marriageStatus,
  totalMonthsInUs,
  visaTypeOptions,
  yesNoOptions,
} from "./constants";
import GenerateElements from "../../../../components/GenerateElements";
import "antd/dist/antd-with-locales";
import dayjs from "dayjs";
import Dependent from "./Dependent";
import { gutterBlobal } from "../constants";
import { dependentEmptyContext, spouseEmptyContext } from "./constants";
import Skeleton from "../../../../components/Skeletons";
import Spouse from "./Spouse";
import { useDispatch, useSelector } from "react-redux";
import { IInitialState } from "../../../../store/reducers/models";
import "./styles.scss";
import localStorageContent from "../../../../utils/localstorage";
import { convertToDate, isEmptyKeys } from "../../../../utils";
import { PlusCircleOutlined } from "@ant-design/icons";
import {
  initCreateLead,
  initUpdateVerifyStatus,
  updateLead,
} from "../../../../store/actions/creators";
import axios from "axios";
import { setError, setSections } from "../../../../store/reducers";
import { useLocation, useNavigate } from "react-router-dom";

function GeneralInformation() {
  const [form] = Form.useForm();
  const [filterFields, setfilterFields] = useState<any[]>([]);
  const [showDepenedents, setShowDependents] = useState<boolean>(false);
  const [showSpouse, setShowSpouse] = useState<boolean>(false);
  const [spouseDetails, setSpouseDetails] = useState<any>({
    ...spouseEmptyContext,
  });
  const [dependencies, setDependencies] = useState<any>([]);
  const [disableLocation, setDisableLocation] = useState<boolean>(false);
  const [validateDependents, setValidateDependents] = useState<boolean>(false);
  const [isReadOnly, setIsReadOnly] = useState<boolean>(false);
  const [showFields, setShowFields] = useState<any>({
    dateOfChange: false,
    fromVisa: false,
    toVisa: false,
  });
  const localUserData = localStorageContent.getUserData();
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const lastSixYearsOptions = Array.from({ length: 6 }, (v, i) => {
    const year = currentYear - 1 - i; // Start from -1 year
    return { value: year, label: year };
  });
  const gloablStore = useSelector((state: any) => state.store);
  const { isleadDetailsLoading, leadData }: IInitialState = gloablStore;

  const onChangeDropDown = (key: string, status: boolean) => {
    if (status) {
      setShowFields({
        dateOfChange: true,
        fromVisa: true,
        toVisa: true,
      });
    } else {
      setShowFields({
        dateOfChange: false,
        fromVisa: false,
        toVisa: false,
      });
    }
  };

  const onChangeLead = useCallback(
    (value: string, name: string) => {
      if (name === "dependents") {
        if (value === "1") {
          setShowDependents(true);
          setDependencies([{ ...dependentEmptyContext }]);
        } else {
          setShowDependents(false);
          setDependencies([]);
        }
      }

      if (name === "maritalStatus") {
        if (value === "2") {
          setShowSpouse(true);
          if (
            leadData &&
            leadData?.spouseDetails &&
            Object.keys(leadData?.spouseDetails).length === 0
          ) {
            setValidateDependents(false);
            setSpouseDetails({ ...spouseEmptyContext });
          }
        } else {
          setShowSpouse(false);
        }
      }
    },
    [leadData]
  );

  const onChangeSpouseDetails = useCallback((value: string, name: string) => {
    setSpouseDetails((prev: any) => {
      const copySpouse: any = { ...prev };
      if (name === "identificationNumber") {
        if (value === "1") {
          copySpouse["itinnVisaNumber"] = "";
          copySpouse["passportNumber"] = "";
          copySpouse["passportExpiryDate"] = "";
          copySpouse["foreignHomeAddress"] = "";
        }

        if (value === "2") {
          copySpouse["ssnItinNumber"] = "";
        }
      }
      copySpouse[name] = value;

      return copySpouse;
    });
  }, []);

  const addDependent = useCallback(() => {
    const values = [...dependencies];
    values.push({ ...dependentEmptyContext });
    setDependencies(values);
  }, [dependencies]);

  const deleteDependent = useCallback(
    (index: number) => {
      const copyDependencies = [...dependencies];
      setDependencies(
        copyDependencies.filter((_: any, i: number) => i !== index)
      );
    },
    [dependencies]
  );

  const handleZipCode = (value: any) => {
    if (value.length === 5 || value.length === 6) {
      axios.get(`https://api.zippopotam.us/us/${value}`).then(
        (resp: any) => {
          form.setFieldsValue({
            country: resp?.data?.country,
            state: resp?.data?.places[0]?.state,
            city: resp?.data?.places[0]["place name"],
          });
        },
        (error) => {
          dispatch(
            setError({
              status: true,
              type: "error",
              message: "Invalid Zipcode",
            })
          );
        }
      );
    }
  };

  const submitVerifyStatus = (e: any) => {
    if (leadData !== null) {
      let obj = {
        verifyPersonelInfo: e.target.checked ? "1" : "0",
      };
      dispatch(initUpdateVerifyStatus(leadData?.lead_id, obj));
    }
  };

  const onChangeDependent = useCallback(
    (value: string, name: string, index: number) => {
      setDependencies((prevDependencies: any) => {
        const updatedDependencies = [...prevDependencies];
        if (name === "identificationNumber") {
          if (value === "1") {
            updatedDependencies[index]["itinnVisaNumber"] = "";
            updatedDependencies[index]["passportNumber"] = "";
            updatedDependencies[index]["passportExpiryDate"] = "";
            updatedDependencies[index]["foreignHomeAddress"] = "";
          }

          if (value === "2") {
            updatedDependencies[index]["ssnItinNumber"] = "";
          }
        }
        updatedDependencies[index][name] = value;
        return updatedDependencies;
      });
    },
    []
  );

  const onSubmitLead = useCallback(
    (values: any) => {
      setValidateDependents(true);
      setIsLoading(true); // Show loader when form submission starts
      const copyValues = { ...values };
      const { dob, dateOfChange, primaryPorOfentry } = copyValues;
      if (dob) {
        copyValues.dob = convertToDate(dob);
      }
      if (dateOfChange) {
        copyValues.dateOfChange = convertToDate(dateOfChange);
      }
      if (primaryPorOfentry) {
        copyValues.primaryPorOfentry = convertToDate(primaryPorOfentry);
      }

      //Validation and modification of dependents data

      let isDependentsValid: boolean = true;
      if (showDepenedents) {
        const modifiedDependents: any = dependencies.map((dependent: any) => {
          const copyDependent = { ...dependent };
          if (copyDependent.dob) {
            copyDependent.dob = convertToDate(copyDependent.dob);
          }
          if (copyDependent.dateOfEntryInUs) {
            copyDependent.dateOfEntryInUs = convertToDate(
              copyDependent.dateOfEntryInUs
            );
          }
          if (copyDependent.passportExpiryDate) {
            copyDependent.passportExpiryDate = convertToDate(
              copyDependent.passportExpiryDate
            );
          }
          if (copyDependent.dateOfChange) {
            copyDependent.dateOfChange = convertToDate(
              copyDependent.dateOfChange
            );
          }
          // if(copyDependent.fromVisa){
          //   copyDependent.fromVisa = convertToDate(copyDependent.fromVisa)
          // }
          // if(copyDependent.toVisa){
          //   copyDependent.toVisa = convertToDate(copyDependent.toVisa)
          // }

          return copyDependent;
        });

        isDependentsValid = modifiedDependents.every((dependent: any) => {
          const copyDependent: any = { ...dependent };
          if (dependent.identificationNumber === "1") {
            delete copyDependent.itinnVisaNumber;
            delete copyDependent.passportNumber;
            delete copyDependent.passportExpiryDate;
            delete copyDependent.foreignHomeAddress;
          }

          if (dependent.changeInVisa2022 === "0") {
            delete copyDependent.dateOfChange;
            delete copyDependent.fromVisa;
            delete copyDependent.toVisa;
          }

          if (dependent.identificationNumber === "2") {
            delete copyDependent.ssnItinNumber;
          }
          if (dependent.firstName && dependent.lastName) {
            return true;
          }
          // return isEmptyKeys(copyDependent, 'ALL', [])
        });

        if (!isDependentsValid) {
          return;
        }

        copyValues.dependentsList = modifiedDependents;
      } else {
        copyValues.dependentsList = [];
      }

      //Validation and modificatiion of spouse data
      let isSpouseValid: boolean = true;
      if (showSpouse) {
        const copySpouse: any = { ...spouseDetails };
        if (copySpouse.identificationNumber === "1") {
          delete copySpouse.itinnVisaNumber;
          delete copySpouse.passportNumber;
          delete copySpouse.passportExpiryDate;
          delete copySpouse.foreignHomeAddress;
        }

        if (copySpouse.changeInVisa2022 === "0") {
          delete copySpouse.dateOfChange;
          delete copySpouse.fromVisa;
          delete copySpouse.toVisa;
        }

        if (copySpouse.identificationNumber === "2") {
          delete copySpouse.ssnItinNumber;
        }

        if (!copySpouse.firstName || !copySpouse.lastName) {
          return false;
        }

        // isSpouseValid = isEmptyKeys(copySpouse, 'ALL',[])

        // if(!isSpouseValid){
        //   return;
        // }

        if (
          copySpouse.identificationNumber === "2" &&
          copySpouse.passportExpiryDate
        ) {
          copySpouse.passportExpiryDate = convertToDate(
            copySpouse.passportExpiryDate
          );
        }

        if (copySpouse.changeInVisa2022 === "1") {
          copySpouse.dateOfChange = convertToDate(copySpouse.dateOfChange);
          // copySpouse.fromVisa = convertToDate(copySpouse.fromVisa)
          // copySpouse.toVisa = convertToDate(copySpouse.toVisa)
        }

        if (copySpouse.dob && copySpouse.dateOfEntryInUs && copySpouse.dom) {
          copySpouse.dom = convertToDate(copySpouse.dom);
          copySpouse.dateOfEntryInUs = convertToDate(
            copySpouse.dateOfEntryInUs
          );
        }
        copyValues.spouseDetails = copySpouse;
        copyValues.spouseDetails.dob = dayjs(
          copyValues.spouseDetails.dob
        ).format("YYYY-MM-DD");
      } else {
        copyValues.spouseDetails = {};
      }
      if (sessionStorage.getItem("clonenewleadid")) {
        dispatch(initCreateLead(copyValues, navigate));
        sessionStorage.removeItem("clonenewleadid");
      } else if (leadData) {
        // if (leadData?.lead_id) {
        //   delete copyValues.itrYear;
        // }
        dispatch(updateLead(leadData.lead_id, copyValues));
      } else {
        dispatch(initCreateLead(copyValues, navigate));
      }
      setIsLoading(false);
    },
    [dependencies, spouseDetails, leadData]
  );

  const formFields = useMemo(
    () => [
      {
        label: "ITR Year",
        key: "itrYear",
        childKey: [],
        parentKey: [],
        elementType: "SELECT",
        options: lastSixYearsOptions,
        onChangeField: onChangeLead,
        required: true,
        //disable: sessionStorage.getItem("clonenewleadid") ? false : leadData?.lead_id,
        disable: (() => {
          const userDetailsString = localStorage.getItem("user_details");
          if (userDetailsString) {
            const userDetails = JSON.parse(userDetailsString);
            return userDetails && Number(userDetails.departmentId) > 2;
          }
          return false; // Default to not disabling if no user_details found
        })(),
        type: "string",
        config: {
          rules: [{ required: true, message: "Please Select ITR Year" }],
        },
      },
      {
        label: "First Name (as per SSN)",
        key: "firstName",
        childKey: [],
        parentKey: [],
        elementType: "INPUT",
        onChangeField: onChangeLead,
        required: true,
        disable: isReadOnly,
        type: "text",
        config: {
          rules: [{ required: true, message: "Please Enter First name!" }],
        },
      },
      {
        label: "Middle Name",
        key: "middleName",
        childKey: [],
        parentKey: [],
        elementType: "INPUT",
        onChangeField: onChangeLead,
        required: false,
        disable: isReadOnly,
        type: "text",
        config: {
          rules: [{ required: false, message: "Please Enter First name!" }],
        },
      },
      {
        label: "Last Name",
        key: "lastName",
        childKey: [],
        parentKey: [],
        elementType: "INPUT",
        onChangeField: onChangeLead,
        required: true,
        disable: isReadOnly,
        type: "text",
        config: {
          rules: [{ required: true, message: "Please Enter Last name!" }],
        },
      },
      {
        label: "Date Of Birth",
        key: "dob",
        childKey: [],
        parentKey: [],
        elementType: "DATE_PICKER_DATE",
        onChangeField: onChangeLead,
        required: false,
        disable: isReadOnly,
        type: "date",
        config: {
          rules: [{ required: true, message: "Please Enter Date of birth!" }],
        },
      },
      {
        label: "Gender",
        key: "gender",
        childKey: [],
        parentKey: [],
        elementType: "SELECT",
        options: GenderOptions,
        onChangeField: onChangeLead,
        required: false,
        disable: isReadOnly,
        type: "string",
        config: {
          rules: [{ required: true, message: "Please provide Gender" }],
        },
      },
      {
        label: "SSN/ITIN",
        key: "ssnItinNumber",
        childKey: [],
        parentKey: [],
        elementType: "INPUT_FORMATTER",
        onChangeField: onChangeLead,
        required: false,
        disable: isReadOnly,
        type: "number",
        config: {
          rules: [{ required: false, message: "Please Enter SSN/ITIN!" }],
        },
      },
      {
        label: "Visa Type",
        key: "visaType",
        childKey: [],
        parentKey: [],
        elementType: "SELECT",
        options: visaTypeOptions,
        onChangeField: onChangeLead,
        required: false,
        disable: isReadOnly,
        type: "string",
        config: {
          rules: [{ required: false, message: "Please provide Visa Type" }],
        },
      },
      {
        label: "Latest Visa Change?",
        key: "visaChangeIn2022",
        childKey: ["dateOfChange", "fromVisa", "toVisa"],
        parentKey: [],
        elementType: "SELECT",
        onChangeField: (value: any, name: any, index: any) => {
          onChangeLead(value, name);
          onChangeDropDown("visaChangeIn2022", value === "1");
        },
        required: false,
        options: yesNoOptions,
        disable: isReadOnly,
        type: "text",
        config: {
          rules: [
            { required: false, message: "Please Enter Visa Change year." },
          ],
        },
      },
      {
        label: "Date Of Visa Change",
        key: "dateOfChange",
        childKey: [],
        parentKey: ["visaChangeIn2022"],
        elementType: "DATE_PICKER_DATE",
        onChangeField: onChangeLead,
        required: false,
        disable: isReadOnly,
        type: "date",
        config: {
          rules: [{ required: false, message: "Please Enter Date of birth!" }],
        },
      },
      {
        label: "From visa",
        key: "fromVisa",
        childKey: [],
        parentKey: ["visaChangeIn2022"],
        onChangeField: onChangeLead,
        elementType: "SELECT",
        options: visaTypeOptions,
        required: false,
        disable: isReadOnly,
        type: "text",
        config: {
          rules: [{ required: false, message: "Please Enter Date of birth!" }],
        },
      },
      {
        label: "To Visa",
        key: "toVisa",
        childKey: [],
        parentKey: ["visaChangeIn2022"],
        onChangeField: onChangeLead,
        elementType: "SELECT",
        options: visaTypeOptions,
        required: false,
        disable: isReadOnly,
        type: "text",
        config: {
          rules: [{ required: false, message: "Please Enter Date of birth!" }],
        },
      },
      {
        label: "Country Of Citizenship",
        key: "citizenOfCountry",
        childKey: [],
        parentKey: [],
        elementType: "INPUT",
        onChangeField: onChangeLead,
        required: false,
        disable: isReadOnly,
        type: "text",
        config: {
          rules: [
            { required: false, message: "Please Enter Country Of Citizenship" },
          ],
        },
      },
      {
        label: "Occupation",
        key: "occupation",
        childKey: [],
        parentKey: [],
        elementType: "INPUT",
        onChangeField: onChangeLead,
        required: false,
        disable: isReadOnly,
        type: "text",
        config: {
          rules: [{ required: false, message: "Please Enter Occupation" }],
        },
      },
      {
        label: "Email",
        key: "email",
        childKey: [],
        parentKey: [],
        elementType: "INPUT",
        onChangeField: onChangeLead,
        required: false,
        disable: (() => {
          const userDetailsString = localStorage.getItem("user_details");
          if (userDetailsString) {
            const userDetails = JSON.parse(userDetailsString);
            return userDetails && Number(userDetails.departmentId) > 2;
          }
          return false; // Default to not disabling if no user_details found
        })(),
        type: "text",
        config: {
          rules: [{ required: true, message: "Please Enter Email!" }],
        },
      },
      {
        label: "Alternate number",
        key: "workPhoneNumber",
        childKey: [],
        parentKey: [],
        elementType: "INPUT",
        onChangeField: onChangeLead,
        required: false,
        disable: isReadOnly,
        type: "text",
        config: {
          rules: [
            { required: false, message: "Please Enter Work Phone Number!" },
          ],
        },
      },
      {
        label: "Primary Port of Entry",
        key: "primaryPorOfentry",
        childKey: [],
        parentKey: [],
        elementType: "DATE_PICKER_DATE",
        onChangeField: onChangeLead,
        required: false,
        disable: isReadOnly,
        type: "date",
        config: {
          rules: [{ required: false, message: "Please Enter Port of Entry" }],
        },
      },
      {
        label: "Total Months",
        key: "totalMonthsInUs",
        childKey: [],
        parentKey: [],
        elementType: "SELECT",
        options: totalMonthsInUs,
        onChangeField: onChangeLead,
        required: false,
        disable: isReadOnly,
        type: "string",
        config: {
          rules: [{ required: false, message: "Please provide Total Months" }],
        },
      },
      {
        label: "Will You Stay in The U.S.? (t)",
        key: "willYouStayedInUs",
        childKey: [],
        parentKey: [],
        elementType: "SELECT",
        options: yesNoOptions,
        onChangeField: onChangeLead,
        required: false,
        disable: isReadOnly,
        type: "string",
        config: {
          rules: [
            { required: false, message: "Please provide Stay in The U.S" },
          ],
        },
      },
      {
        label: "Mobile",
        key: "mobile",
        childKey: [],
        parentKey: [],
        elementType: "INPUT",
        onChangeField: onChangeLead,
        required: false,
        disable: isReadOnly,
        type: "text",
        config: {
          rules: [{ required: true, message: "Please Enter Mobile Number!" }],
        },
      },
      {
        label: "Zipcode",
        key: "zipCode",
        childKey: [],
        parentKey: [],
        elementType: "INPUT",
        onChangeField: handleZipCode,
        required: false,
        disable: isReadOnly,
        type: "text",
        config: {
          rules: [{ required: false, message: "Please Enter Zipcode!" }],
        },
      },
      {
        label: "Country",
        key: "country",
        childKey: [],
        parentKey: [],
        elementType: "INPUT",
        onChangeField: onChangeLead,
        required: false,
        disable: true,
        type: "text",
        config: {
          rules: [{ required: false, message: "Please Enter Country!" }],
        },
      },
      {
        label: "State",
        key: "state",
        childKey: [],
        parentKey: [],
        elementType: "INPUT",
        onChangeField: onChangeLead,
        required: false,
        type: "text",
        disable: true,
        config: {
          rules: [{ required: false, message: "Please Enter State!" }],
        },
      },
      {
        label: "City",
        key: "city",
        childKey: [],
        parentKey: [],
        elementType: "INPUT",
        onChangeField: onChangeLead,
        required: false,
        disable: true,
        type: "text",
        config: {
          rules: [{ required: false, message: "Please Enter City!" }],
        },
      },
      {
        label: "Street Address",
        key: "streetAddress",
        childKey: [],
        parentKey: [],
        elementType: "INPUT",
        onChangeField: onChangeLead,
        required: false,
        disable: isReadOnly,
        type: "text",
        config: {
          rules: [{ required: false, message: "Please Enter Street Address!" }],
        },
      },
      {
        label: "Apartment Number",
        key: "apartmentNumber",
        childKey: [],
        parentKey: [],
        elementType: "INPUT",
        onChangeField: onChangeLead,
        required: false,
        disable: isReadOnly,
        type: "text",
        config: {
          rules: [
            { required: false, message: "Please Enter Apartment Number!" },
          ],
        },
      },
      {
        label: "Marital Status (As on last year)",
        key: "maritalStatus",
        childKey: [],
        parentKey: [],
        elementType: "SELECT",
        options: marriageStatus,
        onChangeField: onChangeLead,
        required: false,
        disable: isReadOnly,
        type: "string",
        config: {
          rules: [
            { required: false, message: "Please provide Marital Status" },
          ],
        },
      },
      {
        label: "Dependents",
        key: "dependents",
        childKey: [],
        parentKey: [],
        elementType: "SELECT",
        options: yesNoOptions,
        onChangeField: onChangeLead,
        required: false,
        disable: isReadOnly,
        type: "string",
        config: {
          rules: [{ required: false, message: "Please provide Dependents" }],
        },
      },
    ],
    [onChangeLead, disableLocation, isReadOnly]
  );
  const leadId = leadData?.lead_id; // Use optional chaining to safely access lead_id
  useEffect(() => {
    let conditionalKeys = Object.keys(showFields);
    let existingKeys = filterFields.map((field: any) => field.key);
    conditionalKeys.forEach((fieldKey: any) => {
      if (showFields[fieldKey]) {
        existingKeys.push(fieldKey);
      } else {
        existingKeys = existingKeys.filter((key: any) => key !== fieldKey);
      }
    });
    setfilterFields(
      formFields.filter((field: any) => existingKeys.includes(field.key))
    );
  }, [showFields]);

  useEffect(() => {
    const yesNoElements = ["visaChangeIn2022"];
    let residentData = {
      ...leadData,
    };
    let residentKeys = leadData ? Object.keys(residentData) : [];
    if (residentKeys.length > 0 && leadData) {
      setfilterFields(
        formFields.filter(
          (field: any) =>
            (field?.parentKey.length > 0 &&
              yesNoElements.includes(field.parentKey[0]) &&
              residentData["visa_change_in_2022"] === "1") ||
            field?.parentKey.length === 0
        )
      );
    } else {
      setfilterFields(
        formFields.filter((field: any) => field?.parentKey.length === 0)
      );
    }
  }, [leadData]);

  useEffect(() => {
    if (
      leadData &&
      Object.keys(leadData).length > 0 &&
      !Array.isArray(leadData)
    ) {
      const {
        first_name,
        middle_name,
        itr_year,
        last_name,
        dob,
        gender,
        ssn_itin,
        visa_type,
        visa_change_in_2022,
        citizen_of_country,
        occupation,
        email,
        work_phone_number,
        primary_port_of_entry,
        total_months_in_us,
        will_you_stayed_in_us,
        mobile,
        zipcode,
        country,
        state,
        city,
        street_address,
        apartment_number,
        marital_status,
        dependents,
        dependentDetails,
        spouseDetails,
        personel_info_verified,
        date_of_change,
        from_visa,
        to_visa,
      } = leadData;

      form.setFieldsValue({
        itrYear: itr_year,
        firstName: first_name,
        middleName: middle_name,
        lastName: last_name,
        dob: dob ? dayjs(dob, "YYYY-MM-DD") : "",
        gender,
        ssnItinNumber: ssn_itin,
        visaType: visa_type,
        visaChangeIn2022: visa_change_in_2022,
        citizenOfCountry: citizen_of_country,
        occupation,
        email,
        workPhoneNumber: work_phone_number,
        primaryPorOfentry: primary_port_of_entry
          ? dayjs(primary_port_of_entry, "YYYY-MM-DD")
          : "",
        totalMonthsInUs: total_months_in_us,
        willYouStayedInUs: will_you_stayed_in_us,
        mobile,
        zipCode: zipcode,
        country,
        state,
        city,
        streetAddress: street_address,
        apartmentNumber: apartment_number,
        maritalStatus: marital_status,
        dependents,
        dateOfChange: date_of_change ? dayjs(date_of_change, "YYYY-MM-DD") : "",
        fromVisa: from_visa,
        toVisa: to_visa,
      });

      if (marital_status === "2") {
        if (spouseDetails && Object.keys(spouseDetails).length > 0) {
          const {
            first_name,
            middle_name,
            last_name,
            dob,
            visa_type,
            visa_change_in_2022,
            date_of_entry_for_us,
            identification_type,
            ssn_itin_number,
            itin_visa_number,
            passport_number,
            passport_expiry_date,
            foreign_home_address,
            date_of_change,
            from_visa,
            to_visa,
            date_of_marriage,
            occupation,
          } = spouseDetails;

          setSpouseDetails({
            firstName: first_name,
            middleName: middle_name,
            lastName: last_name,
            dob: dob ? dayjs(dob ? dob : "", "YYYY-MM-DD") : "",
            visaType: visa_type,
            changeInVisa2022: visa_change_in_2022,
            dateOfEntryInUs: date_of_entry_for_us
              ? dayjs(
                  date_of_entry_for_us ? date_of_entry_for_us : "",
                  "YYYY-MM-DD"
                )
              : "",
            identificationNumber: identification_type,
            ssnItinNumber: ssn_itin_number,
            itinnVisaNumber: itin_visa_number,
            passportNumber: passport_number,
            passportExpiryDate: passport_expiry_date
              ? dayjs(
                  passport_expiry_date ? passport_expiry_date : "",
                  "YYYY-MM-DD"
                )
              : "",
            foreignHomeAddress: foreign_home_address
              ? dayjs(
                  foreign_home_address ? foreign_home_address : "",
                  "YYYY-MM-DD"
                )
              : "",
            dateOfChange: date_of_change
              ? dayjs(date_of_change, "YYYY-MM-DD")
              : "",
            fromVisa: from_visa,
            toVisa: to_visa,
            dom: date_of_marriage ? dayjs(date_of_marriage, "YYYY-MM-DD") : "",
            occupation: occupation,
          });
        } else {
          setSpouseDetails({ ...spouseEmptyContext });
        }
        setShowSpouse(true);
      }

      if (dependents === "1") {
        if (dependentDetails.length > 0) {
          const generateDependencies = dependentDetails.map(
            (dependent: any) => {
              const {
                first_name,
                middle_name,
                last_name,
                dob,
                gender,
                relation,
                visa_type,
                visa_change_in_2022,
                citizenship_country,
                date_of_entry_for_us,
                identification_type,
                ssn_itin_number,
                itin_visa_number,
                passport_number,
                passport_expiry_date,
                foreign_home_address,
                date_of_change,
                to_visa,
                from_visa,
              } = dependent;

              return {
                firstName: first_name,
                middleName: middle_name,
                lastName: last_name,
                dob: dob ? dayjs(dob ? dob : "", "YYYY-MM-DD") : "",
                gender: gender,
                relation: relation,
                visaType: visa_type,
                changeInVisa2022: visa_change_in_2022,
                countryOfCitizenship: citizenship_country,
                dateOfEntryInUs: date_of_entry_for_us
                  ? dayjs(
                      date_of_entry_for_us ? date_of_entry_for_us : "",
                      "YYYY-MM-DD"
                    )
                  : "",
                identificationNumber: identification_type,
                ssnItinNumber: ssn_itin_number,
                itinnVisaNumber: itin_visa_number,
                passportNumber: passport_number,
                passportExpiryDate: passport_expiry_date
                  ? dayjs(
                      passport_expiry_date ? passport_expiry_date : "",
                      "YYYY-MM-DD"
                    )
                  : "",
                foreignHomeAddress: foreign_home_address
                  ? dayjs(
                      foreign_home_address ? foreign_home_address : "",
                      "YYYY-MM-DD"
                    )
                  : "",
                dateOfChange: date_of_change
                  ? dayjs(date_of_change, "YYYY-MM-DD")
                  : "",
                fromVisa: from_visa,
                toVisa: to_visa,
              };
            }
          );
          setDependencies([...generateDependencies]);
        } else {
          setDependencies([{ ...dependentEmptyContext }]);
        }
        setShowDependents(true);
      }

      if (country && state && city) {
        setDisableLocation(true);
      }

      if (localUserData) {
        setIsReadOnly(!localUserData?.leadEdit);
      }
    } else {
      if (leadData === null && location?.state) {
        form.setFieldsValue({
          email: location?.state?.email,
          mobile: location?.state?.phone_number,
          firstName: location?.state?.name,
        });
      }
    }
  }, [leadData]);

  return (
    <div>
      {isleadDetailsLoading ? (
        <Row gutter={gutterBlobal}>
          {new Array(24).fill("null").map((_: any, index: number) => (
            <Col className="gutter-row" xl={6} sm={12} xs={24} key={index}>
              <Skeleton
                shape="rectangle"
                styles={{ height: "20px", width: "150px" }}
              />
              <Skeleton shape="rectangle" />
            </Col>
          ))}
        </Row>
      ) : (
        <>
          <Form
            form={form}
            onFinish={onSubmitLead}
            onFinishFailed={() => {}}
            autoComplete="off"
            layout="vertical"
          >
            <Row gutter={gutterBlobal}>
              {filterFields.map((formItem: any, index: number) => (
                <Col className="gutter-row" xl={6} sm={12} xs={24} key={index}>
                  <GenerateElements elementData={formItem} />
                </Col>
              ))}
            </Row>
            {showSpouse && (
              <div className="showSpouse-details">
                <p className="showSpouse-details__title">Spouse Details</p>
                <hr />
                <Spouse
                  isReadOnly={isReadOnly}
                  spouse={spouseDetails}
                  onChangeSpouseDetails={onChangeSpouseDetails}
                  validateDependents={validateDependents}
                  setValidateDependents={setValidateDependents}
                />
              </div>
            )}
            {showDepenedents && (
              <div className="dependent-details">
                <p className="dependent-details__title">Dependent Details</p>
                <hr />
                {dependencies.map((dependent: any, index: number) => (
                  <Dependent
                    key={index}
                    isReadOnly={isReadOnly}
                    dependents={dependencies}
                    dependent={dependent}
                    addDependent={addDependent}
                    deleteDependent={deleteDependent}
                    onChangeDependent={onChangeDependent}
                    index={index}
                    validateDependents={validateDependents}
                    setValidateDependents={setValidateDependents}
                  />
                ))}
                <Row gutter={gutterBlobal} justify={"end"}>
                  <Button
                    className="add-dependent-btn green mx-2"
                    onClick={addDependent}
                    disabled={isReadOnly}
                  >
                    <PlusCircleOutlined />
                  </Button>
                </Row>
              </div>
            )}

            {sessionStorage.getItem("clonenewleadid") && (
              <Row justify={"end"}>
                <Col>
                  <Form.Item>
                    {" "}
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            )}

            {!isReadOnly && (
              <Row justify={"end"}>
                <Col>
                  <Form.Item>
                    {localUserData?.role == "3" &&
                      (leadData?.department_id == localUserData.departmentId ||
                        leadData === null ||
                        leadData?.assigned_agent == localUserData.userId) && (
                        <Button
                          type="primary"
                          htmlType="submit"
                          disabled={isLoading} // Disable the button while loading
                        >
                          {isLoading ? "Submitting..." : "Submit"}{" "}
                          {/* Show loading text when submitting */}
                        </Button>
                      )}
                    {false &&
                      localUserData &&
                      localUserData.departmentId !== 1 && (
                        <span className="mx-4">
                          <Checkbox
                            disabled={leadData ? false : true}
                            checked={
                              leadData &&
                              leadData?.personel_info_verified === "1"
                            }
                            onChange={submitVerifyStatus}
                          >
                            Verify
                          </Checkbox>
                          <Checkbox
                            disabled={leadData ? false : true}
                            onChange={() =>
                              dispatch(setSections("Personal Details"))
                            }
                          >
                            Comment
                          </Checkbox>
                        </span>
                      )}
                  </Form.Item>
                </Col>
              </Row>
            )}
          </Form>
        </>
      )}
    </div>
  );
}

export default GeneralInformation;

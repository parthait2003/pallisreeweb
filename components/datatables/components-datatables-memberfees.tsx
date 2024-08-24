"use client";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useEffect, useState, Fragment, useRef } from "react";
import sortBy from "lodash/sortBy";
import IconFile from "@/components/icon/icon-file";
import { Dialog, Transition } from "@headlessui/react";
import IconPlus from "@/components/icon/icon-plus";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import { useSelector } from "react-redux";
import { IRootState } from "@/store";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import IconXCircle from "@/components/icon/icon-x-circle";
import IconPencil from "@/components/icon/icon-pencil";
import Select from "react-select";

const MySwal = withReactContent(Swal);

const initialRowData = [
  {
    id: "989",
    billNo: 7500,
    member: "Caroline",
    date: "2004-05-28",
    monthsSelected: [{ month: "January", amount: 50 }],
    subscriptionType: [{ type: "Monthly", amount: 50 }],
    amount: "O+",
  },
];

const col = [
  "billNo",
  "id",
  "member",
  "year",
  "date",
  "monthsSelected",
  "subscriptionType",
  "amount",
];

const years = ["2024", "2025", "2026", "2027", "2028"];

const allMonthOptions = {
  "2024": [
    { value: "April", label: "April" },
    { value: "May", label: "May" },
    { value: "June", label: "June" },
    { value: "July", label: "July" },
    { value: "August", label: "August" },
    { value: "September", label: "September" },
    { value: "October", label: "October" },
    { value: "November", label: "November" },
    { value: "December", label: "December" },
  ],
  "2025": [
    { value: "January", label: "January" },
    { value: "February", label: "February" },
    { value: "March", label: "March" },
    { value: "April", label: "April" },
    { value: "May", label: "May" },
    { value: "June", label: "June" },
    { value: "July", label: "July" },
    { value: "August", label: "August" },
    { value: "September", label: "September" },
    { value: "October", label: "October" },
    { value: "November", label: "November" },
    { value: "December", label: "December" },
  ],
  "2026": [
    { value: "January", label: "January" },
    { value: "February", label: "February" },
    { value: "March", label: "March" },
    { value: "April", label: "April" },
    { value: "May", label: "May" },
    { value: "June", label: "June" },
    { value: "July", label: "July" },
    { value: "August", label: "August" },
    { value: "September", label: "September" },
    { value: "October", label: "October" },
    { value: "November", label: "November" },
    { value: "December", label: "December" },
  ],
  "2027": [
    { value: "January", label: "January" },
    { value: "February", label: "February" },
    { value: "March", label: "March" },
    { value: "April", label: "April" },
    { value: "May", label: "May" },
    { value: "June", label: "June" },
    { value: "July", label: "July" },
    { value: "August", label: "August" },
    { value: "September", label: "September" },
    { value: "October", label: "October" },
    { value: "November", label: "November" },
    { value: "December", label: "December" },
  ],
  "2028": [
    { value: "January", label: "January" },
    { value: "February", label: "February" },
    { value: "March", label: "March" },
    { value: "April", label: "April" },
    { value: "May", label: "May" },
    { value: "June", label: "June" },
    { value: "July", label: "July" },
    { value: "August", label: "August" },
    { value: "September", label: "September" },
    { value: "October", label: "October" },
    { value: "November", label: "November" },
    { value: "December", label: "December" },
  ],
};

const subscriptionOptions = [
  { value: "Admission fees", label: "Admission fees" },
  { value: "Development Fees", label: "Development Fees" },
  { value: "Donation", label: "Donation" },
  { value: "Concession", label: "Concession" },
  { value: "Discount", label: "Discount" },
  { value: "Misc.", label: "Misc." },
];

const ComponentsDatatablesMemberfees = () => {
  const currentYear = new Date().getFullYear().toString();
  const currentDate = new Date().toISOString().split("T")[0];
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === "rtl";
  const [modal1, setModal1] = useState(false);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [initialRecords, setInitialRecords] = useState(
    sortBy(initialRowData, "id")
  );
  const [recordsData, setRecordsData] = useState(initialRecords);
  const [customerData, setCustomerData] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [uamount, setUamount] = useState("");
  const [hiddenFileName, setHiddenFileName] = useState("");
  const [recordsDataSort, setRecordsDataSort] = useState("dsc");
  const [modal2, setModal2] = useState(false);
  const [editId, setEditId] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [memberData, setMemberData] = useState([]);
  const [monthOptions, setMonthOptions] = useState(allMonthOptions["2024"]);

  const [paymentType, setPaymentType] = useState("");
  const [transactionNo, setTransactionNo] = useState("");
  const [utrNo, setUtrNo] = useState("");

  const [settings, setSettings] = useState({
    regularmonthlyfee: 0,
    membershipfee: 0,
  });

  const newMemberAdded = () => {
    MySwal.fire({
      title: "New Fees has been added",
      toast: true,
      position: "bottom-start",
      showConfirmButton: false,
      timer: 5000,
      showCloseButton: true,
    });
  };

  const updatedSubscription = () => {
    MySwal.fire({
      title: "Fees has been updated",
      toast: true,
      position: "bottom-start",
      showConfirmButton: false,
      timer: 5000,
      showCloseButton: true,
    });
  };

  const deletedSubscription = () => {
    MySwal.fire({
      title: "Subscription has been deleted",
      toast: true,
      position: "bottom-start",
      showConfirmButton: false,
      timer: 5000,
      showCloseButton: true,
    });
  };

  interface Subscription {
    id: string;
    billNo: number;
    member: string;
    year: string;
    date: string;
    monthsSelected: { month: string; amount: number }[];
    subscriptionType: { type: string; amount: number }[];
    amount: string;
    paymentType: string;
    transactionNo: string;
    utrNo: string;
  }

  const handleDeleteClick = (value: any) => {
    setModal2(true);
    setDeleteId(value);
  };

  const fetchSubscriptionData = async () => {
    try {
      const response = await fetch("/api/membersubscription");
      if (!response.ok) {
        throw new Error("Failed to fetch fees data");
      }
      const data = await response.json();

      const formattedSubscription = data.subscriptions.map(
        (subscription: Subscription, index: number) => ({
          id: subscription._id,
          billNo: subscription.billNo,
          member: subscription.member,
          memberid: subscription.memberid,
          year: subscription.year,
          date: formatDate(subscription.date),
          monthsSelected: Array.isArray(subscription.monthsSelected)
            ? subscription.monthsSelected
            : [],
          subscriptionType: Array.isArray(subscription.subscriptionType)
            ? subscription.subscriptionType
            : [],
          amount: subscription.amount,
          paymentType: subscription.paymentType,
          transactionNo: subscription.transactionNo,
          utrNo: subscription.utrNo,
        })
      );

      const sortedRecords = formattedSubscription.sort(
        (a, b) => parseInt(b.billNo) - parseInt(a.billNo)
      );

      setInitialRecords(sortedRecords);
      setRecordsData(
        sortedRecords.slice((page - 1) * pageSize, page * pageSize)
      );
      setLoading(false);
      console.log("Fetched and sorted data by bill number:", sortedRecords);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  const fetchMembersData = async () => {
    try {
      const response = await fetch("/api/clubmember");
      if (!response.ok) {
        throw new Error("Failed to fetch member data");
      }
      const data = await response.json();
      console.log("Fetched member data:", data);

      const members = Array.isArray(data.clubmembers) ? data.clubmembers : [];
      setMemberData(members);
      console.log(members); // Added logging for members array
      const options = members.map((member) => ({
        value: member._id,
        label: `${member.name} - ${member.phoneno}`,
      }));
      console.log(options); // Added logging for options array
      setOptions(options);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  const fetchSettingsData = async () => {
    try {
      const response = await fetch("/api/settings");
      if (!response.ok) {
        throw new Error("Failed to fetch settings data");
      }
      const data = await response.json();
      setSettings({
        regularmonthlyfee: data.regularmonthlyfee,
        membershipfee: data.membershipfee,
      });
    } catch (error) {
      console.error("Error fetching settings data:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
    fetchMembersData();
    fetchSettingsData();
  }, []);

  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "id",
    direction: "desc",
  });

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecordsData([...initialRecords.slice(from, to)]);
  }, [page, pageSize, initialRecords]);

  useEffect(() => {
    const filteredRecords = initialRecords.filter((item: any) => {
      return (
        item.billNo.toString().includes(search) ||
        item.member.toLowerCase().includes(search.toLowerCase()) ||
        item.year.toString().includes(search.toLowerCase()) ||
        item.date.toString().includes(search.toLowerCase()) ||
        item.monthsSelected.some((month) =>
          month.month.toLowerCase().includes(search.toLowerCase())
        ) ||
        item.subscriptionType.some((type) =>
          type.type.toLowerCase().includes(search.toLowerCase())
        ) ||
        item.amount.toString().includes(search.toLowerCase()) ||
        item.paymentType.toLowerCase().includes(search.toLowerCase()) ||
        item.transactionNo.toLowerCase().includes(search.toLowerCase()) ||
        item.utrNo.toLowerCase().includes(search.toLowerCase())
      );
    });

    setRecordsData(
      filteredRecords.slice((page - 1) * pageSize, page * pageSize)
    );
  }, [search, initialRecords, page, pageSize]);

  const handleAddCustomerClick = (e: any) => {
    e.stopPropagation();
    setShowAddCustomer(!showAddCustomer);
  };

  useEffect(() => {
    const sortedData = sortBy(initialRecords, sortStatus.columnAccessor);
    const finalData =
      sortStatus.direction === "desc" ? sortedData.reverse() : sortedData;
    setRecordsData(finalData.slice((page - 1) * pageSize, page * pageSize));
  }, [sortStatus, page, pageSize, initialRecords]);

  const formatDate = (date: string) => {
    if (date) {
      const dt = new Date(date);
      const day = dt.getDate() < 10 ? "0" + dt.getDate() : dt.getDate();
      const month =
        dt.getMonth() + 1 < 10 ? "0" + (dt.getMonth() + 1) : dt.getMonth() + 1;
      return `${day}/${month}/${dt.getFullYear()}`;
    }
    return "";
  };

  const handleDeleteData = async () => {
    setModal2(false);

    const resdel = await fetch(`/api/membersubscription/${deleteId}`, {
      method: "GET",
    });
    if (!resdel.ok) {
      throw new Error(`Failed to fetch data for ID: ${deleteId}`);
    }
    const data = await resdel.json();

    const reportData2 = {
      date: data.subscription.date,
      expense: parseFloat(data.subscription.amount),
    };

    await fetch("/api/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reportData2),
    });

    const res = await fetch(`/api/membersubscription/${deleteId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      fetchSubscriptionData();
      deletedSubscription();
    }
  };

  const getFirstName = (label: string) => label.split(" - ")[0];

  const getCustomerVal = () => {
    const currentFormattedDate = formatDate(new Date().toISOString());

    setEditId("");
    setFiles([]);
    setFormData({
      id: "",
      billNo: getNextBillNo(),
      member: "",
      year: currentYear,
      date: currentFormattedDate,
      monthsSelected: [],
      subscriptionType: [],
      amount: "",
      paymentType: "",
      transactionNo: "",
      utrNo: "",
    });
    setPaymentType("");
    setTransactionNo("");
    setUtrNo("");
    setModal1(true);
  };

  const getNextBillNo = () => {
    const maxBillNo = Math.max(
      ...initialRecords.map((record) => record.billNo),
      100008
    );
    return maxBillNo + 1;
  };

  const handleDateChange = (date: any) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      date: date[0] ? formatDate(date[0]) : "",
    }));
  };

  const exportTable = (type: any) => {
    let columns: any = col;
    let records = initialRecords;
    let filename = "table";

    let newVariable: any;
    newVariable = window.navigator;

    if (type === "csv") {
      let coldelimiter = ";";
      let linedelimiter = "\n";
      let result = columns
        .map((d: any) => {
          return capitalize(d);
        })
        .join(coldelimiter);
      result += linedelimiter;
      records.map((item: any) => {
        columns.map((d: any, index: any) => {
          if (index > 0) {
            result += coldelimiter;
          }
          let val = item[d] ? item[d] : "";
          result += val;
        });
        result += linedelimiter;
      });

      if (result == null) return;
      if (!result.match(/^data:text\/csv/i) && !newVariable.msSaveOrOpenBlob) {
        var data =
          "data:application/csv;charset=utf-8," + encodeURIComponent(result);
        var link = document.createElement("a");
        link.setAttribute("href", data);
        link.setAttribute("download", filename + ".csv");
        link.click();
      } else {
        var blob = new Blob([result]);
        if (newVariable.msSaveOrOpenBlob) {
          newVariable.msSaveBlob(blob, filename + ".csv");
        }
      }
    } else if (type === "print") {
      var rowhtml = "<p>" + filename + "</p>";
      rowhtml +=
        '<table style="width: 100%; " cellpadding="0" cellcpacing="0"><thead><tr style="color: #515365; background: #eff5ff; -webkit-print-color-adjust: exact; print-color-adjust: exact; "> ';
      columns.map((d: any) => {
        rowhtml += "<th>" + capitalize(d) + "</th>";
      });
      rowhtml += "</tr></thead>";
      rowhtml += "<tbody>";
      records.map((item: any) => {
        rowhtml += "<tr>";
        columns.map((d: any) => {
          let val = item[d] ? item[d] : "";
          rowhtml += "<td>" + val + "</td>";
        });
        rowhtml += "</tr>";
      });
      rowhtml +=
        "<style>body {font-family:Arial; color:#495057;}p{text-align:center;font-size:18px;font-weight:bold;margin:15px;}table{ border-collapse: collapse; border-spacing: 0; }th,td{font-size:12px;text-align:left;padding: 4px;}th{padding:8px 4px;}tr:nth-child(2n-1){background:#f7f7f7; }</style>";
      rowhtml += "</tbody></table>";
      var winPrint: any = window.open(
        "",
        "",
        "left=0,top=0,width=1000,height=600,toolbar=0,scrollbars=0,status=0"
      );
      winPrint.document.write("<title>Print</title>" + rowhtml);
      winPrint.document.close();
      winPrint.focus();
      winPrint.print();
    } else if (type === "txt") {
      let coldelimiter = ",";
      let linedelimiter = "\n";
      let result = columns
        .map((d: any) => {
          return capitalize(d);
        })
        .join(coldelimiter);
      result += linedelimiter;
      records.map((item: any) => {
        columns.map((d: any, index: any) => {
          if (index > 0) {
            result += coldelimiter;
          }
          let val = item[d] ? item[d] : "";
          result += val;
        });
        result += linedelimiter;
      });

      if (result == null) return;
      if (!result.match(/^data:text\/txt/i) && !newVariable.msSaveOrOpenBlob) {
        var data1 =
          "data:application/txt;charset=utf-8," + encodeURIComponent(result);
        var link1 = document.createElement("a");
        link1.setAttribute("href", data1);
        link1.setAttribute("download", filename + ".txt");
        link1.click();
      } else {
        var blob1 = new Blob([result]);
        if (newVariable.msSaveOrOpenBlob) {
          newVariable.msSaveBlob(blob1, filename + ".txt");
        }
      }
    }
  };

  const capitalize = (text: any) => {
    return text
      .replace(/_/g, " ")
      .replace(/-/g, " ")
      .toLowerCase()
      .split(" ")
      .map((s: any) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(" ");
  };

  const [formData, setFormData] = useState({
    id: "",
    billNo: "",
    member: "",
    memberid: "",
    year: currentYear,
    date: formatDate(new Date()),
    monthsSelected: [],
    subscriptionType: [],
    amount: "",
    paymentType: "",
    transactionNo: "",
    utrNo: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "year") {
      setMonthOptions(allMonthOptions[value]);
    }

    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));
  };

  const handleMonthAmountChange = (index: number, value: string) => {
    const updatedMonths = [...formData.monthsSelected];
    updatedMonths[index].amount = value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      monthsSelected: updatedMonths,
    }));
  };

  const handleTypeAmountChange = (index: number, value: string) => {
    const updatedTypes = [...formData.subscriptionType];
    updatedTypes[index].amount = value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      subscriptionType: updatedTypes,
    }));
  };

  const handleMonthsSelectedChange = (selectedOptions: any) => {
    const selectedValues = selectedOptions
      ? selectedOptions.map((option: any) => ({
          month: option.value,
          amount: settings.membershipfee, // Using membershipfee instead of regularmonthlyfee
        }))
      : [];
    setFormData((prevFormData) => ({
      ...prevFormData,
      monthsSelected: selectedValues,
    }));
  };

  const handleSubscriptionChange = (selectedOptions: any) => {
    const selectedValues = selectedOptions
      ? selectedOptions.map((option: any) => {
          const amount =
            option.value === "Concession"
              ? -settings.membershipfee
              : settings.membershipfee;
          return { type: option.value, amount };
        })
      : [];
    setFormData((prevFormData) => ({
      ...prevFormData,
      subscriptionType: selectedValues,
    }));
  };

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      id: editId,
    }));
  }, [editId]);

  useEffect(() => {
    const calculateTotalAmount = () => {
      const totalMonthAmount = formData.monthsSelected.reduce(
        (total, month) => total + parseFloat(month.amount || 0),
        0
      );
      const totalTypeAmount = formData.subscriptionType.reduce(
        (total, type) => total + parseFloat(type.amount || 0),
        0
      );
      return totalMonthAmount + totalTypeAmount;
    };
    setFormData((prevFormData) => ({
      ...prevFormData,
      amount: calculateTotalAmount(),
    }));
  }, [formData.monthsSelected, formData.subscriptionType]);

  const handleFormSubmit = async (event: any) => {
    event.preventDefault();

    const hasValidAmount =
      formData.monthsSelected.some((month) => month.amount > 0) ||
      formData.subscriptionType.some((type) => type.amount > 0);

    if (!hasValidAmount) {
      alert("Please select at least one of the Monthly Fees or Other Fees");
      return;
    }

    const formattedFormData = {
      ...formData,
      date: formData.date ? formData.date.split("/").reverse().join("-") : "",
      member: customerName,
      memberid: customerId,
      paymentType,
      transactionNo,
      utrNo,
    };

    const reportData = {
      date: formattedFormData.date,
      income: parseFloat(formattedFormData.amount),
      expense: 0,
      noOfNewTraineeCricket: 0,
      noOfNewTraineeFootball: 0,
      noOfNewClubMember: 0,
      profitAndLoss: parseFloat(formattedFormData.amount),
    };

    if (!editId) {
      try {
        const res = await fetch("/api/membersubscription", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(formattedFormData),
        });

        if (res.ok) {
          newMemberAdded();
          fetchSubscriptionData();
          setModal1(false);

          await fetch("/api/reports", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(reportData),
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        console.log("new amount" + formattedFormData.amount);
        console.log("old amount" + uamount);
        var newamout = formattedFormData.amount - uamount;
        console.log("change amount" + newamout);
        console.log("change date" + formattedFormData.date);

        const reportData1 = {
          date: formattedFormData.date,
          income: parseFloat(newamout),
        };

        await fetch("/api/reports", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reportData1),
        });

        const url = `/api/membersubscription/${editId}`;

        const res = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(formattedFormData),
        });

        if (!res.ok) {
          throw new Error("failed to update fees");
        }
        if (res.ok) {
          setModal1(false);
          fetchSubscriptionData();
          updatedSubscription();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleUpdateClick = async (value: any) => {
    try {
      console.log("Fetching data for ID:", value);
      const res = await fetch(`/api/membersubscription/${value}`, {
        method: "GET",
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch data for ID: ${value}`);
      }
      const data = await res.json();
      console.log("Fetched data:", data);

      setUamount(data.subscription.amount);

      // Find the corresponding member
      const memberOption = options.find(
        (option) => option.label.split(" - ")[0] === data.subscription.member
      );

      // Get the selected months from the database
      const selectedMonths = data.subscription.monthsSelected.map(
        (month) => month.month
      );

      // Filter out selected months from monthOptions
      const filteredMonthOptions = allMonthOptions[
        data.subscription.year
      ].filter((option) => !selectedMonths.includes(option.value));

      setFormData({
        ...data.subscription,
        member: memberOption ? memberOption.value : "",
        billNo: data.subscription.billNo,
        monthsSelected: Array.isArray(data.subscription.monthsSelected)
          ? data.subscription.monthsSelected
          : [],
        subscriptionType: Array.isArray(data.subscription.subscriptionType)
          ? data.subscription.subscriptionType
          : [],
        date: formatDate(data.subscription.date),
      });

      setMonthOptions(filteredMonthOptions);
      setEditId(data.subscription._id);
      setPaymentType(data.subscription.paymentType || "");
      setTransactionNo(data.subscription.transactionNo || "");
      setUtrNo(data.subscription.utrNo || "");
      setModal1(true);
      if (res.ok) {
        fetchSubscriptionData();
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  // Helper function to filter month options based on joining date and existing subscriptions
  const filterMonthOptions = (
    joiningDate: string,
    monthOptions: any,
    subscriptions: Subscription[]
  ) => {
    const joinDate = new Date(joiningDate);
    const joinYear = joinDate.getFullYear();
    const joinMonth = joinDate.getMonth() + 1; // JavaScript months are 0-based, so add 1
    console.log("joinDate" + joinMonth);
    const existingMonths = subscriptions
      .filter(
        (subscription) =>
          subscription.memberid === customerId &&
          subscription.year === formData.year
      )
      .flatMap((subscription) =>
        subscription.monthsSelected.map((m) => m.month)
      );

    return monthOptions.filter((option: any) => {
      const monthIndex =
        new Date(`${option.label} 1, ${joinYear}`).getMonth() + 1;
      return monthIndex >= joinMonth && !existingMonths.includes(option.label);
    });
  };

  // Update useEffect to filter month options based on joining date and existing subscriptions
  useEffect(() => {
    if (customerId) {
      const selectedMember = memberData.find(
        (member) => member._id === customerId
      );
      if (selectedMember && selectedMember.joiningdate) {
        const filteredOptions = filterMonthOptions(
          selectedMember.joiningdate,
          allMonthOptions[formData.year],
          initialRecords // Pass the subscriptions to the filter function
        );
        setMonthOptions(filteredOptions);
      }
    }
  }, [customerId, formData.year, initialRecords]);

  const generatePdf = async (row) => {
    const doc = new jsPDF();

    const loadImage = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
      });
    };

    try {
      const logoUrl = "/assets/images/logo.png";
      const logoImg = await loadImage(logoUrl);

      const renderContent = (startY) => {
        doc.addImage(logoImg, "PNG", 10, startY, 20, 20);
        doc.setFontSize(12);
        doc.text(`Bill No: ${row.billNo}`, 200 - 10, startY + 10, {
          align: "right",
        });
        doc.text(`Date: ${row.date}`, 200 - 10, startY + 15, {
          align: "right",
        });

        doc.setFontSize(22);
        doc.text("PALLISREE", 105, startY + 10, { align: "center" });

        doc.setFontSize(10);
        const additionalText = `ESTD: 1946\nRegd. Under Societies Act. XXVI of 1961 • Regd. No. S/5614\nAffiliated to North 24 Parganas District Sports Association through BBSZSA\nBIDHANPALLY • MADHYAMGRAM • KOLKATA - 700129`;
        doc.text(additionalText, 105, startY + 18, { align: "center" });

        doc.setFontSize(12);
        doc.text(`Name: ${row.member}`, 15, startY + 50);

        const tableRows = [
          ["Monthly Fees", row.year, ""],
          ...row.monthsSelected.map((month) => [month.month, "", month.amount]),
        ];

        if (row.subscriptionType.some((type) => type.amount)) {
          tableRows.push(["Other", row.year, ""]);
          tableRows.push(
            ...row.subscriptionType
              .filter((type) => type.amount)
              .map((type) => [type.type, "", type.amount])
          );
        }

        autoTable(doc, {
          startY: startY + 55,
          head: [["Description", "Year", "Amount"]],
          body: tableRows,
          theme: "grid",
          headStyles: { fillColor: [0, 0, 139] },
          columnStyles: { 2: { halign: "right" } },
          styles: { fontSize: 10 },
          alternateRowStyles: { fillColor: [240, 240, 240] },
        });

        const totalAmount =
          row.monthsSelected.reduce(
            (total, month) => total + parseFloat(month.amount || 0),
            0
          ) +
          row.subscriptionType.reduce(
            (total, type) => total + parseFloat(type.amount || 0),
            0
          );

        const totalAmountStartY = doc.autoTable.previous.finalY + 2;
        doc.setFontSize(12);
        doc.text("Total Amount", 15, totalAmountStartY + 8);
        doc.text(`Rs. ${totalAmount} INR`, 200 - 15, totalAmountStartY + 8, {
          align: "right",
        });

        doc.line(10, totalAmountStartY, 200, totalAmountStartY);
        doc.line(10, totalAmountStartY + 12, 200, totalAmountStartY + 12);

        doc.setFontSize(10);
        doc.setFont("italic");
        let paymentDetails = `Payment Type: ${row.paymentType}`;
        if (row.paymentType === "upi") {
          if (row.transactionNo) {
            paymentDetails += `, Transaction No: ${row.transactionNo}`;
          }
          if (row.utrNo) {
            paymentDetails += `, UTR No: ${row.utrNo}`;
          }
        }
        doc.text(paymentDetails, 15, totalAmountStartY + 20);

        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(12);
        doc.text("Collector", 10, pageHeight - 10, { align: "left" });
        doc.text("General Secretary", 200 - 10, pageHeight - 10, {
          align: "right",
        });
      };

      renderContent(10);
      renderContent(140);

      doc.save(`subscription_${row.member}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="panel mt-6">
      <h5 className="mb-5 text-lg font-semibold dark:text-white-light">
        Member Fees
      </h5>

      <div className="mb-4.5 flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div className="flex flex-wrap items-center">
          <div className="mb-5">
            <div className="flex items-center justify-center"></div>
            <Transition appear show={modal1} as={Fragment}>
              <Dialog as="div" open={modal1} onClose={() => setModal1(false)}>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0" />
                </Transition.Child>
                <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                  <div className="flex min-h-screen items-start justify-center px-4">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <Dialog.Panel
                        as="div"
                        className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark"
                      >
                        <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                          <div className="text-lg font-bold">
                            {editId ? "Update Fees" : "Add Fees"}
                          </div>
                          <button
                            type="button"
                            className="text-white-dark hover:text-dark"
                            onClick={() => setModal1(false)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                            >
                              <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" />
                            </svg>
                          </button>
                        </div>
                        <div className="p-5">
                          <div className="mb-5">
                            <form
                              className="space-y-5"
                              onSubmit={handleFormSubmit}
                            >
                              <div>
                                <label htmlFor="billNo">Bill No</label>
                                <input
                                  id="billNo"
                                  type="text"
                                  name="billNo"
                                  placeholder="Enter Bill No"
                                  onChange={handleChange}
                                  className="form-input"
                                  value={formData.billNo}
                                  required
                                />
                              </div>
                              <div>
                                <label htmlFor="member">Member</label>
                                <div>
                                  <Select
                                    placeholder="Select an option"
                                    options={options}
                                    value={
                                      formData.member
                                        ? options.find(
                                            (option) =>
                                              option.value === formData.member
                                          )
                                        : null
                                    }
                                    required
                                    onChange={(t) => {
                                      const memberName = getFirstName(t.label);
                                      setCustomerName(memberName);
                                      console.log(t.value);
                                      setCustomerId(t.value);
                                      setFormData((prevFormData) => ({
                                        ...prevFormData,
                                        member: t.value,
                                      }));
                                    }}
                                  />
                                </div>
                              </div>
                              <div>
                                <label htmlFor="year">Year</label>
                                <select
                                  id="year"
                                  name="year"
                                  className="form-select"
                                  onChange={handleChange}
                                  value={formData.year}
                                  required
                                >
                                  <option value="">Select Year</option>
                                  {years.map((year) => (
                                    <option key={year} value={year}>
                                      {year}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label htmlFor="date">Date</label>
                                <Flatpickr
                                  id="date"
                                  value={formData.date}
                                  required
                                  options={{
                                    dateFormat: "d/m/Y",
                                    defaultDate: formData.date,
                                    position: isRtl
                                      ? "auto right"
                                      : "auto left",
                                  }}
                                  className="form-input"
                                  onChange={handleDateChange}
                                />
                              </div>
                              <div>
                                <label htmlFor="monthsSelected">
                                  Regular Monthly
                                </label>
                                <Select
                                  id="monthsSelected"
                                  name="monthsSelected"
                                  options={monthOptions}
                                  isMulti
                                  onChange={handleMonthsSelectedChange}
                                  value={formData.monthsSelected.map(
                                    (month) => ({
                                      value: month.month,
                                      label: month.month,
                                    })
                                  )}
                                  className="form-select"
                                />
                                {formData.monthsSelected.map((month, index) => (
                                  <div key={index}>
                                    <label htmlFor={`monthAmount-${index}`}>
                                      {month.month} Amount
                                    </label>
                                    <input
                                      id={`monthAmount-${index}`}
                                      type="number"
                                      name={`monthAmount-${index}`}
                                      placeholder="Enter amount"
                                      onChange={(e) =>
                                        handleMonthAmountChange(
                                          index,
                                          e.target.value
                                        )
                                      }
                                      className="form-input"
                                      value={month.amount}
                                    />
                                  </div>
                                ))}
                              </div>
                              <div>
                                <label htmlFor="subscriptionType">Other </label>
                                <Select
                                  id="subscriptionType"
                                  name="subscriptionType"
                                  options={subscriptionOptions}
                                  isMulti
                                  onChange={handleSubscriptionChange}
                                  value={formData.subscriptionType.map(
                                    (type) => ({
                                      value: type.type,
                                      label: type.type,
                                    })
                                  )}
                                  className="form-select"
                                />
                                {formData.subscriptionType.map(
                                  (type, index) => (
                                    <div key={index}>
                                      <label htmlFor={`typeAmount-${index}`}>
                                        {type.type} Amount
                                      </label>
                                      <input
                                        id={`typeAmount-${index}`}
                                        type="number"
                                        name={`typeAmount-${index}`}
                                        placeholder="Enter amount"
                                        onChange={(e) =>
                                          handleTypeAmountChange(
                                            index,
                                            e.target.value
                                          )
                                        }
                                        className="form-input"
                                        value={type.amount}
                                      />
                                    </div>
                                  )
                                )}
                              </div>
                              <div>
                                <label htmlFor="paymentType">
                                  Payment Type
                                </label>
                                <select
                                  required
                                  id="paymentType"
                                  name="paymentType"
                                  className="form-select"
                                  onChange={(e) =>
                                    setPaymentType(e.target.value)
                                  }
                                  value={paymentType}
                                >
                                  <option value="">Select Payment Type</option>
                                  <option value="cash">Cash</option>
                                  <option value="upi">UPI</option>
                                </select>
                              </div>

                              {paymentType === "upi" && (
                                <div>
                                  <label htmlFor="transactionNo">
                                    Transaction No
                                  </label>
                                  <input
                                    id="transactionNo"
                                    type="text"
                                    name="transactionNo"
                                    className="form-input"
                                    onChange={(e) => {
                                      setTransactionNo(e.target.value);
                                    }}
                                    value={transactionNo}
                                  />
                                </div>
                              )}

                              {paymentType === "upi" && (
                                <div>
                                  <label htmlFor="utrNo">UTR No</label>
                                  <input
                                    id="utrNo"
                                    type="text"
                                    name="utrNo"
                                    className="form-input"
                                    onChange={(e) => setUtrNo(e.target.value)}
                                    value={utrNo}
                                  />
                                </div>
                              )}

                              <div>
                                <label htmlFor="amount">Total Amount</label>
                                <input
                                  id="amount"
                                  type="text"
                                  name="amount"
                                  placeholder="Enter amount"
                                  onChange={handleChange}
                                  className="form-input"
                                  value={formData.amount}
                                  readOnly
                                />
                              </div>
                              <button
                                type="submit"
                                className="btn btn-primary !mt-6"
                              >
                                Submit
                              </button>
                            </form>
                          </div>
                        </div>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition>
          </div>
          <button
            type="button"
            className="btn btn-primary my-5"
            onClick={() => getCustomerVal()}
          >
            <IconPlus className="ltr:mr-2 rtl:ml-2" />
            Fees
          </button>
          <button
            type="button"
            onClick={() => exportTable("csv")}
            className="btn btn-primary btn-sm m-1 "
          >
            <IconFile className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
            CSV
          </button>
        </div>

        <input
          type="text"
          className="form-input w-auto"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="datatables">
        <DataTable
          highlightOnHover
          className="table-hover whitespace-nowrap"
          records={recordsData}
          columns={[
            { accessor: "billNo", title: "Bill No", sortable: true },
            { accessor: "member", sortable: true },
            { accessor: "year", sortable: true },
            { accessor: "date", sortable: true },
            {
              accessor: "monthsSelected",
              title: "Monthly Fees",
              sortable: true,
              render: ({ monthsSelected }) =>
                monthsSelected
                  .map((month) => `${month.month}: ${month.amount}`)
                  .join(", "),
            },
            {
              accessor: "subscriptionType",
              title: "Other",
              sortable: true,
              render: ({ subscriptionType }) =>
                subscriptionType
                  .map((type) => `${type.type}: ${type.amount}`)
                  .join(", "),
            },
            { accessor: "amount", sortable: true },
            {
              accessor: "paymentType",
              title: "Payment Type",
              sortable: true,
            },
            {
              accessor: "transactionNo",
              title: "Transaction No",
              sortable: true,
            },
            {
              accessor: "utrNo",
              title: "UTR No",
              sortable: true,
            },
            {
              accessor: "action",
              title: "Action",
              titleClassName: "!text-center",
              render: (row) => (
                <div className="mx-auto flex w-max items-center gap-4">
                  <Tippy content="Edit Fees">
                    <button
                      type="button"
                      onClick={() => handleUpdateClick(row.id)}
                      className="btn btn-primary bg-primary"
                    >
                      <IconPencil />
                    </button>
                  </Tippy>

                  <Tippy content="Delete Fees">
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(row.id)}
                      className="btn btn-primary bg-red-500"
                    >
                      <IconXCircle />
                    </button>
                  </Tippy>

                  <Tippy content="Download PDF">
                    <button
                      type="button"
                      onClick={() => generatePdf(row)}
                      className="btn btn-primary bg-blue-500"
                    >
                      <IconFile />
                    </button>
                  </Tippy>
                </div>
              ),
            },
          ]}
          totalRecords={initialRecords.length}
          recordsPerPage={pageSize}
          page={page}
          onPageChange={(p) => setPage(p)}
          recordsPerPageOptions={PAGE_SIZES}
          onRecordsPerPageChange={setPageSize}
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
          minHeight={200}
          paginationText={({ from, to, totalRecords }) =>
            `Showing ${from} to ${to} of ${totalRecords} entries`
          }
        />
      </div>

      <Transition appear show={modal2} as={Fragment}>
        <Dialog as="div" open={modal2} onClose={() => setModal2(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0" />
          </Transition.Child>
          <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
            <div className="flex min-h-screen items-center justify-center px-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  as="div"
                  className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark"
                >
                  <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                    <h5 className="text-lg font-bold">Delete</h5>
                    <button
                      type="button"
                      className="text-white-dark hover:text-dark"
                      onClick={() => setModal2(false)}
                    ></button>
                  </div>
                  <div className="p-5">
                    <p>Do you want to delete this Fees?</p>
                    <div className="mt-8 flex items-center justify-end">
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => setModal2(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary ltr:ml-4 rtl:mr-4"
                        onClick={handleDeleteData}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default ComponentsDatatablesMemberfees;

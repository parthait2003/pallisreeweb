"use client";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useEffect, useState, Fragment, useRef } from "react";
import sortBy from "lodash/sortBy";
import IconFile from "@/components/icon/icon-file";
import { Dialog, Transition } from "@headlessui/react";
import IconPlus from "../icon/icon-plus";
import IconXCircle from "@/components/icon/icon-x-circle";
import IconPencil from "@/components/icon/icon-pencil";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import { useSelector } from "react-redux";
import { IRootState } from "@/store";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const MySwal = withReactContent(Swal);

const showMessage8 = () => {
  MySwal.fire({
    title: "You can upload only one file or remove last uploaded file",
    toast: true,
    position: "bottom-start",
    showConfirmButton: false,
    timer: 5000,
    showCloseButton: true,
  });
};

const initialRowData = [
  {
    id: "989",
    billNo: "1001",
    year: "2024",
    staffName: "John Doe",
    description: "guygipgilgyi",
    date: "2004-05-28",
    amount: "100",
    document: "otyhjklrdt",
    things: [
      { name: "Thing1", amount: "50" },
      { name: "Thing2", amount: "50" },
    ],
    months: [
      { month: "January", amount: "50" },
      { month: "February", amount: "50" },
    ],
  },
];

const col = [
  "id",
  "billNo",
  "year",
  "staffName",
  "months",
  "date",
  "things",
  "amount",
];

const formatDate = (date) => {
  if (date) {
    const dt = new Date(date);
    const month =
      dt.getMonth() + 1 < 10 ? "0" + (dt.getMonth() + 1) : dt.getMonth() + 1;
    const day = dt.getDate() < 10 ? "0" + dt.getDate() : dt.getDate();
    return day + "/" + month + "/" + dt.getFullYear();
  }
  return "";
};

const ComponentsDatatablesStaff = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === "rtl";
  const [date1, setDate1] = useState<any>("2022-07-05");

  const [modal1, setModal1] = useState(false);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [page, setPage] = useState(1);
  const [documentfile, setDocumentFile] = useState(null);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [initialRecords, setInitialRecords] = useState(
    sortBy(initialRowData, "id")
  );
  const [uamount, setUamount] = useState("");
  const [recordsData, setRecordsData] = useState(initialRecords);
  const [customerData, setCustomerData] = useState([]);
  const [cutomerid, setcutomerid] = useState("");
  const [cutomerName, setcutomerName] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [hiddenFileName, setHiddenFileName] = useState("");
  const [recordsDatasort, setRecordsDatashort] = useState("dsc");
  const [modal2, setModal2] = useState(false);
  const [editid, setEditid] = useState("");
  const [deleteid, setDeleteid] = useState("");
  const [traineeData, setTraineeData] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [monthsSelected, setMonthsSelected] = useState([]);
  const [monthAmounts, setMonthAmounts] = useState({});
  const [formData, setFormData] = useState({
    id: "",
    billNo: "",
    year: "2024",
    staffName: "",
    date: formatDate(new Date()),
    amount: "",
    document: "",
    things: [{ name: "", amount: "" }],
    monthsSelected: [],
    otherCoach: "",
  });
  const [filteredMonths, setFilteredMonths] = useState([]);
  const allMonths = [
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
  ];

  const fetchCoachesData = async () => {
    try {
      const response = await fetch("/api/settings");
      if (!response.ok) {
        throw new Error("Failed to fetch settings data");
      }
      const data = await response.json();
      const formattedCoaches = data.couches.map((coach) => ({
        value: coach._id,
        label: coach.name,
      }));
      formattedCoaches.push({ value: "other", label: "Other" });
      setCoaches(formattedCoaches);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchCoachesData();
  }, []);

  useEffect(() => {
    filterMonths();
  }, [formData.year]);

  const filterMonths = async (selectedStaff = formData.staffName) => {
    let months = allMonths;

    if (formData.year === "2024") {
      months = allMonths.slice(3);
    }

    if (selectedStaff) {
      try {
        const response = await fetch(
          `/api/staffpayment?staff=${selectedStaff}&year=${formData.year}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch existing months for the staff");
        }
        const data = await response.json();
        const existingMonths = data.expenditures.flatMap((expenditure) =>
          expenditure.months.map((m) => m.month)
        );

        months = months.filter(
          (month) => !existingMonths.includes(month.value)
        );
      } catch (error) {
        console.error(error);
        setError(error.message);
      }
    }

    setFilteredMonths(months);
  };

  const handleDocumentChange = (e) => {
    setDocumentFile(e.target.files[0]);
  };

  const newExpenditureadded = () => {
    MySwal.fire({
      title: "New Expenditure has been added",
      toast: true,
      position: "bottom-start",
      showConfirmButton: false,
      timer: 5000,
      showCloseButton: true,
    });
  };

  const updatedExpenditure = () => {
    MySwal.fire({
      title: "Expenditure has been updated",
      toast: true,
      position: "bottom-start",
      showConfirmButton: false,
      timer: 5000,
      showCloseButton: true,
    });
  };

  const deletedexpenditure = () => {
    MySwal.fire({
      title: "Expenditure has been deleted",
      toast: true,
      position: "bottom-start",
      showConfirmButton: false,
      timer: 5000,
      showCloseButton: true,
    });
  };

  interface Expenditure {
    id: string;
    billNo: string;
    year: string;
    staffName: string;
    description: string;
    date: string;
    amount: string;
    document: string;
    things: { name: string; amount: string }[];
    months: string[];
  }

  const handleDeleteClick = (value: any) => {
    setModal2(true);
    setDeleteid(value);
  };

  const fetchExpenditureData = async () => {
    try {
      const response = await fetch("/api/staffpayment");
      if (!response.ok) {
        throw new Error("Failed to fetch expenditure data");
      }
      const data = await response.json();

      const formattedExpenditure = data.expenditures.map(
        (expenditure: Expenditure) => ({
          id: expenditure._id,
          billNo: expenditure.billNo,
          year: expenditure.year,
          staffName: expenditure.staffName,
          description: expenditure.description,
          things: Array.isArray(expenditure.things)
            ? expenditure.things
                .map((thing) => `${thing.name}: ${thing.amount}`)
                .join(", ")
            : "",
          date: formatDate(expenditure.date),
          amount: expenditure.amount,
          document: expenditure.document,
          months: expenditure.months,
        })
      );

      setInitialRecords(formattedExpenditure);
      setRecordsData(
        formattedExpenditure.slice((page - 1) * pageSize, page * pageSize)
      );
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchExpenditureData();
  }, []);

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "_id",
    direction: "desc",
  });

  const handleDeleteData = async () => {
    const resdel = await fetch(`/api/staffpayment/${deleteid}`, {
      method: "GET",
    });
    if (!resdel.ok) {
      throw new Error(`Failed to fetch data for ID: ${deleteid}`);
    }
    const data = await resdel.json();
    const reportData2 = {
      date: data.expenditure.date,
      income: parseFloat(data.expenditure.amount),
    };

    await fetch("/api/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reportData2),
    });

    setModal2(false);

    const res = await fetch(`/api/staffpayment/${deleteid}`, {
      method: "DELETE",
    });

    if (res.ok) {
      fetchExpenditureData();
      deletedexpenditure();
    }
  };

  const getNextBillNumber = (records) => {
    if (records.length === 0) {
      return 100009;
    }
    const maxBillNo = Math.max(
      ...records.map((record) => parseInt(record.billNo))
    );
    return maxBillNo + 1;
  };

  const getcustomeval = () => {
    const nextBillNo = getNextBillNumber(initialRecords);
    setEditid("");
    setFiles([]);
    setMonthsSelected([]);
    setFormData({
      id: "",
      billNo: nextBillNo.toString(),
      year: "2024",
      staffName: "",
      date: formatDate(new Date()),
      amount: "",
      document: "",
      things: [{ name: "", amount: "" }],
      monthsSelected: [],
      otherCoach: "",
    });
    const options = customerData.map((customer) => ({
      value: customer._id,
      label: `${customer.firstName} ${
        customer.middleName ? customer.middleName + " " : ""
      }${customer.lastName} - ${customer.mobile}`,
    }));
    setOptions(options);
    setMonthAmounts({});
    setModal1(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files[0]);

    const selectedFiles = e.target.files;
    const newFiles = Array.from(selectedFiles!);

    if (files.length + newFiles.length > 1) {
      showMessage8();
    } else {
      setFiles([...files, ...newFiles]);
      setHiddenFileName(newFiles[0].name);
    }
  };

  const handleDateChange = (date: any) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      date: date[0] ? formatDate(date[0]) : "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const isMonthAmount = name.startsWith("amount-");

    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));

    if (isMonthAmount) {
      const month = name.replace("amount-", "");
      setMonthAmounts((prevMonthAmounts) => ({
        ...prevMonthAmounts,
        [month]: parseFloat(value) || 0,
      }));
    }
  };

  const handleMonthsSelectedChange = (selectedOptions) => {
    const selectedValues = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setMonthsSelected(selectedValues);
    setFormData((prevFormData) => ({
      ...prevFormData,
      monthsSelected: selectedValues,
    }));
    setMonthAmounts(
      selectedValues.reduce((acc, month) => {
        acc[month] = 0;
        return acc;
      }, {})
    );
  };

  const handleMonthAmountChange = (month, value) => {
    setMonthAmounts((prevMonthAmounts) => ({
      ...prevMonthAmounts,
      [month]: parseFloat(value) || 0,
    }));
  };

  useEffect(() => {
    const totalAmount =
      Object.values(monthAmounts).reduce((sum, value) => sum + value, 0) +
      formData.things.reduce(
        (total, item) => total + parseFloat(item.amount || 0),
        0
      );
    setFormData((prevFormData) => ({
      ...prevFormData,
      amount: totalAmount.toFixed(2),
    }));
  }, [monthAmounts, formData.things]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const formattedFormData = {
      ...formData,
      staffName:
        formData.staffName === "" ? formData.otherCoach : formData.staffName,
      monthsSelected: monthsSelected.map((month) => ({
        month,
        amount: monthAmounts[month],
      })),
      date: formData.date ? formData.date.split("/").reverse().join("-") : "",
    };

    try {
      if (!editid) {
        let docname = "";
        if (documentfile) {
          const documentfilename = documentfile.name;
          docname = documentfilename;
          formattedFormData.document = docname;
        }

        const res = await fetch("/api/staffpayment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedFormData),
        });

        if (res.ok) {
          newExpenditureadded();
          fetchExpenditureData();
          setModal1(false);

          if (documentfile) {
            const uploadFormData = new FormData();
            uploadFormData.append("documentfile", documentfile);
            uploadFormData.append("documentfilename", docname);

            const res = await fetch("/api/uploadexp", {
              method: "POST",
              body: uploadFormData,
            });
            if (res.ok) {
              alert("Expenditure uploaded successfully");
            } else {
              alert("Expenditure upload failed");
            }
          }

          const reportData = {
            date: formattedFormData.date,
            income: 0,
            expense: parseFloat(formattedFormData.amount),
            noOfNewTraineeCricket: 0,
            noOfNewTraineeFootball: 0,
            noOfNewClubMember: 0,
            profitAndLoss: -parseFloat(formattedFormData.amount),
          };

          const reportRes = await fetch("/api/reports", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(reportData),
          });

          if (!reportRes.ok) {
            console.error(
              "Failed to send report data:",
              await reportRes.json()
            );
          }
        } else {
          console.log("Failed to add new expenditure:", await res.json());
        }
      } else {
        const url = `/api/staffpayment/${editid}`;
        formattedFormData.staffName = cutomerName;
        const res = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedFormData),
        });

        if (res.ok) {
          setModal1(false);
          fetchExpenditureData();
          updatedExpenditure();

          var newamout = parseFloat(formattedFormData.amount - uamount);

          const reportData1 = {
            date: formattedFormData.date,
            expense: parseFloat(newamout),
          };

          const reportRes = await fetch("/api/reports", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(reportData1),
          });

          if (!reportRes.ok) {
            console.error(
              "Failed to send report data:",
              await reportRes.json()
            );
          }
        } else {
          console.log("Failed to update expenditure:", await res.json());
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateClick = async (value) => {
    try {
      const res = await fetch(`/api/staffpayment/${value}`, {
        method: "GET",
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch data for ID: ${value}`);
      }
      const data = await res.json();

      setcutomerName(data.expenditure.staffName);

      if (coaches.length === 0) {
        await fetchCoachesData();
      }

      const selectedCoach = coaches.find(
        (coach) => coach.label === data.expenditure.staffName
      );

      setUamount(data.expenditure.amount);
      setFormData({
        id: data.expenditure._id,
        billNo: data.expenditure.billNo.toString(),
        year: data.expenditure.year.toString(),
        staffName: selectedCoach ? selectedCoach.value : "other",
        otherCoach: selectedCoach ? "" : data.expenditure.staffName,
        date: formatDate(data.expenditure.date),
        things: data.expenditure.things || [{ name: "", amount: "" }],
        monthsSelected: data.expenditure.months.map((m) => m.month) || [],
        amount: data.expenditure.amount.toString(),
        document: data.expenditure.document || "",
      });
      setMonthsSelected(data.expenditure.months.map((m) => m.month) || []);
      setMonthAmounts(
        (data.expenditure.months || []).reduce((acc, month) => {
          acc[month.month] = month.amount;
          return acc;
        }, {})
      );
      setEditid(data.expenditure._id);
      setModal1(true);
    } catch (error) {
      console.error("Fetch error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleAddRow = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      things: [...prevFormData.things, { name: "", amount: "" }],
    }));
  };

  const handleDeleteRow = (index) => {
    setFormData((prevFormData) => {
      const newThings = prevFormData.things.filter((_, i) => i !== index);
      return {
        ...prevFormData,
        things: newThings,
        amount: newThings.reduce(
          (total, item) => total + parseFloat(item.amount || 0),
          0
        ),
      };
    });
  };

  const handleThingsChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      const newThings = prevFormData.things.map((thing, i) =>
        i === index ? { ...thing, [name]: value } : thing
      );
      const totalAmount =
        Object.values(monthAmounts).reduce((sum, value) => sum + value, 0) +
        newThings.reduce(
          (total, item) => total + parseFloat(item.amount || 0),
          0
        );
      return {
        ...prevFormData,
        things: newThings,
        amount: totalAmount.toFixed(2),
      };
    });
  };

  const generatePDF = (row) => {
    const doc = new jsPDF();
    const logoUrl = "/assets/images/logo.png";

    const img = new Image();
    img.src = logoUrl;
    img.onload = function () {
      doc.addImage(img, "PNG", 10, 10, 20, 20);

      doc.setFontSize(16);
      doc.text("PALLISREE", 105, 30, { align: "center" });

      const additionalText = `ESTD: 1946\nRegd. Under Societies Act. XXVI of 1961 • Regd. No. S/5614\nAffiliated to North 24 Parganas District Sports Association through BBSZSA\nBIDHANPALLY • MADHYAMGRAM • KOLKATA - 700129`;
      doc.setFontSize(10);
      doc.text(additionalText, 105, 35, { align: "center" });

      doc.setFontSize(12);
      doc.text(`Date: ${row.date}`, 200, 10, { align: "right" });
      doc.text(`Bill No: ${row.billNo}`, 200, 15, { align: "right" });

      doc.text(`Name: ${row.staffName}`, 15, 60);

      const things = row.things
        ? row.things
            .split(", ")
            .map((thing) => {
              const [name, amount] = thing.split(": ");
              return {
                name,
                amount:
                  amount && amount.trim() !== "null" && amount.trim() !== ""
                    ? amount
                    : null,
              };
            })
            .filter((thing) => thing.amount !== null)
        : [];

      const totalThingsAmount = things.reduce(
        (total, thing) => total + parseFloat(thing.amount),
        0
      );

      let currentAmount = parseFloat(row.amount) - totalThingsAmount;
      const months = row.months.map((month) => [
        `${month.month} ${row.year}`,
        `${currentAmount.toFixed(2)}`,
      ]);

      const tableData = [
        ...months,
        ...things.map((thing) => [thing.name, thing.amount]),
        ["Total", "Rs." + row.amount + " INR"],
      ];

      autoTable(doc, {
        startY: 65,
        head: [["Item", "Amount"]],
        body: tableData,
        willDrawCell: function (data) {
          if (data.row.index === tableData.length - 1) {
            doc.setFillColor(0, 0, 255);
            doc.setTextColor(255, 255, 255);
          }
        },
      });

      const tableHeight = doc.previousAutoTable.finalY;
      if (row.description) {
        doc.text("\n\nDescription\n" + row.description, 15, tableHeight + 10);
      }

      doc.save(`expenditure_${row.id}.pdf`);
    };
  };

  const yearOptions = [
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
    { value: "2026", label: "2026" },
    { value: "2027", label: "2027" },
    { value: "2028", label: "2028" },
  ];

  useEffect(() => {
    const filteredRecords = initialRecords.filter((item: any) => {
      return (
        item.billNo.toString().includes(search) ||
        item.staffName.toLowerCase().includes(search.toLowerCase()) ||
        item.year.toString().includes(search.toLowerCase()) ||
        item.date.toString().includes(search.toLowerCase()) ||
        item.months.some((month) =>
          month.month.toLowerCase().includes(search.toLowerCase())
        ) ||
        item.amount.toString().includes(search.toLowerCase())
      );
    });

    setRecordsData(
      filteredRecords.slice((page - 1) * pageSize, page * pageSize)
    );
  }, [search, initialRecords, page, pageSize]);

  return (
    <div className="panel mt-6">
      <h5 className="mb-5 text-lg font-semibold dark:text-white-light">
        Staff Payment
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
                            {editid
                              ? "Update Staff Payment"
                              : "Add Staff Payment"}
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
                                  placeholder="Enter bill number"
                                  onChange={handleChange}
                                  className="form-input"
                                  value={formData.billNo}
                                  required
                                />
                              </div>
                              <div>
                                <label htmlFor="year">Year</label>
                                <Select
                                  id="year"
                                  options={yearOptions}
                                  className="form-input"
                                  onChange={(selectedOption) => {
                                    setFormData((prevFormData) => ({
                                      ...prevFormData,
                                      year: selectedOption.value,
                                    }));
                                    filterMonths();
                                  }}
                                  value={yearOptions.find(
                                    (option) =>
                                      option.value.toString() ===
                                      formData.year.toString()
                                  )}
                                  required
                                />
                              </div>
                              <div>
                                <label htmlFor="coach">Coach</label>
                                {editid ? (
                                  <label>{cutomerName}</label>
                                ) : (
                                  <Select
                                    id="coach"
                                    options={coaches}
                                    className="form-input"
                                    onChange={(selectedOption) => {
                                      setFormData((prevFormData) => ({
                                        ...prevFormData,
                                        staffName:
                                          selectedOption.value === "other"
                                            ? ""
                                            : selectedOption.label,
                                        otherCoach:
                                          selectedOption.value === "other"
                                            ? ""
                                            : prevFormData.otherCoach,
                                      }));
                                      filterMonths(selectedOption.label);
                                    }}
                                    value={
                                      coaches.find(
                                        (coach) =>
                                          coach.label === formData.staffName
                                      ) || {
                                        value: "other",
                                        label: formData.otherCoach,
                                      }
                                    }
                                  />
                                )}
                              </div>
                              {formData.staffName === "" && (
                                <div>
                                  <label htmlFor="otherCoach">
                                    Enter a name
                                  </label>
                                  <input
                                    id="otherCoach"
                                    type="text"
                                    name="otherCoach"
                                    placeholder="Enter a name"
                                    onChange={handleChange}
                                    className="form-input"
                                    value={formData.otherCoach}
                                    required
                                  />
                                </div>
                              )}

                              <div>
                                <label htmlFor="date">Date</label>
                                <Flatpickr
                                  id="date"
                                  value={formData.date}
                                  options={{
                                    dateFormat: "d/m/Y",
                                    position: isRtl
                                      ? "auto right"
                                      : "auto left",
                                  }}
                                  className="form-input"
                                  required
                                  onChange={handleDateChange}
                                />
                              </div>

                              <div>
                                <label htmlFor="months">Months</label>
                                <Select
                                  id="months"
                                  options={filteredMonths}
                                  isMulti
                                  className="form-input"
                                  onChange={handleMonthsSelectedChange}
                                  value={filteredMonths.filter((option) =>
                                    monthsSelected.includes(option.value)
                                  )}
                                />
                              </div>

                              {monthsSelected.map((month, index) => (
                                <div key={index}>
                                  <label htmlFor={`amount-${month}`}>
                                    {month} Amount
                                  </label>
                                  <input
                                    id={`amount-${month}`}
                                    type="number"
                                    name={`amount-${month}`}
                                    placeholder={`Enter ${month} amount`}
                                    value={monthAmounts[month] || ""}
                                    onChange={(e) =>
                                      handleMonthAmountChange(
                                        month,
                                        e.target.value
                                      )
                                    }
                                    className="form-input"
                                  />
                                </div>
                              ))}
                              <div>
                                <label htmlFor="things">Other</label>
                                {formData.things.map((thing, index) => (
                                  <div
                                    key={index}
                                    className="mb-2 flex items-center space-x-2"
                                  >
                                    <input
                                      type="text"
                                      name="name"
                                      placeholder="Thing Name"
                                      value={thing.name}
                                      onChange={(e) =>
                                        handleThingsChange(index, e)
                                      }
                                      className="form-input"
                                    />
                                    <input
                                      type="number"
                                      name="amount"
                                      placeholder="Amount"
                                      value={thing.amount}
                                      onChange={(e) =>
                                        handleThingsChange(index, e)
                                      }
                                      className="form-input"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteRow(index)}
                                      className="btn btn-danger"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={handleAddRow}
                                  className="btn btn-secondary mt-2"
                                >
                                  Add Row
                                </button>
                              </div>
                              <div>
                                <label htmlFor="amount">Total Amount</label>
                                <input
                                  id="amount"
                                  type="text"
                                  name="amount"
                                  placeholder="Enter amount"
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
            onClick={() => getcustomeval()}
          >
            <IconPlus className="ltr:mr-2 rtl:ml-2" />
            Staff Payment
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
            { accessor: "billNo", sortable: true, title: "Bill No" },
            { accessor: "year", sortable: true, title: "Year" },
            { accessor: "staffName", sortable: true, title: "Staff Name" },
            {
              accessor: "months",
              sortable: true,
              title: "Months",
              render: (row) =>
                row.months
                  .map((month) => `${month.month}: ${month.amount}`)
                  .join(", "),
            },
            { accessor: "date", sortable: true, title: "Date" },
            {
              accessor: "things",
              title: "Other",
              sortable: true,
              render: (row) => {
                if (typeof row.things === "string") {
                  return row.things
                    .split(", ")
                    .map((thing) => {
                      const [name, amount] = thing.split(": ");
                      return amount &&
                        amount.trim() !== "null" &&
                        amount.trim() !== ""
                        ? `${name}: ${amount}`
                        : `x`;
                    })
                    .join(", ");
                }
                return "";
              },
            },
            { accessor: "amount", sortable: true, title: "Amount" },
            {
              accessor: "action",
              title: "Action",
              titleClassName: "!text-center",
              render: (row) => (
                <div className="mx-auto flex w-max items-center gap-4">
                  <Tippy content="Edit Staff Payment">
                    <button
                      type="button"
                      onClick={() => handleUpdateClick(row.id)}
                      className="btn btn-primary bg-primary"
                    >
                      <IconPencil />
                    </button>
                  </Tippy>

                  <Tippy content="Delete Staff Payment">
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(row.id)}
                      className="btn btn-primary bg-red-500"
                    >
                      <IconXCircle />
                    </button>
                  </Tippy>

                  <Tippy content="Generate PDF">
                    <button
                      type="button"
                      onClick={() => generatePDF(row)}
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
                    <p>Do you want to delete this Staff Payment?</p>
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

export default ComponentsDatatablesStaff;

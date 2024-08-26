"use client";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useEffect, useState, Fragment, useRef } from "react";
import sortBy from "lodash/sortBy";
import IconFile from "@/components/icon/icon-file";
import { Dialog, Transition } from "@headlessui/react";
import IconPrinter from "@/components/icon/icon-printer";
import IconPlus from "../icon/icon-plus";
import IconBince from "@/components/icon/icon-bookmark";
import { useSelector } from "react-redux";
import { IRootState } from "@/store";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import IconXCircle from "@/components/icon/icon-x-circle";
import IconPencil from "@/components/icon/icon-pencil";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";

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
    billNo: 80009,
    type: "hihdsoaf",
    name: "guygipgilgyi",
    date: "2004-05-28",
    purpose: "rtjjkrihj",
    amount: "100",
    paymentType: "otyhjklrdt",
  },
];

const col = [
  "billNo",
  "id",
  "type",
  "name",
  "date",
  "purpose",
  "amount",
  "paymentType",
];

const ComponentsDatatablesDonation = () => {
  const currentYear = new Date().getFullYear().toString();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === "rtl";
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
  const [recordsData, setRecordsData] = useState(initialRecords);
  const [customerData, setCustomerData] = useState([]);
  const [cutomerid, setcutomerid] = useState("");
  const [cutomerName, setcutomerName] = useState("");
  const [updatedate, setUpdatedate] = useState("");
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
  const [paymentType, setPaymentType] = useState("");
  const [transactionNo, setTransactionNo] = useState("");
  const [utrNo, setUtrNo] = useState("");
  const [draftNo, setDraftNo] = useState("");
  const [chequeNo, setChequeNo] = useState("");

  const handleDocumentChange = (e) => {
    setDocumentFile(e.target.files[0]);
  };

  const formatDate = (date) => {
    if (!date) return "";
    const dt = new Date(date);
    if (isNaN(dt)) return "";
    const month = (dt.getMonth() + 1).toString().padStart(2, "0");
    const day = dt.getDate().toString().padStart(2, "0");
    const year = dt.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (date) => {
    if (date && date[0]) {
      const formattedDate = formatDate(date[0]);
      setFormData((prevFormData) => ({
        ...prevFormData,
        date: formattedDate,
      }));
    }
  };

  const newDonationadded = () => {
    MySwal.fire({
      title: "New Donation has been added",
      toast: true,
      position: "bottom-start",
      showConfirmButton: false,
      timer: 5000,
      showCloseButton: true,
    });
  };

  const updatedDonation = () => {
    MySwal.fire({
      title: "Donation has been updated",
      toast: true,
      position: "bottom-start",
      showConfirmButton: false,
      timer: 5000,
      showCloseButton: true,
    });
  };

  const deleteddonation = () => {
    MySwal.fire({
      title: "Donation has been deleted",
      toast: true,
      position: "bottom-start",
      showConfirmButton: false,
      timer: 5000,
      showCloseButton: true,
    });
  };

  interface Donation {
    id: string;
    billNo: number;
    type: string;
    name: string;
    date: string;
    purpose: string;
    amount: string;
    paymentType: string;
    transactionNo: string;
    utrNo: string;
    chequeNo: string;
    draftNo: string;
  }

  const handleDeleteClick = (value: any) => {
    setModal2(true);
    setDeleteid(value);
  };

  const fetchDonationData = async () => {
    try {
      const response = await fetch("/api/donation");
      if (!response.ok) {
        throw new Error("Failed to fetch donation data");
      }
      const data = await response.json();

      const formattedDonation = data.donations.map((donation: Donation) => ({
        id: donation._id,
        billNo: donation.billNo || 80009,
        type: donation.type,
        name: donation.name,
        date: formatDate(donation.date),
        purpose: donation.purpose,
        amount: donation.amount,
        paymentType: donation.paymentType,
        transactionNo: donation.transactionNo,
        utrNo: donation.utrNo,
        chequeNo: donation.chequeNo,
        draftNo: donation.draftNo,
      }));

      setInitialRecords(formattedDonation);
      setRecordsData(
        formattedDonation.slice((page - 1) * pageSize, page * pageSize)
      );
      setLoading(false);
      console.log("Fetched data:", formattedDonation);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchDonationData();
  }, []);

  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "_id",
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
        item.id.toString().includes(search.toLowerCase()) ||
        item.billNo.toString().includes(search.toLowerCase()) ||
        item.type.toLowerCase().includes(search.toLowerCase()) ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.date.toString().includes(search.toLowerCase()) ||
        item.purpose.toLowerCase().includes(search.toLowerCase()) ||
        item.amount.toString().includes(search.toLowerCase()) ||
        item.paymentType.toLowerCase().includes(search.toLowerCase()) ||
        item.transactionNo.toString().includes(search.toLowerCase()) ||
        item.utrNo.toString().includes(search.toLowerCase()) ||
        item.chequeNo.toString().includes(search.toLowerCase()) ||
        item.draftNo.toString().includes(search.toLowerCase())
      );
    });

    setRecordsData(
      filteredRecords.slice((page - 1) * pageSize, page * pageSize)
    );
  }, [search, initialRecords, page, pageSize]);

  useEffect(() => {
    const sortedData = sortBy(initialRecords, sortStatus.columnAccessor);
    const finalData =
      sortStatus.direction === "desc" ? sortedData.reverse() : sortedData;
    setRecordsData(finalData.slice((page - 1) * pageSize, page * pageSize));
  }, [sortStatus, page, pageSize, initialRecords]);

  const handleDeleteData = async () => {
    setModal2(false);

    const res = await fetch(`/api/donation/${deleteid}`, {
      method: "DELETE",
    });

    if (res.ok) {
      fetchDonationData();
      deleteddonation();
    }
  };

  const getcustomeval = () => {
    const maxBillNo =
      Math.max(...initialRecords.map((record) => record.billNo)) + 1;
    setEditid("");
    setFiles([]);
    setFormData({
      id: "",
      billNo: maxBillNo,
      type: "",
      name: "",
      date: formatDate(new Date()),
      purpose: "",
      amount: "",
      paymentType: "cash",
      transactionNo: "",
      utrNo: "",
      chequeNo: "",
      draftNo: "",
    });
    setModal1(true);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);

    const selectedFiles = e.target.files;
    const newFiles = Array.from(selectedFiles);

    if (files.length + newFiles.length > 1) {
      showMessage8();
    } else {
      setFiles([...files, ...newFiles]);
      setHiddenFileName(newFiles[0].name);
    }
  };

  const capitalize = (text) => {
    return text
      .replace("_", " ")
      .replace("-", " ")
      .toLowerCase()
      .split(" ")
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(" ");
  };

  const [formData, setFormData] = useState({
    id: "",
    billNo: 80009,
    type: "",
    name: "",
    date: formatDate(new Date()),
    purpose: "",
    amount: "",
    paymentType: "",
    transactionNo: "",
    utrNo: "",
    chequeNo: "",
    draftNo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));

    if (name === "paymentType") {
      setPaymentType(value);
      setTransactionNo("");
      setUtrNo("");
      setChequeNo("");
      setDraftNo("");
    }
  };

  useEffect(() => {
    if (editid) {
      const donation = initialRecords.find((record) => record.id === editid);
      if (donation) {
        setFormData({
          id: donation.id,
          billNo: donation.billNo,
          type: donation.type,
          name: donation.name,
          date: formatDate(donation.date),
          purpose: donation.purpose,
          amount: donation.amount,
          paymentType: donation.paymentType,
          transactionNo: donation.transactionNo,
          utrNo: donation.utrNo,
          chequeNo: donation.chequeNo,
          draftNo: donation.draftNo,
        });
        setPaymentType(donation.paymentType);
      }
    }
  }, [editid, initialRecords]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    let formattedDate = "";
    if (formData.date && formData.date.includes("/")) {
      formattedDate = formData.date.split("/").reverse().join("-");
    } else if (formData.date) {
      formattedDate = formData.date;
    } else {
      console.error("Date is missing");
      return; // Stop submission if the date is missing
    }

    const formattedFormData = {
      ...formData,
      date: formattedDate,
    };

    console.log("Submitting form data:", formattedFormData); // Log the form data to check the date

    try {
      let response;
      if (!editid) {
        // Handle new donation addition
        let docname = "";
        if (documentfile) {
          const documentfilename = documentfile.name;
          docname = documentfilename;
          formattedFormData.document = docname;
        }

        response = await fetch("/api/donation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedFormData),
        });

        if (response.ok) {
          newDonationadded();
          fetchDonationData();
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
              alert("Donation uploaded successfully");
            } else {
              alert("Donation upload failed");
            }
          }

          // Send report data
          const reportData = {
            date: formattedFormData.date,
            income: parseFloat(formattedFormData.amount),
            expense: 0,
            noOfNewTraineeCricket: 0,
            noOfNewTraineeFootball: 0,
            noOfNewClubMember: 0,
            profitAndLoss: parseFloat(formattedFormData.amount),
          };

          await fetch("/api/reports", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(reportData),
          });
        } else {
          console.log("Failed to add new donation:", await response.json());
        }
      } else {
        // Handle donation update
        const url = `/api/donation/${editid}`;

        response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedFormData),
        });

        if (response.ok) {
          setModal1(false);
          fetchDonationData();
          updatedDonation();

          // Fetch the report for the specific date to update it
          const reportResponse = await fetch(
            `/api/reports?date=${formattedFormData.date}`
          );

          if (reportResponse.ok) {
            const reportData = await reportResponse.json();
            if (reportData && reportData.length > 0) {
              const existingReport = reportData[0];

              const updatedReport = {
                ...existingReport,
                income: parseFloat(formattedFormData.amount),
                profitAndLoss:
                  parseFloat(formattedFormData.amount) -
                  existingReport.expense,
              };

              const reportUpdateResponse = await fetch(
                `/api/reports/${existingReport._id}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(updatedReport),
                }
              );

              if (!reportUpdateResponse.ok) {
                console.error(
                  "Failed to update report data:",
                  await reportUpdateResponse.json()
                );
              }
            } else {
              console.log("No existing report found. Creating a new one.");

              const newReportData = {
                date: formattedFormData.date,
                income: parseFloat(formattedFormData.amount),
                expense: 0,
                noOfNewTraineeCricket: 0,
                noOfNewTraineeFootball: 0,
                noOfNewClubMember: 0,
                profitAndLoss: parseFloat(formattedFormData.amount),
              };

              const newReportResponse = await fetch("/api/reports", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(newReportData),
              });

              if (!newReportResponse.ok) {
                console.error(
                  "Failed to create new report:",
                  await newReportResponse.json()
                );
              }
            }
          } else {
            console.error("Failed to fetch report data:", await reportResponse.json());
          }
        } else {
          console.log("Failed to update donation:", await response.json());
        }
      }
    } catch (error) {
      console.log("Error during submission:", error);
    }
  };

  const handleUpdateClick = async (value) => {
    try {
      console.log("Fetching data for ID:", value);
      const res = await fetch(`/api/donation/${value}`, {
        method: "GET",
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch data for ID: ${value}`);
      }
      const data = await res.json();
      console.log("Fetched data:", formatDate(data.donation.date)); // Log the fetched data
      setUpdatedate(formatDate(data.donation.date));
      // Set the form data with the fetched data
      setFormData({
        id: data.donation._id,
        billNo: data.donation.billNo || 80009,
        type: data.donation.type || "",
        name: data.donation.name,
        purpose: data.donation.purpose,
        amount: data.donation.amount,
        paymentType: data.donation.paymentType || "cash",
        transactionNo: data.donation.transactionNo,
        utrNo: data.donation.utrNo,
        chequeNo: data.donation.chequeNo,
        draftNo: data.donation.draftNo,
        date: formatDate(data.donation.date),
      });

      setPaymentType(data.donation.paymentType || "cash");
      setEditid(data.donation._id); // Set the edit ID to ensure we are updating the correct record
      setTimeout(() => setModal1(true), 1000);
    } catch (error) {
      console.error("Fetch error:", error); // Log any errors
      alert(`Error: ${error.message}`);
    }
  };

  const handleAddRow = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      things: [...prevFormData.things, { name: "", amount: "" }],
    }));
  };

  const generatePDF = (row) => {
    const doc = new jsPDF();
    const logoUrl = "/assets/images/logo.png";

    const img = new Image();
    img.src = logoUrl;
    img.onload = function () {
      const renderContent = (startY) => {
        // Add logo
        doc.addImage(img, "PNG", 10, startY, 20, 20);

        // Add title
        doc.setFontSize(22);
        doc.text("PALLISREE", 105, startY + 2, { align: "center" });

        // Add additional text
        const additionalText = `ESTD: 1946\nRegd. Under Societies Act. XXVI of 1961 • Regd. No. S/5614\nAffiliated to North 24 Parganas District Sports Association through BBSZSA\nBIDHANPALLY • MADHYAMGRAM • KOLKATA - 700129`;
        doc.setFontSize(10);
        doc.text(additionalText, 105, startY + 10, { align: "center" });

        // Add date and bill no
        doc.setFontSize(12);
        doc.text(`Bill No: ${row.billNo}`, 200, startY, { align: "right" });
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 200, startY + 5, {
          align: "right",
        });

        // Define table data
        const tableData = [
          ["Name", "Purpose", "Type", "Amount"],
          [
            row.name,
            row.purpose,
            row.type.charAt(0).toUpperCase() + row.type.slice(1),
            row.amount,
          ],
        ];

        // Add full-width table
        autoTable(doc, {
          startY: startY + 30,
          theme: "grid",
          head: [tableData[0]],
          body: tableData.slice(1),
          tableWidth: doc.internal.pageSize.getWidth() - 20, // Adjust width to be full-page minus margins
          styles: {
            halign: "center",
            cellWidth: "wrap",
          },
          margin: { left: 10, right: 10 }, // Ensuring there is a little margin on each side
        });

        // Get position to add total and payment type
        let finalY = doc.lastAutoTable.finalY || startY + 30; // Y position after the table

        // Add total amount below the table
        doc.setFontSize(10);
        doc.text(`Total Amount: ${row.amount}`, 15, finalY + 10);

        // Add payment type below the total amount
        doc.setFontSize(8);
        doc.text(`Payment Type: ${row.paymentType}`, 15, finalY + 15);
      };

      // Render the content twice on the same page
      renderContent(10); // First instance of the content
      renderContent(140); // Second instance of the content, starting lower on the page

      // Save the PDF
      doc.save(`donation_${row.id}.pdf`);
    };
  };

  return (
    <div className="panel mt-6">
      <h5 className="mb-5 text-lg font-semibold dark:text-white-light">
        Donation
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
                            {editid ? "Update Donation" : "Add Donation"}
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
                                  className="form-input"
                                  value={formData.billNo}
                                  readOnly
                                />
                              </div>
                              <div>
                                <label htmlFor="type">Type</label>
                                <select
                                  id="type"
                                  name="type"
                                  className="form-select"
                                  onChange={handleChange}
                                  value={formData.type}
                                  required
                                >
                                  <option value="">Select Type</option>
                                  <option value="Company">Company</option>
                                  <option value="Individual">Individual</option>
                                </select>
                              </div>

                              <div>
                                <label htmlFor="name">Name</label>
                                <div>
                                  {editid ? (
                                    <label>{formData.name}</label> // Display the name as fixed text if in edit mode
                                  ) : (
                                    <input
                                      id="name"
                                      type="text"
                                      name="name"
                                      placeholder="Enter name"
                                      onChange={handleChange}
                                      className="form-input"
                                      value={formData.name}
                                      required
                                    />
                                  )}
                                </div>
                              </div>

                              <div>
                                {editid ? (
                                  <div>
                                    <label htmlFor="date">Date</label>
                                    <Flatpickr
                                      id="date"
                                      value={updatedate}
                                      options={{
                                        dateFormat: "d/m/Y",
                                        position: isRtl
                                          ? "auto right"
                                          : "auto left",
                                      }}
                                      className="form-input"
                                      onChange={handleDateChange}
                                    />
                                  </div>
                                ) : (
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
                                      onChange={handleDateChange}
                                    />
                                  </div>
                                )}
                              </div>

                              <div>
                                <label htmlFor="name">Donation Purpose</label>
                                <div>
                                  <input
                                    id="purpose"
                                    type="text"
                                    name="purpose"
                                    placeholder="Enter Purpose"
                                    onChange={handleChange}
                                    className="form-input"
                                    value={formData.purpose}
                                  />
                                </div>
                              </div>

                              <div>
                                <label htmlFor="amount">Donation Amount</label>
                                <input
                                  id="amount"
                                  type="Number"
                                  name="amount"
                                  placeholder="Enter amount"
                                  onChange={handleChange}
                                  className="form-input"
                                  value={formData.amount}
                                  required
                                />
                              </div>

                              <div>
                                <label htmlFor="paymentType">
                                  Payment Type
                                </label>
                                <select
                                  id="paymentType"
                                  name="paymentType"
                                  className="form-select"
                                  onChange={(e) => {
                                    handleChange(e);
                                    setPaymentType(e.target.value);
                                  }}
                                  value={formData.paymentType}
                                  required
                                >
                                  <option value="">Select Payment Type</option>
                                  <option value="cash">Cash</option>
                                  <option value="upi">UPI</option>
                                  <option value="cheque">Cheque</option>
                                  <option value="draft">Draft</option>
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
                                    onChange={handleChange}
                                    value={formData.transactionNo}
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
                                    onChange={handleChange}
                                    value={formData.utrNo}
                                  />
                                </div>
                              )}

                              {paymentType === "cheque" && (
                                <div>
                                  <label htmlFor="chequeNo">Cheque No</label>
                                  <input
                                    id="chequeNo"
                                    type="text"
                                    name="chequeNo"
                                    className="form-input"
                                    onChange={handleChange}
                                    value={formData.chequeNo}
                                  />
                                </div>
                              )}

                              {paymentType === "draft" && (
                                <div>
                                  <label htmlFor="draftNo">Draft No</label>
                                  <input
                                    id="draftNo"
                                    type="text"
                                    name="draftNo"
                                    className="form-input"
                                    onChange={handleChange}
                                    value={formData.draftNo}
                                  />
                                </div>
                              )}

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
            Donation
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
            { accessor: "type", sortable: true },
            { accessor: "name", sortable: true },
            { accessor: "date", sortable: true },
            { accessor: "purpose", sortable: true },
            { accessor: "amount", sortable: true },
            { accessor: "paymentType", title: "Payment Type", sortable: true },
            {
              accessor: "transactionNo",
              title: "Transaction No",
              sortable: true,
            },
            { accessor: "utrNo", title: "UTR No", sortable: true },
            { accessor: "chequeNo", title: "Cheque No", sortable: true },
            { accessor: "draftNo", title: "Draft No", sortable: true },
            {
              accessor: "action",
              title: "Action",
              titleClassName: "!text-center",
              render: (row) => (
                <div className="mx-auto flex w-max items-center gap-4">
                  <Tippy content="Edit Donation">
                    <button
                      type="button"
                      onClick={() => handleUpdateClick(row.id)}
                      className="btn btn-primary bg-primary"
                    >
                      <IconPencil />
                    </button>
                  </Tippy>
                  <Tippy content="Delete Donation">
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
                    <p>Do you want to delete this Donation?</p>
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

export default ComponentsDatatablesDonation;

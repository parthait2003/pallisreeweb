"use client";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { DataTable } from "mantine-datatable";
import { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import { useSelector } from "react-redux";
import { IRootState } from "@/store";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import IconFile from "@/components/icon/icon-file";
import IconPlus from "@/components/icon/icon-plus";
import IconXCircle from "@/components/icon/icon-x-circle";
import IconPencil from "@/components/icon/icon-pencil";
import sortBy from "lodash/sortBy";

const MySwal = withReactContent(Swal);

const initialRowData = [
  {
    id: "989",
    date: "2023-07-05",
    expense: 100,
    income: 200,
    noOfNewTraineeCricket: 5,
    noOfNewTraineeFootball: 3,
    noOfNewClubMember: 2,
    profitAndLoss: 100,
  },
];

const col = [
  "id",
  "date",
  "expense",
  "income",
  "noOfNewTraineeCricket",
  "noOfNewTraineeFootball",
  "noOfNewClubMember",
  "profitAndLoss",
];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const ComponentsDatatablesReports = () => {
  const [modal1, setModal1] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [editid, setEditid] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === "rtl";
  const [initialRecords, setInitialRecords] = useState(
    sortBy(initialRowData, "id")
  );
  const [recordsData, setRecordsData] = useState(initialRecords);
  const [search, setSearch] = useState("");
  const [deleteid, setDeleteid] = useState("");

  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredRecords, setFilteredRecords] = useState(initialRecords);

  const handleYearChange = (e) => setYear(e.target.value);
  const handleMonthChange = (e) => setMonth(e.target.value);

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("/");
    return new Date(`${year}-${month}-${day}`);
  };

  const fetchRecordsData = async () => {
    try {
      const response = await fetch("/api/reports");
      if (!response.ok) {
        throw new Error("Failed to fetch records data");
      }
      const data = await response.json();
      console.log("Fetched Data:", data);

      const formattedRecords = data.reports.map((record) => ({
        id: record._id,
        date: formatDate(record.date),
        expense: record.expense,
        income: record.income,
        noOfNewTraineeCricket: record.noOfNewTraineeCricket,
        noOfNewTraineeFootball: record.noOfNewTraineeFootball,
        noOfNewClubMember: record.noOfNewClubMember,
        profitAndLoss: record.profitAndLoss,
      }));
      console.log("Formatted Records:", formattedRecords);

      setInitialRecords(formattedRecords);
      setRecordsData(
        formattedRecords.slice((page - 1) * pageSize, page * pageSize)
      );
      setFilteredRecords(formattedRecords);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRecordsData();
  }, []);

  useEffect(() => {
    let filtered = initialRecords;

    if (year) {
      filtered = filtered.filter(
        (record) => new Date(record.date).getFullYear() === parseInt(year)
      );
    }
    if (month) {
      filtered = filtered.filter(
        (record) => parseDate(record.date).getMonth() + 1 === parseInt(month)
      );
    }
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filtered = filtered.filter((record) => {
        const date = parseDate(record.date);
        return date >= start && date <= end;
      });
    }

    setFilteredRecords(filtered);
  }, [year, month, startDate, endDate, initialRecords]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecordsData([...filteredRecords.slice(from, to)]);
  }, [page, pageSize, filteredRecords]);

  const newRecordAdded = () => {
    MySwal.fire({
      title: "New record has been added",
      toast: true,
      position: "bottom-start",
      showConfirmButton: false,
      timer: 5000,
      showCloseButton: true,
    });
  };

  const updatedRecord = () => {
    MySwal.fire({
      title: "Record has been updated",
      toast: true,
      position: "bottom-start",
      showConfirmButton: false,
      timer: 5000,
      showCloseButton: true,
    });
  };

  const deletedRecord = () => {
    MySwal.fire({
      title: "Record has been deleted",
      toast: true,
      position: "bottom-start",
      showConfirmButton: false,
      timer: 5000,
      showCloseButton: true,
    });
  };

  const handleDeleteClick = (value) => {
    setModal2(true);
    setDeleteid(value);
  };

  const handleDeleteData = async () => {
    setModal2(false);

    const res = await fetch(`/api/reports/${deleteid}`, {
      method: "DELETE",
    });

    if (res.ok) {
      fetchRecordsData();
      deletedRecord();
    }
  };

  const handleUpdateClick = async (value) => {
    try {
      const res = await fetch(`/api/reports/${value}`, {
        method: "GET",
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch data for ID: ${value}`);
      }
      const data = await res.json();

      setFormData({
        ...data.report,
        date: formatDate(data.report.date),
      });
      setEditid(data.report._id);

      setModal1(true);
      if (res.ok) {
        fetchRecordsData();
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleDateChange = (date) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      date: date[0] ? formatDate(date[0]) : "",
    }));
  };

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

  const [formData, setFormData] = useState({
    id: "",
    date: formatDate(new Date()),
    expense: "",
    income: "",
    noOfNewTraineeCricket: "",
    noOfNewTraineeFootball: "",
    noOfNewClubMember: "",
    profitAndLoss: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const formattedFormData = {
      ...formData,
      date: formData.date ? formData.date.split("/").reverse().join("-") : "",
    };

    if (!editid) {
      try {
        const res = await fetch("/api/reports", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(formattedFormData),
        });

        if (res.ok) {
          newRecordAdded();
          fetchRecordsData();
          setModal1(false);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const url = `/api/reports/${editid}`;

        const res = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(formattedFormData),
        });

        if (res.ok) {
          setModal1(false);
          fetchRecordsData();
          updatedRecord();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const generatePDF = (data) => {
    const doc = new jsPDF();
    const tableColumn = ["Date", "Income", "Expense", "Profit and Loss"];
    const tableRows = [];

    let totalIncome = 0;
    let totalExpense = 0;
    let totalProfitAndLoss = 0;

    // Calculate totals and prepare table rows
    data.forEach((record) => {
      const income = parseFloat(record.income);
      const expense = parseFloat(record.expense);
      const profitAndLoss = parseFloat(record.profitAndLoss);

      // Skip rows where both income and expense are zero
      if (income === 0 && expense === 0) {
        return;
      }

      totalIncome += income;
      totalExpense += expense;
      totalProfitAndLoss += profitAndLoss;

      const recordData = [
        record.date,
        income.toFixed(2),
        expense.toFixed(2),
        profitAndLoss.toFixed(2),
      ];
      tableRows.push(recordData);
    });

    // Add totals row
    const totalsRow = [
      "Total",
      totalIncome.toFixed(2),
      totalExpense.toFixed(2),
      totalProfitAndLoss.toFixed(2),
    ];
    tableRows.push(totalsRow);

    // Add image
    const logoUrl = "/assets/images/logo.png";
    const img = new Image();
    img.src = logoUrl;
    img.onload = function () {
      doc.addImage(img, "PNG", 10, 10, 20, 20);

      // Add header text
      doc.setFontSize(16);
      doc.text("PALLISREE", 105, 30, { align: "center" });

      const additionalText = `ESTD: 1946\nRegd. Under Societies Act. XXVI of 1961 • Regd. No. S/5614\nAffiliated to North 24 Parganas District Sports Association through BBSZSA\nBIDHANPALLY • MADHYAMGRAM • KOLKATA - 700129`;
      doc.setFontSize(10);
      doc.text(additionalText, 105, 35, { align: "center" });

      // Add date in the header
      const currentDate = new Date().toLocaleDateString();
      doc.text(`Date: ${currentDate}`, 200, 10, { align: "right" });

      // Add table data
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 55,
        willDrawCell: function (data) {
          if (data.row.index === tableRows.length - 1) {
            doc.setFillColor(0, 51, 102); // Example header color
            doc.setTextColor(255, 255, 255); // White text color
          }
        },
      });

      // Save the PDF
      doc.save("report.pdf");
    };
  };

  const generateTraineeRecordPDF = (data) => {
    const doc = new jsPDF();
    const tableColumn = [
      "Date",
      "No of New Trainee (Cricket)",
      "No of New Trainee (Football)",
      "No of New Club Member",
    ];
    const tableRows = [];

    let totalCricketTrainees = 0;
    let totalFootballTrainees = 0;
    let totalClubMembers = 0;

    // Prepare table rows
    data.forEach((record) => {
      const cricketTrainees = parseInt(record.noOfNewTraineeCricket, 10);
      const footballTrainees = parseInt(record.noOfNewTraineeFootball, 10);
      const clubMembers = parseInt(record.noOfNewClubMember, 10);

      totalCricketTrainees += cricketTrainees;
      totalFootballTrainees += footballTrainees;
      totalClubMembers += clubMembers;

      const recordData = [
        record.date,
        cricketTrainees,
        footballTrainees,
        clubMembers,
      ];
      tableRows.push(recordData);
    });

    // Add totals row
    const totalsRow = [
      "Total",
      totalCricketTrainees,
      totalFootballTrainees,
      totalClubMembers,
    ];
    tableRows.push(totalsRow);

    // Add image
    const logoUrl = "/assets/images/logo.png";
    const img = new Image();
    img.src = logoUrl;
    img.onload = function () {
      doc.addImage(img, "PNG", 10, 10, 20, 20);

      // Add header text
      doc.setFontSize(16);
      doc.text("PALLISREE", 105, 30, { align: "center" });

      const additionalText = `ESTD: 1946\nRegd. Under Societies Act. XXVI of 1961 • Regd. No. S/5614\nAffiliated to North 24 Parganas District Sports Association through BBSZSA\nBIDHANPALLY • MADHYAMGRAM • KOLKATA - 700129`;
      doc.setFontSize(10);
      doc.text(additionalText, 105, 35, { align: "center" });

      // Add date in the header
      const currentDate = new Date().toLocaleDateString();
      doc.text(`Date: ${currentDate}`, 200, 10, { align: "right" });

      // Add table data
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 55,
        willDrawCell: function (data) {
          if (data.row.index === tableRows.length - 1) {
            doc.setFillColor(0, 51, 102); // Example header color
            doc.setTextColor(255, 255, 255); // White text color
          }
        },
      });

      // Save the PDF
      doc.save("trainee_records.pdf");
    };
  };

  const clearFilters = () => {
    setYear("");
    setMonth("");
    setStartDate("");
    setEndDate("");
    setFilteredRecords(initialRecords);
  };

  return (
    <div className="panel mt-6">
      <h5 className="mb-5 text-lg font-semibold dark:text-white-light">
        Records
      </h5>
      <div className="mb-4.5 flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <button
          type="button"
          className="btn btn-primary my-5 w-100"
          onClick={() => setModal1(true)}
          style={{ fontSize: "calc(1em - 2px)" }}
        >
          {" "}
          <IconPlus className="ltr:mr-2 rtl:ml-2" />
          Record
        </button>
        <div className="flex flex-wrap items-center gap-4 w-full">
          <select
            className="form-select flex-1"
            onChange={handleYearChange}
            value={year}
          >
            <option value="">Select Year</option>
            {Array.from(
              { length: 5 },
              (_, i) => new Date().getFullYear() - i
            ).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <select
            className="form-select flex-1"
            onChange={handleMonthChange}
            value={month}
          >
            <option value="">Select Month</option>
            {monthNames.map((monthName, index) => (
              <option key={index} value={index + 1}>
                {monthName}
              </option>
            ))}
          </select>

          <Flatpickr
            options={{ dateFormat: "d/m/Y" }}
            className="form-input flex-1"
            placeholder="Start Date"
            onChange={(date) =>
              setStartDate(date[0] ? date[0].toISOString().split("T")[0] : "")
            }
          />
          <Flatpickr
            options={{ dateFormat: "d/m/Y" }}
            className="form-input flex-1"
            placeholder="End Date"
            onChange={(date) =>
              setEndDate(date[0] ? date[0].toISOString().split("T")[0] : "")
            }
          />

          <button
            onClick={clearFilters}
            className="btn btn-secondary btn-sm m-1"
          >
            Clear Filters
          </button>

          <button
            onClick={() => generatePDF(filteredRecords)}
            className="btn btn-primary btn-sm m-1"
          >
            <IconFile className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
            Generate PDF
          </button>

          <button
            onClick={() => generateTraineeRecordPDF(filteredRecords)}
            className="btn btn-primary btn-sm m-1"
          >
            <IconFile className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
            Generate Trainee Record PDF
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
            { accessor: "date", title: "Date", sortable: true },
            { accessor: "income", title: "Income", sortable: true },
            { accessor: "expense", title: "Expense", sortable: true },
            {
              accessor: "noOfNewTraineeCricket",
              title: "No of New Trainee (Cricket)",
              sortable: true,
            },
            {
              accessor: "noOfNewTraineeFootball",
              title: "No of New Trainee (Football)",
              sortable: true,
            },
            {
              accessor: "noOfNewClubMember",
              title: "No of New Club Member",
              sortable: true,
            },
            {
              accessor: "profitAndLoss",
              title: "Profit and Loss",
              sortable: true,
            },
            {
              accessor: "action",
              title: "Action",
              titleClassName: "!text-center",
              render: (row) => (
                <div className="mx-auto flex w-max items-center gap-4">
                  <Tippy content="Edit Record">
                    <button
                      type="button"
                      onClick={() => handleUpdateClick(row.id)}
                      className="btn btn-primary bg-primary"
                    >
                      <IconPencil />
                    </button>
                  </Tippy>

                  <Tippy content="Delete Record">
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(row.id)}
                      className="btn btn-primary bg-red-500"
                    >
                      <IconXCircle />
                    </button>
                  </Tippy>
                </div>
              ),
            },
          ]}
          totalRecords={filteredRecords.length}
          recordsPerPage={pageSize}
          page={page}
          onPageChange={(p) => setPage(p)}
          recordsPerPageOptions={PAGE_SIZES}
          onRecordsPerPageChange={setPageSize}
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
                    <p>Do you want to delete this record?</p>
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
                      {editid ? "Update Record" : "Add Record"}
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
                      <form className="space-y-5" onSubmit={handleFormSubmit}>
                        <div>
                          <label htmlFor="date">Date</label>
                          <Flatpickr
                            id="date"
                            value={formData.date}
                            options={{
                              dateFormat: "d/m/Y",
                              position: isRtl ? "auto right" : "auto left",
                            }}
                            className="form-input"
                            onChange={handleDateChange}
                          />
                        </div>

                        <div>
                          <label htmlFor="income">Income</label>
                          <input
                            id="income"
                            type="number"
                            name="income"
                            placeholder="Enter income"
                            onChange={handleChange}
                            className="form-input"
                            value={formData.income}
                          />
                        </div>
                        <div>
                          <label htmlFor="expense">Expense</label>
                          <input
                            id="expense"
                            type="number"
                            name="expense"
                            placeholder="Enter expense"
                            onChange={handleChange}
                            className="form-input"
                            value={formData.expense}
                          />
                        </div>
                        <div>
                          <label htmlFor="noOfNewTraineeCricket">
                            No of New Trainee (Cricket)
                          </label>
                          <input
                            id="noOfNewTraineeCricket"
                            type="number"
                            name="noOfNewTraineeCricket"
                            placeholder="Enter no of new trainee cricket"
                            onChange={handleChange}
                            className="form-input"
                            value={formData.noOfNewTraineeCricket}
                          />
                        </div>
                        <div>
                          <label htmlFor="noOfNewTraineeFootball">
                            No of New Trainee (Football)
                          </label>
                          <input
                            id="noOfNewTraineeFootball"
                            type="number"
                            name="noOfNewTraineeFootball"
                            placeholder="Enter no of new trainee football"
                            onChange={handleChange}
                            className="form-input"
                            value={formData.noOfNewTraineeFootball}
                          />
                        </div>
                        <div>
                          <label htmlFor="noOfNewClubMember">
                            No of New Club Member
                          </label>
                          <input
                            id="noOfNewClubMember"
                            type="number"
                            name="noOfNewClubMember"
                            placeholder="Enter no of new club member"
                            onChange={handleChange}
                            className="form-input"
                            value={formData.noOfNewClubMember}
                          />
                        </div>

                        <button type="submit" className="btn btn-primary !mt-6">
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
  );
};

export default ComponentsDatatablesReports;

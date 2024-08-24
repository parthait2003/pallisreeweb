"use client";
import { useEffect, useState } from "react";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import axios from "axios";
import Select from "react-select";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const allMonthsOptions = [
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

// Helper function to parse date in DD/MM/YYYY format
const parseDate = (dateString: string) => {
  const [day, month, year] = dateString.split("/").map(Number);
  return new Date(year, month - 1, day);
};

const ComponentsDatatablesSubscriptionsReports = () => {
  const currentYear = new Date().getFullYear().toString();
  const currentMonthIndex = new Date().getMonth(); // 0-based index for the current month
  const [traineeData, setTraineeData] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "_id",
    direction: "desc",
  });

  const [filters, setFilters] = useState({
    currentMonth: false,
    previousMonth: false,
    previousTwoMonths: false,
  });

  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const traineeResponse = await axios.get("/api/studentform");
        const subscriptionResponse = await axios.get("/api/subscription");

        const trainees = traineeResponse.data.studentforms;
        const subscriptions = subscriptionResponse.data.subscriptions;

        const pending = trainees
          .filter((trainee) => {
            const traineeSubscriptions = subscriptions.filter(
              (sub) => sub.traineeid === trainee._id && sub.year === currentYear
            );

            const paidMonths = traineeSubscriptions.flatMap((sub) =>
              sub.monthsSelected.map((month) => month.month)
            );

            // Parse the joining date
            const joiningDate = parseDate(trainee.joiningdate);
            const joiningMonthIndex = joiningDate.getMonth(); // 0-based index
            const joiningYear = joiningDate.getFullYear();

            let monthsToCheck;

            if (currentYear === "2024") {
              monthsToCheck = allMonthsOptions.slice(3, currentMonthIndex + 1); // From April to current month for 2024
            } else {
              monthsToCheck = allMonthsOptions.slice(0, currentMonthIndex + 1); // From January to current month for other years
            }

            // Adjust monthsToCheck based on the joining date
            if (
              joiningYear === parseInt(currentYear, 10) &&
              joiningMonthIndex >= allMonthsOptions.indexOf(monthsToCheck[0])
            ) {
              monthsToCheck = monthsToCheck.filter(
                (month) => allMonthsOptions.indexOf(month) > joiningMonthIndex
              );
            }

            const pendingMonths = monthsToCheck.filter(
              (month) => !paidMonths.includes(month.value)
            );

            return pendingMonths.length > 0;
          })
          .map((trainee) => {
            const traineeSubscriptions = subscriptions.filter(
              (sub) => sub.traineeid === trainee._id && sub.year === currentYear
            );

            const paidMonths = traineeSubscriptions.flatMap((sub) =>
              sub.monthsSelected.map((month) => month.month)
            );

            // Parse the joining date
            const joiningDate = parseDate(trainee.joiningdate);
            const joiningMonthIndex = joiningDate.getMonth(); // 0-based index
            const joiningYear = joiningDate.getFullYear();

            let monthsToCheck;

            if (currentYear === "2024") {
              monthsToCheck = allMonthsOptions.slice(3, currentMonthIndex + 1); // From April to current month for 2024
            } else {
              monthsToCheck = allMonthsOptions.slice(0, currentMonthIndex + 1); // From January to current month for other years
            }

            // Adjust monthsToCheck based on the joining date
            if (
              joiningYear === parseInt(currentYear, 10) &&
              joiningMonthIndex >= allMonthsOptions.indexOf(monthsToCheck[0])
            ) {
              monthsToCheck = monthsToCheck.filter(
                (month) => allMonthsOptions.indexOf(month) > joiningMonthIndex
              );
            }

            const pendingMonths = monthsToCheck.filter(
              (month) => !paidMonths.includes(month.value)
            );

            return { ...trainee, pendingMonths };
          });

        // Sort pending payments by the number of pending months in descending order
        pending.sort((a, b) => b.pendingMonths.length - a.pendingMonths.length);

        setTraineeData(trainees);
        setPendingPayments(pending);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentMonthIndex, currentYear]);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  const handleFilterChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prev) => ({ ...prev, [name]: checked }));
  };

  const clearFilters = () => {
    setFilters({
      currentMonth: false,
      previousMonth: false,
      previousTwoMonths: false,
    });
    setSportFilter(null);
  };

  const applyFilters = (records) => {
    const { currentMonth, previousMonth, previousTwoMonths } = filters;
    const monthsToFilter = [];
    if (currentMonth)
      monthsToFilter.push(allMonthsOptions[currentMonthIndex].value);
    if (previousMonth && currentMonthIndex - 1 >= 0)
      monthsToFilter.push(allMonthsOptions[currentMonthIndex - 1].value);
    if (previousTwoMonths && currentMonthIndex - 2 >= 0)
      monthsToFilter.push(allMonthsOptions[currentMonthIndex - 2].value);

    let filteredRecords = records;

    if (monthsToFilter.length > 0) {
      filteredRecords = filteredRecords.filter((item) =>
        item.pendingMonths.some((month) => monthsToFilter.includes(month.value))
      );
    }

    if (sportFilter) {
      filteredRecords = filteredRecords.filter(
        (item) => item.sportstype === sportFilter.value
      );
    }

    return filteredRecords;
  };

  const sportOptions = [
    ...new Set(traineeData.map((trainee) => trainee.sportstype)),
  ].map((sport) => ({ value: sport, label: sport }));

  const filteredRecords = applyFilters(pendingPayments).filter((item) => {
    return (
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.pendingMonths.some((month) =>
        month.label.toLowerCase().includes(search.toLowerCase())
      )
    );
  });

  const paginatedRecords = filteredRecords.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleCheckboxChange = (event, record) => {
    if (event.target.checked) {
      setSelectedRows((prevSelected) => [...prevSelected, record]);
    } else {
      setSelectedRows((prevSelected) =>
        prevSelected.filter((item) => item._id !== record._id)
      );
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();

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

      // Add report title
      doc.setFontSize(10);
      doc.text("Trainee Pending Payment Report", 105, 55, { align: "center" });

      // Prepare table data
      const tableData = selectedRows.map((row, index) => [
        index + 1,
        row.name,
        row.pendingMonths.map((month) => month.label).join(", "),
      ]);

      // Add table
      autoTable(doc, {
        head: [["#", "Trainee Name", "Pending Payment Months"]],
        body: tableData,
        startY: 60, // Adjust the start position based on the added header text
      });

      // Save the PDF
      doc.save("trainee_pending_payment_report.pdf");
    };
  };

  const columns = [
    {
      accessor: "checkbox",
      title: (
        <input
          type="checkbox"
          onChange={(event) => {
            if (event.target.checked) {
              setSelectedRows(paginatedRecords);
            } else {
              setSelectedRows([]);
            }
          }}
          checked={selectedRows.length === paginatedRecords.length}
        />
      ),
      render: (record) => (
        <input
          type="checkbox"
          onChange={(event) => handleCheckboxChange(event, record)}
          checked={selectedRows.some((item) => item._id === record._id)}
        />
      ),
    },
    { accessor: "name", title: "Trainee Name", sortable: true },
    { accessor: "sportstype", title: "Sport Type", sortable: true },
    {
      accessor: "pendingMonths",
      title: "Pending Payment Months",
      render: ({ pendingMonths }) =>
        pendingMonths.map((month, index) => (
          <span
            key={index}
            className="month-badge m-1 inline-block rounded border border-gray-300 p-2"
          >
            &#10060; {month.label}
          </span>
        )),
    },
  ];

  return (
    <div className="panel mt-6">
      <h5 className="mb-5 text-lg font-semibold dark:text-white-light">
        Pending Payments
      </h5>

      <div className="mb-4.5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <label>
            {" "}
            Filter by Month{" - "}{" "}
            <input
              type="checkbox"
              name="currentMonth"
              checked={filters.currentMonth}
              onChange={handleFilterChange}
            />
            {` ${allMonthsOptions[currentMonthIndex].label}`}
          </label>
          {currentMonthIndex - 1 >= 0 && (
            <label>
              <input
                type="checkbox"
                name="previousMonth"
                checked={filters.previousMonth}
                onChange={handleFilterChange}
              />
              {` ${allMonthsOptions[currentMonthIndex - 1].label}`}
            </label>
          )}
          {currentMonthIndex - 2 >= 0 && (
            <label>
              <input
                type="checkbox"
                name="previousTwoMonths"
                checked={filters.previousTwoMonths}
                onChange={handleFilterChange}
              />
              {` ${allMonthsOptions[currentMonthIndex - 2].label}`}
            </label>
          )}
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative z-50 w-full lg:w-60">
            <Select
              options={sportOptions}
              value={sportFilter}
              onChange={setSportFilter}
              placeholder="Filter by Sport Type"
              isClearable
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              className="w-full rounded bg-blue-500 px-3 py-2 text-white lg:w-auto"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
            <button
              className="w-full rounded bg-green-500 px-3 py-2 text-white lg:w-auto"
              onClick={generateReport}
            >
              Generate Report
            </button>
            <input
              type="text"
              className="form-input w-full lg:w-auto"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="datatables">
        <DataTable
          highlightOnHover
          className="table-hover whitespace-nowrap"
          records={paginatedRecords}
          columns={columns}
          totalRecords={filteredRecords.length}
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

      <style jsx>{`
        .month-badge {
          display: inline-block;
          margin-right: 5px;
          padding: 2px 8px;
          border: 1px solid red;
          border-radius: 12px;
          background-color: #f8d7da;
          color: red;
          font-size: 12px;
          font-weight: bold;
        }
        .form-input {
          border: 1px solid #ccc;
          padding: 0.5rem;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default ComponentsDatatablesSubscriptionsReports;

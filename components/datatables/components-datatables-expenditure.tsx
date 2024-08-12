"use client";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useEffect, useState, Fragment, useRef } from "react";
import sortBy from "lodash/sortBy";
import IconFile from "@/components/icon/icon-file";
import { Dialog, Transition } from "@headlessui/react";
import IconPrinter from "@/components/icon/icon-printer";
import IconPlus from "../icon/icon-plus";
import IconBince from "@/components/icon/icon-bookmark";
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
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const MySwal = withReactContent(Swal);

const handleRemoveDocument = () => {
  setDocumentFile(null);
  setFormData((prevFormData) => ({
    ...prevFormData,
    document: null,
  }));
};

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
    expenditures: "hihdsoaf",
    description: "guygipgilgyi",
    date: "2004-05-28",
    amount: "100",
    document: "otyhjklrdt",
    things: [
      { name: "Thing1", amount: "50" },
      { name: "Thing2", amount: "50" },
    ],
  },
];

const col = [
  "id",
  "expenditures",
  "description",
  "things",
  "date",
  "amount",
  "document",
];

const ComponentsDatatablesExpenditure = () => {
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

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    expenditures: string;
    description: string;
    date: string;
    amount: string;
    document: string;
    things: { name: string; amount: string }[];
  }

  const handleDeleteClick = (value: any) => {
    setModal2(true);
    setDeleteid(value);
  };

  const fetchExpenditureData = async () => {
    try {
      const response = await fetch("/api/expenditure");
      if (!response.ok) {
        throw new Error("Failed to fetch expenditure data");
      }
      const data = await response.json();

      const formattedExpenditure = data.expenditures.map(
        (expenditure: Expenditure) => ({
          id: expenditure._id,
          expenditures: expenditure.expenditures,
          description: expenditure.description,
          things: Array.isArray(expenditure.things)
            ? expenditure.things
                .map((thing) => `${thing.name}: ${thing.amount}`)
                .join(", ")
            : "",
          date: formatDate(expenditure.date),
          amount: expenditure.amount,
          document: expenditure.document,
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
        item.expenditures.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.date.toString().includes(search.toLowerCase()) ||
        item.amount.toString().includes(search.toLowerCase()) ||
        item.document.toLowerCase().includes(search.toLowerCase())
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

  const formatDate = (date: any) => {
    if (date) {
      const dt = new Date(date);
      const month =
        dt.getMonth() + 1 < 10 ? "0" + (dt.getMonth() + 1) : dt.getMonth() + 1;
      const day = dt.getDate() < 10 ? "0" + dt.getDate() : dt.getDate();
      return day + "/" + month + "/" + dt.getFullYear();
    }
    return "";
  };

  const handleDeleteData = async () => {
    const resdel = await fetch(`/api/expenditure/${deleteid}`, {
      method: "GET",
    });
    if (!resdel.ok) {
      throw new Error(`Failed to fetch data for ID: ${deleteid}`);
    }
    const data = await resdel.json();
    console.log("deleted data" + data);
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

    const res = await fetch(`/api/expenditure/${deleteid}`, {
      method: "DELETE",
    });

    if (res.ok) {
      fetchExpenditureData();
      deletedexpenditure();
    }
  };

  const getcustomeval = () => {
    setEditid("");
    setFiles([]);
    setFormData({
      id: "",
      expenditures: "",
      description: "",
      date: formatDate(new Date()), // Set the default date here
      amount: "",
      document: "",
      things: [{ name: "", amount: "" }],
    });
    const options = customerData.map((customer) => ({
      value: customer._id,
      label: `${customer.firstName} ${
        customer.middleName ? customer.middleName + " " : ""
      }${customer.lastName} - ${customer.mobile}`,
    }));
    setOptions(options);
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

  const capitalize = (text: any) => {
    return text
      .replace("_", " ")
      .replace("-", " ")
      .toLowerCase()
      .split(" ")
      .map((s: any) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(" ");
  };

  const [formData, setFormData] = useState({
    id: "",
    expenditures: "",
    description: "",
    date: formatDate(new Date()), // Set the default date here
    amount: "",
    document: "",
    things: [{ name: "", amount: "" }],
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));
  };

  const handleMonthsSelectedChange = (selectedOptions: any) => {
    const selectedValues = selectedOptions
      ? selectedOptions.map((option: any) => option.value)
      : [];
    setFormData((prevFormData) => ({
      ...prevFormData,
      monthsSelected: selectedValues,
    }));
  };

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      id: editid,
    }));
  }, [editid]);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formattedFormData = {
      ...formData,
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

        const res = await fetch("/api/expenditure", {
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
        const url = `/api/expenditure/${editid}`;

        const res = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedFormData),
        });
        var newamout = parseFloat(formattedFormData.amount) - uamount;
        console.log("amount change" + newamout);
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
        if (res.ok) {
          setModal1(false);
          fetchExpenditureData();
          updatedExpenditure();

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

  const handleUpdateClick = async (value: any) => {
    try {
      const res = await fetch(`/api/expenditure/${value}`, {
        method: "GET",
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch data for ID: ${value}`);
      }
      const data = await res.json();

      setUamount(data.expenditure.amount);

      setFormData({
        ...data.expenditure,
        date: formatDate(data.expenditure.date),
        things: data.expenditure.things || [{ name: "", amount: "" }],
      });
      setEditid(data.expenditure._id); // Set the edit ID to ensure we are updating the correct record
      setModal1(true); // Moved inside the try block to ensure it opens only if fetch is successful
      if (res.ok) {
        fetchExpenditureData();
      }
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

  const handleDeleteRow = (index: number) => {
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

  const handleThingsChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      const newThings = prevFormData.things.map((thing, i) =>
        i === index ? { ...thing, [name]: value } : thing
      );
      const totalAmount = newThings.reduce(
        (total, item) => total + parseFloat(item.amount || 0),
        0
      );
      return {
        ...prevFormData,
        things: newThings,
        amount: totalAmount,
      };
    });
  };

  const generatePDF = (row) => {
    const doc = new jsPDF();
    const logoUrl = "/assets/images/logo.png";

    // Add logo
    const img = new Image();
    img.src = logoUrl;
    img.onload = function () {
      doc.addImage(img, "PNG", 10, 10, 20, 20);

      // Add title
      doc.setFontSize(16);
      doc.text("PALLISREE", 105, 30, { align: "center" });

      // Add additional text
      const additionalText = `ESTD: 1946\nRegd. Under Societies Act. XXVI of 1961 • Regd. No. S/5614\nAffiliated to North 24 Parganas District Sports Association through BBSZSA\nBIDHANPALLY • MADHYAMGRAM • KOLKATA - 700129`;
      doc.setFontSize(10);
      doc.text(additionalText, 105, 35, { align: "center" });

      // Add date
      doc.setFontSize(12);
      doc.text(`Date: ${row.date}`, 200, 10, { align: "right" });

      // Add expenditure details
      doc.text(`Expenditures: ${row.expenditures}`, 15, 60);

      // Prepare table data
      const things = row.things.split(", ").map((thing) => thing.split(": "));
      const tableData = [
        ...things.map(([name, amount]) => [name, amount]),
        ["Total", "Rs." + row.amount + "INR"], // Add total amount as the last row of the table
      ];

      // Add expenditure table
      autoTable(doc, {
        startY: 65,
        head: [["Things name", "Amount"]],
        body: tableData,
        willDrawCell: function (data) {
          // Check if this is the last row
          if (data.row.index === tableData.length - 1) {
            doc.setFillColor(0, 0, 255); // Blue background
            doc.setTextColor(255, 255, 255); // White text
          }
        },
      });

      // Add description below the table
      const tableHeight = doc.previousAutoTable.finalY;
      doc.text("\n\nDescription\n" + row.description, 15, tableHeight + 10);

      // Save the PDF
      doc.save(`expenditure_${row.id}.pdf`);
    };
  };

  return (
    <div className="panel mt-6">
      <h5 className="mb-5 text-lg font-semibold dark:text-white-light">
        Expenditures
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
                              ? "Update Expenditures"
                              : "Add Expenditures"}
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
                                <label htmlFor="description">Expenditure</label>
                                <input
                                  id="expenditures"
                                  type="text"
                                  name="expenditures"
                                  placeholder="Enter expenditures"
                                  onChange={handleChange}
                                  className="form-input"
                                  value={formData.expenditures}
                                  required
                                />
                              </div>

                              <div>
                                <label htmlFor="description">Description</label>
                                <textarea
                                  id="description"
                                  name="description"
                                  value={formData.description}
                                  onChange={handleChange}
                                  rows="4"
                                  className="form-input h-20 w-full rounded-md border border-gray-300 p-2"
                                />
                              </div>

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
                                <label htmlFor="things">Things</label>
                                {formData.things.map((thing, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center space-x-2 mb-2"
                                  >
                                    <input
                                      required
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
                                      required
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
                                  onChange={handleChange}
                                  className="form-input"
                                  value={formData.amount}
                                  readOnly
                                />
                              </div>

                              <div>
                                {formData.document ? (
                                  <div
                                    style={{
                                      position: "relative",
                                      display: "flex",
                                    }}
                                  >
                                    <a
                                      href={`https://pallisree.blr1.cdn.digitaloceanspaces.com/${formData.document}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        textDecoration: "none",
                                        color: "blue",
                                      }}
                                    >
                                      View Document
                                    </a>
                                    <button
                                      onClick={handleRemoveDocument}
                                      style={{
                                        position: "absolute",
                                        top: 0,
                                        right: 0,
                                        backgroundColor: "red",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "50%",
                                        width: "24px",
                                        height: "24px",
                                        cursor: "pointer",
                                      }}
                                    >
                                      &times;
                                    </button>
                                  </div>
                                ) : (
                                  <div>
                                    <label htmlFor="document">
                                      Upload Document
                                    </label>
                                    <input
                                      id="document"
                                      type="file"
                                      name="document"
                                      onChange={handleDocumentChange}
                                      className="form-input"
                                    />
                                  </div>
                                )}
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
            Add Expenditure
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
            { accessor: "expenditures", sortable: true },
            { accessor: "description", sortable: true },
            {
              accessor: "things",
              title: "Things",
              sortable: true,
              render: (row) => {
                if (typeof row.things === "string") {
                  return row.things
                    .split(", ")
                    .map((thing) => {
                      const [name, amount] = thing.split(": ");
                      return `${name}: ${amount}`;
                    })
                    .join(", ");
                }
                return "";
              },
            },
            { accessor: "date", sortable: true },
            { accessor: "amount", sortable: true },
            {
              accessor: "Document",
              sortable: true,

              render: (row) => (
                <div className="mx-auto flex w-max items-center gap-4">
                  <Tippy content="Document">
                    <button
                      type="button"
                      onClick={() => {
                        window.open(
                          `https://pallisree.blr1.cdn.digitaloceanspaces.com/${row.document}`,
                          "_blank"
                        );
                      }}
                      className="btn btn-primary"
                    >
                      <IconBince />
                    </button>
                  </Tippy>
                </div>
              ),
            },
            {
              accessor: "action",
              title: "Action",
              titleClassName: "!text-center",
              render: (row) => (
                <div className="mx-auto flex w-max items-center gap-4">
                  <Tippy content="Edit Expenditure">
                    <button
                      type="button"
                      onClick={() => handleUpdateClick(row.id)}
                      className="btn btn-primary bg-primary"
                    >
                      <IconPencil />
                    </button>
                  </Tippy>

                  <Tippy content="Delete Expenditure">
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
                    <p>Do you want to delete this Expenditure?</p>
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

export default ComponentsDatatablesExpenditure;

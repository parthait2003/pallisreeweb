"use client";
import { useRouter } from "next/navigation";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useEffect, useState, Fragment, useRef } from "react";
import sortBy from "lodash/sortBy";
import IconFile from "@/components/icon/icon-file";
import { Dialog, Transition } from "@headlessui/react";
import IconPrinter from "@/components/icon/icon-printer";
import IconPlus from "../icon/icon-plus";
import IconXCircle from "@/components/icon/icon-x-circle";
import IconPencil from "@/components/icon/icon-pencil";
import IconBince from "@/components/icon/icon-bookmark";
import IconAadhaar from "@/components/icon/icon-aadhaar";
import IconDOB from "@/components/icon/icon-dob";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import { useSelector } from "react-redux";
import { IRootState } from "@/store";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import dayjs from "dayjs";
import Papa from "papaparse";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import IconMagnifyingGlass from "@/components/icon/icon-magnifying-glass";
import { FaSearch } from "react-icons/fa";

const MySwal = withReactContent(Swal);

const showMessage8 = () => {
  MySwal.fire({
    title: "You can upload only one file or remove the last uploaded file",
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
    image: "iweiofthuji",
    sportstype: "cricket",
    name: "Caroline",
    fathersname: "John",
    guardiansname: "Rahul",
    guardiansoccupation: "Service",
    gender: "Female",
    address: "kolkata",
    phoneno: "123456",
    date: "2004-05-28",
    nameoftheschool: "ABC",
    bloodgroup: "O+",
    document: "likgjrtdk",
    adhar: "hjklfhkjsh",
    extraPractice: "Yes",
  },
];

const col = [
  "id",
  "image",
  "sportstype",
  "name",
  "fathersname",
  "guardiansname",
  "guardiansoccupation",
  "gender",
  "address",
  "phoneno",
  "date",
  "nameoftheschool",
  "bloodgroup",
  "document",
  "adhar",
  "extraPractice",
];

const Bloods = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Genders = ["Female", "Male"];

const Sports = ["Cricket", "Football"];

const truncateAddress = (address) => {
  const words = address.split(" ");
  return words.length > 2 ? `${words.slice(0, 2).join(" ")}...` : address;
};

const ComponentsDatatablesTrainee = () => {
  const [file, setFile] = useState(null);
  const [documentfile, setDocumentFile] = useState(null);
  const [adharfile, setAdharFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === "rtl";
  const [date1, setDate1] = useState("2022-07-05");
  const [modal1, setModal1] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100, 500, 1000];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [initialRecords, setInitialRecords] = useState(
    sortBy(initialRowData, "id")
  );
  const [recordsData, setRecordsData] = useState(initialRecords);
  const [customerData, setCustomerData] = useState([]);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [hiddenFileName, setHiddenFileName] = useState("");
  const [recordsDatasort, setRecordsDatashort] = useState("dsc");
  const [modal2, setModal2] = useState(false);
  const [editid, setEditid] = useState("");
  const [deleteid, setDeleteid] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [ageFilter, setAgeFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [sportstypeFilter, setSportstypeFilter] = useState("");
  const [extraPracticeFilter, setExtraPracticeFilter] = useState("");
  const [bloodGroupFilter, setBloodGroupFilter] = useState("");
  const [showCsvUpload, setShowCsvUpload] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [selectedTrainees, setSelectedTrainees] = useState([]);
  const [showSelectedTrainees, setShowSelectedTrainees] = useState(false);
  const [tournamentName, setTournamentName] = useState("");
  const [groundName, setGroundName] = useState("");
  const [tournamentDate, setTournamentDate] = useState("");
  const [note, setNote] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [traineeDetails, setTraineeDetails] = useState(null);
  const [feesDetails, setFeesDetails] = useState(null);
  const [eventType, setEventType] = useState("Tournament"); // New state for dropdown
  const [campName, setCampName] = useState("");
  const [campType, setCampType] = useState("");
  const [campDate, setCampDate] = useState(null);
  const [time, setTime] = useState("");
  const router = useRouter();

  const handleViewClick = (id) => {
    router.push(`/viewtrainee/${id}`);
  };

  const handleCsvFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleCsvUpload = () => {
    if (!csvFile) return;

    const formData = new FormData();
    formData.append("file", csvFile);

    fetch("/api/uploadcsv", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "CSV uploaded and student forms created") {
          MySwal.fire({
            title: `Total ${data.importedCount} records will be imported`,
            toast: true,
            position: "bottom-start",
            showConfirmButton: false,
            timer: 5000,
            showCloseButton: true,
          });
          newTraineeadded();
          fetchTraineeData();
          setShowCsvUpload(false);
        } else {
          console.error("Failed to upload CSV data");
        }
      })
      .catch((error) => {
        console.error("Error uploading CSV data:", error);
      });
  };

  const newTraineeadded = () => {
    MySwal.fire({
      title: "New Trainee has been added",
      toast: true,
      position: "bottom-start",
      showConfirmButton: false,
      timer: 5000,
      showCloseButton: true,
    });
  };

  const updatedTrainee = () => {
    MySwal.fire({
      title: "Trainee has been updated",
      toast: true,
      position: "bottom-start",
      showConfirmButton: false,
      timer: 5000,
      showCloseButton: true,
    });
  };

  const deletedtrainee = () => {
    MySwal.fire({
      title: "Trainee has been deleted",
      toast: true,
      position: "bottom-start",
      showConfirmButton: false,
      timer: 5000,
      showCloseButton: true,
    });
  };

  interface Trainee {
    id: string;
    sportstype: string;
    name: string;
    fathersname: string;
    guardiansname: string;
    guardiansoccupation: string;
    gender: string;
    address: string;
    phoneno: string;
    date: string;
    nameoftheschool: string;
    bloodgroup: string;
    document: string;
    adhar: string;
    extraPractice: string;
  }

  const handleDeleteClick = (value) => {
    setModal2(true);
    setDeleteid(value);
  };

  const fetchTraineeData = async () => {
    try {
      const response = await fetch("/api/studentform");
      if (!response.ok) {
        throw new Error("Failed to fetch trainee data");
      }
      const data = await response.json();

      const formattedTrainee = data.studentforms.map((trainee) => ({
        id: trainee._id,
        image: trainee.image,
        sportstype: trainee.sportstype,
        name: trainee.name,
        fathersname: trainee.fathersname,
        guardiansname: trainee.guardiansname,
        guardiansoccupation: trainee.guardiansoccupation,
        gender: trainee.gender,
        address: trainee.address,
        phoneno: trainee.phoneno,
        date: trainee.date,
        nameoftheschool: trainee.nameoftheschool,
        bloodgroup: trainee.bloodgroup,
        document: trainee.document,
        adhar: trainee.adhar,
        extraPractice: trainee.extraPractice,
      }));

      setInitialRecords(formattedTrainee);
      setRecordsData(
        formattedTrainee.slice((page - 1) * pageSize, page * pageSize)
      );
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchTraineeData();
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
    const filteredRecords = initialRecords.filter((item) => {
      const itemDate = dayjs(item.date).format("YYYY-MM-DD");
      const isInDateRange =
        (!startDate || dayjs(itemDate).isAfter(startDate)) &&
        (!endDate || dayjs(itemDate).isBefore(endDate));
      const age = ageFilter
        ? Math.floor(dayjs().diff(dayjs(item.date), "year"))
        : null;
      const isAgeMatch =
        ageFilter &&
        age >= parseInt(ageFilter.split("-")[0]) &&
        age <= parseInt(ageFilter.split("-")[1]);
      const isGenderMatch = !genderFilter || item.gender === genderFilter;
      const isSportstypeMatch =
        !sportstypeFilter || item.sportstype === sportstypeFilter;
      const isExtraPracticeMatch =
        !extraPracticeFilter || item.extraPractice === extraPracticeFilter;
      const isBloodGroupMatch =
        !bloodGroupFilter || item.bloodgroup === bloodGroupFilter;

      return (
        (search === "" ||
          item.id.toString().includes(search.toLowerCase()) ||
          item.image.toString().includes(search.toLowerCase()) ||
          item.sportstype.toString().includes(search.toLowerCase()) ||
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.fathersname.toLowerCase().includes(search.toLowerCase()) ||
          item.guardiansname.toLowerCase().includes(search.toLowerCase()) ||
          item.guardiansoccupation
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          item.gender.toLowerCase().includes(search.toLowerCase()) ||
          item.address.toLowerCase().includes(search.toLowerCase()) ||
          item.phoneno.toString().includes(search.toLowerCase()) ||
          item.date.toString().includes(search.toLowerCase()) ||
          item.nameoftheschool.toString().includes(search.toLowerCase()) ||
          item.bloodgroup.toLowerCase().includes(search.toLowerCase()) ||
          item.extraPractice.toLowerCase().includes(search.toLowerCase()) ||
          item.document?.toString().includes(search.toLowerCase()) ||
          item.adhar?.toString().includes(search.toLowerCase())) &&
        isInDateRange &&
        (!ageFilter || isAgeMatch) &&
        isGenderMatch &&
        isSportstypeMatch &&
        isExtraPracticeMatch &&
        isBloodGroupMatch
      );
    });

    setRecordsData(
      filteredRecords.slice((page - 1) * pageSize, page * pageSize)
    );
  }, [
    search,
    initialRecords,
    page,
    pageSize,
    startDate,
    endDate,
    ageFilter,
    genderFilter,
    sportstypeFilter,
    extraPracticeFilter,
    bloodGroupFilter,
  ]);

  const handleAddCustomerClick = (e) => {
    e.stopPropagation();
    setShowAddCustomer(!showAddCustomer);
  };

  useEffect(() => {
    const sortedData = sortBy(initialRecords, sortStatus.columnAccessor);
    const finalData =
      sortStatus.direction === "desc" ? sortedData.reverse() : sortedData;
    setRecordsData(finalData.slice((page - 1) * pageSize, page * pageSize));
  }, [sortStatus, page, pageSize, initialRecords]);

  const formatDate = (date) => {
    if (date) {
      return dayjs(date).format("DD/MM/YYYY");
    }
    return "";
  };

  const handleDeleteData = async () => {
    setModal2(false);

    const res = await fetch(`/api/studentform/${deleteid}`, {
      method: "DELETE",
    });

    if (res.ok) {
      fetchTraineeData();
      deletedtrainee();
    }
  };

  const getcustomeval = () => {
    setEditid("");
    setFiles([]);
    setFormData({
      id: "",
      image: "",
      sportstype: "",
      name: "",
      fathersname: "",
      guardiansname: "",
      guardiansoccupation: "",
      gender: "",
      address: "",
      phoneno: "",
      date: "",
      nameoftheschool: "",
      bloodgroup: "",
      document: "",
      adhar: "",
      extraPractice: "Yes",
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

  const handleDocumentChange = (e) => {
    setDocumentFile(e.target.files[0]);
  };

  const handleAdharChange = (e) => {
    setAdharFile(e.target.files[0]);
  };

  const handleDateChange = (date) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      date: date[0] ? date[0].toISOString().split("T")[0] : "",
    }));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      console.error("No files selected");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
  };

  const removeFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    setHiddenFileName("");
  };

  const exportTable = (type) => {
    let columns = col;
    let records = initialRecords;
    let filename = "table";

    let newVariable;
    newVariable = window.navigator;

    if (type === "csv") {
      let coldelimiter = ";";
      let linedelimiter = "\n";
      let result = columns
        .map((d) => {
          return capitalize(d);
        })
        .join(coldelimiter);
      result += linedelimiter;
      records.map((item) => {
        columns.map((d, index) => {
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
    image: "",
    sportstype: "",
    name: "",
    fathersname: "",
    guardiansname: "",
    guardiansoccupation: "",
    gender: "",
    address: "",
    phoneno: "",
    date: "",
    nameoftheschool: "",
    bloodgroup: "",
    document: "",
    adhar: "",
    extraPractice: "Yes",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));
  };

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      id: editid,
    }));
  }, [editid]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    let imageName = "";
    let docname = "";
    let adhname = "";
    if (file) {
      const filename = file.name;
      imageName = formData.phoneno + "-" + filename;
      formData.image = imageName;
    }

    if (documentfile) {
      const documentfilename = documentfile.name;
      docname = formData.phoneno + "-" + documentfilename;
      formData.document = docname;
    }

    if (adharfile) {
      const adharfilename = adharfile.name;
      adhname = formData.phoneno + "-" + adharfilename;
      formData.adhar = adhname;
    }

    try {
      const url = editid ? `/api/studentform/${editid}` : "/api/studentform";
      const method = editid ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        if (editid) {
          updatedTrainee(); // show trainee updated message
        } else {
          newTraineeadded(); // show new trainee added message
        }
        fetchTraineeData();
        setModal1(false);

        const uploadFormData = new FormData();
        if (file) {
          uploadFormData.append("file", file);
          if (documentfile) {
            uploadFormData.append("documentfile", documentfile);
            uploadFormData.append("documentfilename", docname);
          }
          if (adharfile) {
            uploadFormData.append("adharfile", adharfile);
            uploadFormData.append("adharname", adhname);
          }
          uploadFormData.append("imageName", imageName);

          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: uploadFormData,
          });
          if (uploadRes.ok) {
            alert("File uploaded successfully");
          } else {
            alert("File upload failed");
          }
        }

        if (!editid) {
          const [day, month, year] = formData.date.split("/");
          const isoDate = `${year}-${month}-${day}`;

          const reportData = {
            date: isoDate,
            noOfNewTraineeCricket: formData.sportstype === "Cricket" ? 1 : 0,
            noOfNewTraineeFootball: formData.sportstype === "Football" ? 1 : 0,
          };

          const reportRes = await fetch("/api/reports", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(reportData),
          });

          if (reportRes.ok) {
            console.log("Reports updated successfully");
          } else {
            console.error("Failed to update reports");
          }
        }
      } else {
        console.error("Failed to add/update trainee");
      }
    } catch (error) {
      console.log("Error in form submission:", error);
    }
  };

  const handleUpdateClick = async (value) => {
    try {
      const res = await fetch(`/api/studentform/${value}`, {
        method: "GET",
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch data for ID: ${value}`);
      }
      const data = await res.json();
      if (data && data.student) {
        setFormData({
          id: data.student._id || "",
          image: data.student.image || "",
          sportstype: data.student.sportstype || "",
          name: data.student.name || "",
          fathersname: data.student.fathersname || "",
          guardiansname: data.student.guardiansname || "",
          guardiansoccupation: data.student.guardiansoccupation || "",
          gender: data.student.gender || "",
          address: data.student.address || "",
          phoneno: data.student.phoneno || "",
          date: data.student.date ? data.student.date.split("T")[0] : "",
          nameoftheschool: data.student.nameoftheschool || "",
          bloodgroup: data.student.bloodgroup || "",
          document: data.student.document || "",
          adhar: data.student.adhar || "",
          extraPractice: data.student.extraPractice || "Yes",
        });
        setEditid(data.student._id);
        setModal1(true);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleClearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setAgeFilter("");
    setGenderFilter("");
    setSportstypeFilter("");
    setExtraPracticeFilter("");
    setBloodGroupFilter("");
    setSearch("");
  };

  const RenderImage = ({ row }) => {
    const [imageSrc, setImageSrc] = useState("");
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
      const checkImageExists = async (imageUrl) => {
        try {
          const response = await fetch("/api/imagefile", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({ url: imageUrl }),
          });

          if (!response.ok) {
            throw new Error("Image check failed");
          }

          const data = await response.json();
          if (data.exists) {
            setImageSrc(imageUrl);
          } else {
            setImageSrc(
              `/assets/images/trainee_${row.gender.toLowerCase()}.png`
            );
          }
        } catch (error) {
          setImageSrc(`/assets/images/trainee_${row.gender.toLowerCase()}.png`);
        }
      };

      const imageUrl = `https://pallisree.blr1.cdn.digitaloceanspaces.com/${row.image}`;
      checkImageExists(imageUrl);
    }, [row.image, row.gender]);

    return (
      <div
        className="relative flex items-center gap-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={imageSrc}
          className="h-9 w-9 max-w-none rounded-full"
          alt=""
        />
        {isHovered && (
          <div className="bottom-1/8 absolute left-12 z-50">
            <img
              src={imageSrc}
              className="h-40 w-40 max-w-none rounded-lg shadow-lg"
              alt=""
            />
          </div>
        )}
      </div>
    );
  };

  const handleCheckboxChange = (id) => {
    setSelectedTrainees((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((traineeId) => traineeId !== id)
        : [...prevSelected, id]
    );
  };

  const handleShowSelectedTrainees = () => {
    setShowSelectedTrainees(true);
  };

  const handlePrint = () => {
    const printContent = document.getElementById("printableContent");
    const WinPrint = window.open("", "", "width=900,height=650");
    WinPrint.document.write(printContent.innerHTML);
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    WinPrint.close();
  };

  const handleRemoveImage = () => {
    setFile(null);
    setFormData((prevFormData) => ({
      ...prevFormData,
      image: null,
    }));
  };

  const handleRemoveDocument = () => {
    setDocumentFile(null);
    setFormData((prevFormData) => ({
      ...prevFormData,
      document: null,
    }));
  };

  const handleRemoveAdhar = () => {
    setAdharFile(null);
    setFormData((prevFormData) => ({
      ...prevFormData,
      adhar: null,
    }));
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    const startY = 90;

    const getOrdinalSuffix = (n) => {
      const s = ["th", "st", "nd", "rd"],
        v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    const formatDate = (date) => {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
        date
      );
      const day = date.getDate();
      return formattedDate.replace(day, getOrdinalSuffix(day));
    };

    const formatTraineeDate = (date) => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const formatTime = (time) => {
      const [hour, minute] = time.split(":");
      const hourInt = parseInt(hour, 10);
      const ampm = hourInt >= 12 ? "pm" : "am";
      const formattedHour = hourInt % 12 || 12; // Convert to 12-hour format
      return `${formattedHour}:${minute} ${ampm}`;
    };

    const logoUrl = "/assets/images/logo.png";
    const logoImg = new Image();
    logoImg.src = logoUrl;
    logoImg.onload = () => {
      doc.addImage(logoImg, "PNG", 10, 10, 20, 20);

      doc.setFontSize(18);
      doc.text("PALLISREE", 105, 30, { align: "center" });

      doc.setFontSize(12);
      const additionalText = `ESTD: 1946\nRegd. Under Societies Act. XXVI of 1961 • Regd. No. S/5614\nAffiliated to North 24 Parganas District Sports Association through BBSZSA\nBIDHANPALLY • MADHYAMGRAM • KOLKATA - 700129`;
      doc.text(additionalText, 105, 35, { align: "center" });

      doc.setFontSize(10);
      if (eventType === "Tournament") {
        doc.text("Tournament: " + tournamentName, 15, 70);
        doc.text("Ground: " + groundName, 15, 75);
        doc.text("Date: " + formatDate(tournamentDate), 15, 80);
        doc.text("Reporting Time: " + formatTime(time), 15, 85);
        doc.text("Note: " + note, 15, 90);
      } else if (eventType === "Camp") {
        doc.text("Camp: " + campName, 15, 70);
        doc.text("Camp Type: " + campType, 15, 75);
        doc.text("Date: " + formatDate(campDate), 15, 80);
        doc.text("Reporting Time: " + formatTime(time), 15, 85);
        doc.text("Note: " + note, 15, 90);
      }

      const rows = selectedTrainees.map((id, index) => {
        const trainee = initialRecords.find((t) => t.id === id);
        return [
          index + 1,
          trainee.name,
          trainee.phoneno,
          formatTraineeDate(trainee.date),
          trainee.image,
        ];
      });

      autoTable(doc, {
        startY: startY + 10,
        head: [["No", "Name", "Phone No", "DOB"]],
        body: rows,
      });

      doc.save("selected_trainees.pdf");
    };
  };

  const handleDeleteAllClick = () => {
    MySwal.fire({
      title: "Do you want to delete the selected Trainees?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete them!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteSelectedTrainees();
      }
    });
  };

  const handleDeleteSelectedTrainees = async () => {
    try {
      for (let id of selectedTrainees) {
        const res = await fetch(`/api/studentform/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error(`Failed to delete trainee with ID: ${id}`);
        }
      }

      fetchTraineeData();
      setSelectedTrainees([]);
      MySwal.fire({
        title: "Selected Trainees have been deleted",
        toast: true,
        position: "bottom-start",
        showConfirmButton: false,
        timer: 5000,
        showCloseButton: true,
      });
    } catch (error) {
      console.error(error);
      MySwal.fire({
        title: "Error deleting trainees",
        text: error.message,
        icon: "error",
        toast: true,
        position: "bottom-start",
        showConfirmButton: false,
        timer: 5000,
        showCloseButton: true,
      });
    }
  };

  return (
    <div className="panel mt-6">
      <h5 className="mb-5 text-lg font-semibold dark:text-white-light">
        Trainees
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
                            {editid ? "Update Trainees" : "Add Trainees"}
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
                                {formData.image ? (
                                  <div
                                    style={{
                                      position: "relative",
                                      display: "flex",
                                    }}
                                  >
                                    <img
                                      src={`https://pallisree.blr1.cdn.digitaloceanspaces.com/${formData.image}`}
                                      alt="Uploaded"
                                      style={{ maxWidth: "30%" }}
                                    />
                                    <button
                                      onClick={handleRemoveImage}
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
                                    <label htmlFor="image">Upload Image</label>
                                    <input
                                      id="image"
                                      type="file"
                                      name="image"
                                      accept="image/*"
                                      onChange={handleFileChange}
                                      className="form-input"
                                    />
                                  </div>
                                )}
                              </div>

                              <div>
                                <label htmlFor="sportstype">Sports Type</label>
                                <select
                                  id="sportstype"
                                  name="sportstype"
                                  className="form-select"
                                  onChange={handleChange}
                                  value={formData.sportstype}
                                  required
                                >
                                  <option value="">Select Sports Type</option>
                                  {Sports.map((type) => (
                                    <option key={type} value={type}>
                                      {type}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {formData.sportstype === "Cricket" && (
                                <div>
                                  <label htmlFor="extraPractice">
                                    Extra Practice
                                  </label>
                                  <select
                                    id="extraPractice"
                                    name="extraPractice"
                                    className="form-select"
                                    onChange={handleChange}
                                    value={formData.extraPractice}
                                  >
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </select>
                                </div>
                              )}

                              <div>
                                <label htmlFor="name">Name</label>
                                {editid ? (
                                  <label>{formData.name}</label> // Display the name as a label if in edit mode
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

                              <div>
                                <label htmlFor="fathersname">
                                  Father's Name
                                </label>
                                <input
                                  id="fathersname"
                                  type="text"
                                  name="fathersname"
                                  placeholder="Enter father's name"
                                  onChange={handleChange}
                                  className="form-input"
                                  value={formData.fathersname}
                                  required
                                />
                              </div>
                              <div>
                                <label htmlFor="guardiansname">
                                  Guardian's Name
                                </label>
                                <input
                                  id="guardiansname"
                                  type="text"
                                  name="guardiansname"
                                  placeholder="Enter guardian's name"
                                  onChange={handleChange}
                                  className="form-input"
                                  value={formData.guardiansname}
                                  required
                                />
                              </div>
                              <div>
                                <label htmlFor="guardiansoccupation">
                                  Guardian's Occupation
                                </label>
                                <input
                                  id="guardiansoccupation"
                                  type="text"
                                  name="guardiansoccupation"
                                  placeholder="Enter guardian's occupation"
                                  onChange={handleChange}
                                  className="form-input"
                                  value={formData.guardiansoccupation}
                                  required
                                />
                              </div>

                              <div>
                                <label htmlFor="gender">Gender</label>
                                <select
                                  id="gender"
                                  name="gender"
                                  className="form-select"
                                  onChange={handleChange}
                                  value={formData.gender}
                                  required
                                >
                                  <option value="">Select Gender</option>
                                  {Genders.map((type) => (
                                    <option key={type} value={type}>
                                      {type}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label htmlFor="address">Address</label>
                                <input
                                  id="address"
                                  type="text"
                                  name="address"
                                  placeholder="Enter address"
                                  onChange={handleChange}
                                  className="form-input"
                                  value={formData.address}
                                  required
                                />
                              </div>
                              <div>
                                <label htmlFor="phoneno">Phone Number</label>
                                <input
                                  id="phoneno"
                                  type="text"
                                  name="phoneno"
                                  placeholder="Enter phone number"
                                  onChange={handleChange}
                                  className="form-input"
                                  value={formData.phoneno}
                                  required
                                />
                              </div>
                              <div>
                                <label htmlFor="date">Date</label>
                                <Flatpickr
                                  id="date"
                                  value={formData.date}
                                  required
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
                              <div>
                                <label htmlFor="nameoftheschool">
                                  Name of the School
                                </label>
                                <input
                                  id="nameoftheschool"
                                  type="text"
                                  name="nameoftheschool"
                                  placeholder="Enter name of the school"
                                  onChange={handleChange}
                                  className="form-input"
                                  value={formData.nameoftheschool}
                                  required
                                />
                              </div>
                              <div>
                                <label htmlFor="bloodgroup">Blood Group</label>
                                <select
                                  id="bloodgroup"
                                  name="bloodgroup"
                                  className="form-select"
                                  onChange={handleChange}
                                  value={formData.bloodgroup}
                                  required
                                >
                                  <option value="">Select Blood Group</option>
                                  {Bloods.map((type) => (
                                    <option key={type} value={type}>
                                      {type}
                                    </option>
                                  ))}
                                </select>
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

                              <div>
                                {formData.adhar ? (
                                  <div
                                    style={{
                                      position: "relative",
                                      display: "flex",
                                    }}
                                  >
                                    <a
                                      href={`https://pallisree.blr1.cdn.digitaloceanspaces.com/${formData.adhar}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        textDecoration: "none",
                                        color: "blue",
                                      }}
                                    >
                                      View Aadhaar
                                    </a>
                                    <button
                                      onClick={handleRemoveAdhar}
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
                                    <label htmlFor="adhar">
                                      Upload Aadhaar
                                    </label>
                                    <input
                                      id="adhar"
                                      type="file"
                                      name="adhar"
                                      onChange={handleAdharChange}
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
            Trainee
          </button>
          <button
            type="button"
            className="btn btn-primary my-5 ml-2"
            onClick={() => setShowCsvUpload(true)}
          >
            <IconFile className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
            Upload CSV
          </button>
          <button
            type="button"
            onClick={() => exportTable("csv")}
            className="btn btn-primary btn-sm m-1 "
          >
            <IconFile className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
            CSV
          </button>
          <button
            type="button"
            className="btn btn-primary my-5 ml-2"
            onClick={handleShowSelectedTrainees}
          >
            Show Selected Trainees
          </button>
          <button
            type="button"
            className="btn btn-danger my-5 ml-2"
            onClick={handleDeleteAllClick}
          >
            Delete All
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

      <div className="mb-4 flex gap-4">
        <Flatpickr
          options={{ dateFormat: "d/m/Y" }}
          className="form-input"
          placeholder="Start Date"
          onChange={(date) =>
            setStartDate(date[0] ? date[0].toISOString() : null)
          }
        />
        <Flatpickr
          options={{ dateFormat: "d/m/Y" }}
          className="form-input"
          placeholder="End Date"
          onChange={(date) =>
            setEndDate(date[0] ? date[0].toISOString() : null)
          }
        />
        <select
          className="form-input"
          value={ageFilter}
          onChange={(e) => setAgeFilter(e.target.value)}
        >
          <option value="">Select Age</option>
          {[...Array(76)].map((_, index) => (
            <option key={index} value={`${index + 4}-${index + 5}`}>
              {index + 4} - {index + 5} years
            </option>
          ))}
        </select>
        <select
          className="form-input"
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
        >
          <option value="">Select Gender</option>
          {Genders.map((gender) => (
            <option key={gender} value={gender}>
              {gender}
            </option>
          ))}
        </select>
        <select
          className="form-input"
          value={sportstypeFilter}
          onChange={(e) => setSportstypeFilter(e.target.value)}
        >
          <option value="">Select Sportstype</option>
          {Sports.map((sportstype) => (
            <option key={sportstype} value={sportstype}>
              {sportstype}
            </option>
          ))}
        </select>
        <select
          className="form-input"
          value={extraPracticeFilter}
          onChange={(e) => setExtraPracticeFilter(e.target.value)}
        >
          <option value="">Select Extra Practice</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
        <select
          className="form-input"
          value={bloodGroupFilter}
          onChange={(e) => setBloodGroupFilter(e.target.value)}
        >
          <option value="">Select Blood Group</option>
          {Bloods.map((blood) => (
            <option key={blood} value={blood}>
              {blood}
            </option>
          ))}
        </select>
        <button className="btn btn-secondary" onClick={handleClearFilters}>
          Clear
        </button>
      </div>

      <div className="datatables">
        <DataTable
          highlightOnHover
          className="table-hover whitespace-nowrap"
          records={recordsData}
          columns={[
            {
              accessor: "checkbox",
              title: "",
              render: (row) => (
                <input
                  type="checkbox"
                  checked={selectedTrainees.includes(row.id)}
                  onChange={() => handleCheckboxChange(row.id)}
                />
              ),
            },
            {
              accessor: "image",
              sortable: true,
              render: (row) => <RenderImage row={row} />,
            },
            { accessor: "name", sortable: true },
            { accessor: "sportstype", title: "Sports type", sortable: true },
            {
              accessor: "extraPractice",
              title: "Extra Practice",
              sortable: true,
            },
            { accessor: "fathersname", title: "Fathers Name", sortable: true },

            {
              accessor: "guardiansname",
              title: "Guardians name",
              sortable: true,
            },
            {
              accessor: "guardiansoccupation",
              title: "Occupation",
              sortable: true,
            },
            { accessor: "gender", sortable: true },
            {
              accessor: "address",
              sortable: true,
              render: (row) => (
                <Tippy content={row.address}>
                  <span>{truncateAddress(row.address)}</span>
                </Tippy>
              ),
            },
            { accessor: "phoneno", sortable: true },
            {
              accessor: "date",
              title: "DOB",
              sortable: true,
              render: (row) => formatDate(row.date),
            },
            { accessor: "nameoftheschool", title: "School", sortable: true },
            { accessor: "bloodgroup", title: "Blood", sortable: true },
            {
              accessor: "Certificate",
              sortable: true,

              render: (row) => (
                <div className="mx-auto flex w-max items-center gap-4">
                  <Tippy content="Birth Certificate">
                    <button
                      type="button"
                      onClick={() => {
                        window.open(
                          `https://pallisree.blr1.cdn.digitaloceanspaces.com/${row.document}`,
                          "_blank"
                        );
                      }}
                      className="btn"
                    >
                      <IconDOB />
                    </button>
                  </Tippy>
                </div>
              ),
            },

            {
              accessor: "adhar",
              title: "Aadhaar",
              sortable: true,

              render: (row) => (
                <div className="mx-auto flex w-max items-center gap-4">
                  <Tippy content="Aadhaar">
                    <button
                      type="button"
                      onClick={() => {
                        window.open(
                          `https://pallisree.blr1.cdn.digitaloceanspaces.com/${row.adhar}`,
                          "_blank"
                        );
                      }}
                      className="btn"
                    >
                      <IconAadhaar />
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
                  <Tippy content="Edit Trainee">
                    <button
                      type="button"
                      onClick={() => handleUpdateClick(row.id)}
                      className="btn btn-primary bg-primary"
                    >
                      <IconPencil />
                    </button>
                  </Tippy>

                  <Tippy content="Delete Trainee">
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(row.id)}
                      className="btn btn-primary bg-red-500"
                    >
                      <IconXCircle />
                    </button>
                  </Tippy>

                  <Tippy content="View Trainee">
                    <button
                      type="button"
                      onClick={() => handleViewClick(row.id)}
                      className="btn btn-primary bg-blue-500"
                    >
                      <FaSearch />
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
                    <p>Do you want to delete this Trainee?</p>
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
                        onClick={() => handleDeleteData()}
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

      <Transition appear show={showCsvUpload} as={Fragment}>
        <Dialog
          as="div"
          open={showCsvUpload}
          onClose={() => setShowCsvUpload(false)}
        >
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
                    <div className="text-lg font-bold">Upload CSV</div>
                    <button
                      type="button"
                      className="text-white-dark hover:text-dark"
                      onClick={() => setShowCsvUpload(false)}
                      onSubmit={handleCsvUpload}
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
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleCsvUpload();
                        }}
                      >
                        <div>
                          <label htmlFor="csvFile">Upload CSV</label>
                          <input
                            id="csvFile"
                            type="file"
                            name="csvFile"
                            accept=".csv"
                            onChange={handleCsvFileChange}
                            className="form-input"
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

      <Transition appear show={showSelectedTrainees} as={Fragment}>
        <Dialog
          as="div"
          open={showSelectedTrainees}
          onClose={() => setShowSelectedTrainees(false)}
        >
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
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  as="div"
                  className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark"
                >
                  <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                    <div className="text-lg font-bold">Selected Trainees</div>
                    <button
                      type="button"
                      className="text-white-dark hover:text-dark"
                      onClick={() => setShowSelectedTrainees(false)}
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
                  <div className="p-5" id="printableContent">
                    <div className="mb-4">
                      <label htmlFor="eventType">Event Type</label>
                      <select
                        id="eventType"
                        className="form-select"
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                      >
                        <option value="Tournament">Tournament</option>
                        <option value="Camp">Camp</option>
                      </select>
                    </div>

                    {eventType === "Tournament" && (
                      <>
                        <div className="mb-4">
                          <label htmlFor="tournamentName">
                            Tournament Name
                          </label>
                          <input
                            id="tournamentName"
                            type="text"
                            className="form-input"
                            value={tournamentName}
                            onChange={(e) => setTournamentName(e.target.value)}
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="groundName">Ground Name</label>
                          <input
                            id="groundName"
                            type="text"
                            className="form-input"
                            value={groundName}
                            onChange={(e) => setGroundName(e.target.value)}
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="tournamentDate">
                            Tournament Date
                          </label>
                          <DatePicker
                            id="tournamentDate"
                            selected={tournamentDate}
                            onChange={(date) => setTournamentDate(date)}
                            dateFormat="dd/MM/yyyy"
                            className="form-input"
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="time">Time</label>
                          <input
                            id="time"
                            type="time"
                            className="form-input"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                          />
                        </div>
                      </>
                    )}

                    {eventType === "Camp" && (
                      <>
                        <div className="mb-4">
                          <label htmlFor="campName">Camp Name</label>
                          <input
                            id="campName"
                            type="text"
                            className="form-input"
                            value={campName}
                            onChange={(e) => setCampName(e.target.value)}
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="campType">Camp Type</label>
                          <select
                            id="campType"
                            className="form-select"
                            value={campType}
                            onChange={(e) => setCampType(e.target.value)}
                          >
                            <option value="18Trial">18 Trial</option>
                            <option value="15Trial">15 Trial</option>
                            <option value="Division">Division</option>
                            <option value="District">District</option>
                          </select>
                        </div>
                        <div className="mb-4">
                          <label htmlFor="campDate">Camp Date</label>
                          <DatePicker
                            id="campDate"
                            selected={campDate}
                            onChange={(date) => setCampDate(date)}
                            dateFormat="dd/MM/yyyy"
                            className="form-input"
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="campTime">Time</label>
                          <input
                            id="campTime"
                            type="time"
                            className="form-input"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                          />
                        </div>
                      </>
                    )}

                    <div className="mb-4">
                      <label htmlFor="note">Note</label>
                      <textarea
                        id="note"
                        className="form-input"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      ></textarea>
                    </div>
                    <ul>
                      {selectedTrainees.map((id) => {
                        const trainee = initialRecords.find((t) => t.id === id);
                        return (
                          <li key={id} className="mb-4 flex items-center gap-4">
                            <img
                              src={`https://pallisree.blr1.cdn.digitaloceanspaces.com/${trainee.image}`}
                              alt={trainee.name}
                              className="h-16 w-16 rounded-full"
                            />
                            <div>
                              <h4 className="text-lg font-semibold">
                                {trainee.name}
                              </h4>
                              <p>{formatDate(trainee.date)}</p>
                              <p>{trainee.phoneno}</p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      className="btn btn-primary mb-4 mr-4"
                      onClick={handleGeneratePDF}
                    >
                      Generate PDF
                    </button>
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

export default ComponentsDatatablesTrainee;

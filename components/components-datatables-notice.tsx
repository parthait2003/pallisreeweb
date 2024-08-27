"use client";
import React, { useEffect, useState, Fragment } from "react";
import { useSelector } from "react-redux";
import { DataTable } from "mantine-datatable";
import { Dialog, Transition } from "@headlessui/react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import { Pagination } from "@mantine/core";
import "flatpickr/dist/flatpickr.css";
import "tippy.js/dist/tippy.css";

// Importing the icons
import IconPencil from "@/components/icon/icon-pencil";
import IconXCircle from "@/components/icon/icon-x-circle";

const MySwal = withReactContent(Swal);

const ComponentsNotice = () => {
  const [notices, setNotices] = useState([]);
  const [selectedNotices, setSelectedNotices] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editNoticeId, setEditNoticeId] = useState(null);
  const [formData, setFormData] = useState({
    noticeNo: "",
    noticeTitle: "",
    noticeDesc: "",
    noticeDate: "",
    noticeBy: "",
    trainees: [], // Multi-select field
  });
  const [traineeOptions, setTraineeOptions] = useState([]);
  const [traineeMap, setTraineeMap] = useState({});
  const [coachOptions, setCoachOptions] = useState([]);
  const isRtl = useSelector((state) => state.themeConfig.rtlClass) === "rtl";

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchNotices = async () => {
    try {
      const response = await fetch("/api/notice");
      if (!response.ok) {
        throw new Error("Failed to fetch notices");
      }
      const data = await response.json();

      const maxNoticeNo = data.notices.reduce((max, notice) => {
        const num = parseInt(notice.noticeNo.replace("N", ""), 10);
        return num > max ? num : max;
      }, 8);

      setNotices(data.notices || []);
      setFormData((prev) => ({
        ...prev,
        noticeNo: `N${String(maxNoticeNo + 1).padStart(3, "0")}`,
      }));
    } catch (error) {
      console.error("Error fetching notices:", error);
      Swal.fire("Error", "Failed to fetch notices.", "error");
    }
  };

  const fetchTrainees = async () => {
    try {
      const response = await fetch("/api/studentform");
      if (!response.ok) {
        throw new Error("Failed to fetch trainee data");
      }
      const data = await response.json();
      const options = data.studentforms.map((trainee) => ({
        value: trainee._id,
        label: trainee.name,
        joiningDate: trainee.joiningdate,
        extraPractice: trainee.extraPractice === "Yes",
      }));

      const traineeMap = data.studentforms.reduce((acc, trainee) => {
        acc[trainee._id] = trainee.name;
        return acc;
      }, {});

      setTraineeOptions(options);
      setTraineeMap(traineeMap);
    } catch (error) {
      console.error("Error fetching trainee data:", error);
      Swal.fire("Error", "Failed to fetch trainee data.", "error");
    }
  };

  const fetchCoaches = async () => {
    try {
      const response = await fetch("/api/settings");
      if (!response.ok) {
        throw new Error("Failed to fetch coach data");
      }
      const data = await response.json();
      const options = data.couches.map((coach) => ({
        value: coach.name,
        label: coach.name,
      }));
      setCoachOptions(options);
    } catch (error) {
      console.error("Error fetching coach data:", error);
      Swal.fire("Error", "Failed to fetch coach data.", "error");
    }
  };

  useEffect(() => {
    fetchNotices();
    fetchTrainees();
    fetchCoaches();
  }, []);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const method = editNoticeId ? "PUT" : "POST";
    const url = editNoticeId ? `/api/notice/${editNoticeId}` : "/api/notice";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit notice");
      }

      await fetchNotices();
      setModalOpen(false);
      MySwal.fire({
        title: editNoticeId ? "Notice Updated" : "Notice Added",
        toast: true,
        position: "bottom-start",
        showConfirmButton: false,
        timer: 3000,
        showCloseButton: true,
      });
    } catch (error) {
      console.error("Error submitting notice:", error);
      Swal.fire("Error", "Failed to submit notice.", "error");
    }
  };

  const handleEditNotice = (noticeId) => {
    const notice = notices.find((n) => n._id === noticeId);
    setFormData({
      noticeNo: notice.noticeNo,
      noticeTitle: notice.noticeTitle,
      noticeDesc: notice.noticeDesc,
      noticeDate: notice.noticeDate,
      noticeBy: notice.noticeBy,
      trainees: notice.trainees || [],
    });
    setEditNoticeId(noticeId);
    setModalOpen(true);
  };

  const handleDeleteNotice = async (noticeId) => {
    try {
      const response = await fetch(`/api/notice/${noticeId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete notice");
      }

      await fetchNotices();
      Swal.fire("Deleted!", "Notice has been deleted.", "success");
    } catch (error) {
      console.error("Error deleting notice:", error);
      Swal.fire("Error", "Failed to delete notice.", "error");
    }
  };

  const handleDeleteSelectedNotices = async () => {
    try {
      await Promise.all(
        selectedNotices.map(async (noticeId) => {
          const response = await fetch(`/api/notice/${noticeId}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            throw new Error("Failed to delete notice with ID " + noticeId);
          }
        })
      );

      await fetchNotices();
      setSelectedNotices([]);
      Swal.fire("Deleted!", "Selected notices have been deleted.", "success");
    } catch (error) {
      console.error("Error deleting selected notices:", error);
      Swal.fire("Error", "Failed to delete selected notices.", "error");
    }
  };

  const handleTraineeChange = (selectedOptions) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      trainees: selectedOptions.map((option) => option.value),
    }));
  };

  const handleCoachChange = (selectedOption) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      noticeBy: selectedOption.value,
    }));
  };

  const handleAddNotice = () => {
    setFormData({
      noticeNo: `N${String(
        parseInt(notices[notices.length - 1]?.noticeNo.replace("N", ""), 10) +
          1 || 9
      ).padStart(3, "0")}`,
      noticeTitle: "",
      noticeDesc: "",
      noticeDate: "",
      noticeBy: "",
      trainees: [],
    });
    setEditNoticeId(null);
    setModalOpen(true);
  };

  const handleSelectAll = () => {
    const allNoticeIds = notices.map((notice) => notice._id);
    setSelectedNotices(
      selectedNotices.length === notices.length ? [] : allNoticeIds
    );
  };

  const handleSelectNotice = (noticeId) => {
    setSelectedNotices((prevSelected) =>
      prevSelected.includes(noticeId)
        ? prevSelected.filter((id) => id !== noticeId)
        : [...prevSelected, noticeId]
    );
  };

  const paginatedNotices = notices.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="panel mt-6">
      <h5 className="mb-5 text-lg font-semibold">Notices</h5>

      <div className="mb-4 flex space-x-4">
        <button onClick={handleAddNotice} className="btn btn-primary">
          Add Notice
        </button>

        <button
          onClick={handleDeleteSelectedNotices}
          className="btn btn-danger"
          disabled={selectedNotices.length === 0}
        >
          Delete All
        </button>
      </div>

      <DataTable
        records={paginatedNotices}
        columns={[
          {
            accessor: "select",
            title: (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedNotices.length === notices.length}
                  onChange={handleSelectAll}
                />
              </div>
            ),
            render: (row) => (
              <input
                type="checkbox"
                checked={selectedNotices.includes(row._id)}
                onChange={() => handleSelectNotice(row._id)}
              />
            ),
            width: 40,
            sortable: false,
          },
          { accessor: "noticeNo", title: "Notice No", sortable: true },
          { accessor: "noticeTitle", title: "Title", sortable: true },
          { accessor: "noticeDesc", title: "Description", sortable: true },
          {
            accessor: "trainees",
            title: "Trainees",
            render: (row) =>
              row.trainees.map((id) => traineeMap[id]).join(", "),
          },
          {
            accessor: "noticeDate",
            title: "Date",
            sortable: true,
            render: (row) => {
              const date = new Date(row.noticeDate);
              return date.toLocaleDateString("en-GB");
            },
          },
          { accessor: "noticeBy", title: "Issued By", sortable: true },
          {
            accessor: "actions",
            title: "Actions",
            render: (row) => (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditNotice(row._id)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <IconPencil className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteNotice(row._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <IconXCircle className="h-5 w-5" />
                </button>
              </div>
            ),
          },
        ]}
      />

      <div className="mt-4 flex justify-center">
        <Pagination
          page={currentPage}
          onChange={setCurrentPage}
          total={Math.ceil(notices.length / pageSize)}
        />
      </div>

      {modalOpen && (
        <Transition appear show={modalOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => setModalOpen(false)}
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
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        {editNoticeId ? "Edit Notice" : "Add Notice"}
                      </h3>
                      <button
                        onClick={() => setModalOpen(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <IconXCircle className="h-6 w-6" />
                      </button>
                    </div>
                    <form onSubmit={handleFormSubmit}>
                      <div className="mb-4">
                        <label
                          htmlFor="trainees"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Assign to Trainee
                        </label>
                        <Select
                          id="trainees"
                          placeholder="Select Trainees"
                          options={traineeOptions}
                          value={traineeOptions.filter((option) =>
                            formData.trainees.includes(option.value)
                          )}
                          onChange={handleTraineeChange}
                          isMulti
                          isSearchable
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="noticeNo"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Notice No
                        </label>
                        <input
                          id="noticeNo"
                          name="noticeNo"
                          value={formData.noticeNo}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              noticeNo: e.target.value,
                            })
                          }
                          required
                          readOnly={!!editNoticeId}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="noticeTitle"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Title
                        </label>
                        <input
                          id="noticeTitle"
                          name="noticeTitle"
                          value={formData.noticeTitle}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              noticeTitle: e.target.value,
                            })
                          }
                          required
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="noticeDesc"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Description
                        </label>
                        <textarea
                          id="noticeDesc"
                          name="noticeDesc"
                          value={formData.noticeDesc}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              noticeDesc: e.target.value,
                            })
                          }
                          required
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="noticeDate"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Date
                        </label>
                        <Flatpickr
                          id="noticeDate"
                          value={formData.noticeDate}
                          onChange={([date]) =>
                            setFormData({ ...formData, noticeDate: date })
                          }
                          options={{ dateFormat: "d/m/Y" }}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="noticeBy"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Issued By
                        </label>
                        <Select
                          id="noticeBy"
                          placeholder="Select Issuer"
                          options={coachOptions}
                          value={coachOptions.find(
                            (option) => option.value === formData.noticeBy
                          )}
                          onChange={handleCoachChange}
                          isSearchable
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                        />
                      </div>

                      <div className="mt-4">
                        <button
                          type="submit"
                          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
    </div>
  );
};

export default ComponentsNotice;

"use client";

import React, { useState, useEffect } from "react";

const ComponentsDatatablesSettings = () => {
  const [tabs, setTabs] = useState<string>("home");
  const [editid, setEditid] = useState("");
  const [stableMessage, setStableMessage] = useState(""); // State for stable message
  const [popupVisible, setPopupVisible] = useState(false); // State for popup notification
  const [couches, setCouches] = useState([
    { name: "", fee: "", mobile: "", designation: "" },
  ]);
  const [settings, setSettings] = useState({
    regularmonthlyfee: "",
    extrapractice: "",
    membershipfee: "",
    gymfee: "",
    developementfee: "",
    admissionfee: "",
  });

  useEffect(() => {
    // Fetch initial data from the database
    fetch("/api/settings")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setEditid(data._id);
        setSettings({
          regularmonthlyfee: data.regularmonthlyfee,
          extrapractice: data.extrapractice,
          membershipfee: data.membershipfee,
          gymfee: data.gymfee,
          developementfee: data.developementfee,
          admissionfee: data.admissionfee,
        });
        setCouches(data.couches);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });

    // Retrieve stable message from local storage
    const savedMessage = localStorage.getItem("backupMessage");
    if (savedMessage) {
      setStableMessage(savedMessage);
    }
  }, []);

  const toggleTabs = (name: string) => {
    setTabs(name);
  };

  const addNewRow = () => {
    setCouches([
      ...couches,
      { name: "", fee: "", mobile: "", designation: "" },
    ]);
  };

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    const updatedCouches = [...couches];
    updatedCouches[index][name] = value;
    setCouches(updatedCouches);
  };

  const handleSettingsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSettings({
      ...settings,
      [name]: value,
    });
  };

  const deleteRow = (index: number) => {
    const updatedCouches = couches.filter((_, i) => i !== index);
    setCouches(updatedCouches);
  };

  const saveSettings = async () => {
    try {
      const url = editid ? `/api/settings/${editid}` : "/api/settings";
      const method = editid ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          regularmonthlyfee: settings.regularmonthlyfee,
          extrapractice: settings.extrapractice,
          membershipfee: settings.membershipfee,
          gymfee: settings.gymfee,
          developementfee: settings.developementfee,
          admissionfee: settings.admissionfee,
          couches,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Settings saved!", data);

      // Show popup notification
      setPopupVisible(true);
      setTimeout(() => {
        setPopupVisible(false);
      }, 3000); // Hide after 3 seconds
    } catch (error) {
      console.error("There was a problem with the save operation:", error);
    }
  };

  const handleBackup = () => {
    fetch("/api/backup")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `backup_${new Date().toISOString()}.json`
        );
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);

        // Get current date in "dd/mm/yyyy" format
        const currentDate = new Date().toLocaleDateString("en-GB");

        // Set stable message
        const message = `Backup downloaded successfully on ${currentDate}`;
        setStableMessage(message);

        // Save the message to local storage
        localStorage.setItem("backupMessage", message);
      })
      .catch((error) => {
        console.error("There was a problem with the backup operation:", error);
      });
  };

  const clearBackupMessage = () => {
    setStableMessage("");
    localStorage.removeItem("backupMessage");
  };

  return (
    <div className="pt-5">
      <div className="mb-5 flex items-center justify-between">
        <h5 className="text-lg font-semibold dark:text-white-light">
          Settings
        </h5>
      </div>
      <div>
        <ul className="mb-5 overflow-y-auto whitespace-nowrap border-b border-[#ebedf2] font-semibold dark:border-[#191e3a] sm:flex">
          {/* Vos onglets ici */}
        </ul>
      </div>

      {/* Display stable message for backup */}
      {stableMessage && (
        <div className="relative flex items-center border p-3.5 rounded text-primary bg-primary-light !border-primary ltr:border-l-[64px] rtl:border-r-[64px] dark:bg-primary-dark-light">
          <span className="absolute ltr:-left-11 rtl:-right-11 inset-y-0 text-white w-6 h-6 m-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14V11c0-1.306-.835-2.417-2-2.83V7a4 4 0 10-8 0v1.17C6.835 8.583 6 9.694 6 11v3c0 .374-.073.735-.215 1.075L4.5 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </span>
          <span className="ltr:pr-2 rtl:pl-2">
            <strong className="ltr:mr-1 rtl:ml-1">Status:</strong>
            {stableMessage}
          </span>
          
        </div>
      )}

      <div>
        <form className="mb-5 rounded-md border border-[#ebedf2] bg-white p-4 dark:border-[#191e3a] dark:bg-black">
          <h6 className="mb-5 text-lg font-bold">Income Settings</h6>
          <div className="flex flex-col sm:flex-row">
            <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="regularmonthlyfee">Regular Monthly Fee</label>
                <input
                  id="regularmonthlyfee"
                  name="regularmonthlyfee"
                  type="text"
                  className="form-input"
                  value={settings.regularmonthlyfee}
                  onChange={handleSettingsChange}
                />
              </div>
              <div>
                <label htmlFor="gymfee">Gym Fee</label>
                <input
                  id="gymfee"
                  name="gymfee"
                  type="text"
                  className="form-input"
                  value={settings.gymfee}
                  onChange={handleSettingsChange}
                />
              </div>
              <div>
                <label htmlFor="extrapractice">
                  Extra Practice Monthly Fee
                </label>
                <input
                  id="extrapractice"
                  name="extrapractice"
                  type="text"
                  className="form-input"
                  value={settings.extrapractice}
                  onChange={handleSettingsChange}
                />
              </div>
              <div>
                <label htmlFor="developementfee">Development Fee</label>
                <input
                  id="developementfee"
                  name="developementfee"
                  type="text"
                  className="form-input"
                  value={settings.developementfee}
                  onChange={handleSettingsChange}
                />
              </div>
              <div>
                <label htmlFor="membershipfee">Membership Fee</label>
                <input
                  id="membershipfee"
                  name="membershipfee"
                  type="text"
                  className="form-input"
                  value={settings.membershipfee}
                  onChange={handleSettingsChange}
                />
              </div>
              <div>
                <label htmlFor="admissionfee">Admission Fee</label>
                <input
                  id="admissionfee"
                  name="admissionfee"
                  type="text"
                  className="form-input"
                  value={settings.admissionfee}
                  onChange={handleSettingsChange}
                />
              </div>
            </div>
          </div>
        </form>

        <form className="mb-5 rounded-md border border-[#ebedf2] bg-white p-4 dark:border-[#191e3a] dark:bg-black">
          <h6 className="mb-5 text-lg font-bold">Coaches Payment</h6>
          {couches && couches.length > 0 ? (
            couches.map((couch, index) => (
              <div
                key={index}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 items-center"
              >
                <div>
                  <label htmlFor={`couchName-${index}`}>Coach Name</label>
                  <input
                    id={`couchName-${index}`}
                    name="name"
                    type="text"
                    className="form-input"
                    value={couch.name}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </div>
                <div>
                  <label htmlFor={`couchFee-${index}`}>Fee</label>
                  <input
                    id={`couchFee-${index}`}
                    name="fee"
                    type="text"
                    className="form-input"
                    value={couch.fee}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </div>
                <div>
                  <label htmlFor={`couchMobile-${index}`}>Mobile no</label>
                  <input
                    id={`couchMobile-${index}`}
                    name="mobile"
                    type="text"
                    className="form-input"
                    value={couch.mobile}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </div>
                <div>
                  <label htmlFor={`couchDesignation-${index}`}>
                    Designation
                  </label>
                  <select
                    id={`couchDesignation-${index}`}
                    name="designation"
                    className="form-select"
                    value={couch.designation}
                    onChange={(e) => handleInputChange(index, e)}
                  >
                    <option value="">Select Designation</option>
                    <option value="Head Coach">Head Coach</option>
                    <option value="Assistant Coach">Assistant Coach</option>
                    <option value="Bowling Coach">Bowling Coach</option>
                    <option value="Batting Coach">Batting Coach</option>
                    <option value="Fielding Coach">Fielding Coach</option>
                    <option value="Strength and Conditioning Coach">
                      Strength and Conditioning Coach
                    </option>
                    <option value="Spin Bowling Coach">
                      Spin Bowling Coach
                    </option>
                    <option value="Mental Conditioning Coach">
                      Mental Conditioning Coach
                    </option>
                  </select>
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => deleteRow(index)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No coaches data available.</p>
          )}
          <div className="mt-3">
            <button
              type="button"
              className="btn btn-primary"
              onClick={addNewRow}
            >
              Add New Row
            </button>
          </div>
        </form>

        <div className="flex justify-end mt-5">
          <button
            type="button"
            className="btn btn-success"
            onClick={saveSettings}
          >
            Save
          </button>
        </div>
      </div>

      {/* Popup notification for data update */}
      {popupVisible && (
         <div className="fixed bottom-5 right-5 bg-gray-800 text-white p-3 rounded shadow-lg flex items-center justify-between">
          <span>Data updated successfully</span>
          <button
            onClick={() => setPopupVisible(false)}
            className="bg-transparent text-white"
          >
            &times;
          </button>
        </div>
      )}

      <div className="mt-10">
        <h6 className="text-lg font-bold">Backup</h6>
        <button
          type="button"
          className="btn btn-secondary mt-3"
          onClick={handleBackup}
        >
          Download Database Backup
        </button>
      </div>
    </div>
  );
};

export default ComponentsDatatablesSettings;

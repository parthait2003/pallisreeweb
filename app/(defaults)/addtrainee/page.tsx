"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import Swal from "sweetalert2";
import dayjs from "dayjs";

const Bloods = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const Genders = ["Female", "Male"];
const Sports = ["Cricket", "Football"];

const AddTraineePage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [documentfile, setDocumentFile] = useState<File | null>(null);
  const [adharfile, setAdharFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState("");
  const [formData, setFormData] = useState({
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
    extraPractice: "Yes",
    joiningdate: dayjs().format("DD/MM/YYYY"),
    image: "",
    document: "",
    adhar: "",
  });

  const router = useRouter();

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
            `/assets/images/trainee_${formData.gender.toLowerCase()}.png`
          );
        }
      } catch (error) {
        setImageSrc(`/assets/images/trainee_${formData.gender.toLowerCase()}.png`);
      }
    };

    if (formData.image) {
      const imageUrl = `https://pallisree.blr1.cdn.digitaloceanspaces.com/${formData.image}`;
      checkImageExists(imageUrl);
    }
  }, [formData.image, formData.gender]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files ? e.target.files[0] : null);
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentFile(e.target.files ? e.target.files[0] : null);
  };

  const handleAdharChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdharFile(e.target.files ? e.target.files[0] : null);
  };

  const handleDateChange = (date: Date[]) => {
    if (date && date.length > 0) {
      const formattedDate = dayjs(date[0]).format("DD/MM/YYYY");
      setFormData((prevFormData) => ({
        ...prevFormData,
        date: formattedDate,
      }));
    }
  };

  const handleJoiningDateChange = (date: Date[]) => {
    if (date && date.length > 0) {
      const formattedDate = dayjs(date[0]).format("DD/MM/YYYY");
      setFormData((prevFormData) => ({
        ...prevFormData,
        joiningdate: formattedDate,
      }));
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Check if the phone number already exists
    try {
      const checkRes = await fetch("/api/checktrainee", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ phoneno: formData.phoneno }),
      });

      if (checkRes.ok) {
        const checkData = await checkRes.json();
        if (checkData.exists) {
          Swal.fire({
            icon: "error",
            title: "This trainee already exists",
            text: "A trainee with this phone number is already in the database.",
          });
          return; // Stop the form submission if the trainee exists
        }
      }
    } catch (error) {
      console.error("Error checking trainee:", error);
      return;
    }

    const formattedFormData = {
      ...formData,
      dob: formData.dob ? formData.dob.split("/").reverse().join("-") : "",
      joiningdate: formData.joiningdate
        ? formData.joiningdate.split("/").reverse().join("-")
        : "",
    };
  
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
      const res = await fetch("/api/studentform", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (res.ok) {
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
  
          await fetch("/api/upload", {
            method: "POST",
            body: uploadFormData,
          });
        }
  
        // Use the current date for the report
        const reportData = {
          date: new Date().toISOString().split("T")[0], // Use today's date in YYYY-MM-DD format
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
  
        // Reset form data
        setFormData({
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
          extraPractice: "Yes",
          joiningdate: dayjs().format("DD/MM/YYYY"),
          image: "",
          document: "",
          adhar: "",
        });
  
        setFile(null);
        setDocumentFile(null);
        setAdharFile(null);
  
        // Refresh the page
        router.refresh();
      } else {
        console.error("Failed to add trainee");
      }
    } catch (error) {
      console.log("Error in form submission:", error);
    }
  };
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-6 text-2xl font-semibold">Add Trainee</h1>
      <form onSubmit={handleFormSubmit}>
        <div className="mb-4">
          <label htmlFor="sportstype" className="block text-sm font-medium">
            Sports Type
          </label>
          <select
            id="sportstype"
            name="sportstype"
            value={formData.sportstype}
            onChange={handleChange}
            className="form-select mt-1 block w-full"
            required
          >
            <option value="">Select Sports Type</option>
            {Sports.map((sport) => (
              <option key={sport} value={sport}>
                {sport}
              </option>
            ))}
          </select>
        </div>

        {formData.sportstype === "Cricket" && (
          <div className="mb-4">
            <label
              htmlFor="extraPractice"
              className="block text-sm font-medium"
            >
              Extra Practice
            </label>
            <select
              id="extraPractice"
              name="extraPractice"
              value={formData.extraPractice}
              onChange={handleChange}
              className="form-select mt-1 block w-full"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="form-input mt-1 block w-full"
            placeholder="Enter name"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="fathersname" className="block text-sm font-medium">
            Father's Name
          </label>
          <input
            id="fathersname"
            name="fathersname"
            type="text"
            value={formData.fathersname}
            onChange={handleChange}
            className="form-input mt-1 block w-full"
            placeholder="Enter father's name"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="guardiansname" className="block text-sm font-medium">
            Guardian's Name
          </label>
          <input
            id="guardiansname"
            name="guardiansname"
            type="text"
            value={formData.guardiansname}
            onChange={handleChange}
            className="form-input mt-1 block w-full"
            placeholder="Enter guardian's name"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="guardiansoccupation"
            className="block text-sm font-medium"
          >
            Guardian's Occupation
          </label>
          <input
            id="guardiansoccupation"
            name="guardiansoccupation"
            type="text"
            value={formData.guardiansoccupation}
            onChange={handleChange}
            className="form-input mt-1 block w/full"
            placeholder="Enter guardian's occupation"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="gender" className="block text-sm font-medium">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="form-select mt-1 block w/full"
            required
          >
            <option value="">Select Gender</option>
            {Genders.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium">
            Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            className="form-input mt-1 block w/full"
            placeholder="Enter address"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="phoneno" className="block text-sm font-medium">
            Phone Number
          </label>
          <input
            id="phoneno"
            name="phoneno"
            type="text"
            value={formData.phoneno}
            onChange={handleChange}
            className="form-input mt-1 block w/full"
            placeholder="Enter phone number"
            maxLength={10}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="date" className="block text-sm font-medium">
            Date of Birth
          </label>
          <Flatpickr
            id="date"
            value={formData.date}
            onChange={handleDateChange}
            options={{ dateFormat: "d/m/Y" }}
            className="form-input mt-1 block w/full"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="nameoftheschool"
            className="block text-sm font-medium"
          >
            Name of the School
          </label>
          <input
            id="nameoftheschool"
            name="nameoftheschool"
            type="text"
            value={formData.nameoftheschool}
            onChange={handleChange}
            className="form-input mt-1 block w/full"
            placeholder="Enter name of the school"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="bloodgroup" className="block text-sm font-medium">
            Blood Group
          </label>
          <select
            id="bloodgroup"
            name="bloodgroup"
            value={formData.bloodgroup}
            onChange={handleChange}
            className="form-select mt-1 block w/full"
            
          >
            <option value="">Select Blood Group</option>
            {Bloods.map((blood) => (
              <option key={blood} value={blood}>
                {blood}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="joiningdate" className="block text-sm font-medium">
            Joining Date
          </label>
          <Flatpickr
            id="joiningdate"
            value={formData.joiningdate}
            onChange={handleJoiningDateChange}
            options={{ dateFormat: "d/m/Y" }}
            className="form-input mt-1 block w/full"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium">
            Upload Image
          </label>
          <input
            id="image"
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className="form-input mt-1 block w/full"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="document" className="block text-sm font-medium">
            Upload Birth certificate
          </label>
          <input
            id="document"
            type="file"
            name="document"
            onChange={handleDocumentChange}
            className="form-input mt-1 block w/full"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="adhar" className="block text-sm font-medium">
            Upload Aadhaar
          </label>
          <input
            id="adhar"
            type="file"
            name="adhar"
            onChange={handleAdharChange}
            className="form-input mt-1 block w/full"
          />
        </div>

        <button type="submit" className="btn btn-primary mt-6">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddTraineePage;

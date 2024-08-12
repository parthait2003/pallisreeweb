"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";

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

const ViewTrainee = () => {
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.split("/").pop();

  const currentYear = new Date().getFullYear().toString();
  const currentMonthIndex = new Date().getMonth(); // 0-based index for the current month

  const [traineeDetails, setTraineeDetails] = useState(null);
  const [feesDetails, setFeesDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingMonths, setPendingMonths] = useState([]);

  useEffect(() => {
    if (!id) {
      console.error("ID is not defined");
      setError("ID is not defined");
      setLoading(false);
      return;
    }

    const fetchTraineeDetails = async () => {
      try {
        const traineeRes = await fetch(`/api/studentform/${id}`);
        if (!traineeRes.ok) throw new Error(`Failed to fetch trainee details`);

        const traineeData = await traineeRes.json();
        const trainee = traineeData.student;

        const feesRes = await fetch(`/api/subscription?traineeId=${id}`);
        if (!feesRes.ok) throw new Error(`Failed to fetch fees details`);

        const feesData = await feesRes.json();

        const traineeSubscriptions = feesData.subscriptions.filter(
          (f) => f.traineeid === id && f.year === currentYear
        );

        const paidMonths = traineeSubscriptions.flatMap((sub) =>
          sub.monthsSelected.map((month) => month.month)
        );

        let monthsToCheck;
        if (currentYear === "2024") {
          monthsToCheck = allMonthsOptions.slice(3, currentMonthIndex + 1); // From April to current month for 2024
        } else {
          monthsToCheck = allMonthsOptions.slice(0, currentMonthIndex + 1); // From January to current month for other years
        }

        const pending = monthsToCheck.filter(
          (month) => !paidMonths.includes(month.value)
        );

        setTraineeDetails({
          ...trainee,
          imageUrl: `https://pallisree.blr1.cdn.digitaloceanspaces.com/${trainee.image}`,
        });

        setFeesDetails(traineeSubscriptions);
        setPendingMonths(pending);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTraineeDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="flex space-x-2 rtl:space-x-reverse">
        <ul className="flex space-x-2 rtl:space-x-reverse">
          <li>
            <Link href="/trainee" className="text-primary hover:underline">
              Trainees
            </Link>
          </li>
          <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
            <span>Profile</span>
          </li>
        </ul>
      </div>
      <div className="pt-5">
        <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-3 xl:grid-cols-4">
          <div className="panel">
            <div className="mb-5 flex items-center justify-between">
              <h5 className="text-lg font-semibold dark:text-white-light">
                Profile
              </h5>
            </div>
            <div className="mb-5">
              <div className="flex flex-col items-center justify-center">
                <img
                  src={traineeDetails?.imageUrl}
                  alt={traineeDetails?.name}
                  className="mb-5 h-24 w-24 rounded-full object-cover"
                />
                <p className="text-xl font-semibold text-primary">
                  {traineeDetails?.name}
                </p>
              </div>
              <ul className="m-auto mt-5 flex max-w-[300px] flex-col space-y-4 font-semibold text-white-dark">
                <li className="flex items-center gap-2">
                  <span className="font-bold text-black">Father's Name:</span>{" "}
                  {traineeDetails?.fathersname}
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-bold text-black">Guardian's Name:</span>{" "}
                  {traineeDetails?.guardiansname}
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-bold text-black">
                    {" "}
                    Guardian's Occupation:{" "}
                  </span>{" "}
                  {traineeDetails?.guardiansoccupation}
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-bold text-black"> Gender: </span>{" "}
                  {traineeDetails?.gender}
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-bold text-black"> Address: </span>{" "}
                  {traineeDetails?.address}
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-bold text-black"> Phone No: </span>{" "}
                  {traineeDetails?.phoneno}
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-bold text-black"> Date of Birth: </span>{" "}
                  {traineeDetails?.date}
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-bold text-black"> School: </span>{" "}
                  {traineeDetails?.nameoftheschool}
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-bold text-black"> Blood Group: </span>{" "}
                  {traineeDetails?.bloodgroup}
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-bold text-black">
                    {" "}
                    Extra Practice:{" "}
                  </span>{" "}
                  {traineeDetails?.extraPractice}
                </li>
              </ul>
            </div>
          </div>
          <div className="panel lg:col-span-2 xl:col-span-3">
            <div className="mb-5">
              <h5 className="text-lg font-semibold dark:text-white-light">
                Fees Details
              </h5>
            </div>

            {/* Display pending months at the top of the Fees Details section */}
            {pendingMonths.length > 0 && (
              <div className="mb-5">
                <h5 className="text-lg font-semibold text-red-600">
                  Pending Payments
                </h5>
                <div className="flex flex-wrap">
                  {pendingMonths.map((month, index) => (
                    <span
                      key={index}
                      className="pending-month-badge inline-block border border-red-300 p-2 m-1 rounded bg-red-100 text-red-600"
                    >
                      &#10060; {month.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <h5 className="text-lg font-semibold text-black-600">
              Payments Details
            </h5>
            <div className="grid gap-5 lg:grid-cols-3">
              {feesDetails && feesDetails.length > 0 ? (
                feesDetails.map((feeDetail) => (
                  <div
                    key={feeDetail._id}
                    className="rounded-lg shadow-lg p-5 bg-white dark:bg-gray-800 flex justify-between items-start"
                  >
                    <ul className="space-y-2">
                      <li>
                        <strong>Bill No:</strong> {feeDetail.billNo}
                      </li>
                      <li>
                        <strong>Year:</strong> {feeDetail.year}
                      </li>
                      <li>
                        <strong>Paid Months:</strong>{" "}
                        {feeDetail.monthsSelected
                          .map((month) => month.month)
                          .join(", ")}
                      </li>
                      <li>
                        <strong>Extra Practice Months:</strong>{" "}
                        {feeDetail.extraPracticeMonthsSelected
                          .map((month) => month.month)
                          .join(", ")}
                      </li>
                      {feeDetail.subscriptionType.length > 0 && (
                        <>
                          <li>
                            <strong>Other Fees:</strong>
                          </li>
                          <ul className="pl-4 list-disc">
                            {feeDetail.subscriptionType.map((sub, index) => (
                              <li key={index}>
                                {sub.type}: {sub.amount}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                      <li>
                        <strong>Total Amount:</strong> {feeDetail.amount}
                      </li>
                    </ul>
                    <div className="text-right">
                      <strong>Date:</strong>

                      {new Date(feeDetail.date).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <p>No fee details available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .pending-month-badge {
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
      `}</style>
    </div>
  );
};

export default ViewTrainee;

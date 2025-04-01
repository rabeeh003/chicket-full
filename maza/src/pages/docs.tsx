import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { useEffect, useState } from "react";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/table";
import { Image } from "@heroui/image";

interface Feedback {
  id: number;
  date: string;
  time: string;
  name: string;
  phone: string | null;
  branch: string;
  email: string | null;
  cooking: string | null;
  speed_of_service: string | null;
  friendliness: string | null;
  store_cleanliness: string | null;
  time_to_receive: string | null;
  commend: string | null;
  picture: string | null;
  created_at: string;
  updated_at: string;
}

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [filteredFeedback, setFilteredFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");

  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("https://chicketarabia.com/api/feedback", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const responseData = await response.json();

        if (!response.ok) {
          if (responseData.error === "Invalid token.") {
            localStorage.removeItem("token");
            setError("Invalid token. Please log in.");
            setLoading(false);
            window.location.reload();
            return;
          }
          throw new Error(responseData.error || "Failed to fetch feedback");
        }

        const data: Feedback[] = responseData.feedback;
        setFeedback(data);
        setFilteredFeedback(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  useEffect(() => {
    let filteredData = feedback;

    if (startDate || endDate) {
      filteredData = filteredData.filter((item) => {
        const itemDate = new Date(item.date);
        const from = startDate ? new Date(startDate) : null;
        const to = endDate ? new Date(endDate) : null;

        return (!from || itemDate >= from) && (!to || itemDate <= to);
      });
    }

    if (selectedBranch) {
      filteredData = filteredData.filter((item) => item.branch === selectedBranch);
    }

    setFilteredFeedback(filteredData);
  }, [startDate, endDate, selectedBranch, feedback]);

  const uniqueBranches = Array.from(new Set(feedback.map((item) => item.branch)));

  return (
    <DefaultLayout>
      <section className="flex flex-col md:items-center relative justify-center gap-4">
        <h1 className={title()}>Customer Feedback</h1>

        {/* Filtering Inputs */}
        <div className="flex flex-wrap gap-4 mb-4">
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="border w-full sm:w-fit p-2 rounded-md"
          >
            <option value="">All Branches</option>
            {uniqueBranches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
          <div className="flex w-full sm:w-fit gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-2 w-full sm:w-fit rounded-md"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-2 w-full sm:w-fit rounded-md"
            />
          </div>
        </div>

        <div className="inline-block max-w-[1200px] text-center justify-center">
          {loading ? (
            <p className="mt-4 text-gray-500">Loading feedback...</p>
          ) : error ? (
            <p className="mt-4 text-red-500">Error: {error}</p>
          ) : filteredFeedback.length === 0 ? (
            <p className="mt-4 text-gray-500">No feedback available.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table aria-label="Form collection table">
                <TableHeader className="bg-gray-50 sticky top-0 z-10">
                  <TableColumn>Branch</TableColumn>
                  <TableColumn>Date</TableColumn>
                  <TableColumn>Time</TableColumn>
                  <TableColumn>Name</TableColumn>
                  <TableColumn>Phone</TableColumn>
                  <TableColumn>Email</TableColumn>
                  <TableColumn>Cooking</TableColumn>
                  <TableColumn>Speed</TableColumn>
                  <TableColumn>Friendliness</TableColumn>
                  <TableColumn>Store Cleanliness</TableColumn>
                  <TableColumn>Time to Receive</TableColumn>
                  <TableColumn>Comments</TableColumn>
                  <TableColumn>Attachment</TableColumn>
                </TableHeader>
                <TableBody>
                  {filteredFeedback.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.branch}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.time}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.phone || "N/A"}</TableCell>
                      <TableCell>{item.email || "N/A"}</TableCell>
                      <TableCell>{item.cooking || "N/A"}</TableCell>
                      <TableCell>{item.speed_of_service || "N/A"}</TableCell>
                      <TableCell>{item.friendliness || "N/A"}</TableCell>
                      <TableCell>{item.store_cleanliness || "N/A"}</TableCell>
                      <TableCell>{item.time_to_receive || "N/A"}</TableCell>
                      <TableCell>{item.commend || "N/A"}</TableCell>
                      <TableCell>
                        {item.picture ? (
                          <a
                            href={"https://chicket.onrender.com/" + item.picture}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700 underline"
                          >
                            <Image
                              isBlurred
                              alt="Attachment"
                              className="m-1"
                              src={"https://chicket.onrender.com/" + item.picture}
                              width={80}
                            />
                          </a>
                        ) : (
                          "None"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </section>
    </DefaultLayout>
  );
}

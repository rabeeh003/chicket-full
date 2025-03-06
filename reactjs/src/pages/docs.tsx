import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { useEffect, useState } from "react";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/table";
import { Image } from "@heroui/image";

interface Feedback {
  _id: number;
  date: string;
  time: string;
  name: string;
  phone: string;
  branch: string;
  email: string;
  meal: string;
  meal_temperature: string;
  cooking: string;
  speed_of_service: string;
  friendliness: string;
  dining_room: string;
  outdoor_cleanliness: string;
  visit_frequency: string;
  service_time: string;
  staff_available: string;
  bathroom_clean: string;
  uniform_clean: string;
  comments: string;
  attachment: string | null;
}

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [filteredFeedback, setFilteredFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

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
        const response = await fetch("https://fadmin.chicketarabia.com/api/submissions", {
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
  
        const data: Feedback[] = responseData;
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
    if (!startDate && !endDate) {
      setFilteredFeedback(feedback);
      return;
    }

    const filteredData = feedback.filter((item) => {
      const itemDate = new Date(item.date);
      const from = startDate ? new Date(startDate) : null;
      const to = endDate ? new Date(endDate) : null;

      return (!from || itemDate >= from) && (!to || itemDate <= to);
    });

    setFilteredFeedback(filteredData);
  }, [startDate, endDate, feedback]);

  const formatRating = (rating: string) => {
    return rating.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatYesNo = (value: string) => {
    return value === "yes" ? "Yes" : "No";
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col md:items-center relative justify-center gap-4">
        <h1 className={title()}>Customer Feedback</h1>

        {/* Date Filtering Inputs */}
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded-md"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded-md"
          />
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
                  <TableColumn>Meal</TableColumn>
                  <TableColumn>Meal Temp</TableColumn>
                  <TableColumn>Cooking</TableColumn>
                  <TableColumn>Speed</TableColumn>
                  <TableColumn>Friendliness</TableColumn>
                  <TableColumn>Dining Room</TableColumn>
                  <TableColumn>Outdoor</TableColumn>
                  <TableColumn>Frequency</TableColumn>
                  <TableColumn>Wait Time</TableColumn>
                  <TableColumn>Staff Available</TableColumn>
                  <TableColumn>Bathroom Clean</TableColumn>
                  <TableColumn>Uniform Clean</TableColumn>
                  <TableColumn>Comments</TableColumn>
                  <TableColumn>Attachment</TableColumn>
                </TableHeader>
                <TableBody>
                  {filteredFeedback.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{item.branch}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.time}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.phone}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>{item.meal}</TableCell>
                      <TableCell>{formatRating(item.meal_temperature)}</TableCell>
                      <TableCell>{formatRating(item.cooking)}</TableCell>
                      <TableCell>{formatRating(item.speed_of_service)}</TableCell>
                      <TableCell>{formatRating(item.friendliness)}</TableCell>
                      <TableCell>{formatRating(item.dining_room)}</TableCell>
                      <TableCell>{formatRating(item.outdoor_cleanliness)}</TableCell>
                      <TableCell>{formatRating(item.visit_frequency)}</TableCell>
                      <TableCell>{item.service_time} min</TableCell>
                      <TableCell>{formatYesNo(item.staff_available)}</TableCell>
                      <TableCell>{formatYesNo(item.bathroom_clean)}</TableCell>
                      <TableCell>{formatYesNo(item.uniform_clean)}</TableCell>
                      <TableCell>{item.comments}</TableCell>
                      <TableCell>
                        {item.attachment ? (
                          <a
                            href={"https://chicket.onrender.com" + item.attachment}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700 underline"
                          >
                            <Image
                              isBlurred
                              alt="Attachment"
                              className="m-1"
                              src={"https://chicket.onrender.com" + item.attachment}
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

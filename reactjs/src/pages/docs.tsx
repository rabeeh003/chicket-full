import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { useEffect, useState } from "react";
import {  Table,  TableHeader,  TableBody,  TableColumn,  TableRow,  TableCell} from "@heroui/table";
// Updated TypeScript interface to match actual API response
interface Feedback {
  id: number;
  date: string;
  time: string;
  name: string;
  phone: string;
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);

      const token = localStorage.getItem("token"); // Get token from localStorage
      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("https://chicket.onrender.com/api/submissions", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send token in headers
          },
        });

        if (!response.ok) throw new Error("Failed to fetch feedback");

        const data: Feedback[] = await response.json();
        setFeedback(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  // Helper function to format rating values
  const formatRating = (rating: string) => {
    return rating.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Helper function to format yes/no values
  const formatYesNo = (value: string) => {
    return value === "yes" ? "Yes" : "No";
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-5xl text-center justify-center">
          <h1 className={title()}>Customer Feedback</h1>

          {loading ? (
            <p className="mt-4 text-gray-500">Loading feedback...</p>
          ) : error ? (
            <p className="mt-4 text-red-500">Error: {error}</p>
          ) : feedback.length === 0 ? (
            <p className="mt-4 text-gray-500">No feedback available.</p>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <Table aria-label="Form collection table">
                <TableHeader className="bg-gray-50">
                    <TableColumn key={"id"}>ID</TableColumn>
                    <TableColumn key={"date"}>Date</TableColumn>
                    <TableColumn key={"time"}>Time</TableColumn>
                    <TableColumn key={"name"}>Name</TableColumn>
                    <TableColumn key={"phone"}>Phone</TableColumn>
                    <TableColumn key={"email"}>Email</TableColumn>
                    <TableColumn key={"meal"}>Meal</TableColumn>
                    <TableColumn key={"mealtemp"}>Meal Temp</TableColumn>
                    <TableColumn key={"cooking"}>Cooking</TableColumn>
                    <TableColumn key={"speed"}>Speed</TableColumn>
                    <TableColumn key={"friendliness"}>Friendliness</TableColumn>
                    <TableColumn key={"dining"}>Dining Room</TableColumn>
                    <TableColumn key={"outdoor"}>Outdoor</TableColumn>
                    <TableColumn key={"frequency"}>Frequency</TableColumn>
                    <TableColumn key={"wait"}>Wait Time</TableColumn>
                    <TableColumn key={"staff"}>Staff Available</TableColumn>
                    <TableColumn key={"bathroom"}>Bathroom Clean</TableColumn>
                    <TableColumn key={"uniform"}>Uniform Clean</TableColumn>
                    <TableColumn key={"comments"}>Comments</TableColumn>
                    <TableColumn key={"attachment"}>Attachment</TableColumn>
                </TableHeader>
                <TableBody >
                  {feedback.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell >{item.id}</TableCell>
                      <TableCell >{item.date}</TableCell>
                      <TableCell >{item.time}</TableCell>
                      <TableCell >{item.name}</TableCell>
                      <TableCell >{item.phone}</TableCell>
                      <TableCell >{item.email}</TableCell>
                      <TableCell >{item.meal}</TableCell>
                      <TableCell >{formatRating(item.meal_temperature)}</TableCell>
                      <TableCell >{formatRating(item.cooking)}</TableCell>
                      <TableCell >{formatRating(item.speed_of_service)}</TableCell>
                      <TableCell >{formatRating(item.friendliness)}</TableCell>
                      <TableCell >{formatRating(item.dining_room)}</TableCell>
                      <TableCell >{formatRating(item.outdoor_cleanliness)}</TableCell>
                      <TableCell >{formatRating(item.visit_frequency)}</TableCell>
                      <TableCell >{item.service_time} min</TableCell>
                      <TableCell >{formatYesNo(item.staff_available)}</TableCell>
                      <TableCell >{formatYesNo(item.bathroom_clean)}</TableCell>
                      <TableCell >{formatYesNo(item.uniform_clean)}</TableCell>
                      <TableCell >{item.comments}</TableCell>
                      <TableCell >
                        {item.attachment ? (
                          <a
                            href={item.attachment}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700 underline"
                          >
                            View
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
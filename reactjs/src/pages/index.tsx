import { useState } from "react";
import { Form } from "@heroui/form";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Radio, RadioGroup } from "@heroui/radio";

import DefaultLayout from "@/layouts/default";

export default function FeedbackForm() {
  const [submitted, setSubmitted] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (attachment) {
      formData.append("attachment", attachment);
    }

    try {
      const response = await fetch("https://chicket.onrender.com/api/submit", {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json",
        },
      });

      const result = await response.json();
      if (response.ok) {
        setSubmitted(true);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <img alt="logo" className="max-w-52" src="/fulllogo.png" />
        {submitted ? (
          <p className="text-green-600">Thank you! Your feedback has been submitted.</p>
        ) : (
          <Form className="w-full max-w-md space-y-4" onSubmit={onSubmit}>
            <Input isRequired label="Date" name="date" type="date" />
            <Input isRequired label="Time" name="time" type="time" />
            <Input isRequired label="Name" name="name" placeholder="Enter your name" />
            <Input isRequired label="Phone Number" name="phone" placeholder="Enter your phone number" type="tel" />
            <Input label="Email" name="email" placeholder="Enter your email" type="email" />
            <Input isRequired label="Meal" name="meal" placeholder="Enter your meal name" />

            {[
              "Meal Temperature",
              "Cooking",
              "Speed of Service",
              "Friendliness",
              "Dining Room",
              "Outdoor Cleanliness",
            ].map((label) => (
              <RadioGroup isRequired key={label} label={label} name={label.toLowerCase().replace(/ /g, "_")}>
                <Radio value="poor">Poor</Radio>
                <Radio value="very_good">Very Good</Radio>
                <Radio value="excellent">Excellent</Radio>
              </RadioGroup>
            ))}

            <RadioGroup label="How often do you visit our restaurant?" name="visit_frequency" isRequired>
              <Radio value="daily">Daily</Radio>
              <Radio value="weekly">Weekly</Radio>
              <Radio value="monthly">Monthly</Radio>
              <Radio value="frequently">Frequently</Radio>
            </RadioGroup>

            <RadioGroup label="The time it took to receive your meal?" name="service_time" isRequired>
              <Radio value="0-5">0-5 min</Radio>
              <Radio value="10-15">10-15 min</Radio>
              <Radio value="15-20">15-20 min</Radio>
              <Radio value="20+">More than 20 min</Radio>
            </RadioGroup>

            {[
              { label: "Was staff available to serve you?", name: "staff_available" },
              { label: "Is the bathroom always clean?", name: "bathroom_clean" },
              { label: "Was the uniform of staff clean and tidy?", name: "uniform_clean" },
            ].map(({ label, name }) => (
              <RadioGroup key={name} label={label} name={name} isRequired>
                <Radio value="yes">Yes</Radio>
                <Radio value="no">No</Radio>
              </RadioGroup>
            ))}

            <Textarea label="Comments & Suggestions" name="comments" placeholder="Write your feedback..." />

            {/* Attachment Input */}
            <Input label="Upload File" type="file" accept="image/*,application/pdf" onChange={(e) => setAttachment(e.target.files?.[0] || null)} />

            <Button className="w-full bg-rose-800" type="submit" variant="bordered">
              Submit
            </Button>
          </Form>
        )}
      </section>
    </DefaultLayout>
  );
}

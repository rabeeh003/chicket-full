import { useContext, useState } from "react";
import { Form } from "@heroui/form";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Radio, RadioGroup } from "@heroui/radio";
import { Image } from "@heroui/image";
import { Select, SelectItem } from "@heroui/select";

import DefaultLayout from "@/layouts/default";
import { LanguageContext } from "@/context/LanguageContext";
// import { tr } from "framer-motion/client";

export default function FeedbackForm() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("FeedbackForm must be used within a LanguageProvider");
  }
  const { translations, lang } = context;

  const branches = [
    { key: "JIDHAFS", label: "JIDHAFS" },
    { key: "MALKIYA", label: "MALKIYA" },
    { key: "MUHARRAQ", label: "MUHARRAQ" },
    { key: "QALALI", label: "QALALI" },
    { key: "SITRA", label: "SITRA" },
    { key: "TUBLI", label: "TUBLI" },
    { key: "MANAMA", label: "MANAMA" },
    { key: "ARAD", label: "ARAD" },
    { key: "BUDAIYYA", label: "BUDAIYYA" },
    { key: "BUSAITEEN", label: "BUSAITEEN" },
    { key: "HAJIYAT", label: "HAJIYAT" },
    { key: "HAMAD TOWN", label: "HAMAD TOWN" },
    { key: "AL HIDD", label: "AL HIDD" },
    { key: 'ISA TOWN', label: "ISA TOWN" },
  ];
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
      <section className={`flex flex-col items-center justify-center gap-4 py-8 md:py-10 ${lang === "ar" ? "rtl" : "ltr"}`}>
        <img alt="logo" className="max-w-52" src="/fulllogo.png" />
        {submitted ? (
          <p className="text-white text-center">{translations.thanks}</p>
        ) : (
          <Form className="w-full max-w-md space-y-4" onSubmit={onSubmit}>
            <h2 className="text-2xl font-bold text-center w-full mb-4">{translations.feedback}</h2>
            <Input isRequired label={translations.date} name="date" type="date" />
            <Input isRequired label={translations.time} name="time" type="time" />
            <Input isRequired label={translations.name} name="name" placeholder={translations.namePlaceholder} />
            <Input isRequired label={translations.phone} name="phone" placeholder={translations.phonePlaceholder} type="number" />
            <Input label={translations.email} name="email" placeholder={translations.emailPlaceholder} type="email" />
            <Select
              isRequired
              items={branches}
              label={translations.branch}
              name="branch"
              placeholder={translations.branchPlaceholder}
            >
              {(branch) => <SelectItem>{branch.label}</SelectItem>}
            </Select>
            <Input isRequired label={translations.meal} name="meal" placeholder={translations.mealPlaceholder} />

            {[
              translations.mealTemperature,
              translations.cooking,
              translations.speedofService,
              translations.friendliness,
              translations.diningRoom,
              translations.outdoorCleanliness,
            ].map((label) => (
              <RadioGroup color="danger" isRequired key={label} label={label} name={label.toLowerCase().replace(/ /g, "_")}>
                <Radio value="excellent">{translations.Excellent}</Radio>
                <Radio value="very_good">{translations.VeryGood}</Radio>
                <Radio value="poor">{translations.Poor}</Radio>
              </RadioGroup>
            ))}

            <RadioGroup color="danger" label={translations.visit} name="visit_frequency" isRequired>
              <Radio value="daily">{translations.daily}</Radio>
              <Radio value="weekly">{translations.weekly}</Radio>
              <Radio value="monthly">{translations.monthly}</Radio>
              <Radio value="frequently">{translations.frequently}</Radio>
            </RadioGroup>

            <RadioGroup color="danger" label={translations.delayTime} name="service_time" isRequired>
              <Radio value="0-5">0-5 min</Radio>
              <Radio value="10-15">10-15 min</Radio>
              <Radio value="15-20">15-20 min</Radio>
              <Radio value="20+">More than 20 min</Radio>
            </RadioGroup>

            {[
              { label: translations.stafAvilable, name: "staff_available" },
              { label: translations.uniformClean, name: "bathroom_clean" },
              { label: translations.bathroomClean, name: "uniform_clean" },
            ].map(({ label, name }) => (
              <RadioGroup color="danger" key={name} label={label} name={name} isRequired>
                <Radio value="yes">{translations.yes}</Radio>
                <Radio value="no">{translations.no}</Radio>
              </RadioGroup>
            ))}

            <Textarea label={translations.message} name="comments" placeholder={translations.messagePlaceholder} />

            {/* Attachment Input */}
            {attachment ? (
              <div className="w-full flex flex-col items-center justify-between">
                <Image
                  alt="Attachment"
                  src={attachment ? URL.createObjectURL(attachment) : "/placeholder.png"}
                  width={100}
                />
                <Button onClick={() => setAttachment(null)} size="sm" className="mt-3 text-red-500" type="button" variant="bordered">
                  Remove
                </Button>
              </div>
            ) : (
              <Input label={translations.uploadFile} type="file" accept="image/*,application/pdf" onChange={(e) => setAttachment(e.target.files?.[0] || null)} />
            )}
            <Button className="w-full bg-danger text-white" type="submit" variant="bordered">
              {translations.submit}
            </Button>
          </Form>
        )}
      </section>
    </DefaultLayout>
  );
}

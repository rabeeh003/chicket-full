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
    { key: "DAMMAM", label: "DAMMAM" },
    { key: "ABQAIQ", label: "ABQAIQ" },
    { key: "Azizia", label: "Azizia" },
    { key: "NASEEM", label: "NASEEM" },
    { key: "NAJAH", label: "NAJAH" },
    { key: "SALAHIYA", label: "SALAHIYA" },
    { key: "OMRAN", label: "OMRAN" },
    { key: "AOMRAN", label: "ARADOMRAN" },
    { key: "NUZHA", label: "NUZHA" },
    { key: "MOHAMMEDIYA", label: "MOHAMMEDIYA" },
    { key: "TARAF", label: "TARAF" },
    { key: "GARA", label: "GARA" },
    { key: "SHIHABIYA", label: "SHIHABIYA" },
    { key: 'RUQAIQA', label: "RUQAIQA" },
    { key: 'KHALDIYA', label: "KHALDIYA" },
    { key: 'OYUN', label: "OYUN" },
    { key: 'MUNAIZILA', label: "MUNAIZILA" },
    { key: 'MUHASIN', label: "MUHASIN" },
    { key: 'MUBARAZ', label: "MUBARAZ" },
    { key: 'NAIFIYAH', label: "NAIFIYAH" },
    { key: 'KILABIYYA', label: "KILABIYYA" },
    { key: 'YANBU-01', label: "YANBU-01" },
    { key: 'BADR', label: "BADR" },
    { key: 'YANBU-02', label: "YANBU-02" },
    { key: 'YANBU-03', label: "YANBU-03" },
    { key: 'YANBU-04', label: "YANBU-04" },
    { key: 'BADR-02', label: "BADR-02" },
  ];

  const radioOptions = [
    {label: translations.cooking, name: "cooking" },
    {label: translations.speedofService, name: "speed_of_service" },
    {label: translations.friendliness, name: "friendliness" },
    {label: translations.outdoorCleanliness, name: "store_cleanliness" },
  ];

  const [submitted, setSubmitted] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (attachment) {
      formData.append("picture", attachment);
    }

    try {

      // set dummy :
      // setSubmitted(true);
      // if (true) {
      //   return;
      // }

      const response = await fetch("https://fadmin.mazaarabia.com/api/feedback", {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json",
        },
      });
      console.log("Res : ", response)

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
      <section className={`flex flex-col items-center justify-center gap-4 py-8 pb-10 md:py-10 ${lang === "ar" ? "rtl" : "ltr"}`}>
        <img alt="logo" className="max-w-52" src="/fulllogo.png" />
        {submitted ? (
          <p className="text-center">{translations.thanks}</p>
        ) : (
          <Form className="w-full max-w-md space-y-4" onSubmit={onSubmit}>
            <h2 className="text-2xl font-bold text-center w-full mb-4">{translations.feedback}</h2>
            {/* `<Input isRequired label={translations.date} name="date" type="date" />
            `<Input isRequired label={translations.time} name="time" type="time" /> */}
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
            {/* <Input isRequired label={translations.meal} name="meal" placeholder={translations.mealPlaceholder} /> */}


            {radioOptions.map(({label, name}) => (
            <RadioGroup color="danger" key={name} label={label} name={label}>
              <Radio value="excellent">{translations.Excellent}</Radio>
              <Radio value="very_good">{translations.VeryGood}</Radio>
              <Radio value="poor">{translations.Poor}</Radio>
            </RadioGroup>
            ))}


            {/* <RadioGroup color="danger" label={translations.visit} name="visit_frequency" isRequired>
              <Radio value="daily">{translations.daily}</Radio>
              <Radio value="weekly">{translations.weekly}</Radio>
              <Radio value="monthly">{translations.monthly}</Radio>
              <Radio value="frequently">{translations.frequently}</Radio>
            </RadioGroup> */}

            <RadioGroup color="danger" label={translations.delayTime} name="time_to_receive">
              <Radio value="20-25">{translations.op1}</Radio>
              <Radio value="25-30">{translations.op2}</Radio>
              <Radio value="30+">{translations.op3}</Radio>
            </RadioGroup>

            {/* {[
              { label: translations.stafAvilable, name: "staff_available" },
              { label: translations.uniformClean, name: "bathroom_clean" },
              { label: translations.bathroomClean, name: "uniform_clean" },
            ].map(({ label, name }) => (
              <RadioGroup color="danger" key={name} label={label} name={name} isRequired>
                <Radio value="yes">{translations.yes}</Radio>
                <Radio value="no">{translations.no}</Radio>
              </RadioGroup>
            ))} */}

            <Textarea label={translations.message} name="commend" placeholder={translations.messagePlaceholder} />

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
            <Button className="w-full bg-danger text-white mb-20" type="submit" variant="bordered">
              {translations.submit}
            </Button>
          </Form>
        )}
      </section>
    </DefaultLayout>
  );
}

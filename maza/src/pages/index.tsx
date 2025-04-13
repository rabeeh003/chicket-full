import { useContext, useEffect, useState } from "react";
import { Form } from "@heroui/form";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Radio, RadioGroup } from "@heroui/radio";
import { Image } from "@heroui/image";
import { Select, SelectItem } from "@heroui/select";
import { SocialIcon } from 'react-social-icons'

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
    { label: translations.cooking, name: "cooking" },
    { label: translations.speedofService, name: "speed_of_service" },
    { label: translations.friendliness, name: "friendliness" },
    { label: translations.outdoorCleanliness, name: "store_cleanliness" },
  ];

  const [submitted, setSubmitted] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [deviceType, setDeviceType] = useState(""); // State to store device type

  // Detect device type on component mount
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setDeviceType("iphone");
    } else if (/android/.test(userAgent)) {
      setDeviceType("android");
    } else {
      setDeviceType("other"); // PC or other devices
    }
  }, []);

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
      <section className={`flex flex-col items-center justify-center gap-4 md:py-10 ${lang === "ar" ? "rtl" : "ltr"}`}>
        <img alt="logo" className="max-w-52 dark:hidden" src="/fulllogo.png" />
        <img alt="logo" className="max-w-52 hidden dark:flex" src="/fulllogo-white.png" />
        <div className="flex justify-between items-center gap-2">
          <SocialIcon network="instagram" url="https://www.instagram.com/mazaarabia/?utm_source=qr" style={{ height: 25, width: 25 }} />
          <SocialIcon network="snapchat" url="https://snapchat.com/t/sZJuNSvp" style={{ height: 25, width: 25 }} />
          <SocialIcon network="tiktok" url="https://www.tiktok.com/@maza_arabia?_t=ZS-8vH127FtZo7&_r=1" style={{ height: 25, width: 25 }} />
          <SocialIcon network="facebook" url="https://www.facebook.com/share/1BB77ViZf3/?mibextid=wwXIfr" style={{ height: 25, width: 25 }} />
        </div>
        {submitted ? (
          <p className="text-center">{translations.thanks}</p>
        ) : (
          <Form className="w-full max-w-md space-y-4" onSubmit={onSubmit}>
            <h2 className="text-2xl font-bold text-black dark:text-white text-center w-full mb-4">{translations.feedback}</h2>
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


            {radioOptions.map(({ label, name }) => (
              <RadioGroup color="danger" key={name} label={label} name={name}>
                <Radio value="very_good">{translations.VeryGood}</Radio>
                <Radio value="poor">{translations.Poor}</Radio>
                <Radio value="excellent">{translations.Excellent}</Radio>
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
            <Button className="w-full bg-danger text-white" type="submit" variant="bordered">
              {translations.submit}
            </Button>
          </Form>
        )}
        <div className="w-full max-w-md mt-16">
          {deviceType === "iphone" && (
            <a href="https://apps.apple.com/sa/app/maza-%D9%85%D8%A7%D8%B2%D8%A9/id1530221224">
              <div className="flex justify-between shadow-md items-center gap-2 bg-white dark:bg-black rounded-2xl w-full p-2 mb-8">
                <div className="flex justify-start items-center gap-2">
                  <img
                    alt="logo"
                    className="w-20 bg-white dark:bg-black border border-gray-100 dark:border-gray-900 shadow-sm p-2 rounded-xl"
                    src="/logo.png"
                  />
                  <div className="text-black dark:text-white items-start">
                    <h2 className="text-xl font-bold text-center w-full">Maza - مازة</h2>
                    <p>Maza</p>fixed feedback form head
                  </div>
                </div>
                <img
                  className="w-10 me-3"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/App_Store_%28iOS%29.svg/512px-App_Store_%28iOS%29.svg.png"
                  alt="app store"
                />
              </div>
            </a>
          )}

          {deviceType === "android" && (
            <a href="https://play.google.com/store/apps/details?id=com.emcan.maza&pcampaignid=web_share">
              <div className="flex justify-between shadow-md items-center gap-2 bg-white dark:bg-black rounded-2xl w-full p-2 mb-8">
                <div className="flex justify-start items-center gap-2">
                  <img
                    alt="logo"
                    className="w-20 bg-white dark:bg-black border border-gray-100 dark:border-gray-900 shadow-sm p-2 rounded-xl"
                    src="/logo.png"
                  />
                  <div className="text-black dark:text-white items-start">
                    <h2 className="text-xl font-bold text-center w-full">Maza - مازة</h2>
                    <p>Maza</p>
                  </div>
                </div>
                <img
                  className="w-10 me-3 rounded-lg shadow-sm"
                  src="https://static.vecteezy.com/system/resources/previews/022/484/501/non_2x/google-play-store-icon-logo-symbol-free-png.png"
                  alt="play store"
                />
              </div>
            </a>
          )}

          {deviceType === "other" && (
            <>
              <div className="flex justify-between shadow-md items-center gap-2 bg-white dark:bg-black rounded-2xl w-full p-2 mb-4">
                <div className="flex justify-start items-center gap-2">
                  <img
                    alt="logo"
                    className="w-20 bg-white dark:bg-black border border-gray-100 dark:border-gray-900 shadow-sm p-2 rounded-xl"
                    src="/logo.png"
                  />
                  <div className="text-gray-600 dark:text-white items-start">
                    <h2 className="text-xl font-bold text-center w-full">Maza - مازة</h2>
                    <p>Maza</p>
                  </div>
                </div>
                <div className="flex">
                  <a href="https://apps.apple.com/sa/app/maza-%D9%85%D8%A7%D8%B2%D8%A9/id1530221224">
                    <img
                      className="w-10 me-3 shadow-sm"
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/App_Store_%28iOS%29.svg/512px-App_Store_%28iOS%29.svg.png"
                      alt="app store"
                    />
                  </a>
                  <a href="https://play.google.com/store/apps/details?id=com.emcan.maza&pcampaignid=web_share">
                    <img
                      className="w-10 me-3 border rounded-lg shadow-sm"
                      src="https://static.vecteezy.com/system/resources/previews/022/484/501/non_2x/google-play-store-icon-logo-symbol-free-png.png"
                      alt="play store"
                    />
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
        <p className="text-center text-sm text-gray-700 dark:text-gray-100">
          © 2023 Maza Arabia. All rights reserved.
        </p>
      </section>
    </DefaultLayout >
  );
}

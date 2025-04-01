import { createContext, useState, useEffect, ReactNode } from "react";
import translations from "../locales/translations.json";

// Define the structure of the translations JSON
type Translations = {
  feedback: string;
  name: string;
  namePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  phone: string;
  phonePlaceholder: string;
  message: string;
  messagePlaceholder: string;
  uploadFile: string;
  submit: string;
  branch: string;
  branchPlaceholder: string;
  date: string;
  time: string;
  meal: string;
  mealPlaceholder: string;
  mealTemperature: string;
  cooking: string;
  speedofService: string;
  friendliness: string;
  diningRoom: string;
  outdoorCleanliness: string;
  Poor: string;
  VeryGood: string;
  Excellent: string;

  visit: string;
  daily: string;
  weekly: string;
  monthly: string;
  frequently: string;

  delayTime: string;
  op1: string;
  op2: string;
  op3: string;
  stafAvilable: string; // Check the spelling mistake
  uniformClean: string;
  bathroomClean: string;
  yes: string;
  no: string;

  thanks: string;
};


// Define the LanguageContext type
interface LanguageContextType {
  lang: "en" | "ar";
  switchLanguage: () => void;
  translations: Translations;
}

// Create context with default values
export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Define props for the provider
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const defaultLang: "en" | "ar" = (localStorage.getItem("lang") as "en" | "ar") || "ar";
  const [lang, setLang] = useState<"en" | "ar">(defaultLang);

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const switchLanguage = () => {
    setLang((prevLang) => (prevLang === "en" ? "ar" : "en"));
  };

  return (
    <LanguageContext.Provider value={{ lang, switchLanguage, translations: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
};

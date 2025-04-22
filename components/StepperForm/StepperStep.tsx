"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";

interface StepperStepProps {
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  handleBankConnect: () => void;
  connectedBanks: { name: string; icon: string | null }[];
}
export default function StepperStep({
  currentStep,
  nextStep,
  prevStep,
  handleBankConnect,
  connectedBanks,
}: StepperStepProps) {
  const [houseCost, sethouseCost] = useState("");
  const [homePurchase, sethomePurchase] = useState("0");
  const [selectedSources, setSelectedSources] = useState({
    bankSavings: true,
    cashSavings: false,
    extraIncome: false,
  });
  const [BankSavings, setBankSavings] = useState("");
  const [CashSavings, setCashSavings] = useState("");
  const [ExtraIncome, setExtraIncome] = useState("");
  const [isFirstTimeHomebuyer, setIsFirstTimeHomebuyer] =
    useState<boolean>(false);

  type SourceKey = "bankSavings" | "cashSavings" | "extraIncome";

  const toggleSource = (source: SourceKey) => {
    setSelectedSources((prev) => ({ ...prev, [source]: !prev[source] }));
  };

  const [consents, setConsents] = useState({
    openAI: false,
    tinkVisa: false,
    privacy: false,
  });

  const allChecked = Object.values(consents).every(Boolean);

  const handleConsentChange = (key: keyof typeof consents) => {
    setConsents((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const { getToken } = useAuth();
  useEffect(() => {
    const bank = selectedSources.bankSavings
      ? parseInt(BankSavings || "0", 10)
      : 0;
    const cash = selectedSources.cashSavings
      ? parseInt(CashSavings || "0", 10)
      : 0;
    const income = selectedSources.extraIncome
      ? parseInt(ExtraIncome || "0", 10)
      : 0;

    const total = bank + cash + income;
    sethomePurchase(total.toString());
  }, [selectedSources, BankSavings, CashSavings, ExtraIncome]);
  const router = useRouter();

  const handleComplete = async () => {
    const token = await getToken();

    const payload = {
      homePrice: parseInt(houseCost),
      bankSaving: parseInt(BankSavings),
      cashSaving: parseInt(CashSavings),
      extraIncome: parseInt(ExtraIncome),
      firstHomeBuyer: isFirstTimeHomebuyer,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/main/affordability`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to submit data");
      }

      router.push("/affordability-scoring");
    } catch (err) {
      console.error("Error submitting data:", err);
      toast.error("Something went wrong submitting your data.");
    }
  };

  return (
    <div className="w-[620px] p-8 h-[108%]  bg-white shadow-md rounded-lg mt-[-20px]">
      {currentStep === 1 && (
        <div className="h-full flex flex-col justify-between">
          <div>
            <h1 className="text-4xl text-[#2A2A33] font-bold mb-9">
              Basic information
            </h1>

            <div className="mb-8">
              <p className="font-semibold text-[#2A2A33] mb-2">
                Are you a first-time homebuyer?
              </p>
              <p className="text-[#2A2A33] text-sm mb-2">
                First-time homebuyers may be eligible for special benefits that
                can reduce mortgage costs and improve affordability.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setIsFirstTimeHomebuyer(true)}
                  className={`w-1/2 py-2 border border-[#CECECE] rounded-lg text-center text-[#2A2A33] ${
                    isFirstTimeHomebuyer ? "bg-[#2286EA] text-white" : ""
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => setIsFirstTimeHomebuyer(false)}
                  className={`w-1/2 py-2 border border-[#CECECE] rounded-lg text-center text-[#2A2A33] ${
                    !isFirstTimeHomebuyer ? "bg-[#2286EA] text-white" : ""
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            <div className="mb-8">
              <label className="font-semibold block mb-2 text-[#2A2A33]">
                Enter Your the cost of the house you are interested in
              </label>

              <input
                type="text"
                className="w-2/3 border border-[#cecece] rounded-lg p-2 text-black"
                value={`$ ${houseCost}`}
                onChange={(e) =>
                  sethouseCost(e.target.value.replace(/\D/g, ""))
                }
              />
              <label className="font-semibold block mb-2 mt-2 text-[#2A2A33]">
                Savings for Home Purchase Expences{" "}
              </label>

              <input
                type="text"
                className="w-2/3 border border-[#cecece] rounded-lg p-2 text-black"
                value={`$ ${homePurchase}`}
                onChange={(e) =>
                  sethomePurchase(e.target.value.replace(/\D/g, ""))
                }
              />
            </div>

            <div className="mb-8">
              <label className="font-semibold block mb-1 text-[#2A2A33]">
                Down Payment Sources
              </label>
              <div className="flex items-center space-y-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="w-5 h-5"
                      checked={selectedSources.bankSavings}
                      onChange={() => toggleSource("bankSavings")}
                    />
                    <label className="font-semibold text-[14px] text-[#2A2A33]">
                      Bank Savings
                    </label>
                  </div>
                  <p className="text-[#2A2A33] text-sm ml-7">
                    I have money in my bank account
                  </p>
                </div>
                {selectedSources.bankSavings && (
                  <input
                    type="text"
                    className="w-2/8 border text-[#2A2A33] border-[#cecece] rounded-lg p-2 ml-6"
                    value={`$ ${BankSavings}`}
                    onChange={(e) =>
                      setBankSavings(e.target.value.replace(/\D/g, ""))
                    }
                  />
                )}
              </div>
              <div className="flex items-center space-y-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="w-5 h-5"
                      checked={selectedSources.cashSavings}
                      onChange={() => toggleSource("cashSavings")}
                    />
                    <label className="font-semibold text-[14px] text-[#2A2A33]">
                      Cash Savings
                    </label>
                  </div>
                  <p className="text-[#2A2A33] text-sm ml-7">
                    I have savings in cash
                  </p>
                </div>
                {selectedSources.cashSavings && (
                  <input
                    type="text"
                    className="w-2/8 border rounded-lg p-2 ml-24 border-[#cecece] text-[#2A2A33]"
                    value={`$ ${CashSavings}`}
                    onChange={(e) =>
                      setCashSavings(e.target.value.replace(/\D/g, ""))
                    }
                  />
                )}
              </div>
              <div className="flex items-center space-y-2 mt-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="w-5 h-5"
                      checked={selectedSources.extraIncome}
                      onChange={() => toggleSource("extraIncome")}
                    />
                    <label className="font-semibold text-[14px] text-[#2A2A33]">
                      Expected Extra Income
                    </label>
                  </div>
                  <p className="text-[#2A2A33] text-sm ml-7">
                    I expect a one-time extra income
                  </p>
                </div>
                {selectedSources.extraIncome && (
                  <input
                    type="text"
                    className="w-2/8 border rounded-lg p-2 ml-8 border-[#cecece] text-[#2A2A33]"
                    value={`$ ${ExtraIncome}`}
                    onChange={(e) =>
                      setExtraIncome(e.target.value.replace(/\D/g, ""))
                    }
                  />
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={nextStep}
              className="flex items-center justify-center mt-4 px-8 py-3 w-38  bg-[#2286EA] text-white rounded-md"
            >
              Next
            </button>
          </div>
        </div>
      )}
      {currentStep === 2 && (
        <div className="flex flex-col h-full justify-between">
          <div>
            <h2 className="text-[18px] text-[#2A2A33] font-bold mb-10">
              Bank Account Connection
            </h2>
            <p className=" text-[#2A2A33] text-[14px] pr-13">
              To check your affordability, securely connect your bank account
              with VISA. This allows for an accurate assessment based on your
              financial data while ensuring a safe and protected process
            </p>
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-[#2A2A33] mb-2">
                Required Consent:
              </h2>

              <label className="flex items-start mb-2 text-[#2A2A33] text-sm">
                <input
                  type="checkbox"
                  checked={consents.openAI}
                  onChange={() => handleConsentChange("openAI")}
                  className="mr-2 w-[40px] h-[25px] "
                />
                I authorize affordify.ai to securely access and process my
                financial information for affordability analysis, including
                using AI services like OpenAI GPT API, with strict security and
                privacy safeguards.
              </label>

              <label className="flex items-start mb-2 text-[#2A2A33] text-sm">
                <input
                  type="checkbox"
                  checked={consents.tinkVisa}
                  onChange={() => handleConsentChange("tinkVisa")}
                  className="mr-2  w-[33px] h-[20px]"
                />
                I authorize affordify.ai to access my financial data via Tink (a
                Visa company) and/or Visa Open Banking solutions, if applicable,
                solely for affordability assessments
              </label>

              <label className="flex items-start mb-2 text-[#2A2A33] text-sm">
                <input
                  type="checkbox"
                  checked={consents.privacy}
                  onChange={() => handleConsentChange("privacy")}
                  className="mr-2  w-[33px] h-[20px]"
                />
                I acknowledge that my data will be processed in accordance with
                U.S. privacy laws and GDPR principles. I understand that I can
                withdraw my consent at any time
              </label>
            </div>
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-[#2A2A33] mb-2">
                Optional Consent:
              </h2>

              <label className="block mb-2 text-[#2A2A33] text-sm">
                <input type="checkbox" className="mr-2 w-4 h-4" />I consent to
                receiving product updates, financial insights, and promotional
                offers from affordify.ai and partners
              </label>

              <label className="block mb-2 text-[#2A2A33] text-sm">
                <input type="checkbox" className="mr-2 w-4 h-4" />I authorize
                affordify.ai to securely share limited, anonymized usage data
                with trusted partners...
              </label>
            </div>
          </div>
          <div className="">
            <button
              onClick={handleBankConnect}
              disabled={!allChecked}
              className={`flex items-center justify-center mt-4 px-4 py-2 w-full h-13 rounded-md ${
                allChecked
                  ? "bg-[#2286EA] text-white cursor-pointer"
                  : "bg-[#1976E1] opacity-50 text-white cursor-not-allowed"
              }`}
            >
              Connect with{" "}
              <img src="./visa_ico.png" alt="" className="w-18 ml-2" />
            </button>
            <button
              onClick={prevStep}
              className="mt-2 px-4 py-2 w-full h-13 bg-white text-[#2286EA] border-1 border-[#2286EA] rounded-md"
            >
              Back
            </button>
          </div>

          <div className="flex flex-col items-start absolute right-[-55%] top-[26px]">
            <h2 className="text-2xl text-[#2A2A33] font-bold mb-3">
              Helpful Hint
            </h2>
            <p className="text-[#2A2A33] mb-3 font-semibold">
              Why connect your bank?
            </p>
            <p className=" text-[#2A2A33] w-80 text-[14px] mb-3">
              Connect your bank securely for instant verification. Open Banking
              serves as a secure form of identity validation and enables access
              to the information required to proceed
            </p>
            <p className="text-[#2A2A33] mb-3 font-semibold">
              What do I need to do?
            </p>
            <p className=" text-[#2A2A33] w-80 text-[14px] mb-3">
              Simply tap the ‘Connect’ button below, and permission will be
              requested to access the data needed to verify your details. You
              will be redirected to your bank’s secure portal to log in to your
              online banking account as usual. Once completed, you will be
              brought back here to continue
            </p>
            <p className=" text-[#2A2A33] mb-3 font-semibold">
              What is Open Banking?
            </p>
            <p className=" text-[#2A2A33] w-83 text-[14px] mb-3">
              Open Banking is a government-backed standard that allows you to
              share your bank transactions securely with any company. All Open
              Banking providers are authorized by the Financial Conduct
              Authority (FCA)
            </p>
            <p className=" text-[#2A2A33] mb-3 font-semibold">
              How do we keep your data safe?
            </p>
            <p className="text-[#2A2A33] w-83 text-[14px] mb-3">
              An intermediary is used to securely access your banking data and
              keep it protected. All application and user access logs are stored
              centrally and monitored.
              <br />
              Only accounts and transactions you select are submitted to
              affordify.ai
            </p>
          </div>
        </div>
      )}
      {currentStep === 3 && (
        <div className="flex flex-col justify-between h-full">
          <div>
            <h2 className="text-4xl font-bold text-[#2A2A33]">
              Calculate Affordability
            </h2>
            <p className="text-[#2A2A33] text-[16px] mt-10">
              Bank accounts connected:
            </p>
            <div className="grid grid-cols-2 gap-4 my-6">
              {connectedBanks.map((bank, index) => (
                <div
                  key={index}
                  className="flex flex-col justify-center items-center p-4 border rounded-lg shadow-sm bg-white"
                >
                  {bank.icon ? (
                    <img
                      src={bank.icon}
                      alt={bank.name}
                      className="w-15 h-15 mb-2"
                    />
                  ) : (
                    <img
                      className="w-15"
                      src="https://cdn.tink.se/provider-images/demobank.png"
                      alt=""
                    />
                  )}
                  <span className="font-medium text-[#2A2A33] mt-2">
                    {"Demobank"}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={prevStep}
              className="flex items-center text-[#2286EA] font-semibold"
            >
              {" "}
              <span className="text-3xl font-light mr-1">+</span>Add more bank
              accounts
            </button>
          </div>
          <div className="flex justify-between mb-7">
            <button
              onClick={prevStep}
              className="px-16 py-2 bg-white border-1 border-[#2286EA] text-[#2286EA] rounded-xl mr-2"
            >
              Back
            </button>
            <button
              // onClick={() => router.push("/dashboard")}
              onClick={handleComplete}
              /*For Demo */
              className="px-10 py-4 bg-[#2286EA] text-white rounded-xl"
            >
              Complete and view dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

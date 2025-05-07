"use client";
import React, { useState, useEffect } from "react";
import { useDemo } from "@/context/DemoProvider";

import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";
import Link from "next/link";
import { useUserGoal } from "@/context/UserGoalProvider";

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
  //for step1
  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [goalMonths, setGoalMonths] = useState(3);
  const { selectedGoal, setSelectedGoal, isOwner } = useUserGoal();

  const [selected, setSelected] = useState(false);
  const goals = [
    "I will live here full-time",
    "It will be my second home",
    "It will be an investment property",
    "I rent (I am a renter)",
  ];
  const [zipcode, setzipcode] = useState("");

  //for step2

  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const buyingStages = [
    "I've signed a purchase agreement",
    "I'm making offers",
    "I'm attending open houses",
    "I'm still researching",
  ];

  const rentingStages = [
    "I've signed a lease agreement",
    "I'm applying for rentals",
    "I'm touring rental properties",
    "I'm just browsing",
  ];

  const options = isOwner ? buyingStages : rentingStages;

  const { isDemo } = useDemo();

  const toggleGoal = (id: string, disabled = false) => {
    if (disabled) return;
    setSelectedGoal(selectedGoal === id ? "" : id);
  };

  const isExpanded = (id: string) => selectedGoal === id;

  //
  const [houseCost, sethouseCost] = useState("0");
  const [homePurchase, sethomePurchase] = useState("0");
  const [selectedSources, setSelectedSources] = useState({
    bankSavings: true,
    cashSavings: false,
    extraIncome: false,
  });
  const [BankSavings, setBankSavings] = useState("");
  const [CashSavings, setCashSavings] = useState("");
  const [ExtraIncome, setExtraIncome] = useState("");

  type SourceKey = "bankSavings" | "cashSavings" | "extraIncome";

  const toggleSource = (source: SourceKey) => {
    setSelectedSources((prev) => ({ ...prev, [source]: !prev[source] }));
  };

  const [consents, setConsents] = useState({
    openAI: false,
    tinkVisa: false,
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
      propertyPrice: parseInt(houseCost),
      zipCode: zipcode,
      bankSavings: parseInt(BankSavings),
      investmentSavings: parseInt(CashSavings),
      extraIncome: parseInt(ExtraIncome),
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
    <div className="w-[620px] p-10 h-fit  bg-white shadow-md rounded-2xl mt-[-20px]">
      {currentStep === 1 && (
        <div className="h-full flex flex-col justify-between">
          <div>
            <h1 className="text-4xl text-[#2A2A33] font-bold mb-9">
              Set Your Property Goal
            </h1>

            <div className="mb-8">
              <p className="font-semibold text-[#2A2A33] text-[18px] mb-2">
                How do you plan to use a property?{" "}
              </p>
              <p className="text-[#2A2A33] text-[14px] mb-2">
                Choose one of the options below, this will customize your
                affordability dashboard. You can change it later
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              {goals.map((goal, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedGoal(goal)}
                  className={`w-full text-start border rounded-lg p-3 text-[16px] cursor-pointer
                ${
                  selectedGoal === goal
                    ? "bg-[#2286EA] text-white border-[#2286EA]"
                    : "border-[#D9D9D9] text-[#2A2A33]"
                }
              `}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end mt-55">
            <button
              onClick={nextStep}
              disabled={!selectedGoal}
              className={`flex items-center justify-center mt-4 px-8 py-3 w-38 rounded-lg text-[18px]
                      ${
                        selectedGoal
                          ? "bg-[#2286EA] text-white"
                          : "bg-[#2286EA] opacity-60 cursor-not-allowed"
                      }
                    `}
            >
              Next
            </button>
          </div>
          <div className="flex flex-col items-start absolute right-[-43%] top-[26px]">
            <h2 className="text-2xl text-[#2A2A33] font-bold mb-3">
              Helpful Hint
            </h2>
            <p className="text-[#2A2A33] mb-3 font-semibold">
              Home for live here full-time
            </p>
            <p className=" text-[#2A2A33] w-70 text-[14px] mb-3">
              Get a clear view of what you can afford, set savings goals, and
              plan confidently for your primary home purchase
            </p>
            <p className="text-[#2A2A33] mb-3 font-semibold">Second home </p>
            <p className=" text-[#2A2A33] w-75 text-[14px] mb-3">
              Plan and budget for buying a second property to rent out or use
              for vacations, with insights into affordability and future returns
            </p>
            <p className=" text-[#2A2A33] mb-3 font-semibold">
              Investment property
            </p>
            <p className=" text-[#2A2A33] w-75 text-[14px] mb-3">
              Understand your financial readiness to invest in real estate,
              whether to flip, rent, or hold for long-term
            </p>
            <p className=" text-[#2A2A33] mb-3 font-semibold">Renting</p>
            <p className="text-[#2A2A33] w-75 text-[14px] mb-3">
              Check your affordability to rent a home, create a savings plan for
              deposits and manage ongoing rental expenses smartly
            </p>
          </div>
        </div>
      )}

      {/* step 2 */}
      {currentStep === 2 && (
        <div className="h-full flex flex-col justify-between">
          <div>
            <h1 className="text-4xl text-[#2A2A33] font-bold mb-9">
              Your Current Stage
            </h1>

            <div className="mb-8">
              <p className="font-semibold text-[#2A2A33] text-[18px] mb-2">
                Where are you in your home buying journey?
              </p>
              <p className="text-[#2A2A33] text-[14px] mb-2">
                Choose one of the options
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedStage(option)}
                  className={`w-full text-start border rounded-lg p-3 text-[16px] cursor-pointer
                ${
                  selectedStage === option
                    ? "bg-[#2286EA] text-white border-[#2286EA]"
                    : "border-[#D9D9D9] text-[#2A2A33]"
                }
              `}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-between mt-55">
            <button
              onClick={prevStep}
              className="flex items-center justify-center mt-4 px-8 py-3 w-38 rounded-lg text-[18px] border border-[#2286EA] text-[#2286EA]"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              disabled={!selectedStage}
              className={`flex items-center justify-center mt-4 px-8 py-3 w-38 rounded-lg text-[18px]
            ${
              selectedStage
                ? "bg-[#2286EA] text-white"
                : "bg-[#2286EA] opacity-60 cursor-not-allowed"
            }
          `}
            >
              Next
            </button>
          </div>
          <div className="flex flex-col items-start absolute right-[-23%] top-[26px]">
            <h2 className="text-2xl text-[#2A2A33] font-bold mb-3">
              Helpful Hint
            </h2>
          </div>
        </div>
      )}
      {currentStep === 3 && (
        <div className="h-full flex flex-col justify-between">
          <div>
            <h1 className="text-[40px] text-[#2A2A33] font-bold mb-6">
              Key Details
            </h1>

            <div className="mb-4">
              <p className="font-semibold text-[#2A2A33] mb-2">
                Property Information{" "}
              </p>
            </div>

            <div className="mb-6">
              <label className="text-sm block mb-2 text-[#2A2A33]">
                {isOwner
                  ? "Property Price You're Considering"
                  : "Property Monthly Rent Price You're Considering"}
              </label>
              <input
                type="text"
                className="w-2/4 border border-[#cecece] rounded-lg p-2 text-black"
                value={`$ ${houseCost}`}
                onChange={(e) =>
                  sethouseCost(e.target.value.replace(/\D/g, ""))
                }
              />
              <label className="text-sm block mb-2 text-[#2A2A33] mt-4">
                Zip Code of the Area You're Exploring{" "}
              </label>

              <input
                type="text"
                className="w-2/4 border border-[#cecece] rounded-lg p-2 text-black"
                value={zipcode}
                onChange={(e) => setzipcode(e.target.value)}
              />
            </div>
            <div className="w-full h-[1px] bg-[#D9D9D9] mb-6"></div>

            <div className="mb-4">
              <p className="font-semibold text-[#2A2A33] mb-2">
                Your Available Savings
              </p>
            </div>

            <div className="mb-6">
              <label className="text-sm block mb-2 text-[#2A2A33] w-3/4">
                Total Savings you already have for Home Purchase and Home Buying
                Expenses
              </label>

              <input
                type="text"
                className="w-2/4 border border-[#cecece] rounded-lg p-2 text-black"
                value={`$ ${homePurchase}`}
                readOnly
              />
            </div>

            <div className="mb-8">
              <label className="block mb-2 text-[#2A2A33] text-sm">
                Savings Sources
              </label>
              <div className="flex items-center ">
                <div className="flex items-start space-x-2 w-4/7">
                  <input
                    type="checkbox"
                    className="w-5 h-5"
                    checked={selectedSources.bankSavings}
                    onChange={() => toggleSource("bankSavings")}
                  />
                  <div className="flex flex-col justify-start items-start">
                    <label className=" text-[14px] text-[#2A2A33]">
                      Bank Savings
                    </label>
                    <i className="text-[#2A2A33] text-sm ">
                      Money currently available in your <br />
                      bank account
                    </i>
                  </div>
                </div>
                {selectedSources.bankSavings && (
                  <input
                    type="text"
                    className="w-2/8 border text-[#2A2A33] border-[#cecece] rounded-lg p-2 ml-2"
                    value={`$ ${BankSavings}`}
                    onChange={(e) =>
                      setBankSavings(e.target.value.replace(/\D/g, ""))
                    }
                  />
                )}
              </div>
              <div className="flex items-center mt-2">
                <div className="flex items-start space-x-2 ">
                  <input
                    type="checkbox"
                    className="w-5 h-5"
                    checked={selectedSources.cashSavings}
                    onChange={() => toggleSource("cashSavings")}
                  />
                  <div className="flex flex-col justify-start items-start">
                    <label className=" text-[14px] text-[#2A2A33]">
                      Investment Savings
                    </label>
                    <i className="text-[#2A2A33] text-sm ">
                      Funds held in stocks, mutual funds, <br />
                      or other investments
                    </i>
                  </div>
                </div>

                {selectedSources.cashSavings && (
                  <input
                    type="text"
                    className="w-2/8 border rounded-lg p-2 ml-11 border-[#cecece] text-[#2A2A33]"
                    value={`$ ${CashSavings}`}
                    onChange={(e) =>
                      setCashSavings(e.target.value.replace(/\D/g, ""))
                    }
                  />
                )}
              </div>
              <div className="flex items-center  mt-2">
                <div>
                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      className="w-5 h-5"
                      checked={selectedSources.extraIncome}
                      onChange={() => toggleSource("extraIncome")}
                    />
                    <div className="flex flex-col justify-start items-start">
                      <label className=" text-[14px] text-[#2A2A33]">
                        Expected Extra Income
                      </label>
                      <i className="text-[#2A2A33] text-sm">
                        One-time income you expect soon <br />
                        (e.g., bonus, tax refund)
                      </i>
                    </div>
                  </div>
                </div>
                {selectedSources.extraIncome && (
                  <input
                    type="text"
                    className="w-2/8 border rounded-lg p-2 ml-13 border-[#cecece] text-[#2A2A33]"
                    value={`$ ${ExtraIncome}`}
                    onChange={(e) =>
                      setExtraIncome(e.target.value.replace(/\D/g, ""))
                    }
                  />
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              className="flex items-center justify-center mt-4 px-8 py-3 w-38 rounded-lg text-[18px] border border-[#2286EA] text-[#2286EA]"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              className="flex items-center justify-center mt-4 px-8 py-3 w-38 rounded-lg text-[18px] bg-[#2286EA] text-white"
            >
              Next
            </button>
          </div>
          <div className="flex flex-col items-start absolute right-[-43%] top-[26px]">
            <h2 className="text-2xl text-[#2A2A33] font-bold mb-3">
              Helpful Hint
            </h2>
            <p className="text-[#2A2A33] mb-3 font-semibold">
              {isOwner ? "Home Buying Expenses" : "Home Renting Expenses"}
            </p>
            <p className=" text-[#2A2A33] w-70 text-[14px] mb-3">
              {isOwner
                ? "Are expenses for Deposit, Agent Commissions, Closing costs (expenses associated with finalizing a transaction, including document processing fees, legal services, taxes, and other payments)"
                : "Include expenses like security deposits, first and last month's rent, application fees, agent commissions"}
            </p>
          </div>
        </div>
      )}
      {/* step 2 */}
      {currentStep === 4 && (
        <div className="flex flex-col h-full justify-between">
          <div>
            <h2 className="text-[40px] text-[#2A2A33] font-bold mb-6">
              Bank Account Connection
            </h2>
            <p className=" text-[#2A2A33] text-[14px] pr-13">
              To check your affordability, securely connect your bank account
              with VISA. This allows for an accurate assessment based on your
              financial data while ensuring a safe and protected process
            </p>
            <div className="w-9/10">
              <div className="mt-6">
                <h2 className="text-[18px] font-semibold text-[#2A2A33] mb-2">
                  Required Consent:
                </h2>

                <label className="flex items-start mb-3 text-[#2A2A33] text-sm">
                  <input
                    type="checkbox"
                    checked={consents.openAI}
                    onChange={() => handleConsentChange("openAI")}
                    className="mr-2 w-[40px] h-[25px] "
                  />
                  I authorize affordify.ai to access my financial data via Tink
                  (a Visa company) and/or Visa Open Banking solutions, if
                  applicable, solely for affordability assessments
                </label>

                <label className="flex items-start mb-3 text-[#2A2A33] text-sm">
                  <input
                    type="checkbox"
                    checked={consents.tinkVisa}
                    onChange={() => handleConsentChange("tinkVisa")}
                    className="mr-2  w-[40px] h-[20px]"
                  />
                  I acknowledge that my data will be processed in accordance
                  with U.S. privacy laws and GDPR principles. I understand that
                  I can withdraw my consent at any time
                </label>
              </div>
              <div className="mt-6 mb-10">
                <h2 className="text-lg font-semibold text-[#2A2A33] mb-2">
                  Optional Consent:
                </h2>

                <label className="flex items-start mb-2 text-[#2A2A33] text-sm">
                  <input type="checkbox" className="mr-2  w-[28px] h-[20px]" />I
                  consent to receiving product updates, financial insights, and
                  promotional offers from affordify.ai and partners
                </label>

                <label className="flex items-start mb-2 text-[#2A2A33] text-sm">
                  <input type="checkbox" className="mr-2  w-[36px] h-[20px]" />{" "}
                  I authorize affordify.ai to securely share limited, anonymized
                  usage data with trusted partners to improve services and
                  deliver relevant content
                </label>
              </div>
            </div>
          </div>
          <div className="mt-35">
            <button
              onClick={!isDemo ? handleBankConnect : nextStep}
              disabled={!allChecked}
              className={`flex items-center justify-center mt-4 px-4 py-2 w-full h-13 rounded-lg font-semibold ${
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
              className="mt-2 px-4 py-2 w-full h-13 bg-white text-[#2286EA] border-1 border-[#2286EA] rounded-lg"
            >
              Back
            </button>
          </div>

          <div className="flex flex-col items-start absolute right-[-50%] top-[10px]">
            <h2 className="text-2xl text-[#2A2A33] font-bold mb-3">
              Helpful Hint
            </h2>
            <p className="text-[#2A2A33] mb-3 font-semibold">
              Why connect your bank?
            </p>
            <p className=" text-[#2A2A33] w-80 text-[14px] mb-3">
              Connect your bank securely for instant verification.{" "}
              <Link
                className="text-[#1976E1]"
                href={
                  "https://usa.visa.com/visa-everywhere/blog/bdp/2023/01/27/what-is-open-1674845638965.html"
                }
              >
                Open Banking
              </Link>{" "}
              serves as a secure form of identity validation and enables access
              to the information required to proceed
            </p>
            <p className="text-[#2A2A33] mb-3 font-semibold">
              Your Security Comes First!
            </p>
            <ul className=" text-[#2A2A33] w-80 text-[14px] mb-3 list-disc ml-5">
              <li>
                You'll be asked to connect your bank via Visa Open Banking.
              </li>
              <li>
                We only access read-only information like income and expenses.
              </li>
              <li>We never see your passwords. You stay in control.</li>
              <li>Your data is encrypted end-to-end.</li>
            </ul>
            <p className=" text-[#2A2A33] mb-3 font-semibold">
              What do I need to do?{" "}
            </p>
            <p className=" text-[#2A2A33] w-83 text-[14px] mb-3">
              Simply tap the 'Connect' button below, and permission will be
              requested to access the data needed to verify your details. You
              will be redirected to your bank's secure portal to log in to your
              online banking account as usual. Once completed, you will be
              brought back here to continue
            </p>
            <p className=" text-[#2A2A33] mb-3 font-semibold">
              What is Open Banking?{" "}
            </p>
            <p className="text-[#2A2A33] w-83 text-[14px] mb-3">
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
              centrally and monitored. <br />
              <br />
              Only accounts and transactions you select are submitted to
              affordify.ai
            </p>
          </div>
        </div>
      )}

      {/* step 3 */}
      {currentStep === 5 && (
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
            <div className="text-[#2A2A33] text-[16px] font-semibold mb-0">
              More accounts can help improve your score:
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
          <div className="flex justify-between mb-7 mt-80">
            <button
              onClick={prevStep}
              className="px-16 py-2 bg-white border-1 border-[#2286EA] text-[#2286EA] rounded-xl mr-2 cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={
                !isDemo ? handleComplete : () => router.push("/dashboard")
              }
              /*For Demo */
              className="px-10 py-4 bg-[#2286EA] text-white rounded-xl cursor-pointer"
            >
              Calculate Affordability
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

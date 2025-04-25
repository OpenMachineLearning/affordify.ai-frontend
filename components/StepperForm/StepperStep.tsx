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

interface GoalData {
  id: "short" | "long" | "firstHome" | "investment" | "spending" | "cashflow";
  label: string;
  comingSoon?: boolean;
  expandable?: boolean;
}

const GOALS: GoalData[] = [
  { id: "short", label: "Save for a short-term goal", expandable: true },
  { id: "long", label: "Save for a long-term goal", expandable: true },
  { id: "firstHome", label: "Buy my first home", expandable: true },
  { id: "investment", label: "Buy an investment property", expandable: true },
  { id: "spending", label: "Cut down on spending", comingSoon: true },
  { id: "cashflow", label: "Optimize my cash flow", comingSoon: true },
];

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
  const [selectedGoal, setSelectedGoal] = useState("");
  const [selected, setSelected] = useState(false);

  const toggleGoal = (id: string, disabled = false) => {
    if (disabled) return;
    setSelectedGoal((prev) => (prev === id ? "" : id));
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
    <div className="w-[620px] p-10 h-fit  bg-white shadow-md rounded-2xl mt-[-20px]">
      {/* step 1 */}
      {currentStep === 1 && (
        <div className="h-full flex flex-col justify-between">
          <div>
            <h1 className="text-4xl text-[#2A2A33] font-bold mb-9">
              Basic information
            </h1>

            <div className="mb-8">
              <p className="font-semibold text-[#2A2A33] text-[18px] mb-2">
                What would you like to focus on?
              </p>
              <p className="text-[#2A2A33] text-[14px] mb-2">
                Choose one of the options. This helps us personalize your
                dashboard
              </p>
            </div>
            <div className="space-y-3">
              {GOALS.map((goal) => {
                const isChecked = selectedGoal === goal.id;
                return (
                  <div
                    key={goal.id}
                    className={`relative border rounded-md px-4 py-3 transition-all ${
                      isChecked ? "border-gray-400" : "border-gray-300"
                    } ${
                      goal.comingSoon ? "cursor-not-allowed bg-[#F5F5F5]" : ""
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleGoal(goal.id, goal.comingSoon)}
                          className="w-5 h-5"
                          disabled={goal.comingSoon}
                        />
                        <span
                          className={`text-[#2A2A33] font-medium ${
                            isChecked ? "border-gray-400" : "border-gray-300"
                          } ${
                            goal.comingSoon ? "opacity-60 bg-[#F5F5F5]" : ""
                          }`}
                        >
                          {goal.label}
                        </span>
                      </label>
                      {goal.comingSoon && (
                        <span className="text-xs font-bold bg-[#159990] text-white px-2 py-1 rounded-2xl">
                          COMING SOON
                        </span>
                      )}
                    </div>

                    {/* Expanded view */}
                    {isExpanded(goal.id) && (
                      <div className="mt-4 space-y-4 px-8">
                        {goal.id === "short" || goal.id === "long" ? (
                          <>
                            <div>
                              <label className="text-sm text-[#2A2A33] font-medium block mb-1 ">
                                Give it a name to help you recognize and track
                                it easily
                              </label>
                              <input
                                type="text"
                                placeholder="Saving goal name, e.g. Vacation"
                                className="border border-gray-300 rounded-md p-2 w-2/4 text-[#2A2A33] text-[14px] outline-none"
                                value={goalName}
                                onChange={(e) => setGoalName(e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="text-sm text-[#2A2A33] font-medium block mb-1">
                                How much would you like to save?
                              </label>
                              <input
                                type="text"
                                className="border border-gray-300 rounded-md p-2 w-2/4 text-[#2A2A33] text-[14px]  outline-none"
                                value={goalAmount}
                                onChange={(e) =>
                                  setGoalAmount(
                                    e.target.value.replace(/\D/g, "")
                                  )
                                }
                                placeholder="$1,000"
                              />
                            </div>
                            <div>
                              <label className="text-sm text-[#2A2A33]  font-medium block mb-2">
                                When do you want to reach this goal?
                              </label>
                              <div className="flex items-center space-x-4">
                                <span className="text-[#2A2A33] text-[14px]  border-1 border-gray-300 p-2 rounded-md w-2/9 mr-4">
                                  {goalMonths}{" "}
                                  {goal.id === "short" ? "months" : "years"}
                                </span>
                                <span className="text-[#2A2A33] text-sm mr-3">
                                  3
                                </span>
                                <input
                                  type="range"
                                  className="w-2/4"
                                  min={3}
                                  max={36}
                                  value={goalMonths}
                                  onChange={(e) =>
                                    setGoalMonths(parseInt(e.target.value, 10))
                                  }
                                />
                                <span className="text-[#2A2A33] text-sm">
                                  36
                                </span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="mb-6">
                              <label className=" block mb-2 text-[#2A2A33] text-sm">
                                Enter the cost of the house you are interested
                                in (Optional)
                              </label>

                              <input
                                type="text"
                                className="w-2/3 border border-[#cecece] rounded-lg p-2 text-black text-sm"
                                placeholder="180,000"
                                value={`$ ${houseCost}`}
                                onChange={(e) =>
                                  sethouseCost(
                                    e.target.value.replace(/\D/g, "")
                                  )
                                }
                              />
                              <label className=" block mb-2 mt-6 text-[#2A2A33] text-sm">
                                Savings for Home Purchase and Related Expenses
                                (Optional)
                              </label>

                              <input
                                type="text"
                                className="w-2/3 border border-[#cecece] rounded-lg p-2 text-black text-sm"
                                value={`$ ${homePurchase}`}
                                onChange={(e) =>
                                  sethomePurchase(
                                    e.target.value.replace(/\D/g, "")
                                  )
                                }
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
                                      Money currently available in your bank
                                      account
                                    </i>
                                  </div>
                                </div>
                                {selectedSources.bankSavings && (
                                  <input
                                    type="text"
                                    className="w-2/8 border text-[#2A2A33] border-[#cecece] rounded-lg p-2 ml-9"
                                    value={`$ ${BankSavings}`}
                                    onChange={(e) =>
                                      setBankSavings(
                                        e.target.value.replace(/\D/g, "")
                                      )
                                    }
                                  />
                                )}
                              </div>
                              <div className="flex items-center mt-2">
                                <div className="flex items-start space-x-2 ">
                                  <input
                                    type="checkbox"
                                    className="w-4 h-5"
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
                                      setCashSavings(
                                        e.target.value.replace(/\D/g, "")
                                      )
                                    }
                                  />
                                )}
                              </div>
                              <div className="flex items-center  mt-2">
                                <div>
                                  <div className="flex items-start space-x-2">
                                    <input
                                      type="checkbox"
                                      className="w-4 h-5"
                                      checked={selectedSources.extraIncome}
                                      onChange={() =>
                                        toggleSource("extraIncome")
                                      }
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
                                      setExtraIncome(
                                        e.target.value.replace(/\D/g, "")
                                      )
                                    }
                                  />
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex justify-end mt-5">
            <button
              onClick={nextStep}
              disabled={!selectedGoal}
              className={`flex items-center justify-center mt-4 px-8 py-4 w-38 rounded-lg text-[18px]
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
            <p className="text-[#2A2A33] mb-3 font-semibold">Short-term goal</p>
            <p className=" text-[#2A2A33] w-70 text-[14px] mb-3">
              Goals up to $10,000 within the next 3–12 months, like travel,
              emergency funds, or upcoming expenses
            </p>
            <p className="text-[#2A2A33] mb-3 font-semibold">Long-term goal </p>
            <p className=" text-[#2A2A33] w-75 text-[14px] mb-3">
              Goals from $10,000 to $100,000+ over 1–10 years, like education,
              buying a car, or home renovation
            </p>
            <p className=" text-[#2A2A33] mb-3 font-semibold">
              Buy my first home
            </p>
            <p className=" text-[#2A2A33] w-75 text-[14px] mb-3">
              Understand your home-buying budget and prepare financially for
              your first property
            </p>
            <p className=" text-[#2A2A33] mb-3 font-semibold">
              Buy an investment property
            </p>
            <p className="text-[#2A2A33] w-75 text-[14px] mb-3">
              Evaluate your affordability and plan for purchasing a rental or
              income-generating property
            </p>
            <p className=" text-[#2A2A33] mb-3 font-semibold">
              Cut down on spending{" "}
            </p>
            <p className="text-[#2A2A33] w-75 text-[14px] mb-3">
              Identify unnecessary expenses and start reducing your day-to-day
              costs
            </p>
            <p className=" text-[#2A2A33] mb-3 font-semibold">
              Optimize cash flow{" "}
            </p>
            <p className="text-[#2A2A33] w-70 text-[14px] mb-3">
              Balance income and expenses to stay in control and reduce
              financial stress
            </p>
          </div>
        </div>
      )}

      {/* step 2 */}
      {currentStep === 2 && (
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
                  I authorize affordify.ai to securely access and process my
                  financial information for affordability analysis, including
                  using AI services like OpenAI GPT API, with strict security
                  and privacy safeguards.
                </label>

                <label className="flex items-start mb-3 text-[#2A2A33] text-sm">
                  <input
                    type="checkbox"
                    checked={consents.tinkVisa}
                    onChange={() => handleConsentChange("tinkVisa")}
                    className="mr-2  w-[33px] h-[20px]"
                  />
                  I authorize affordify.ai to access my financial data via Tink
                  (a Visa company) and/or Visa Open Banking solutions, if
                  applicable, solely for affordability assessments
                </label>

                <label className="flex items-start mb-2 text-[#2A2A33] text-sm">
                  <input
                    type="checkbox"
                    checked={consents.privacy}
                    onChange={() => handleConsentChange("privacy")}
                    className="mr-2  w-[33px] h-[20px]"
                  />
                  I acknowledge that my data will be processed in accordance
                  with U.S. privacy laws and GDPR principles. I understand that
                  I can withdraw my consent at any time
                </label>
              </div>
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-[#2A2A33] mb-2">
                  Optional Consent:
                </h2>

                <label className="flex items-start mb-2 text-[#2A2A33] text-sm">
                  <input type="checkbox" className="mr-2  w-[22px] h-[20px]" />I
                  consent to receiving product updates, financial insights, and
                  promotional offers from affordify.ai and partners
                </label>

                <label className="flex items-start mb-2 text-[#2A2A33] text-sm">
                  <input type="checkbox" className="mr-2  w-[28px] h-[20px]" />{" "}
                  I authorize affordify.ai to securely share limited, anonymized
                  usage data with trusted partners to improve services and
                  deliver relevant content
                </label>
              </div>
            </div>
          </div>
          <div className="mt-12">
            <button
              onClick={handleBankConnect}
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
              onClick={nextStep}
              className="mt-2 px-4 py-2 w-full h-13 bg-white text-[#2286EA] border-1 border-[#2286EA] rounded-lg"
            >
              Back
            </button>
          </div>

          <div className="flex flex-col items-start absolute right-[-48%] top-[26px]">
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

      {/* step 3 */}
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

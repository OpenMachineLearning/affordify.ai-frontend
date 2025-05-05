import React, { useState, useRef, useEffect } from "react";
import { Trash2, X } from "lucide-react";
import Tooltip from "../ui/Tooltip";

type DialogType = "view" | "add" | "edit" | null;

const goals = [
  {
    type: "LONG-TERM GOAL",
    title: "Home Buying Expense",
    current: 18200,
    total: 32200,
    months: 0,
    saved: 0,
    completed: true,
    durationType: "years",
  },
];

const SavingsGoalTracker = () => {
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const [goalType, setGoalType] = useState("short-term"); // 'short-term' or 'long-term'
  const [duration, setDuration] = useState(5);

  const menuRef = useRef<HTMLDivElement>(null);

  const [sliderValues, setSliderValues] = useState(
    goals.map((goal) => goal.months || 1)
  );
  const [durationTypes, setDurationTypes] = useState(
    goals.map((goal) => goal.durationType)
  );

  const handleDurationChange = (index: number, value: string) => {
    const updatedTypes = [...durationTypes];
    updatedTypes[index] = value;
    setDurationTypes(updatedTypes);
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getBarWidth = (value: number, max: number) => `${(value / max) * 100}%`;

  const handleSliderChange = (index: number, value: number) => {
    const newValues = [...sliderValues];
    newValues[index] = value;
    setSliderValues(newValues);
  };

  return (
    <div className="bg-white shadow rounded-2xl p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[24px] font-normal text-[#2A2A33] mb-8 w-6/8">
          Estimated Home Buying <br />
          <div className="flex items-center ">
            Expenses
            <Tooltip text="Savings for Deposit, Agent Commissions, Closing costs (expenses associated with finalizing a transaction, including document processing fees, legal services, taxes, and other payments)">
              <img
                src="/dashboard/info.png"
                alt="Information"
                className="cursor-pointer ml-2"
              />
            </Tooltip>{" "}
          </div>
        </h2>
      </div>

      {goals.map((goal, idx) => (
        <div key={idx} className="mb-10 mt-10">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-1 text-[20px]  text-[#2A2A33] ">
              ${goal.current.toLocaleString()}/${goal.total.toLocaleString()}
            </div>
          </div>
          <div className="w-full h-3 rounded-full bg-[#D9D9D9] mb-2">
            <div
              className={`h-full rounded-full ${
                goal.completed ? "bg-[#1976E1]" : "bg-[#D9D9D9]"
              }`}
              style={{ width: getBarWidth(goal.current, goal.total) }}
            ></div>
          </div>
          <div className="flex justify-start text-sm text-gray-700">
            <span>Estimated TImeLine To Reach Goal: &nbsp;</span>

            <span className="font-medium"> {goal.months} Months</span>
          </div>
        </div>
      ))}

      <div className="text-[16px] text-[#1976E1] font-normal flex justify-start items-center">
        <a href="#">Want to achieve your goals earlier? Get suggestions</a>
        <img className="cursor-pointer" src="/dashboard/side-5-1.png" alt="" />
      </div>

      {/* Dialog Modal */}

      {activeDialog && (
        <div className="fixed inset-0 bg-[#2a2a337a] z-50 flex items-center justify-center">
          <div className="bg-white w-fit  p-12 relative">
            <button
              className="absolute top-4 right-4 text-[#2a2a337a] hover:text-black"
              onClick={() => setActiveDialog(null)}
            >
              <X className="w-5 h-5" />
            </button>

            {activeDialog === "edit" && (
              <div className="fixed inset-0  bg-[#2a2a337a] z-50 flex items-center justify-center ">
                <div className="bg-white w-[1075px] h-[648px] p-10 relative ">
                  <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-black"
                    onClick={() => setActiveDialog(null)}
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <h2 className="text-[24px] font-semibold mb-4 text-[#2A2A33]">
                    Edit Saving Goals
                  </h2>
                  <div className="w-full bg-[#D9D9D9] h-[1px] mb-6"></div>

                  {goals.map((goal, idx) => (
                    <div key={idx} className="mb-7">
                      {/* Header Row */}
                      <div className="flex justify-between items-center px-4 py-3 bg-[#F5F5F5] rounded-md mb-3">
                        <div>
                          <p className="text-[10px] font-bold text-[#ACACAC]">
                            {goal.type}
                          </p>
                          <h3 className="text-[16px] font-normal text-[#2A2A33]">
                            {goal.title}
                          </h3>
                        </div>
                        <button className="text-[#ED4141] text-[14px] flex items-center gap-1">
                          <Trash2 className="w-4 h-5" /> Delete Goal
                        </button>
                      </div>
                      {/* Body Form */}
                      <div className="p-4">
                        <div className="flex justify-between  gap-4 mb-4">
                          <div className="flex flex-col">
                            <label className="text-sm mb-1 text-[#2A2A33]">
                              Saving goal name
                            </label>
                            <input
                              type="text"
                              defaultValue={goal.title}
                              className="border border-[#D9D9D9] px-3 py-2 rounded w-full text-[#2A2A33] text-[14px] outline-none"
                            />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-sm mb-1 text-[#2A2A33]">
                              Amount
                            </label>
                            <input
                              type="number"
                              defaultValue={goal.total}
                              className="border border-[#D9D9D9] px-3 py-2 rounded w-full text-[#2A2A33] text-[14px] outline-none"
                            />
                          </div>
                          <div className="flex items-center  text-[#2A2A33] ">
                            <div className="flex  flex-col">
                              <label className="text-sm mb-1">
                                When do you want to reach this goal?
                              </label>
                              <div className="flex items-center gap-2 mb-2">
                                <input
                                  type="number"
                                  readOnly
                                  value={sliderValues[idx]}
                                  className="border border-[#D9D9D9] px-3 py-2 rounded w-1/2 text-[#2A2A33] text-[14px ] outline-none"
                                />
                                <span className="text-sm">
                                  {durationTypes[idx]}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col -mb-5">
                              <input
                                type="range"
                                min={1}
                                max={30}
                                value={sliderValues[idx]}
                                onChange={(e) =>
                                  handleSliderChange(
                                    idx,
                                    parseInt(e.target.value)
                                  )
                                }
                                className="w-[270px]"
                              />
                              <div className="flex justify-between text-xs mt-1 text-[#2A2A33]">
                                <span>1</span>
                                <span>30</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-[#D9D9D9] h-[1px] -mt-3"></div>
                    </div>
                  ))}

                  <div className="flex justify-between gap-2 mt-4 items-center">
                    <button
                      className="border border-[#1976E1] text-[#1976E1] text-[18px] px-14 py-4 rounded-lg mt-3"
                      onClick={() => setShowDialog(false)}
                    >
                      Cancel
                    </button>
                    <button className="bg-[#1976E1] text-white text-[18px] px-8 py-4 rounded-lg">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
            {activeDialog === "view" && (
              <>
                <div className="w-[680px] ">
                  <h2 className="text-2xl font-semibold mb-6 text-[#2A2A33]">
                    Your Saving Goals
                  </h2>
                  {goals.map((goal, idx) => (
                    <div key={idx} className="mb-6">
                      <p className="text-[10px] font-bold text-gray-400 mb-1">
                        {goal.type}
                      </p>
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="text-[16px] font-semibold text-[#2A2A33]">
                          {goal.title}
                        </h3>
                        <span className="text-sm font-semibold text-[#2A2A33]">
                          ${goal.current.toLocaleString()}/
                          {goal.total.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-[#D9D9D9] mb-2">
                        <div
                          className="h-full rounded-full bg-[#1976E1]"
                          style={{
                            width: getBarWidth(goal.current, goal.total),
                          }}
                        ></div>
                      </div>
                      <div className="text-sm text-gray-700 flex justify-between">
                        <span>
                          Estimated time to reach goal:{" "}
                          <strong>
                            {goal.months
                              ? `${goal.months} ${goal.durationType}`
                              : "-"}
                          </strong>
                        </span>
                        <span>
                          Saved this month: <strong>{goal.months}</strong>
                        </span>
                      </div>
                      <div className="w-full bg-[#D9D9D9] h-[1px] mt-4"></div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {activeDialog === "add" && (
              <>
                <div className="w-[420px]">
                  <h2 className="text-[24px] font-semibold mb-6 text-[#2A2A33]">
                    Add New Saving Goal
                  </h2>

                  <form className="space-y-6">
                    {/* Goal Type */}
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="goalType"
                          value="short-term"
                          className="w-[20px] h-[20px]"
                          checked={goalType === "short-term"}
                          onChange={() => {
                            setGoalType("short-term");
                            setDuration(5);
                          }}
                        />
                        <span className="text-[#2A2A33]">Short-term goal</span>
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="goalType"
                          value="long-term"
                          className="w-[20px] h-[20px]"
                          checked={goalType === "long-term"}
                          onChange={() => {
                            setGoalType("long-term");
                            setDuration(2);
                          }}
                        />
                        <span className="text-[#2A2A33]">Long-term goal</span>
                      </label>
                    </div>

                    {/* Goal Name */}
                    <div>
                      <label className="block text-sm mb-1 text-[#2A2A33]">
                        Give it a name to help you recognize and track it easily
                      </label>
                      <input
                        type="text"
                        placeholder="Saving goal name, e.g. Vacation"
                        className="w-2/3 border border-[#D9D9D9] rounded-lg px-3 py-3 text-sm text-[#2A2A33] outline-none"
                      />
                    </div>

                    {/* Amount */}
                    <div>
                      <label className="block text-sm mb-1 text-[#2A2A33]">
                        How much would you like to save?
                      </label>
                      <input
                        type="number"
                        defaultValue={1000}
                        className="w-2/3 border border-[#D9D9D9] rounded-lg px-3 py-3 text-sm text-[#2A2A33] outline-none"
                      />
                    </div>

                    {/* Time Range */}
                    <label className="block text-sm mb-1 text-[#2A2A33]">
                      When do you want to reach this goal?
                    </label>
                    <div className="flex items-center">
                      <div className="w-[300px]">
                        <div className="flex items-center gap-3 mb-2">
                          <input
                            type="number"
                            value={duration}
                            readOnly
                            className="w-[100px] border border-[#D9D9D9] rounded px-3 py-2 text-sm text-[#2A2A33] outline-none"
                          />
                          <span className="text-sm text-[#2A2A33]">
                            {goalType === "short-term" ? "months" : "years"}
                          </span>
                        </div>
                      </div>
                      <div className="w-full flex text-sm text-[#2A2A33]">
                        <span>{goalType === "short-term" ? "3" : "1"}</span>
                        <input
                          type="range"
                          min={goalType === "short-term" ? 3 : 1}
                          max={goalType === "short-term" ? 36 : 10}
                          value={duration}
                          onChange={(e) =>
                            setDuration(parseInt(e.target.value))
                          }
                          className="w-full accent-[#1976E1]"
                        />
                        <span>{goalType === "short-term" ? "36" : "10"}</span>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between pt-4">
                      <button
                        type="button"
                        onClick={() => setActiveDialog(null)}
                        className="border border-[#1976E1] text-[#1976E1] px-12 py-4 rounded-lg text-[16px]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-[#1976E1] text-white px-9 py-2 rounded-lg text-[16px]"
                      >
                        Save Goal
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingsGoalTracker;

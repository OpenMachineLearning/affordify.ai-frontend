import { useState } from "react";
import { MoreVertical, Download, Trash } from "lucide-react";

export default function MyAccount() {
  const [dropdownOpenIndex, setDropdownOpenIndex] = useState<number | null>(
    null
  );

  const accounts = [
    {
      holder: "John Brian",
      institution: "ING",
      type: "Transaction",
      name: "Orange Everyday",
      transactions: 92,
      balance: "$12,569.09",
    },
    {
      holder: "John Brian + Elisa Cooper",
      institution: "American Express",
      type: "Transaction",
      name: "Orange Everyday",
      transactions: 65,
      balance: "$2,743.59",
    },
    {
      holder: "John Brian",
      institution: "Unicredit",
      type: "Credit Card",
      name: "Mastercard Platinum",
      transactions: 26,
      balance: "$10,559.09",
    },
  ];

  return (
    <div className="p-2  min-h-full">
      <h1 className="text-3xl font-semibold text-[#2A2A33] mb-5">
        Connected Accounts
      </h1>
      <div className="rounded-2xl bg-white shadow p-3 h-[870px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[24px] text-[#2A2A33] font-semibold">Accounts</h2>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-[#1976E1] text-[16px] border-[#1976E1] cursor-pointer w-[203px] h-[45px] font-semibold">
              <img src="/dashboard/download.png" alt="" /> Download as CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-[#1976E1] text-[16px] border-[#1976E1] cursor-pointer  w-[250px] h-[45px] font-semibold">
              <img src="/dashboard/plus.svg" alt="" /> Add New Bank Account
            </button>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#EFF6FD] text-left text-[#2A2A33] font-semibold">
              <th className="py-3 px-4">Account Holder</th>
              <th className="py-3 px-4">Financial Institution</th>
              <th className="py-3 px-4">Account Type</th>
              <th className="py-3 px-4">Account Name</th>
              <th className="py-3 px-4">Transactions</th>
              <th className="py-3 px-4">Current Balance</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody className="rounded-xl">
            {accounts.map((acc, i) => (
              <tr
                key={i}
                className={`${
                  i % 2 !== 0
                    ? "bg-[#F5F5F5] text-[#2A2A33] "
                    : " text-[#2A2A33]"
                } `}
              >
                <td className="py-3 px-4">{acc.holder}</td>
                <td className="py-3 px-4">{acc.institution}</td>
                <td className="py-3 px-4">{acc.type}</td>
                <td className="py-3 px-4">{acc.name}</td>
                <td className="py-3 px-4">{acc.transactions}</td>
                <td className="py-3 px-4">{acc.balance}</td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() =>
                      setDropdownOpenIndex(dropdownOpenIndex === i ? null : i)
                    }
                    className="relative z-10"
                  >
                    <MoreVertical size={18} />
                  </button>
                  {dropdownOpenIndex === i && (
                    <div className="absolute right-15 mt-2 w-[283px] h-[80px] bg-white rounded-lg shadow-lg z-20 ">
                      <button className="flex items-center gap-2 px-2 py-2  w-full text-left ">
                        <img src="/dashboard/download.png" alt="" /> Download
                        Bank Statements As CSV
                      </button>
                      <button className="flex items-center gap-2 px-2 py-2  text-red-600 w-full text-left">
                        <img src="/dashboard/trash.png" alt="" /> Remove Bank
                        Account
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

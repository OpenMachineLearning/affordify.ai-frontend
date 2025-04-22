"use client";

interface Account {
  holder: string;
  institution: string;
  type: string;
  name: string;
  balance: number;
}

const accounts: Account[] = [
  {
    holder: "John Brian",
    institution: "ING",
    type: "Transaction",
    name: "Orange Everyday",
    balance: 12569.09,
  },
  {
    holder: "John Brian + Elisa Cooper",
    institution: "American Express",
    type: "Transaction",
    name: "Orange Everyday",
    balance: 2743.59,
  },
  {
    holder: "John Brian",
    institution: "Unicredit",
    type: "Credit Card",
    name: "Mastercard Platinum",
    balance: -250.0,
  },
];

export default function AccountTable() {
  return (
    <div className="max-w-full md:w-[62.5%]  bg-white p-4 rounded-xl shadow-sm font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 ">
        <h2 className="text-[24px] font-semibold text-neutral-900">Accounts</h2>
        <a
          href="#"
          className="text-[16px] font-medium text-[#1976E1] flex items-center gap-1 p-2 rounded-md border-[#1976E1] border-1"
        >
          <img src="./dashboard/download.png" />
          Download as CSV
        </a>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl ">
        <table className="w-full text-left text-sm border-md">
          <thead className="bg-[#EFF6FD] text-gray-700">
            <tr>
              <th className="px-4 py-3 font-semibold">Account Holder</th>
              <th className="px-4 py-3 font-semibold">Financial Institution</th>
              <th className="px-4 py-3 font-semibold">Account Type</th>
              <th className="px-4 py-3 font-semibold">Account Name</th>
              <th className="px-4 py-3 font-semibold text-right">
                Current Balance
              </th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc, i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-[#F5F5F5]" : "bg-white"}>
                <td className="px-4 py-3 text-[#2A2A33]">{acc.holder}</td>
                <td className="px-4 py-3 text-[#2A2A33]">{acc.institution}</td>
                <td className="px-4 py-3 text-[#2A2A33]">{acc.type}</td>
                <td className="px-4 py-3 text-[#2A2A33]">{acc.name}</td>
                <td
                  className={`px-4 py-3 text-right font-medium ${
                    acc.balance < 0 ? "text-red-600" : "text-[#2A2A33]"
                  }`}
                >
                  {acc.balance < 0
                    ? `-$${Math.abs(acc.balance).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}`
                    : `$${acc.balance.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

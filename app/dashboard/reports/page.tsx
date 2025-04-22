export default function ReportsPage() {
  const reports = [
    {
      name: "Report #1",
      type: "John Brian",
      date: "03/14/2025",
      url: "/reports/report1.pdf",
    },
    {
      name: "Report #2",
      type: "John Brian + Elisa Cooper",
      date: "03/07/2025",
      url: "/reports/report2.pdf",
    },
    {
      name: "Report #3",
      type: "John Brian",
      date: "03/01/2025",
      url: "/reports/report3.pdf",
    },
  ];

  return (
    <main className="p-2  min-h-full">
      <h1 className="text-3xl font-semibold text-[#2A2A33] mb-5">
        Your Reports
      </h1>
      <div className="rounded-2xl bg-white shadow p-3 h-[870px]">
        <table className="min-w-full">
          <thead className="bg-[#EFF6FD] text-left">
            <tr className="text-sm text-[#1d1d1f] rounded-2xl">
              <th className="px-6 py-3 font-medium">
                Report Name{" "}
                <span className="inline-block transform rotate-180">⇅</span>
              </th>
              <th className="px-6 py-3 font-medium">Type</th>
              <th className="px-6 py-3 font-medium">
                Date{" "}
                <span className="inline-block transform rotate-180">⇅</span>
              </th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-[#1d1d1f]">
            {reports.map((report, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 1 ? "bg-[#F5F5F5]" : "bg-white"}
              >
                <td className="px-6 py-4">{report.name}</td>
                <td className="px-6 py-4">{report.type}</td>
                <td className="px-6 py-4">{report.date}</td>
                <td className="px-6 py-4">
                  <a
                    href={report.url}
                    download
                    className="inline-flex items-center gap-2 text-sm text-[#0066cc] hover:underline"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 3a1 1 0 011 1v10.586l3.293-3.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L11 14.586V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                      <path d="M5 18a1 1 0 100 2h14a1 1 0 100-2H5z" />
                    </svg>
                    Download PDF
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

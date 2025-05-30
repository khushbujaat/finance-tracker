import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "../components/StatCard";
import TransactionForm from "../components/TransactionForm";
import CategoryPieChart from "../components/CategoryPieChart";
import MonthlyBarChart from "../components/MonthlyBarChart";

function Dashboard() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [selectedTx, setSelectedTx] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterFrom, setFilterFrom] = useState("");
const [filterTo, setFilterTo] = useState("");
const [showForm, setShowForm] = useState(true);



  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchTransactions = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/transactions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };

    fetchTransactions();
  }, [navigate]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!window.confirm("Are you sure you want to delete this transaction?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        alert("Transaction deleted.");
        setTransactions((prev) => prev.filter((tx) => tx._id !== id));
      } else {
        alert(data.message || "Failed to delete.");
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const filteredTx = transactions.filter((tx) => {
  const matchesCategory =
    filterCategory === "all" || tx.category === filterCategory;

  const txDate = new Date(tx.date);
  const fromDate = filterFrom ? new Date(filterFrom) : null;
  const toDate = filterTo ? new Date(filterTo) : null;

  const matchesFrom = !fromDate || txDate >= fromDate;
  const matchesTo = !toDate || txDate <= toDate;

  return matchesCategory && matchesFrom && matchesTo;
});

//filter((tx) => tx.category === filterCategory);


  const income = filteredTx
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const expense = filteredTx
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const balance = income - expense;

  const expenseByCategory = filteredTx
    .filter((tx) => tx.type === "expense")
    .reduce((acc, tx) => {
      const existing = acc.find((item) => item.category === tx.category);
      if (existing) {
        existing.amount += Number(tx.amount);
      } else {
        acc.push({ category: tx.category, amount: Number(tx.amount) });
      }
      return acc;
    }, []);

  const monthlyExpense = filteredTx
    .filter((tx) => tx.type === "expense")
    .reduce((acc, tx) => {
      const date = new Date(tx.date);
      const month = date.toLocaleString("default", { month: "short", year: "numeric" });

      const existing = acc.find((item) => item.month === month);
      if (existing) {
        existing.amount += Number(tx.amount);
      } else {
        acc.push({ month, amount: Number(tx.amount) });
      }

      return acc;
    }, [])
    .sort((a, b) => new Date(a.month) - new Date(b.month));

const downloadCSV = () => {
  const headers = ["Date", "Type", "Category", "Amount", "Note"];
  const rows = filteredTx.map((tx) => [
    tx.date?.slice(0, 10),
    tx.type,
    tx.category,
    tx.amount,
    tx.note,
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers, ...rows].map((row) => row.join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "transactions.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4">

      <header className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold">Hello, John!</h1>
          <p className="text-gray-600">Welcome back to your dashboard 👋</p>
        </div>

        <div className="flex gap-3">
        <button
  onClick={() => {
    document.documentElement.classList.toggle("dark");
  }}
  className="bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400 dark:bg-gray-700 dark:text-white">
  Toggle Dark Mode
</button>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            window.location.href = "/login";
          }}
          className="bg-primary hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-xl shadow transition">
          Logout
        </button>
        </div>
      </header>

      {selectedTx && <p className="text-sm text-blue-600">Editing: {selectedTx.category}</p>}
{showForm && (
      <TransactionForm
        onSubmit={(newTx) => {
          if (selectedTx) {
            setTransactions((prev) =>
              prev.map((tx) => (tx._id === newTx._id ? newTx : tx))
            );
            setSelectedTx(null);
          } else {
            setTransactions((prev) => [newTx, ...prev]);
          }
        }}
        initialData={selectedTx}
      />
      )}
<div className="mb-6">
  <button
    onClick={() => setShowForm(!showForm)}
    className="bg-primary hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-xl shadow transition"
  >
    {showForm ? "Close Form" : "+ Add Transaction"}
  </button>
</div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300">

    <StatCard title="Income" amount={`$${income}`} color="green" />
  </div>
  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300">

    <StatCard title="Expense" amount={`$${expense}`} color="red" />
  </div>
  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300">

    <StatCard title="Balance" amount={`$${balance}`} color="blue" />
  </div>
</section>


      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300">

    <h2 className="text-xl font-semibold mb-2">Spending by Category</h2>
    <CategoryPieChart data={expenseByCategory} />
  </div>

  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300">

    <h2 className="text-xl font-semibold mb-2">Monthly Trends</h2>
    <MonthlyBarChart data={monthlyExpense} />
  </div>
</section>


      <section className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
  <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>

        <div className="mb-4">
          <label className="mr-2 font-medium">Filter by Category:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="all">All</option>
            {[...new Set(transactions.map((tx) => tx.category))].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
          <div className="flex gap-4 mb-4 flex-wrap">
  <div>
    <label className="block mb-1 font-medium">From:</label>
    <input
      type="date"
      value={filterFrom}
      onChange={(e) => setFilterFrom(e.target.value)}
      className="border px-2 py-1 rounded"
    />
  </div>
  <div>
    <label className="block mb-1 font-medium">To:</label>
    <input
      type="date"
      value={filterTo}
      onChange={(e) => setFilterTo(e.target.value)}
      className="border px-2 py-1 rounded"
    />
  </div>

  <div className="flex items-end">
<button
  onClick={() => {
    setFilterCategory("all");
    setFilterFrom("");
    setFilterTo("");
  }}
  className="bg-primary hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-xl shadow transition"
>
  Reset Filters
</button>
<button
  onClick={downloadCSV}
  className="bg-primary hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-xl shadow transition"
>
  Export CSV
</button>

</div>
</div>
          <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-2 border-b text-gray-700 dark:text-gray-200">Date</th>
              <th className="py-2 border-b text-gray-700 dark:text-gray-200">Amount</th>
              <th className="py-2 border-b text-gray-700 dark:text-gray-200">Category</th>
              <th className="py-2 border-b text-gray-700 dark:text-gray-200">Note</th>
              <th className="py-2 border-b text-gray-700 dark:text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTx.map((tx) => (
              <tr key={tx._id}>
                <td className="py-2 border-b text-gray-700 dark:text-gray-200">{tx.date?.slice(0, 10)}</td>
                <td
                  className={`py-2 border-b ${
                    tx.type === "income" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {tx.type === "expense" ? "- " : ""}${tx.amount}
                </td>
                <td className="py-2 border-b text-gray-700 dark:text-gray-200">{tx.category}</td>
                <td className="py-2 border-b text-gray-700 dark:text-gray-200">{tx.note}</td>
                <td className="py-2 border-b text-gray-700 dark:text-gray-200">
                  <button
                    onClick={() => setSelectedTx(tx)}
                    className="bg-primary hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-xl shadow transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(tx._id)}
                    className="bg-danger hover:bg-red-700 dark:bg-blue-800 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-xl shadow transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;

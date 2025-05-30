
import { useState, useEffect } from "react";


function TransactionForm({ onSubmit, initialData = null }) {

  const [form, setForm] = useState(
  initialData || {
    type: "income",
    category: "",
    amount: "",
    date: "",
    note: "",
  }
);

useEffect(() => {
  if (initialData) {
    setForm(initialData);
  }
}, [initialData]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must be logged in");
    return;
  }

  const method = initialData ? "PUT" : "POST";
  const url = initialData
    ? `http://localhost:5000/api/transactions/${initialData._id}`
    : "http://localhost:5000/api/transactions";

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to save transaction");
    } else {
      alert(initialData ? "Transaction updated!" : "Transaction added!");
      onSubmit?.(data);
      setForm({ type: "income", category: "", amount: "", date: "", note: "" });
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Something went wrong.");
  }
};



  return (
    <form
  onSubmit={handleSubmit}
  className="bg-white p-6 rounded-2xl shadow-md max-w-md w-full mx-auto space-y-4"
>
  <div>
    <label className="block mb-1 font-medium text-gray-700">Type</label>
    <select
      name="type"
      value={form.type}
      onChange={handleChange}
      className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <option value="income">Income</option>
      <option value="expense">Expense</option>
    </select>
  </div>

  <div>
    <label className="block mb-1 font-medium text-gray-700">Category</label>
    <input
      type="text"
      name="category"
      value={form.category}
      onChange={handleChange}
      className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
    />
  </div>

  <div>
    <label className="block mb-1 font-medium text-gray-700">Amount</label>
    <input
      type="number"
      name="amount"
      value={form.amount}
      onChange={handleChange}
      className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
    />
  </div>

  <div>
    <label className="block mb-1 font-medium text-gray-700">Date</label>
    <input
      type="date"
      name="date"
      value={form.date}
      onChange={handleChange}
      className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
    />
  </div>

  <div>
    <label className="block mb-1 font-medium text-gray-700">Note</label>
    <input
      type="text"
      name="note"
      value={form.note}
      onChange={handleChange}
      className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
    />
  </div>

  <button className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow transition">
    {initialData ? "Update Transaction" : "Add Transaction"}
  </button>
</form>

  );
}

export default TransactionForm;

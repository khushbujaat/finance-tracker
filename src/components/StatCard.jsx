
function StatCard({ title, amount, color }) {
  const bg = {
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    blue: "bg-blue-100 text-blue-800",
  };

  return (
    <div className={`p-4 rounded shadow ${bg[color]}`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold">{amount}</p>
    </div>
  );
}

export default StatCard;

import React, { useState } from "react";
import apiClient from '../api/axios';


const AddTransactionModal = ({ onClose, onTransactionAdded }) => {
  const [transactionType, setTransactionType] = useState("expense");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleTypeClick = (type) => {
    setTransactionType(type);
    // Automatically fill category to avoid lowercase mistakes
    setCategory(type === "income" ? "income" : "expense");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const finalAmount = Math.abs(parseFloat(amount));

    try {
      const payload = {
        date,
        category,
        amount: finalAmount,
        description,
        transaction_type: transactionType, // always lowercased
      };

      console.log("DEBUG submitting transaction:", payload);

      await apiClient.post("/transactions", payload);
      if (onTransactionAdded) await onTransactionAdded();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to add transaction. Please try again.");
    }
  };

  return (
    <div style={{ padding: "1rem", border: "1px solid #ccc" }}>
      <h3>Add New Transaction</h3>

      <div style={{ marginBottom: "10px" }}>
        <button
          onClick={() => handleTypeClick("expense")}
          style={{
            backgroundColor: transactionType === "expense" ? "#ffcccc" : "#f2f2f2",
            marginRight: "10px",
          }}
        >
          Expense
        </button>
        <button
          onClick={() => handleTypeClick("income")}
          style={{
            backgroundColor: transactionType === "income" ? "#ccffcc" : "#f2f2f2",
          }}
        >
          Income
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />{" "}
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value.toLowerCase())}
          placeholder="Category"
          required
        />{" "}
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount (₹)"
          required
        />{" "}
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />{" "}
        <button type="button" onClick={onClose}>
          Cancel
        </button>{" "}
        <button type="submit">Add Transaction</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default AddTransactionModal;

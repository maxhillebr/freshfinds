import { useState } from "react";

const useStateHook = () => {
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rows, setRows] = useState([]);

  return {
    product,
    setProduct,
    amount,
    setAmount,
    title,
    setTitle,
    description,
    setDescription,
    rows,
    setRows,
  };
};

export default useStateHook;

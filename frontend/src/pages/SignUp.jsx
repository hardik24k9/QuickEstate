import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { getErrorMessage, validateFormData } from "../utils/validateAuthData";
import { APIS } from "../utils/constants";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // add check for client side validation
    const formError = validateFormData(formData);
    if (formError) {
      setError(formError);
      return;
    }

    try {
      setLoading(true);

      await axios.post(APIS.AUTH.SIGN_UP_URL, JSON.stringify(formData), {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setError(null);
      setLoading(false);
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      const { message } = error.response.data;
      const errorMessage = getErrorMessage(message);
      setError(errorMessage);
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto lg:p-3">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
          required
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
};

export default SignUp;

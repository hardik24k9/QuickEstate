import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const resp = await axios.get(`/api/user/find/${listing?.userRef}`);
        setLandlord(resp.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLandlord();
  }, [listing?.userRef]);

  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2 mt-2">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={handleChange}
            placeholder="Enter your message here..."
            className="w-full border p-3 rounded-lg my-2"
          ></textarea>

          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
};

export default Contact;

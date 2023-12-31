import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../stores/userSlice";
import { Link } from "react-router-dom";
import { getErrorMessage, validateFormData } from "../utils/validateAuthData";
import { APIS } from "../utils/constants";

const Profile = () => {
  const profileImg = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListings, setShowListings] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [showListingsError, setShowListingsError] = useState(false);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleUserDetailsChange = (event) => {
    setFormData({ ...formData, [event.target.id]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(updateUserStart());

    if (formData.email || formData.password) {
      const formError = validateFormData(formData, true);
      if (formError) {
        dispatch(updateUserFailure(formError));
        return;
      }
    }

    try {
      const response = await axios.post(
        `${APIS.USER.UPDATE_URL}/${currentUser._id}`,
        JSON.stringify(formData),
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === false) {
        dispatch(updateUserFailure(response.message));
        return;
      }

      dispatch(updateUserSuccess(response.data));
      setUpdateSuccess(true);
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 2000);
    } catch (error) {
      const { message } = error.response.data;
      const errorMessage = getErrorMessage(message);
      dispatch(updateUserFailure(errorMessage));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const resp = await axios.delete(
        `${APIS.USER.DELETE_URL}/${currentUser._id}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (resp.status === false) {
        dispatch(updateUserFailure(resp.message));
        return;
      }

      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOutUser = async () => {
    dispatch(signOutUserStart());

    try {
      const resp = await axios.get(APIS.AUTH.SIGN_OUT_URL, {
        headers: { "Content-Type": "application/json" },
      });

      if (resp.status === false) {
        dispatch(signOutUserFailure(resp.message));
        return;
      }

      dispatch(signOutUserSuccess());
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);

      if (!showListings) {
        const resp = await axios.get(
          `${APIS.USER.FETCH_USER_LISTINGS_URL}/${currentUser._id}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        if (resp.status === false) {
          setShowListingsError(true);
          return;
        }

        setShowListings(true);
        setUserListings(resp.data);
      } else {
        setShowListings(false);
      }
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const resp = axios.delete(`${APIS.LISTING.DELETE_URL}/${listingId}`);
      if (resp.status === false) {
        return;
      }

      setUserListings(
        userListings.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-3xl font-semibold text-center my-6 lg:my-7">
        Profile
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          ref={profileImg}
          hidden
          accept="image/*"
          onChange={(event) => setFile(event.target.files[0])}
        />
        <img
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          onClick={() => profileImg.current.click()}
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mb-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePercentage}%`}</span>
          ) : filePercentage === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          id="username"
          className="border p-3 rounded-lg"
          onChange={handleUserDetailsChange}
          required
        />
        <input
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
          id="email"
          className="border p-3 rounded-lg"
          onChange={handleUserDetailsChange}
          required
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleUserDetailsChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link to="/create-listing">
          <button className="bg-green-700 text-white w-full rounded-lg p-3 uppercase hover:opacity-95">
            Create Listing
          </button>
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          className="text-red-700 cursor-pointer"
          onClick={handleDeleteUser}
        >
          Delete account
        </span>
        <span
          className="text-red-700 cursor-pointer"
          onClick={handleSignOutUser}
        >
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 my-4">
        {updateSuccess ? "User is updated successfully!" : ""}
      </p>
      <button onClick={handleShowListings} className="text-green-700 w-full">
        Show Listings
      </button>
      <p className="text-red-700 mt-5">
        {showListingsError ? "Error showing listings" : ""}
      </p>
      {/** show all the listings created by the user */}
      {showListings &&
        userListings &&
        (userListings.length > 0 ? (
          <div className="flex flex-col gap-4">
            <h1 className="text-center mt-3 text-2xl font-semibold">
              Your Listings
            </h1>
            {userListings.map((listing) => (
              <div
                key={listing._id}
                className="border rounded-lg p-3 flex justify-between items-center gap-4 px-4"
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt="listing cover"
                    className="h-16 w-16 object-contain"
                  />
                </Link>
                <Link
                  className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                  to={`/listing/${listing._id}`}
                >
                  <p>{listing.name}</p>
                </Link>

                <div className="flex flex-col item-center">
                  <button
                    className="text-red-700 uppercase"
                    onClick={() => handleListingDelete(listing._id)}
                  >
                    Delete
                  </button>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className="text-green-700 uppercase">Edit</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">No Listings Found!</p>
        ))}
    </div>
  );
};

export default Profile;

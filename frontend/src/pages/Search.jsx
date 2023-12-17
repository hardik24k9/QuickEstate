import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Search = () => {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    if (
      event.target.id === "all" ||
      event.target.id === "rent" ||
      event.target.id === "sell"
    ) {
      setSidebarData({ ...sidebarData, type: event.target.id });
    }

    if (event.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: event.target.value });
    }

    if (
      event.target.id === "parking" ||
      event.target.id === "furnished" ||
      event.target.id === "offer"
    ) {
      setSidebarData({
        ...sidebarData,
        [event.target.id]:
          event.target.checked || event.target.checked === "true"
            ? true
            : false,
      });
    }

    if (event.target.id === "sort_order") {
      const sort = event.target.value.split("_")[0] || "created_at";
      const order = event.target.value.split("_")[1] || "desc";
      setSidebarData({ ...sidebarData, sort, order });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("furnished", sidebarData.furnished);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromURL = urlParams.get("searchTerm");
    const typeFromURL = urlParams.get("type");
    const offerFromURL = urlParams.get("offer");
    const parkingFromURL = urlParams.get("parking");
    const furnishedFromURL = urlParams.get("furnished");
    const sortFromURL = urlParams.get("sort");
    const orderFromURL = urlParams.get("order");

    if (
      searchTermFromURL ||
      typeFromURL ||
      offerFromURL ||
      sortFromURL ||
      parkingFromURL ||
      furnishedFromURL ||
      orderFromURL
    ) {
      setSidebarData({
        searchTerm: searchTermFromURL || "",
        offer: offerFromURL === "true" ? true : false,
        type: typeFromURL || "all",
        parking: parkingFromURL === "true" ? true : false,
        furnished: furnishedFromURL === "true" ? true : false,
        sort: sortFromURL || "created_at",
        order: orderFromURL || "desc",
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const response = await axios.get(`/api/listing/search?${searchQuery}`);

      if (response.success === false) {
        setLoading(false);
        return;
      }

      setListings(response.data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="p-7 border-b-2 lg:border-r-2 lg:min-h-screen">
        <form className="flex flex-col gap-6 lg:gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              onChange={handleChange}
              value={sidebarData.searchTerm}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.type === "all"}
              />
              <span>Rent & Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sell"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.type === "sell"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              id="sort_order"
              className="border rounded-lg p-3"
              defaultValue={"created_at_desc"}
              onChange={handleChange}
            >
              <option id="regularPrice_desc">Price high to low</option>
              <option id="regularPrice_asc">Price low to high</option>
              <option id="createdAt_desc">Latest</option>
              <option id="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div className="">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-2 lg:mt-5">
          Listing results:
        </h1>
      </div>
    </div>
  );
};

export default Search;

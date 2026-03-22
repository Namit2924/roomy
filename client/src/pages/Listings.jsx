import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { Link, useSearchParams } from "react-router-dom";

function Listings() {
  const [searchParams] = useSearchParams();

  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchCity, setSearchCity] = useState(searchParams.get("city") || "");
  const [searchArea, setSearchArea] = useState("");
  const [genderFilter, setGenderFilter] = useState(
    searchParams.get("gender") || "all"
  );
  const [maxPrice, setMaxPrice] = useState(
    searchParams.get("budget") === "low" ? "5000" : ""
  );

  const fetchPgs = async () => {
    try {
      const res = await API.get("/pgs");
      setPgs(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching PGs:", error);
      setError("Failed to load PG listings");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPgs();
  }, []);

  const filteredPgs = useMemo(() => {
    return pgs.filter((pg) => {
      const matchesCity = pg.city
        ?.toLowerCase()
        .includes(searchCity.toLowerCase());

      const matchesArea = (pg.area || "")
        .toLowerCase()
        .includes(searchArea.toLowerCase());

      const matchesGender =
        genderFilter === "all" ? true : pg.gender === genderFilter;

      const matchesPrice =
        maxPrice === "" ? true : Number(pg.price) <= Number(maxPrice);

      return matchesCity && matchesArea && matchesGender && matchesPrice;
    });
  }, [pgs, searchCity, searchArea, genderFilter, maxPrice]);

  const clearFilters = () => {
    setSearchCity("");
    setSearchArea("");
    setGenderFilter("all");
    setMaxPrice("");
  };

  if (loading) {
    return (
      <div className="container card-grid">
        {[...Array(6)].map((_, i) => (
          <div className="skeleton-card" key={i}></div>
        ))}
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="page-title">Available PG Listings</h2>

      {error && <p className="error-message">{error}</p>}

      <div className="filter-box">
        <div className="filter-grid">
          <div className="form-group">
            <label>Search by City</label>
            <input
              type="text"
              placeholder="Enter city name"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Search by Area</label>
            <input
              type="text"
              placeholder="Enter area/locality"
              value={searchArea}
              onChange={(e) => setSearchArea(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Filter by Gender</label>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="boys">Boys</option>
              <option value="girls">Girls</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>

          <div className="form-group">
            <label>Max Price</label>
            <input
              type="number"
              placeholder="Enter max price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        <button className="btn" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      <p className="results-text">
        {filteredPgs.length} PG{filteredPgs.length !== 1 ? "s" : ""} found
      </p>

      {filteredPgs.length === 0 ? (
        <div className="detail-box empty-state">
          <h3>No PG found</h3>
          <p>Try changing city, area, gender, or max price filters.</p>
        </div>
      ) : (
        <div className="card-grid">
          {filteredPgs.map((pg) => (
            <div className="card" key={pg._id}>
              <img
                src={
                  pg.images && pg.images.length > 0
                    ? pg.images[0]
                    : "https://dummyimage.com/400x220/e2e8f0/334155&text=No+Image"
                }
                alt={pg.title}
                className="pg-card-image"
                onError={(e) => {
                  e.target.src =
                    "https://dummyimage.com/400x220/e2e8f0/334155&text=Image+Not+Available";
                }}
              />

              <h3>{pg.title}</h3>
              <p><strong>City:</strong> {pg.city}</p>
              <p><strong>Area:</strong> {pg.area || "Not specified"}</p>
              <p><strong>Location:</strong> {pg.location}</p>
              <p><strong>Price:</strong> ₹{pg.price}</p>
              <p><strong>Gender:</strong> {pg.gender}</p>

              <Link to={`/pg/${pg._id}`}>
                <button className="btn">View Details</button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Listings;
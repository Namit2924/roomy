import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [pgs, setPgs] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchPgs = async () => {
    try {
      const res = await API.get("/pgs");
      setPgs(res.data);
    } catch (error) {
      console.error("Error fetching PGs:", error);
    }
  };

  useEffect(() => {
    fetchPgs();
  }, []);

  const featuredPgs = useMemo(() => pgs.slice(0, 5), [pgs]);

  useEffect(() => {
    if (featuredPgs.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredPgs.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [featuredPgs]);

  const dynamicCities = useMemo(() => {
    return [...new Set(
      pgs
        .map((pg) => pg.city?.trim())
        .filter((city) => city && city !== "")
    )];
  }, [pgs]);

  const categories = ["All", "Boys", "Girls", "Budget", ...dynamicCities];

  const filteredPgs = useMemo(() => {
    switch (selectedCategory) {
      case "Boys":
        return pgs.filter((pg) => pg.gender === "boys");
      case "Girls":
        return pgs.filter((pg) => pg.gender === "girls");
      case "Budget":
        return [...pgs].sort((a, b) => a.price - b.price);
      case "All":
        return pgs;
      default:
        return pgs.filter(
          (pg) =>
            pg.city?.toLowerCase().trim() ===
            selectedCategory.toLowerCase().trim()
        );
    }
  }, [pgs, selectedCategory]);

  const boysPgs = filteredPgs.filter((pg) => pg.gender === "boys").slice(0, 10);
  const girlsPgs = filteredPgs.filter((pg) => pg.gender === "girls").slice(0, 10);
  const budgetPgs = [...filteredPgs].sort((a, b) => a.price - b.price).slice(0, 10);
  const cityPgs = selectedCategory !== "All" &&
    selectedCategory !== "Boys" &&
    selectedCategory !== "Girls" &&
    selectedCategory !== "Budget"
      ? filteredPgs.slice(0, 10)
      : [];

  const handleSeeAll = (type, value = "") => {
  if (type === "gender") {
    navigate(`/listings?gender=${value}`);
  } else if (type === "city") {
    navigate(`/listings?city=${encodeURIComponent(value)}`);
  } else if (type === "budget") {
    navigate(`/listings?budget=low`);
  } else {
    navigate("/listings");
  }
};

  return (
    <div className="container home-page">
      {featuredPgs.length > 0 && (
        <>
          <div className="home-banner">
            <img
              src={
                featuredPgs[currentSlide]?.images?.[0] ||
                "https://dummyimage.com/1200x420/e2e8f0/334155&text=Featured+PG"
              }
              alt={featuredPgs[currentSlide]?.title}
              className="home-banner-image"
            />

            <div className="home-banner-overlay">
              <h2>{featuredPgs[currentSlide]?.title}</h2>
              <p>
                {featuredPgs[currentSlide]?.city}
                {featuredPgs[currentSlide]?.area
                  ? ` • ${featuredPgs[currentSlide]?.area}`
                  : ""}
              </p>
              <p>From ₹{featuredPgs[currentSlide]?.price}</p>

              <Link to={`/pg/${featuredPgs[currentSlide]?._id}`}>
                <button className="btn">View PG</button>
              </Link>
            </div>
          </div>

          <div className="home-slider-dots">
            {featuredPgs.map((_, index) => (
              <span
                key={index}
                className={`home-dot ${
                  currentSlide === index ? "active-home-dot" : ""
                }`}
                onClick={() => setCurrentSlide(index)}
              ></span>
            ))}
          </div>
        </>
      )}

      <div className="home-highlight-box">
        <h2>
          {user ? `${user.name}, still looking for these?` : "Explore top PGs"}
        </h2>
      </div>

      <div className="category-chip-row">
        {categories.map((item) => (
          <button
            key={item}
            className={`category-chip ${
              selectedCategory === item ? "active-category-chip" : ""
            }`}
            onClick={() => setSelectedCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <HomeSection
  title="Boys PGs"
  items={boysPgs}
  onSeeAll={() => handleSeeAll("gender", "boys")}
/>

      <HomeSection
        title="Girls PGs"
        items={girlsPgs}
        onSeeAll={()=>handleSeeAll("gender", "girls")}
      />

      <HomeSection
        title="Budget Friendly PGs"
        items={budgetPgs}
        onSeeAll={() => handleSeeAll("budget", "low")}
      />
{cityPgs.length > 0 && (
  <HomeSection
    title={`Popular in ${selectedCategory}`}
    items={cityPgs}
    onSeeAll={() => handleSeeAll("city", selectedCategory)}
  />
)}
    </div>
  );
}

function HomeSection({ title, items, onSeeAll }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!scrollRef.current || items.length === 0) return;

    const container = scrollRef.current;

    const interval = setInterval(() => {
      if (!container) return;

      const maxScrollLeft =
        container.scrollWidth - container.clientWidth;

      if (container.scrollLeft >= maxScrollLeft - 5) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: 260, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [items]);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -260, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 260, behavior: "smooth" });
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="home-section">
      <div className="home-section-header">
        <h3 className="home-section-title">{title}</h3>

        <div className="home-section-actions">
          <button className="scroll-arrow" onClick={scrollLeft}>
            ‹
          </button>
          <button className="scroll-arrow" onClick={scrollRight}>
            ›
          </button>
          <button className="see-all-btn" onClick={onSeeAll}>
            See all
          </button>
        </div>
      </div>

      <div className="home-horizontal-scroll" ref={scrollRef}>
        {items.map((pg) => (
          <Link to={`/pg/${pg._id}`} key={pg._id} className="home-card-link">
            <div className="home-mini-card">
              <img
                src={
                  pg.images && pg.images.length > 0
                    ? pg.images[0]
                    : "https://dummyimage.com/240x180/e2e8f0/334155&text=No+Image"
                }
                alt={pg.title}
                className="home-mini-card-image"
                onError={(e) => {
                  e.target.src =
                    "https://dummyimage.com/240x180/e2e8f0/334155&text=Image";
                }}
              />
              <h4>{pg.title}</h4>
              <p>{pg.city}</p>
              <p>{pg.area || "Area not specified"}</p>
              <p>₹{pg.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
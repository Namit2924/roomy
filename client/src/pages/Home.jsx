import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user } = useAuth();
  const [pgs, setPgs] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  useEffect(() => {
    if (pgs.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.min(pgs.length, 5));
    }, 3000);

    return () => clearInterval(interval);
  }, [pgs]);

  const featuredPgs = pgs.slice(0, 5);
  const boysPgs = pgs.filter((pg) => pg.gender === "boys").slice(0, 8);
  const girlsPgs = pgs.filter((pg) => pg.gender === "girls").slice(0, 8);
  const budgetPgs = [...pgs]
    .sort((a, b) => a.price - b.price)
    .slice(0, 8);

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

      <HomeSection title="Featured PGs" items={featuredPgs} />
      <HomeSection title="Budget Friendly PGs" items={budgetPgs} />
      <HomeSection title="Boys PGs" items={boysPgs} />
      <HomeSection title="Girls PGs" items={girlsPgs} />
    </div>
  );
}

function HomeSection({ title, items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="home-section">
      <h3 className="home-section-title">{title}</h3>

      <div className="home-horizontal-scroll">
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
              <p>₹{pg.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
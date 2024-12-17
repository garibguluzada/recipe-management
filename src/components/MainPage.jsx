import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";

function MainPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the recipe data from the API on mount
  useEffect(() => {
    fetch("http://localhost:3000/recipes")
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Check if data is correct
        setRecipes(data.recipes);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      { breakpoint: 768, settings: { slidesToShow: 1 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
    ],
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="main-container">
      {/* Top Section */}
      <div className="top-section">
        <p>Welcome to World of Delicious Recipes!</p>
        <button className="button">Recipes</button>
      </div>

      {/* Trending Recipes Section */}
      <div className="slider-section">
        <h2>Trending Recipes</h2>
        <Slider {...sliderSettings}>
          {recipes.length > 0 ? (
            recipes.map((recipe) => (
              <div key={recipe.id} style={{ padding: "10px" }}>
                <Link
                  to={`/recipes/${recipe.id}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "10px",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                      overflow: "hidden",
                      textAlign: "center",
                    }}
                  >
                    <img
                      src={`../../public/meal${recipe.id}.jpg`} // Make sure images exist or use a default one
                      alt={recipe.title}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                    <h3 style={{ margin: "10px 0", color: "#555" }}>
                      {recipe.title}
                    </h3>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p>No recipes available.</p>
          )}
        </Slider>
      </div>
    </div>
  );
}

export default MainPage;

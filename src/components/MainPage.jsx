import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom"; // Use navigate for custom routing
import "../MainPage.css";

function MainPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  

  useEffect(() => {
    fetch("http://localhost:3000/recipes")
      .then((response) => response.json())
      .then((data) => {
        // Sort recipes by dateModified (most recent first)
        const sortedRecipes = data.sort(
          (a, b) => new Date(b.dateModified) - new Date(a.dateModified)
        );
        // Take only the 4 most recent recipes
        setRecipes(sortedRecipes.slice(0, 4));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const openRecipe = (id) => {
    navigate(`/recipes/${id}`, { state: { fromMainPage: true, recipeId: id } });
  };

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

  const projects = [
    {
      name: "Chrome Extension",
      description: "Created Chrome extension as a team",
      link: "https://github.com/IsmayilovRufat/as1-chrome-extension.git",
    },
    {
      name: "Portfolio of Garib Guluzada",
      description: "Personal Website of a Team Member",
      link: "https://github.com/garibguluzada/MyPortfolio",
    },
    {
      name: "Projects of Ulkar Ahmadli",
      description: "All Projects during Web & Mobile I",
      link: "https://github.com/uahmadli17458/Personal-Webpage",
    }
  ];

  return (
    <div className="main-container">
      <div className="top-section">
        <p>Welcome to World of Delicious Recipes!</p>
        <button className="button" onClick={() => navigate("/recipes")}>
          Explore Recipes
        </button>
        <button className="button" onClick={() => navigate("/contact")}>
          Contact Us
        </button>
      </div>

      <div className="slider-section">
        <h2>Featured Recipes</h2>
        <Slider {...sliderSettings}>
          {recipes.map((recipe) => (
            <div key={recipe.id}>
              <div
                onClick={() => openRecipe(recipe.id)}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                  overflow: "hidden",
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                <img
                  src={
                    recipe.image ||
                    "https://via.placeholder.com/300x200?text=Image+Not+Found"
                  }
                  alt={recipe.title}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Found";
                  }}
                />
                <h3 style={{ margin: "10px 0", color: "#555" }}>{recipe.title}</h3>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <div className="projects-section">
        <h2>Projects from Web and Mobile 1 Course</h2>
        <div className="project-list">
          {projects.map((project, index) => (
            <div key={index} className="project-card">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                View Project
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MainPage;

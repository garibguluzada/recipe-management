import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import RecipeList from "./RecipeList";
import "./../RecipesPage.css";

function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch recipes from the JSON server
  useEffect(() => {
    fetch("http://localhost:3000/recipes")
      .then((res) => res.json())
      .then((data) => setRecipes(data))
      .catch((err) => console.error("Failed to fetch recipes:", err));
  }, []);

  // Share selected recipes via email
  const handleShare = (selectedRecipes) => {
    const jsonRecipes = JSON.stringify(selectedRecipes, null, 2); // Convert to JSON
    const mailtoLink = `mailto:?subject=Shared Recipes&body=${encodeURIComponent(
      jsonRecipes
    )}`; // Construct mailto link
    window.location.href = mailtoLink; // Open default mail client
  };

  // Delete a recipe
  const handleDelete = (id) => {
    fetch(`http://localhost:3000/recipes/${id}`, { method: "DELETE" })
      .then(() => setRecipes(recipes.filter((recipe) => recipe.id !== id)))
      .catch((err) => console.error("Failed to delete recipe:", err));
  };

  return (
    <div>
      <Link to="/">
        <button className="button">Back to Home</button>
      </Link>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search recipes by title, description, or ingredients"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="search-button"
          onClick={() =>
            setRecipes(
              recipes.filter(
                (recipe) =>
                  recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  recipe.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  recipe.ingredients
                    .join(", ")
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
              )
            )
          }
        >
          Search
        </button>
      </div>

      {/* Recipe List */}
      <RecipeList
        recipes={recipes}
        onEdit={(recipe) => console.log("Edit recipe:", recipe)}
        onDelete={handleDelete}
        onShare={handleShare}
      />
    </div>
  );
}

export default RecipesPage;

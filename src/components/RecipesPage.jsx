import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import RecipeForm from "./RecipeForm";
import RecipeList from "./RecipeList";
import "./../RecipesPage.css";
import { v4 as uuidv4 } from "uuid";

function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/recipes")
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data);
      })
      .catch((err) => console.error("Failed to fetch recipes:", err));
  }, []);

  const handleCreateOrUpdate = (recipe) => {
    const method = recipe.id ? "PUT" : "POST";
    const url = recipe.id
      ? `http://localhost:3000/recipes/${recipe.id}`
      : "http://localhost:3000/recipes";

    if (!recipe.id) {
      recipe.id = uuidv4();
      const currentDate = new Date().toISOString();
      recipe.dateAdded = currentDate;
      recipe.dateModified = currentDate;
    } else {
      recipe.dateModified = new Date().toISOString();
    }

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recipe),
    })
      .then((res) => res.json())
      .then((data) => {
        if (method === "POST") {
          setRecipes((prevRecipes) => [...prevRecipes, data]);
        } else {
          setRecipes((prevRecipes) =>
            prevRecipes.map((r) => (r.id === data.id ? data : r))
          );
        }
        setSelectedRecipe(null);
      })
      .catch((err) => console.error("Error saving recipe:", err));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3000/recipes/${id}`, { method: "DELETE" })
      .then(() => {
        setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== id));
      })
      .catch((err) => console.error("Error deleting recipe:", err));
  };

  return (
    <div>
      <Link to="/">
        <button className="button">Back to Home</button>
      </Link>
      <RecipeForm onSubmit={handleCreateOrUpdate} selectedRecipe={selectedRecipe} />
      <RecipeList
        recipes={recipes}
        onEdit={setSelectedRecipe}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default RecipesPage;

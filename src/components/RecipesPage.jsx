import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import RecipeForm from "./RecipeForm";
import RecipeList from "./RecipeList";
import "./../RecipesPage.css";
import { v4 as uuidv4 } from "uuid";

function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const { id } = useParams(); // Extract the id from the URL

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
      recipe.id = uuidv4(); // Generate a unique ID if it's a new recipe
      const currentDate = new Date().toISOString();
      recipe.dateAdded = currentDate; // Set dateAdded for new recipe
      recipe.dateModified = currentDate; // Set dateModified for new recipe
    } else {
      recipe.dateModified = new Date().toISOString(); // Update dateModified for existing recipe
    }

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recipe),
    })
      .then(() => {
        return fetch("http://localhost:3000/recipes")
          .then((res) => res.json())
          .then((data) => {
            setRecipes(data);
            setSelectedRecipe(null); // Reset selectedRecipe after save
          });
      })
      .catch((err) => console.error("Error saving recipe:", err));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3000/recipes/${id}`, { method: "DELETE" })
      .then(() => {
        setRecipes(recipes.filter((recipe) => recipe.id !== id));
      })
      .catch((err) => console.error("Error deleting recipe:", err));
  };

  return (
    <div>
      <Link to="/">
        <button className="button">Back to Home</button>
      </Link>
      <h1>Recipe Management</h1>
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
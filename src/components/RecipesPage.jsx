import React, { useState, useEffect } from "react";
import RecipeList from "./RecipeList";
import RecipeForm from "./RecipeForm";
import { Link } from "react-router-dom";
import "./../RecipesPage.css";
import { v4 as uuidv4 } from "uuid"; // Install uuid: npm install uuid

function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Fetch recipes on component mount
  useEffect(() => {
    fetch("http://localhost:3000/recipes")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch recipes");
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setRecipes(data); // Ensure data is an array before setting state
        }
      })
      .catch((err) => console.error("Failed to fetch recipes:", err));
  }, []);

  // Handle create or update recipe
  const handleCreateOrUpdate = (recipe) => {
    const method = recipe.id ? "PUT" : "POST";
    const url = recipe.id
      ? `http://localhost:3000/recipes/${recipe.id}`
      : "http://localhost:3000/recipes";

    if (!recipe.id) {
      recipe.id = uuidv4(); // Generate a unique ID if it's a new recipe
    }

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recipe),
    })
      .then(() => {
        // Fetch updated recipes list
        return fetch("http://localhost:3000/recipes")
          .then((res) => res.json())
          .then((data) => {
            setRecipes(data);
            setSelectedRecipe(null); // Reset selectedRecipe after save
          });
      })
      .catch((err) => console.error("Error saving recipe:", err));
  };

  // Handle delete recipe
  const handleDelete = (id) => {
    fetch(`http://localhost:3000/recipes/${id}`, { method: "DELETE" })
      .then(() => {
        setRecipes(recipes.filter((recipe) => recipe.id !== id));
      })
      .catch((err) => console.error("Error deleting recipe:", err));
  };

  return (
    <div>
      <Link to="/">Back to Home</Link>
      <h1>Recipe Management</h1>
      <RecipeForm onSubmit={handleCreateOrUpdate} selectedRecipe={selectedRecipe} />
      <RecipeList recipes={recipes} onEdit={setSelectedRecipe} onDelete={handleDelete} />
    </div>
  );
}

export default RecipesPage;

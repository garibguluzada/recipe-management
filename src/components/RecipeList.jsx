import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./../RecipesPage.css";

function RecipeList({ recipes, onEdit, onDelete, onShare }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRecipes, setSelectedRecipes] = useState([]);

  useEffect(() => {
    const recipeIdFromURL = location.pathname.split("/recipes/")[1];
    if (recipeIdFromURL && recipes.length > 0) {
      const matchedRecipe = recipes.find(
        (recipe) => recipe.id === recipeIdFromURL
      );
      if (matchedRecipe) {
        setSelectedRecipes([matchedRecipe]);
      }
    }
  }, [location.pathname, recipes]);

  const handleCheckboxChange = (recipe) => {
    setSelectedRecipes((prevSelected) => {
      if (prevSelected.some((r) => r.id === recipe.id)) {
        return prevSelected.filter((r) => r.id !== recipe.id);
      }
      return [...prevSelected, recipe];
    });
  };

  return (
    <div>
      <div className="recipe-cards-container">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <input
              type="checkbox"
              onChange={() => handleCheckboxChange(recipe)}
              checked={selectedRecipes.some((r) => r.id === recipe.id)}
            />
            <div
              className="recipe-card-header"
              onClick={() => navigate(`/recipes/${recipe.id}`)}
            >
              <h2>{recipe.title}</h2>
              {recipe.image && (
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="recipe-image"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
            </div>
            <div className="recipe-card-body">
              <p><strong>Description:</strong> {recipe.description}</p>
              <p><strong>Tags:</strong> {recipe.tags}</p>
              <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
            </div>
            <div className="recipe-card-actions">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(recipe);
                }}
                className="edit-button"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(recipe.id);
                }}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {selectedRecipes.length > 0 && (
        <button
          className="share-button"
          onClick={() => onShare(selectedRecipes)}
        >
          Share Selected Recipes
        </button>
      )}
    </div>
  );
}

export default RecipeList;

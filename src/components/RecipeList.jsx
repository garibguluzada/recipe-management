import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./../RecipesPage.css";

function RecipeList({ recipes, onEdit, onDelete }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Open modal automatically if URL contains recipe ID
  useEffect(() => {
    const recipeIdFromURL = location.pathname.split("/recipes/")[1];
    if (recipeIdFromURL && recipes.length > 0) {
      const matchedRecipe = recipes.find((recipe) => recipe.id === recipeIdFromURL);
      if (matchedRecipe) {
        setSelectedRecipe(matchedRecipe);
      }
    }
  }, [location.pathname, recipes]);

  const openModal = (recipe) => {
    setSelectedRecipe(recipe);
    navigate(`/recipes/${recipe.id}`); // Update the URL with the recipe ID
  };

  const closeModal = () => {
    setSelectedRecipe(null);
    navigate("/recipes"); // Reset URL when closing modal
  };

  const truncateDescription = (description) => {
    return description.length > 131 ? description.slice(0, 131) + "..." : description;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString(); // This will return both date and time in a readable format
  };

  return (
    <div>
      {/* Recipe Cards */}
      <div className="recipe-cards-container">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="recipe-card"
            onClick={() => openModal(recipe)}
          >
            <div className="recipe-card-header">
              <h2>{recipe.title}</h2>
              {recipe.image && (
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="recipe-image"
                  onError={(e) => {
                    e.target.style.display = "none"; // Hide the image if it fails to load
                  }}
                />
              )}
            </div>
            <div className="recipe-card-body">
              <p><strong>Description:</strong> {truncateDescription(recipe.description)}</p>
              <p><strong>Tags:</strong> {recipe.tags}</p>
              <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
              <p><strong>Date Added:</strong> {formatDate(recipe.dateAdded)}</p>
              <p><strong>Date Modified:</strong> {formatDate(recipe.dateModified)}</p>
              <div className="difficulty-line"></div>
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
        
      {/* Modal for Detailed Recipe View */}
      {selectedRecipe && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeModal}>X</button>
            <h2>{selectedRecipe.title}</h2>
            <p><strong>Description:</strong> {selectedRecipe.description}</p>
            <p><strong>Ingredients:</strong> {selectedRecipe.ingredients}</p>
            <p><strong>Steps:</strong> {selectedRecipe.steps}</p>
            <p><strong>Tags:</strong> {selectedRecipe.tags}</p>
            <p><strong>Difficulty:</strong> {selectedRecipe.difficulty}</p>  
          </div>
        </div>
      )}
    </div>
  );
}

export default RecipeList;

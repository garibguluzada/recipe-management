import React, { useState } from "react";
import "./../RecipesPage.css";

function RecipeList({ recipes, onEdit, onDelete }) {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const openModal = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const closeModal = () => {
    setSelectedRecipe(null);
  };

  const truncateDescription = (description) => {
    return description.length > 131 ? description.slice(0, 131) + "..." : description;
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

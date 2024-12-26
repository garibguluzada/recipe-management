import React, { useState } from "react";
import "./../RecipesPage.css";

function RecipeList({ recipes, onEdit, onDelete }) {
  // State to handle the modal visibility and selected recipe
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Function to open the modal with the clicked recipe
  const openModal = (recipe) => {
    setSelectedRecipe(recipe);
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedRecipe(null);
  };

  // Function to limit description length to 131 characters
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
            onClick={() => openModal(recipe)} // Open the modal on click
          >
            <div className="recipe-card-header">
              <h2>{recipe.title}</h2>
              {recipe.image && (
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="recipe-image"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/200x200?text=No+Image";
                  }}
                />
              )}
            </div>
            <div className="recipe-card-body">
              <p><strong>Description:</strong> {truncateDescription(recipe.description)}</p>
              <p><strong>Tags:</strong> {recipe.tags}</p>
              <p><strong>Difficulty:</strong> {recipe.difficulty}</p>

              {/* Add space and line */}
              <div className="difficulty-line"></div>
            </div>

            {/* Action buttons positioned at the bottom-left and bottom-right */}
            <div className="recipe-card-actions">
              <button
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onEdit(recipe); // Pass the whole recipe object to onEdit
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

      {/* Modal (Popup) for Detailed Recipe View */}
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

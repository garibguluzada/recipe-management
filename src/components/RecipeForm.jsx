import React, { useState, useEffect } from "react";
import "./../RecipeForm.css";

function RecipeForm({ onSubmit, selectedRecipe }) {
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    ingredients: [],
    steps: [],
    tags: "",
    difficulty: "Easy",
    image: "",
  });

  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredientIdCounter, setIngredientIdCounter] = useState(1);

  const [stepInput, setStepInput] = useState("");
  const [stepIdCounter, setStepIdCounter] = useState(1);

  useEffect(() => {
    if (selectedRecipe) {
      setFormState(selectedRecipe);

      // Set ingredient and step ID counters based on the selected recipe
      if (selectedRecipe.ingredients && selectedRecipe.ingredients.length > 0) {
        const maxIngredientId = Math.max(...selectedRecipe.ingredients.map((ing) => ing.id));
        setIngredientIdCounter(maxIngredientId + 1);
      }
      if (selectedRecipe.steps && selectedRecipe.steps.length > 0) {
        const maxStepId = Math.max(...selectedRecipe.steps.map((step) => step.id));
        setStepIdCounter(maxStepId + 1);
      }
    }
  }, [selectedRecipe]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  // Add ingredient
  const handleAddIngredient = () => {
    if (ingredientInput.trim()) {
      const newIngredient = {
        id: ingredientIdCounter,
        name: ingredientInput.trim(),
      };
      setFormState((prevState) => ({
        ...prevState,
        ingredients: [...prevState.ingredients, newIngredient],
      }));
      setIngredientInput("");
      setIngredientIdCounter((prevId) => prevId + 1);
    }
  };

  // Remove ingredient
  const handleRemoveIngredient = (id) => {
    setFormState((prevState) => ({
      ...prevState,
      ingredients: prevState.ingredients.filter((ingredient) => ingredient.id !== id),
    }));
  };

  // Add step
  const handleAddStep = () => {
    if (stepInput.trim()) {
      const newStep = {
        id: stepIdCounter,
        description: stepInput.trim(),
      };
      setFormState((prevState) => ({
        ...prevState,
        steps: [...prevState.steps, newStep],
      }));
      setStepInput("");
      setStepIdCounter((prevId) => prevId + 1);
    }
  };

  // Remove step
  const handleRemoveStep = (id) => {
    setFormState((prevState) => ({
      ...prevState,
      steps: prevState.steps.filter((step) => step.id !== id),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formState);
    setFormState({
      title: "",
      description: "",
      ingredients: [],
      steps: [],
      tags: "",
      difficulty: "Easy",
      image: "",
    });
    setIngredientIdCounter(1);
    setStepIdCounter(1);
  };

  return (
    <div>
      <div className="recipe-management">Recipe Management</div>

      <div className="recipe-container">
        <h1 className="recipe-title">Recipe Form</h1>
        <form className="recipe-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              className="form-input"
              name="title"
              value={formState.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              className="form-textarea"
              name="description"
              value={formState.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="ingredients">Ingredients</label>
            <div className="ingredients-container">
              {formState.ingredients.map((ingredient) => (
                <div key={ingredient.id} className="ingredient-item">
                  <span>{ingredient.name}</span>
                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => handleRemoveIngredient(ingredient.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className="add-ingredient">
              <input
                type="text"
                className="form-input"
                placeholder="Add an ingredient"
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
              />
              <button type="button" className="add-button" onClick={handleAddIngredient}>
                +
              </button>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="steps">Steps</label>
            <div className="ingredients-container">
              {formState.steps.map((step) => (
                <div key={step.id} className="ingredient-item">
                  <span>{step.description}</span>
                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => handleRemoveStep(step.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className="add-ingredient">
              <input
                type="text"
                className="form-input"
                placeholder="Add a step"
                value={stepInput}
                onChange={(e) => setStepInput(e.target.value)}
              />
              <button type="button" className="add-button" onClick={handleAddStep}>
                +
              </button>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              id="tags"
              className="form-input"
              name="tags"
              value={formState.tags}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input
              type="text"
              id="image"
              className="form-input"
              name="image"
              value={formState.image}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="difficulty">Difficulty</label>
            <select
              id="difficulty"
              className="form-input"
              name="difficulty"
              value={formState.difficulty}
              onChange={handleChange}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <button type="submit" className="form-button">
            Save Recipe
          </button>
        </form>
      </div>
    </div>
  );
}

export default RecipeForm;

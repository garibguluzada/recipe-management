import React, { useState, useEffect } from "react";
import "./../RecipesPage.css";

function RecipeForm({ onSubmit, selectedRecipe }) {
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    ingredients: "",
    steps: "",
    tags: "",
    difficulty: "Easy",
    image: "" // Add image URL field
  });

  useEffect(() => {
    if (selectedRecipe) setFormState(selectedRecipe);
  }, [selectedRecipe]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formState, id: selectedRecipe?.id });
    setFormState({
      title: "",
      description: "",
      ingredients: "",
      steps: "",
      tags: "",
      difficulty: "Easy",
      image: "" // Reset image field
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <input
        name="title"
        placeholder="Title"
        value={formState.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formState.description}
        onChange={handleChange}
        required
      />
      <textarea
        name="ingredients"
        placeholder="Ingredients (comma-separated)"
        value={formState.ingredients}
        onChange={handleChange}
      />
      <textarea
        name="steps"
        placeholder="Steps (comma-separated)"
        value={formState.steps}
        onChange={handleChange}
      />
      <input
        name="tags"
        placeholder="Tags (comma-separated)"
        value={formState.tags}
        onChange={handleChange}
      />
      <input
        name="image"
        placeholder="Image URL"
        value={formState.image}
        onChange={handleChange}
      />
      <select name="difficulty" value={formState.difficulty} onChange={handleChange}>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>
      <button type="submit">Save</button>
    </form>
  );
}

export default RecipeForm;
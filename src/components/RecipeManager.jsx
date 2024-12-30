import React, { useState } from "react";
import RecipeList from "./RecipeList";

function RecipeManager() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null); // To handle the selected recipe for editing
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    ingredients: "",
    steps: "",
    tags: "",
    difficulty: "",
    image: "",
  });

  const handleEdit = (recipe) => {
    // Set the form data to the recipe details to edit it
    setSelectedRecipe(recipe);
    setFormData({ ...recipe });
  };

  const handleDelete = (id) => {
    // Delete the recipe by id
    setRecipes(recipes.filter((recipe) => recipe.id !== id));
  };

  const handleSave = (event) => {
    event.preventDefault();
    
    const currentDate = new Date().toISOString();
  
    if (selectedRecipe) {
      // Update existing recipe, setting the dateModified field
      setRecipes(
        recipes.map((recipe) =>
          recipe.id === selectedRecipe.id
            ? { ...recipe, ...formData, dateModified: currentDate }
            : recipe
        )
      );
    } else {
      // Create a new recipe, setting both dateAdded and dateModified fields
      setRecipes([
        ...recipes,
        { id: Date.now().toString(), ...formData, dateAdded: currentDate, dateModified: currentDate }
      ]);
    }
  
    setFormData({
      id: "",
      title: "",
      description: "",
      ingredients: "",
      steps: "",
      tags: "",
      difficulty: "",
      image: "",
    });
    setSelectedRecipe(null);
  };
  

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <form onSubmit={handleSave}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Tags"
        />
        <input
          type="text"
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          placeholder="Difficulty"
        />
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="Image URL"
        />
        <button type="submit">{selectedRecipe ? "Update Recipe" : "Create Recipe"}</button>
      </form>

      <RecipeList
        recipes={recipes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSave={handleSave}
      />
    </div>
  );
}

export default RecipeManager;

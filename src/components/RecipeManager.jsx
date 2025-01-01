function RecipeManager() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
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
  const [selectedTag, setSelectedTag] = useState(""); // State for selected tag

  const handleTagChange = (e) => {
    setSelectedTag(e.target.value);
  };

  const handleEdit = (recipe) => {
    setSelectedRecipe(recipe);
    setFormData({ ...recipe });
  };

  const handleDelete = (id) => {
    setRecipes(recipes.filter((recipe) => recipe.id !== id));
  };

  const handleSave = (event) => {
    event.preventDefault();

    const currentDate = new Date().toISOString();

    if (selectedRecipe) {
      setRecipes(
        recipes.map((recipe) =>
          recipe.id === selectedRecipe.id
            ? { ...recipe, ...formData, dateModified: currentDate }
            : recipe
        )
      );
    } else {
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

  const filteredRecipes = selectedTag
    ? recipes.filter((recipe) =>
        recipe.tags.toLowerCase().includes(selectedTag.toLowerCase())
      )
    : recipes;

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

      {/* Select tag for filtering */}
      <select onChange={handleTagChange} value={selectedTag}>
        <option value="">All Tags</option>
        {/* Dynamically create options for tags if needed */}
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <RecipeList
        recipes={recipes} // Use the filtered recipes here
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSave={handleSave}
        selectedTag={selectedTag}
      />
    </div>
  );
}

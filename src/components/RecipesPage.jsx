import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import RecipeForm from "./RecipeForm";
import RecipeList from "./RecipeList";
import "./../RecipesPage.css";
import { v4 as uuidv4 } from "uuid";

function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]); // State for filtered recipes
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [selectedTag, setSelectedTag] = useState(""); // State for selected tag
  const [selectedDifficulty, setSelectedDifficulty] = useState(""); // State for selected difficulty
  const [sortOption, setSortOption] = useState(""); // State for sort option
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Fetch recipes
  useEffect(() => {
    fetch("http://localhost:3000/recipes")
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data);
        setFilteredRecipes(data); // Initialize filtered recipes with all recipes
      })
      .catch((err) => console.error("Failed to fetch recipes:", err));
  }, []);

  // Handle Search
  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    const results = recipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(query) ||
        recipe.description.toLowerCase().includes(query) ||
        recipe.ingredients.some((ingredient) =>
          ingredient.toLowerCase().includes(query)
        )
    );
    filterAndSortRecipes(results); // Apply filters and sorting
  };

  // Handle Filtering
  const filterAndSortRecipes = (data = recipes) => {
    let filtered = data;

    // Apply Tag Filter
    if (selectedTag) {
      filtered = filtered.filter((recipe) =>
        recipe.tags.includes(selectedTag)
      );
    }

    // Apply Difficulty Filter
    if (selectedDifficulty) {
      filtered = filtered.filter(
        (recipe) => recipe.difficulty === selectedDifficulty
      );
    }

    // Apply Sorting
    if (sortOption) {
      filtered.sort((a, b) => {
        switch (sortOption) {
          case "title":
            return a.title.localeCompare(b.title);
          case "createTime":
            return new Date(a.dateAdded) - new Date(b.dateAdded);
          case "updateTime":
            return new Date(a.dateModified) - new Date(b.dateModified);
          case "tags":
            return a.tags.length - b.tags.length; // Sort by tag count
          case "difficulty":
            const difficulties = { Easy: 1, Medium: 2, Hard: 3 };
            return difficulties[a.difficulty] - difficulties[b.difficulty];
          default:
            return 0;
        }
      });
    }

    setFilteredRecipes(filtered); // Update filtered recipes
  };

  // Handle Filter Changes
  const handleTagChange = (e) => {
    setSelectedTag(e.target.value);
    filterAndSortRecipes(); // Reapply filters and sorting
  };

  const handleDifficultyChange = (e) => {
    setSelectedDifficulty(e.target.value);
    filterAndSortRecipes(); // Reapply filters and sorting
  };

  // Handle Sort Change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    filterAndSortRecipes(); // Reapply filters and sorting
  };

  const handleCreateOrUpdate = (recipe) => {
    const method = recipe.id ? "PUT" : "POST";
    const url = recipe.id
      ? `http://localhost:3000/recipes/${recipe.id}`
      : "http://localhost:3000/recipes";

    if (!recipe.id) {
      recipe.id = uuidv4();
      const currentDate = new Date().toISOString();
      recipe.dateAdded = currentDate;
      recipe.dateModified = currentDate;
    } else {
      recipe.dateModified = new Date().toISOString();
    }

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recipe),
    })
      .then((res) => res.json())
      .then((data) => {
        if (method === "POST") {
          setRecipes((prevRecipes) => [...prevRecipes, data]);
          setFilteredRecipes((prevRecipes) => [...prevRecipes, data]); // Update filtered recipes
        } else {
          setRecipes((prevRecipes) =>
            prevRecipes.map((r) => (r.id === data.id ? data : r))
          );
          setFilteredRecipes((prevRecipes) =>
            prevRecipes.map((r) => (r.id === data.id ? data : r))
          );
        }
        setSelectedRecipe(null);
      })
      .catch((err) => console.error("Error saving recipe:", err));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3000/recipes/${id}`, { method: "DELETE" })
      .then(() => {
        setRecipes((prevRecipes) =>
          prevRecipes.filter((recipe) => recipe.id !== id)
        );
        setFilteredRecipes((prevRecipes) =>
          prevRecipes.filter((recipe) => recipe.id !== id)
        );
      })
      .catch((err) => console.error("Error deleting recipe:", err));
  };

  return (
    <div>
      <Link to="/">
        <button className="button">Back to Home</button>
      </Link>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search recipes by title, description, or ingredients"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Filters */}
      <div className="filter-container">
        <select
          className="filter-dropdown"
          value={selectedTag}
          onChange={handleTagChange}
        >
          <option value="">All Tags</option>
          <option value="Dessert">Dessert</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Quick Meal">Quick Meal</option>
        </select>

        <select
          className="filter-dropdown"
          value={selectedDifficulty}
          onChange={handleDifficultyChange}
        >
          <option value="">All Difficulty Levels</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        {/* Sort Dropdown */}
        <select
          className="filter-dropdown"
          value={sortOption}
          onChange={handleSortChange}
        >
          <option value="">Sort By</option>
          <option value="title">Title</option>
          <option value="createTime">Create Time</option>
          <option value="updateTime">Update Time</option>
          <option value="tags">Tags</option>
          <option value="difficulty">Difficulty</option>
        </select>
      </div>

      <RecipeForm onSubmit={handleCreateOrUpdate} selectedRecipe={selectedRecipe} />
      <RecipeList
        recipes={filteredRecipes} // Pass filtered recipes here
        onEdit={setSelectedRecipe}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default RecipesPage;

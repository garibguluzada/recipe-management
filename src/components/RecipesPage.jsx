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

  const sortRecipes = (recipesToSort) => {
    const sorted = [...recipesToSort];
    switch (sortOption) {
      case "title":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "createTime":
        sorted.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
        break;
      case "updateTime":
        sorted.sort((a, b) => new Date(a.dateModified) - new Date(b.dateModified));
        break;
      case "difficulty":
        const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
        sorted.sort(
          (a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        );
        break;
      default:
        break;
    }
    return sorted;
  };

  const filterAndSortRecipes = () => {
    let filtered = [...recipes];

    // Apply Tag Filter
    if (selectedTag && selectedTag !== "") {
      filtered = filtered.filter(
        (recipe) => recipe.tags.split(", ").includes(selectedTag) // Split tags and match
      );
    }

    // Apply Difficulty Filter
    if (selectedDifficulty) {
      filtered = filtered.filter(
        (recipe) => recipe.difficulty === selectedDifficulty
      );
    }

    // Apply Sorting
    filtered = sortRecipes(filtered);

    setFilteredRecipes(filtered); // Update filtered recipes
  };

  const handleTagChange = (e) => {
    setSelectedTag(e.target.value);
  };

  const handleDifficultyChange = (e) => {
    setSelectedDifficulty(e.target.value);
  };

  useEffect(() => {
    filterAndSortRecipes();
  }, [selectedTag, selectedDifficulty, sortOption, recipes]);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Extract unique tags for the dropdown
  const uniqueTags = [
    ...new Set(
      recipes.flatMap((recipe) =>
        recipe.tags.split(", ").map((tag) => tag.trim())
      )
    ),
  ];

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
        <button className="search-button" onClick={() => {}}>
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
          {uniqueTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
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
          <option value="difficulty">Difficulty</option>
        </select>
      </div>

      <RecipeForm
        onSubmit={() => {}}
        selectedRecipe={selectedRecipe}
      />
      <RecipeList
        recipes={filteredRecipes} // Pass filtered recipes here
        onEdit={setSelectedRecipe}
        onDelete={() => {}}
      />
    </div>
  );
}

export default RecipesPage;

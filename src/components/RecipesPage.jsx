import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import { Link } from "react-router-dom";
import RecipeForm from "./RecipeForm";
import RecipeList from "./RecipeList";
import "./../RecipesPage.css";
import { v4 as uuidv4 } from "uuid";
import Pagination from "./Pagination"; // Import a Pagination component
import { DragDropContext, Droppable } from "react-beautiful-dnd";

function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]); // State for filtered recipes
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [selectedTag, setSelectedTag] = useState(""); // State for selected tag
  const [selectedDifficulty, setSelectedDifficulty] = useState(""); // State for selected difficulty
  const [sortOption, setSortOption] = useState(""); // State for sort option
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 8;
  const location = useLocation();
  const { recipeId } = location.state || {}; // Extract recipeId from the navigation state

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

  useEffect(() => {
    if (recipeId) {
      // Find the index of the recipe with the given ID
      const recipeIndex = recipes.findIndex((recipe) => recipe.id === recipeId);

      if (recipeIndex !== -1) {
        // Calculate the page number containing the recipe
        const pageNumber = Math.ceil((recipeIndex + 1) / recipesPerPage);
        setCurrentPage(pageNumber);
      }
    }
  }, [recipeId, recipes]);

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
        sorted.sort(
          (a, b) => new Date(a.dateModified) - new Date(b.dateModified)
        );
        break;
      case "difficulty":
        const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
        sorted.sort(
          (a, b) =>
            difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        );
        break;
      default:
        break;
    }
    return sorted;
  };

  // Share selected recipes via email
  const handleShare = (selectedRecipes) => {
    const jsonRecipes = JSON.stringify(selectedRecipes, null, 2);
    const recipeLink = "http://localhost:3000/recipes";
    const bodyMessage = `I wanted to share some recipes with you:\n\n${jsonRecipes}\n\nHere is the link to view the recipes: ${recipeLink}`;

    const mailtoLink = `mailto:?subject=Check%20out%20these%20recipes&body=${encodeURIComponent(
      bodyMessage
    )}`;

    window.location.href = mailtoLink;
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

  // Extract unique tags for the dropdown
  const uniqueTags = [
    ...new Set(
      recipes.flatMap((recipe) =>
        (recipe.tags || "").split(", ").map((tag) => tag.trim())
      )
    ),
  ];

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = recipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(query) ||
        recipe.description.toLowerCase().includes(query) ||
        recipe.ingredients?.some((ingredient) =>
          ingredient.name?.toLowerCase().includes(query)
        )
    );

    setFilteredRecipes(filtered);
  };

  // Pagination
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(
    indexOfFirstRecipe,
    indexOfLastRecipe
  );
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // ** Drag & Drop: handle reordering in memory and patch 'order' back to server if desired **
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    // Reorder the array of currently filtered recipes
    const updated = Array.from(filteredRecipes);
    const [moved] = updated.splice(result.source.index, 1);
    updated.splice(result.destination.index, 0, moved);

    // Update local state so the UI changes
    setFilteredRecipes(updated);
    setRecipes(updated);

    // Optionally persist the new order to server by PATCHing an 'order' field
    try {
      // Assign new 'order' indexes
      for (let i = 0; i < updated.length; i++) {
        const r = updated[i];
        // Just patch 'order' = i
        await fetch(`http://localhost:3000/recipes/${r.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: i }),
        });
      }
      console.log("Drag-and-drop order saved to server");
    } catch (error) {
      console.error("Error saving drag-drop order:", error);
    }
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
          onChange={handleSearchChange}
        />
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

      <RecipeForm onSubmit={handleCreateOrUpdate} selectedRecipe={selectedRecipe} />

      {/* Wrap RecipeList in DragDropContext + Droppable */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable-recipes" direction="horizontal">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {/* Pass currentRecipes (the paginated ones) into RecipeList */}
              <RecipeList
                recipes={currentRecipes}
                onEdit={setSelectedRecipe}
                onDelete={handleDelete}
                onShare={handleShare}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Pagination
        recipesPerPage={recipesPerPage}
        totalRecipes={filteredRecipes.length}
        paginate={paginate}
      />
    </div>
  );
}

export default RecipesPage;

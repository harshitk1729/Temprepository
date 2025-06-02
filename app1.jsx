import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [technologies, setTechnologies] = useState([]);
  const [filteredTechnologies, setFilteredTechnologies] = useState([]);
  const [selectedTechnology, setSelectedTechnology] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTechDropdown, setShowTechDropdown] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  
  const techDropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close tech dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (techDropdownRef.current && !techDropdownRef.current.contains(event.target)) {
        setShowTechDropdown(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [techDropdownRef]);

  // Fetch technologies when component mounts
  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/technologies');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTechnologies(data);
        setFilteredTechnologies(data); // Initialize filtered technologies
      } catch (error) {
        console.error('Error fetching technologies:', error);
      }
    };

    fetchTechnologies();
  }, []);
  

  const handleSearch = async (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    
    // Clear selected component when search term changes
    if (selectedComponent && selectedComponent.name !== value) {
      setSelectedComponent(null);
    }

    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (value.trim().length >= 1) {
      setLoading(true);
      try {
        let url = `http://localhost:8080/api/components/search?name=${encodeURIComponent(value.trim())}`;
        if (selectedTechnology) {
          url += `&technologyId=${selectedTechnology}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Search results:', data);
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTechnologyChange = (techId) => {
    console.log('Selected technology ID:', techId);
    setSelectedTechnology(techId);
    setShowTechDropdown(false);
    
    // Clear current suggestions and selected component when technology changes
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedComponent(null);
    
    // If there's already a search term, re-run the search with the new technology
    if (searchTerm.trim().length >= 1) {
      handleSearch({ target: { value: searchTerm } });
    }
  };

  // Update suggestion click handler to store the full component object
  const handleSuggestionClick = (suggestion) => {
    console.log('Suggestion clicked:', suggestion);
    // Update the search term to match the selected suggestion
    setSearchTerm(suggestion.name);
    // Store the selected component
    setSelectedComponent(suggestion);
    // Hide the suggestions dropdown
    setShowSuggestions(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Only submit if we have a valid search term
    if (searchTerm.trim().length > 0) {
      setShowSuggestions(false);
      setSelectedComponent(null);
      
      // If we have a selected component, use its technology ID
      if (selectedComponent) {
        console.log('Navigating to component with name:', selectedComponent.name, 'and technology ID:', selectedComponent.technologyId);
        navigate(`/component/${encodeURIComponent(selectedComponent.name)}?techId=${selectedComponent.technologyId}`);
      } else if (selectedTechnology) {
        // If we have a selected technology but no selected component
        console.log('Navigating to component by name:', searchTerm, 'with selected technology ID:', selectedTechnology);
        navigate(`/component/${encodeURIComponent(searchTerm)}?techId=${selectedTechnology}`);
      } else {
        // Otherwise just use the search term
        console.log('Navigating to component by name only:', searchTerm);
        navigate(`/component/${encodeURIComponent(searchTerm)}`);
      }
      
      
     
      
    }
  };

  // Get the selected technology name for display
  const getSelectedTechnologyName = () => {
    if (!selectedTechnology) return "All Technologies";
    const tech = technologies.find(t => t.id === parseInt(selectedTechnology));
    return tech ? tech.name : "All Technologies";
  };

  const handleTechnologySearch = (value) => {
    if (!value.trim()) {
      setFilteredTechnologies(technologies); // Show all technologies if input is empty
      return;
    }

    const filtered = technologies.filter((tech) =>
      tech.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredTechnologies(filtered);
  };

  return (
    <div className="container">
      <h1>Component Search</h1>
      
      <div className="search-wrapper">
        <form onSubmit={handleSubmit} className="search-form">
          <div className="search-controls">
            {/* Custom Technology dropdown */}
            <div className="custom-dropdown-container" ref={techDropdownRef}>
              <div className="custom-dropdown-header" onClick={() => setShowTechDropdown(!showTechDropdown)}>
                <span>{getSelectedTechnologyName()}</span>
                <i className={`dropdown-arrow ${showTechDropdown ? 'up' : 'down'}`}></i>
              </div>

              {showTechDropdown && (
                <div className="custom-dropdown-options">
                  <input
                    type="text"
                    placeholder="Search technologies..."
                    className="dropdown-search-input"
                    onChange={(e) => handleTechnologySearch(e.target.value)}
                  />
                  <div
                    className={`dropdown-option ${selectedTechnology === '' ? 'selected' : ''}`}
                    onClick={() => handleTechnologyChange('')}
                  >
                    All Technologies
                  </div>
                  {filteredTechnologies.map((tech) => (
                    <div
                      key={tech.id}
                      className={`dropdown-option ${selectedTechnology === tech.id.toString() ? 'selected' : ''}`}
                      onClick={() => handleTechnologyChange(tech.id.toString())}
                    >
                      {tech.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="search-input-container">
              <input
                type="text"
                placeholder="Search components..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
              <button 
                type="submit" 
                className="search-button"
                disabled={!searchTerm.trim() || loading}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </form>
        
        
        {/* Suggestions dropdown - without technology name */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions-dropdown">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <span className="suggestion-name">{suggestion.name}</span>
              </div>
            ))}
          </div>
        )}
         
      </div>
    </div>
  );
}

export default App;









import React, { useState, useEffect, useRef } from 'react';
import './CombinedComponent.css';

function CombinedComponent() {
  // Search and technology selection state (from App.jsx)
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

  // Component details state (from ComponentDetails.jsx)
  const [tabData, setTabData] = useState({
    component: null,
    masks: null,
    specs: null,
    figs: null,
    drs: null
  });
  const [tabLoading, setTabLoading] = useState({
    component: false,
    masks: false,
    specs: false,
    figs: false,
    drs: false
  });
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('component');

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

  // Fetch technologies on mount
  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/technologies');
        const data = await response.json();
        setTechnologies(data);
        setFilteredTechnologies(data);
      } catch (error) {
        console.error('Error fetching technologies:', error);
      }
    };
    fetchTechnologies();
  }, []);

  // Search handler
  const handleSearch = async (event) => {
    const value = event.target.value;
    setSearchTerm(value);
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
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      } catch (error) {
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTechnologyChange = (techId) => {
    setSelectedTechnology(techId);
    setShowTechDropdown(false);
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedComponent(null);
    if (searchTerm.trim().length >= 1) {
      handleSearch({ target: { value: searchTerm } });
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.name);
    setSelectedComponent(suggestion);
    setShowSuggestions(false);
    // Fetch component details immediately
    fetchComponentTab(suggestion.name, suggestion.technologyId);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim().length > 0) {
      setShowSuggestions(false);
      setSelectedComponent(null);
      if (selectedComponent) {
        fetchComponentTab(selectedComponent.name, selectedComponent.technologyId);
      } else if (selectedTechnology) {
        fetchComponentTab(searchTerm, selectedTechnology);
      } else {
        fetchComponentTab(searchTerm, '');
      }
    }
  };

  const getSelectedTechnologyName = () => {
    if (!selectedTechnology) return "All Technologies";
    const tech = technologies.find(t => t.id === parseInt(selectedTechnology));
    return tech ? tech.name : "All Technologies";
  };

  const handleTechnologySearch = (value) => {
    if (!value.trim()) {
      setFilteredTechnologies(technologies);
      return;
    }
    const filtered = technologies.filter((tech) =>
      tech.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredTechnologies(filtered);
  };

  // Fetch component tab data
  const fetchComponentTab = async (componentName, technologyId) => {
    setTabLoading(prev => ({ ...prev, component: true }));
    setError(null);
    setTabData({ component: null, masks: null, specs: null, figs: null, drs: null });
    setActiveTab('component');
    try {
      const url = `http://localhost:8080/api/components/tab?name=${encodeURIComponent(componentName)}&technologyId=${encodeURIComponent(technologyId)}`;
      const response = await fetch(url);
      const data = await response.json();
      setTabData(prev => ({ ...prev, component: data[0] }));
    } catch (err) {
      setError(err.message);
    } finally {
      setTabLoading(prev => ({ ...prev, component: false }));
    }
  };

  // Fetch data for other tabs
  const fetchTabData = async (tabName) => {
    if (tabLoading[tabName] || tabData[tabName]) return;
    setTabLoading(prev => ({ ...prev, [tabName]: true }));
    setError(null);
    try {
      let endpoint = '';
      switch (tabName) {
        case 'masks': endpoint = 'masks'; break;
        case 'specs': endpoint = 'specs'; break;
        case 'figs': endpoint = 'figs'; break;
        case 'drs': endpoint = 'drs'; break;
        default: return;
      }
      const url = `http://localhost:8080/api/components/${endpoint}?name=${encodeURIComponent(searchTerm)}&technologyId=${encodeURIComponent(selectedComponent?.technologyId || selectedTechnology)}`;
      const response = await fetch(url);
      const data = await response.json();
      setTabData(prev => ({ ...prev, [tabName]: data }));
    } catch (err) {
      setError(err.message);
    } finally {
      setTabLoading(prev => ({ ...prev, [tabName]: false }));
    }
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    if (tabName !== 'component') {
      fetchTabData(tabName);
    }
  };

  // --- Tab Components (from ComponentDetails.jsx) ---
  const ComponentTab = ({ component }) => {
    if (!component || !component.componentDTO || !component.componentDTO[0]) {
      return <div>No component data available</div>;
    }
    const componentData = component.componentDTO[0];
    const categoryData = component.categoryDTO?.[0];
    const componentTypeData = component.componentTypeDTO?.[0];
    const pcdTemplateData = component.pcdTemplateDTO?.[0];
    const usageData = component.usageDTO?.[0];
    const ownerData = component.ownerDTO?.[0];
    return (
      <table className="details-table">
        <tbody>
          <tr><th>Name</th><td>{componentData?.name}</td></tr>
          <tr><th>Description</th><td>{componentData?.description}</td></tr>
          <tr><th>Owner</th><td>{ownerData ? `${ownerData.firstName} ${ownerData.lastName}` : ''}</td></tr>
          <tr><th>SVN</th><td>{componentData?.componentSvns}</td></tr>
          <tr><th>Category</th><td>{categoryData?.categoryname}</td></tr>
          <tr><th>Active</th><td>{componentData?.active?.toString()}</td></tr>
          <tr><th>Tags</th><td>{componentData?.tags}</td></tr>
          <tr><th>Type</th><td>{componentTypeData?.categoryname}</td></tr>
          <tr><th>Template</th><td>{pcdTemplateData?.categoryname}</td></tr>
          <tr><th>Template Description</th><td>{pcdTemplateData?.description}</td></tr>
          <tr><th>Usage</th><td>{usageData?.categoryname}</td></tr>
          <tr><th>Comments</th><td>{componentData?.comments}</td></tr>
          <tr><th>Version</th><td>{componentData?.lockVersion}</td></tr>
        </tbody>
      </table>
    );
  };

  const MasksTab = ({ masks }) => {
    if (!masks || !Array.isArray(masks)) {
      return <div>No masks data available</div>;
    }
    return (
      <div className="masks-container">
        <div className="table-responsive">
          <table className="details-table masks-table">
            <thead>
              <tr>
                <th>Mask ID</th>
                <th>Mask Name</th>
                <th>Description</th>
                <th>Dark Data</th>
                <th>Technology ID</th>
              </tr>
            </thead>
            <tbody>
              {masks.map((mask, index) => (
                <tr key={index}>
                  <td>{mask.maskid}</td>
                  <td>{mask.maskname}</td>
                  <td>{mask.maskdescription}</td>
                  <td>{mask.maskdarkData}</td>
                  <td>{mask.masktechnologyId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const ElectricalSpecsTab = ({ specs }) => {
    if (!specs || !Array.isArray(specs)) {
      return <div>No specifications data available</div>;
    }
    return (
      <div className="specs-container">
        <div className="table-responsive">
          <table className="details-table specs-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>SVN</th>
                <th>E-Test Name</th>
                <th>Description</th>
                <th>Typical</th>
                <th>Min</th>
                <th>Max</th>
                <th>Units</th>
                <th>Fail Criteria</th>
                <th>Comments</th>
                <th>Operating Conditions/Device Parameters</th>
              </tr>
            </thead>
            <tbody>
              {specs.map((spec, index) => (
                <tr key={index}>
                  <td>{spec.id}</td>
                  <td>{spec.svn}</td>
                  <td>{spec.etestName}</td>
                  <td>{spec.description}</td>
                  <td>{spec.typ}</td>
                  <td>{spec.min}</td>
                  <td>{spec.max}</td>
                  <td>{spec.units}</td>
                  <td>{spec.failCriteria}</td>
                  <td>{spec.commentsNew}</td>
                  <td>{spec.comments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const CdsFigsTab = ({ figs }) => {
    if (!figs || !Array.isArray(figs)) {
      return <div>No figures data available</div>;
    }
    return (
      <div className="figs-container">
        <div className="table-responsive">
          <table className="details-table figs-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tech</th>
                <th>Figure Name</th>
                <th>Version</th>
                <th>Library</th>
                <th>Cell</th>
                <th>View</th>
                <th>Links</th>
                <th>Layout</th>
                <th>MSect</th>
                <th>XSect</th>
              </tr>
            </thead>
            <tbody>
              {figs.map((fig, index) => (
                <tr key={index}>
                  <td>{fig.id}</td>
                  <td>{fig.tech}</td>
                  <td>{fig.figName}</td>
                  <td>{fig.figVersion}</td>
                  <td>{fig.cdsLibName}</td>
                  <td>{fig.cdsCellName}</td>
                  <td>{fig.cdsViewName}</td>
                  <td className="links-cell">
                    {fig.plaUrl && <a href={fig.plaUrl} target="_blank" rel="noopener noreferrer">PLA</a>}
                    {fig.mskUrl && <a href={fig.mskUrl} target="_blank" rel="noopener noreferrer">MSK</a>}
                  </td>
                  <td className="image-cell">
                    {fig.layoutUrl && (
                      <div className="image-container">
                        <img src={fig.layoutUrl} alt="Layout" className="figure-image"
                          onClick={() => window.open(fig.layoutUrl, '_blank')} />
                      </div>
                    )}
                  </td>
                  <td className="image-cell">
                    {fig.msectUrl && (
                      <div className="image-container">
                        <img src={fig.msectUrl} alt="MSect" className="figure-image"
                          onClick={() => window.open(fig.msectUrl, '_blank')} />
                      </div>
                    )}
                  </td>
                  <td className="image-cell">
                    {fig.xsectUrl && (
                      <div className="image-container">
                        <img src={fig.xsectUrl} alt="XSect" className="figure-image"
                          onClick={() => window.open(fig.xsectUrl, '_blank')} />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const DrsTab = ({ drs }) => {
    if (!drs || !Array.isArray(drs)) {
      return <div>No design rules available</div>;
    }
    const [activeSubTab, setActiveSubTab] = useState('active');
    const activeRules = drs.filter(dr => !dr.retired);
    const retiredRules = drs.filter(dr => dr.retired);
    const renderRulesTable = (rules) => (
      <div className="table-responsive">
        <table className="details-table drs-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Note</th>
              <th>Drawn Value</th>
              <th>Silicon Value</th>
              <th>Drawn Units</th>
              <th>Silicon Units</th>
              <th>Comments</th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((dr, index) => {
              const fullText = dr.text || '';
              const firstSpaceIndex = fullText.indexOf(' ');
              const descriptionWithoutFirstWord = firstSpaceIndex !== -1 ? 
                fullText.substring(firstSpaceIndex + 1).trim() : '';
              return (
                <tr key={index}>
                  <td>{dr.id}</td>
                  <td>{dr.name}</td>
                  <td>{descriptionWithoutFirstWord}</td>
                  <td>{dr.note}</td>
                  <td>{dr.drawnValue}</td>
                  <td>{dr.siliconValue}</td>
                  <td>{dr.drawnUnits}</td>
                  <td>{dr.drawnUnits==='du'?'um':'dimensionless'}</td>
                  <td>{dr.comments}</td>
                  <td>{dr.tags}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
    return (
      <div className="drs-container">
        <div className="drs-subtabs">
          <button 
            className={`subtab-button ${activeSubTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('active')}
          >
            Active Rules ({activeRules.length})
          </button>
          <button 
            className={`subtab-button ${activeSubTab === 'retired' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('retired')}
          >
            Retired Rules ({retiredRules.length})
          </button>
        </div>
        <div className="subtab-content">
          {activeSubTab === 'active' && renderRulesTable(activeRules)}
          {activeSubTab === 'retired' && renderRulesTable(retiredRules)}
        </div>
      </div>
    );
  };

  // --- Render ---
  return (
    <div className="combined-container">
      <h1>Component Search & Details</h1>
      <div className="combined-search-wrapper">
        <form onSubmit={handleSubmit} className="combined-search-form">
          <div className="combined-search-controls">
            <div className="combined-custom-dropdown-container" ref={techDropdownRef}>
              <div className="combined-custom-dropdown-header" onClick={() => setShowTechDropdown(!showTechDropdown)}>
                <span>{getSelectedTechnologyName()}</span>
                <i className={`combined-dropdown-arrow ${showTechDropdown ? 'up' : 'down'}`}></i>
              </div>
              {showTechDropdown && (
                <div className="combined-custom-dropdown-options">
                  <input
                    type="text"
                    placeholder="Search technologies..."
                    className="combined-dropdown-search-input"
                    onChange={(e) => handleTechnologySearch(e.target.value)}
                  />
                  <div
                    className={`combined-dropdown-option ${selectedTechnology === '' ? 'selected' : ''}`}
                    onClick={() => handleTechnologyChange('')}
                  >
                    All Technologies
                  </div>
                  {filteredTechnologies.map((tech) => (
                    <div
                      key={tech.id}
                      className={`combined-dropdown-option ${selectedTechnology === tech.id.toString() ? 'selected' : ''}`}
                      onClick={() => handleTechnologyChange(tech.id.toString())}
                    >
                      {tech.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="combined-search-input-container">
              <input
                type="text"
                placeholder="Search components..."
                value={searchTerm}
                onChange={handleSearch}
                className="combined-search-input"
              />
              <button 
                type="submit" 
                className="combined-search-button"
                disabled={!searchTerm.trim() || loading}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
              {showSuggestions && suggestions.length > 0 && (
                <div className="combined-suggestions-dropdown">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="combined-suggestion-item"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <span className="combined-suggestion-name">{suggestion.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </form>
        {showSuggestions && suggestions.length > 0 && (
          <div className="combined-suggestions-dropdown">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="combined-suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <span className="combined-suggestion-name">{suggestion.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Component Details Section */}
      <div className="combined-component-details">
        {tabLoading.component && <div className="combined-loading">Loading component details...</div>}
        {error && <div className="combined-error-message">{error}</div>}
        {!tabLoading.component && !error && tabData.component && (
          <>
            <h2>{tabData.component.componentDTO?.name || 'Component Details'}</h2>
            <div className="combined-details-container">
              <div className="combined-tabs">
                <button 
                  className={`combined-tab-button ${activeTab === 'component' ? 'active' : ''}`}
                  onClick={() => handleTabClick('component')}
                >
                  Component Details
                </button>
                <button 
                  className={`combined-tab-button ${activeTab === 'masks' ? 'active' : ''}`}
                  onClick={() => handleTabClick('masks')}
                >
                  Masks {tabData.masks?.length > 0 && `(${tabData.masks.length})`}
                  {tabLoading.masks && ' (Loading...)'}
                </button>
                <button 
                  className={`combined-tab-button ${activeTab === 'specs' ? 'active' : ''}`}
                  onClick={() => handleTabClick('specs')}
                >
                  Electrical Specs {tabData.specs?.length > 0 && `(${tabData.specs.length})`}
                  {tabLoading.specs && ' (Loading...)'}
                </button>
                <button 
                  className={`combined-tab-button ${activeTab === 'figs' ? 'active' : ''}`}
                  onClick={() => handleTabClick('figs')}
                >
                  CDS Figures {tabData.figs?.length > 0 && `(${tabData.figs.length})`}
                  {tabLoading.figs && ' (Loading...)'}
                </button>
                <button 
                  className={`combined-tab-button ${activeTab === 'drs' ? 'active' : ''}`}
                  onClick={() => handleTabClick('drs')}
                >
                  Design Rules {tabData.drs?.length > 0 && `(${tabData.drs.length})`}
                  {tabLoading.drs && ' (Loading...)'}
                </button>
              </div>
              <div className="combined-tab-content">
                {activeTab === 'component' && (
                  <>
                    <h3>Component Details</h3>
                    <ComponentTab component={tabData.component} />
                  </>
                )}
                {activeTab === 'masks' && (
                  <>
                    <h3>Mask Details</h3>
                    {tabLoading.masks ? (
                      <div className="combined-loading">Loading masks...</div>
                    ) : tabData.masks && (
                      <MasksTab masks={tabData.masks} />
                    )}
                  </>
                )}
                {activeTab === 'specs' && (
                  <>
                    <h3>Electrical Specifications</h3>
                    {tabLoading.specs ? (
                      <div className="combined-loading">Loading specifications...</div>
                    ) : tabData.specs && (
                      <ElectricalSpecsTab specs={tabData.specs} />
                    )}
                  </>
                )}
                {activeTab === 'figs' && (
                  <>
                    <h3>CDS Figures</h3>
                    {tabLoading.figs ? (
                      <div className="combined-loading">Loading figures...</div>
                    ) : tabData.figs && (
                      <CdsFigsTab figs={tabData.figs} />
                    )}
                  </>
                )}
                {activeTab === 'drs' && (
                  <>
                    <h3>Design Rules</h3>
                    {tabLoading.drs ? (
                      <div className="combined-loading">Loading design rules...</div>
                    ) : tabData.drs && (
                      <DrsTab drs={tabData.drs} />
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default CombinedComponent;

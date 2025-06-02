import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './ComponentDetails.css';

function ComponentDetails() {
  const navigate = useNavigate();
  const { componentName } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const technologyId = queryParams.get('techId');
  
  const [componentDetails, setComponentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchAttempted, setFetchAttempted] = useState(false);
  const [activeTab, setActiveTab] = useState('component');
  const [technologies, setTechnologies] = useState([]);
  const [techMap, setTechMap] = useState({}); // Default active tab

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/technologies');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTechnologies(data);
      } catch (error) {
        console.error('Error fetching technologies:', error);
      }
    };

    fetchTechnologies();
  }, []);

  const getTechnologyName = (techId) => {
    if (!techId) return 'N/A';
    const tech = technologies.find(t => t.id === parseInt(techId));
    return tech ? tech.name : `Tech ID: ${techId}`;
  };
  
  useEffect(() => {
    const fetchComponentDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        setFetchAttempted(true); // Mark that we've attempted a fetch

        console.log('Fetching data for component:', componentName);
        console.log('Technology ID:', technologyId);

        // Build the URL with component name and technology ID
        let url = `http://localhost:8080/api/components/view?name=${encodeURIComponent(componentName)}`;
        if (technologyId) {
          url += `&technologyId=${encodeURIComponent(technologyId)}`;
        }

        console.log('Fetching from URL:', url);

        const response = await fetch(url);

        console.log('Response status:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const textResponse = await response.text();

        // Check if the response is empty
        if (!textResponse || textResponse.trim() === '') {
          throw new Error('Empty response received from server');
        }

        console.log('Raw response (first 100 chars):', textResponse.substring(0, 100));

        let data;
        try {
          data = JSON.parse(textResponse);
        } catch (parseError) {
          throw new Error(`Failed to parse response as JSON: ${parseError.message}`);
        }

        console.log('Parsed data:', data);

        // Handle different data formats
        if (Array.isArray(data) && data.length > 0) {
          // If the data is an array, use the first element
          setComponentDetails(data[0]);
          console.log('Component data structure (array):', data[0]);
        } else if (data && typeof data === 'object') {
          // If the data is an object, use it directly
          setComponentDetails(data);
          console.log('Component data structure (object):', data);
        } else {
          throw new Error('Invalid data format received from server');
        }
      } catch (err) {
        console.error('Error fetching component data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (componentName) {
      fetchComponentDetails();
    }
  }, [componentName, technologyId, fetchAttempted]);

  const ComponentTab = ({ component }) => (
    <table className="details-table">
      <tbody>
        <tr>
          <th>Name</th>
          <td>{component.componentDTO.name}</td>
        </tr>
        
        <tr>
          <th>Description</th>
          <td>{component.componentDTO.description }</td>
        </tr>
        <tr>
          <th>Owner</th>
          <td>{component.ownerDTO.firstName+' '+component.ownerDTO.lastName}</td>
        </tr>
        <tr>
          <th>SVN</th>
          <td>{component.componentDTO.componentSvns }</td>
        </tr>
        <tr>
          <th>Category</th>
          <td>{ component.categoryDTO.categoryname}</td>
        </tr>
        <tr>
          <th>Active</th>
          <td>{component.componentDTO.active }</td>
        </tr>
        <tr>
          <th>Tags</th>
          <td>{component.componentDTO.tags }</td>
        </tr>
        <tr>
          <th>Type</th>
          <td>{component.componentTypeDTO.categoryname}</td>
        </tr>
        <tr>
          <th>Template</th>
          <td>{ component.pcdTemplateDTO.categoryname}</td>
        </tr>
        <tr>
          <th>Template Description</th>
          <td>{ component.pcdTemplateDTO.description}</td>
        </tr>
        <tr>
          <th>Usage</th>
          <td>{component.usageDTO.categoryname}</td>
        </tr>
        <tr>
          <th>Comments</th>
          <td>{component.componentDTO.comments}</td>
        </tr>
        
      </tbody>
    </table>
  );

  const MasksTab = ({ masks }) => (
    <div className="masks-container">
      {/* <h3>Total Masks: {masks.length}</h3> */}
      <div className="table-responsive">
        <table className="details-table masks-table">
          <thead>
            <tr>
              <th>Mask ID</th>
              <th>Mask Name</th>
              <th>Description</th>
              <th>Dark Data</th>
              <th>Technology</th>
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
                <td>{componentDetails.technologyDTO.technologyname}</td>
                <td>{mask.masktechnologyId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ElectricalSpecsTab = ({ specs,conditions,svnparams,units }) => {
    // Helper function to build concatenated rules for each spec
    const getRulesForSpec = (specId) => {
      // Filter conditions for the current spec
      const specConditions = conditions.filter((condition) => condition.conditionelectricalspecid
      === specId);
  
      // Map conditions to rules
      const rules = specConditions.map((condition) => {
        const svnParam = svnparams.find((param) => param.svnparamid === condition.conditionsvnparamid);
        const unit = units.find((unit) => unit.unitid === condition.conditionunitid);
  
        // Construct the rule as "svnParamName = value unit"
        return `${svnParam?.svnname || 'Unknown'} = ${condition.conditionvalue || 'N/A'} ${unit?.unitname || ''}`;
      });
  
      // Concatenate rules into a single string
      return rules.join(', ');
    };

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
                  <td>{getRulesForSpec(spec.id)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const CdsFigsTab = ({ figs }) => (
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
                      <img 
                        src={fig.layoutUrl} 
                        alt="Layout" 
                        className="figure-image"
                        onClick={() => window.open(fig.layoutUrl, '_blank')}
                      />
                    </div>
                  )}
                </td>
                <td className="image-cell">
                  {fig.msectUrl && (
                    <div className="image-container">
                      <img 
                        src={fig.msectUrl} 
                        alt="MSect" 
                        className="figure-image"
                        onClick={() => window.open(fig.msectUrl, '_blank')}
                      />
                    </div>
                  )}
                </td>
                <td className="image-cell">
                  {fig.xsectUrl && (
                    <div className="image-container">
                      <img 
                        src={fig.xsectUrl} 
                        alt="XSect" 
                        className="figure-image"
                        onClick={() => window.open(fig.xsectUrl, '_blank')}
                      />
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

  const DrsTab = ({ drs }) => (
    <div className="drs-container">
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
            {drs.map((dr, index) => {
              
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
                  <td>
                    {dr.drawnUnits==='du'?'um':'dimensionless'}
                  </td>
                  <td>{dr.comments}</td>
                  <td>{dr.tags}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return <div className="loading">Loading component details...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="component-details">
      {loading && <div>Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      {!loading && !error && componentDetails && (
        <>
          <button onClick={() => navigate('/')} className="back-button">
            ← Back to Search
          </button>
          
          <h1>{componentDetails.component?.name || componentDetails.name || 'Component Details'}</h1>
          
          <div className="details-container">
            <div className="tabs">
              <button 
                className={`tab-button ${activeTab === 'component' ? 'active' : ''}`}
                onClick={() => setActiveTab('component')}
              >
                Component Details
              </button>
              
              {componentDetails?.maskDTOs && componentDetails.maskDTOs.length > 0 && (
                <button 
                  className={`tab-button ${activeTab === 'masks' ? 'active' : ''}`}
                  onClick={() => setActiveTab('masks')}
                >
                  Masks ({componentDetails.maskDTOs.length})
                </button>
              )}
              
              {componentDetails.specDTOs && componentDetails.specDTOs.length > 0 && (
                <button 
                  className={`tab-button ${activeTab === 'electrical' ? 'active' : ''}`}
                  onClick={() => setActiveTab('electrical')}
                >
                  Electrical Specs ({componentDetails.specDTOs.length})
                </button>
              )}
              
              {componentDetails.figDTOs && componentDetails.figDTOs.length > 0 && (
                <button 
                  className={`tab-button ${activeTab === 'cdsfigs' ? 'active' : ''}`}
                  onClick={() => setActiveTab('cdsfigs')}
                >
                  CDS Figures ({componentDetails.figDTOs.length})
                </button>
              )}
              
              {componentDetails.drsDTOs && componentDetails.drsDTOs.length > 0 && (
                <button 
                  className={`tab-button ${activeTab === 'drs' ? 'active' : ''}`}
                  onClick={() => setActiveTab('drs')}
                >
                  Design Rules ({componentDetails.drsDTOs.length})
                </button>
              )}
            </div>
            
            <div className="tab-content">
              {activeTab === 'component' && (
                <>
                  <h2>Component Details</h2>
                  <ComponentTab component={componentDetails.component || componentDetails} />
                </>
              )}
              
              {activeTab === 'masks' && componentDetails.maskDTOs && (
                <>
                  <h2>Mask Details</h2>
                  <MasksTab masks={componentDetails.maskDTOs} />
                </>
              )}
              
              {activeTab === 'electrical' && componentDetails.specDTOs && (
                <>
                  <h2>Electrical Specifications</h2>
                  <ElectricalSpecsTab 
                    specs={componentDetails.specDTOs}
                    conditions={componentDetails.conditionDTOs}
  svnparams={componentDetails.svnparamDTOs}
  units={componentDetails.unitDTOs}
                   
                  />
                </>
              )}
              
              {activeTab === 'cdsfigs' && componentDetails.figDTOs && (
                <>
                  <h2>CDS Figures</h2>
                  <CdsFigsTab figs={componentDetails.figDTOs} />
                </>
              )}
              
              {activeTab === 'drs' && componentDetails.drsDTOs && (
                <>
                  <h2>Design Rules</h2>
                  <DrsTab drs={componentDetails.drsDTOs} />
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ComponentDetails;

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
  const [activeTab, setActiveTab] = useState('component'); // Default active tab

  useEffect(() => {
    // Only fetch if we haven't attempted yet or if componentName changes
    if (!fetchAttempted || componentName) {
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
            url += `&technologyId=${technologyId}`;
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
            setComponentDetails(data[0]);
            // Log the structure of the data to debug
            console.log('Component data structure:', {
              hasComponent: !!data[0].component,
              hasMask: !!data[0].mask,
              hasElectricalSpecs: !!data[0].electricalSpecs,
              hasCdsFigs: !!data[0].cdsFigs
            });
          } else if (data && typeof data === 'object') {
            setComponentDetails(data);
            // Log the structure of the data to debug
            console.log('Component data structure:', {
              hasComponent: !!data.component,
              hasMask: !!data.mask,
              hasElectricalSpecs: !!data.electricalSpecs,
              hasCdsFigs: !!data.cdsFigs
            });
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

      fetchComponentDetails();
    }
  }, [componentName, technologyId, fetchAttempted]); // Only depend on componentName and technologyId

  const formatJsonDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Simple error display component
  const ErrorDisplay = ({ message }) => (
    <div className="error-container">
      <h2>Error Loading Component</h2>
      <p>{message}</p>
      <button onClick={() => navigate('/')} className="back-button">
        Return to Search
      </button>
    </div>
  );

  // Tab content components
  const ComponentTab = ({ component }) => (
    <table className="details-table">
      <tbody>
        <tr>
          <th>ID:</th>
          <td>{component.id}</td>
        </tr>
        <tr>
          <th>Name:</th>
          <td>{component.name}</td>
        </tr>
        <tr>
          <th>Description:</th>
          <td>{component.description}</td>
        </tr>
        <tr>
          <th>Category ID:</th>
          <td>{component.categoryId}</td>
        </tr>
        <tr>
          <th>Technology ID:</th>
          <td>{component.technologyId}</td>
        </tr>
        <tr>
          <th>Position:</th>
          <td>{component.position}</td>
        </tr>
        <tr>
          <th>Lock Version:</th>
          <td>{component.lockVersion}</td>
        </tr>
        <tr>
          <th>Component Type ID:</th>
          <td>{component.componentTypeId}</td>
        </tr>
        <tr>
          <th>PCD Template ID:</th>
          <td>{component.pcdTemplateId}</td>
        </tr>
        <tr>
          <th>Usage ID:</th>
          <td>{component.usageId}</td>
        </tr>
        <tr>
          <th>Active:</th>
          <td>{component.active}</td>
        </tr>
        <tr>
          <th>Comments:</th>
          <td>{component.comments}</td>
        </tr>
        <tr>
          <th>Component SVNs:</th>
          <td>{component.componentSvns}</td>
        </tr>
        <tr>
          <th>Same PCD As ID:</th>
          <td>{component.samePcdAsId}</td>
        </tr>
        <tr>
          <th>Same DR As ID:</th>
          <td>{component.sameDrAsId}</td>
        </tr>
        <tr>
          <th>CDS Figs:</th>
          <td>{component.cdsFigs}</td>
        </tr>
        <tr>
          <th>Owner Emp ID:</th>
          <td>{component.ownerEmpId}</td>
        </tr>
        <tr>
          <th>Tags:</th>
          <td>{component.tags}</td>
        </tr>
        <tr>
          <th>Created Date:</th>
          <td>{formatJsonDate(component.createdDate)}</td>
        </tr>
        <tr>
          <th>Modified Date:</th>
          <td>{formatJsonDate(component.modifiedDate)}</td>
        </tr>
      </tbody>
    </table>
  );

  const MaskTab = ({ mask }) => (
    <table className="details-table">
      <tbody>
        <tr>
          <th>Mask ID:</th>
          <td>{mask.maskid}</td>
        </tr>
        <tr>
          <th>Mask Name:</th>
          <td>{mask.maskname}</td>
        </tr>
        <tr>
          <th>Mask Description:</th>
          <td>{mask.maskdescription}</td>
        </tr>
        <tr>
          <th>Mask Dark Data:</th>
          <td>{mask.maskdarkData}</td>
        </tr>
        <tr>
          <th>Mask Technology ID:</th>
          <td>{mask.masktechnologyId}</td>
        </tr>
      </tbody>
    </table>
  );

  const ElectricalSpecsTab = ({ specs }) => (
    <table className="details-table">
      <tbody>
        <tr>
          <th>ID:</th>
          <td>{specs.id}</td>
        </tr>
        <tr>
          <th>SVN:</th>
          <td>{specs.svn}</td>
        </tr>
        <tr>
          <th>Fail Criteria:</th>
          <td>{specs.failCriteria}</td>
        </tr>
        <tr>
          <th>E-Test Name:</th>
          <td>{specs.etestName}</td>
        </tr>
        <tr>
          <th>Description:</th>
          <td>{specs.description}</td>
        </tr>
        <tr>
          <th>Typical Value:</th>
          <td>{specs.typ}</td>
        </tr>
        <tr>
          <th>Minimum Value:</th>
          <td>{specs.min}</td>
        </tr>
        <tr>
          <th>Maximum Value:</th>
          <td>{specs.max}</td>
        </tr>
        <tr>
          <th>Units:</th>
          <td>{specs.units}</td>
        </tr>
        <tr>
          <th>Comments:</th>
          <td>{specs.comments}</td>
        </tr>
      </tbody>
    </table>
  );

  const CdsFigsTab = ({ figs }) => (
    <table className="details-table">
      <tbody>
        <tr>
          <th>ID:</th>
          <td>{figs.id}</td>
        </tr>
        <tr>
          <th>Technology:</th>
          <td>{figs.tech}</td>
        </tr>
        <tr>
          <th>Figure Name:</th>
          <td>{figs.figName}</td>
        </tr>
        <tr>
          <th>Figure Version:</th>
          <td>{figs.figVersion}</td>
        </tr>
        <tr>
          <th>PLA URL:</th>
          <td>
            {figs.plaUrl && (
              <a href={figs.plaUrl} target="_blank" rel="noopener noreferrer">
                View PLA
              </a>
            )}
          </td>
        </tr>
        <tr>
          <th>MSK URL:</th>
          <td>
            {figs.mskUrl && (
              <a href={figs.mskUrl} target="_blank" rel="noopener noreferrer">
                View MSK
              </a>
            )}
          </td>
        </tr>
        <tr>
          <th>Layout URL:</th>
          <td>
            {figs.layoutUrl && (
              <a href={figs.layoutUrl} target="_blank" rel="noopener noreferrer">
                View Layout
              </a>
            )}
          </td>
        </tr>
        <tr>
          <th>CDS Library Name:</th>
          <td>{figs.cdsLibName}</td>
        </tr>
        <tr>
          <th>CDS Cell Name:</th>
          <td>{figs.cdsCellName}</td>
        </tr>
        <tr>
          <th>CDS View Name:</th>
          <td>{figs.cdsViewName}</td>
        </tr>
      </tbody>
    </table>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <h2>Loading component data...</h2>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  return (
    <div className="component-details">
      <button onClick={() => navigate('/')} className="back-button">
        ← Back to Search
      </button>
      
      <h1>{componentDetails?.component?.name || 'Component Details'}</h1>
      
      {componentDetails?.component ? (
        <div className="details-container">
          <div className="tabs">
            <button 
              className={`tab-button ${activeTab === 'component' ? 'active' : ''}`}
              onClick={() => setActiveTab('component')}
            >
              Component Details
            </button>
            
            {componentDetails.mask && (
              <button 
                className={`tab-button ${activeTab === 'mask' ? 'active' : ''}`}
                onClick={() => setActiveTab('mask')}
              >
                Mask Details
              </button>
            )}
            
            {componentDetails.electricalSpecs && (
              <button 
                className={`tab-button ${activeTab === 'electrical' ? 'active' : ''}`}
                onClick={() => setActiveTab('electrical')}
              >
                Electrical Specs
              </button>
            )}
            
            {componentDetails.cdsFigs && (
              <button 
                className={`tab-button ${activeTab === 'cdsfigs' ? 'active' : ''}`}
                onClick={() => setActiveTab('cdsfigs')}
              >
                CDS Figures
              </button>
            )}
          </div>
          
          <div className="tab-content">
            {activeTab === 'component' && (
              <>
                <h2>Component Details</h2>
                <ComponentTab component={componentDetails.component} />
              </>
            )}
            
            {activeTab === 'mask' && componentDetails.mask && (
              <>
                <h2>Mask Details</h2>
                <MaskTab mask={componentDetails.mask} />
              </>
            )}
            
            {activeTab === 'electrical' && componentDetails.electricalSpecs && (
              <>
                <h2>Electrical Specifications</h2>
                <ElectricalSpecsTab specs={componentDetails.electricalSpecs} />
              </>
            )}
            
            {activeTab === 'cdsfigs' && componentDetails.cdsFigs && (
              <>
                <h2>CDS Figures</h2>
                <CdsFigsTab figs={componentDetails.cdsFigs} />
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="no-data-container">
          <p>No component data found for "{componentName}"</p>
        </div>
      )}
    </div>
  );
}

export default ComponentDetails;

import React, { useState } from 'react';
import { Container } from 'semantic-ui-react';
import {
  Button,
} from 'semantic-ui-react'

import AppContext from './contexts/AppContext';

import RateFormPage from './RateFormPage';

import StatesDropdown from './StatesDropdown';
import UnderwritersDropdown from './UnderwritersDropdown';
import 'semantic-ui-css/semantic.min.css';

import './App.css';

function App() {
  const [stateCode, setStateCode] = useState('CA');
  const [underwriter, setUnderwriter] = useState('WFG');
  const resetStates = () => {
    setStateCode('');
    setUnderwriter('');
  }


  return (
    <AppContext.Provider value={{
        stateCode,
        setStateCode,
        underwriter,
        setUnderwriter,
      }}>
      <div className="App">
      <Container>
        <div>
          <UnderwritersDropdown onChange={(e, data) => setUnderwriter(data.value)}/>
          <StatesDropdown onChange={(e, data) => setStateCode(data.value)}/>
          <Button onClick={() => {resetStates()}}>Reset</Button>
        </div>
        {
          (stateCode && underwriter) &&
          <RateFormPage />
        }
      </Container>
      </div>
    </AppContext.Provider>
  );
}


export default App;

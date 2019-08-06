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

import { Icon, Step } from 'semantic-ui-react'

const RateGenerationStepGroup = () => (
  <Step.Group>
    <Step active>
      <Icon name='newspaper outline' />
      <Step.Content>
        <Step.Title>Variables and Tables</Step.Title>
        <Step.Description>Define all the variables and tables here</Step.Description>
      </Step.Content>
    </Step>

    <Step disabled>
      <Icon name='sticky note outline' />
      <Step.Content>
        <Step.Title>Rate Table Methods</Step.Title>
        <Step.Description>Build the rate table methods</Step.Description>
      </Step.Content>
    </Step>

    <Step disabled>
      <Icon name='hotjar' />
      <Step.Content>
        <Step.Title>Test Rate Table Methods</Step.Title>
        <Step.Description>Build the rate table methods for the unit test</Step.Description>
      </Step.Content>
    </Step>
  </Step.Group>
);


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
        <RateGenerationStepGroup />
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

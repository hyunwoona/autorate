import React, { useState, useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react';
import axios from 'axios';

import AppContext from './contexts/AppContext';

import StatesDropdown from './StatesDropdown';
import UnderwritersDropdown from './UnderwritersDropdown';
import 'semantic-ui-css/semantic.min.css'

import './App.css';

function App() {
  const [stateCode, setStateCode] = useState('');
  const [underwriter, setUnderwriter] = useState('d');
  const [promulgatedStates, setPromulgatedStates] = useState([]);
  const resetStates = () => {
    setStateCode('');
    setUnderwriter('');
  }

  useEffect(() => {
    // We moved these functions inside!
    async function fetchData() {
      const result = await axios('http://localhost:4567/promulgated_states', {
        mode: "no-cors",
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setPromulgatedStates(result.data);
    }

    fetchData();
  }, []);

  return (
    <AppContext.Provider value={{
        stateCode,
        setStateCode,
        underwriter,
        setUnderwriter,
      }}>
      <div className="App">
        <AppContext.Consumer>
          {context => (
            !(stateCode && underwriter) ? (
              <div>
                <UnderwritersDropdown onChange={(e, data) => setUnderwriter(data.value)}/>
                <StatesDropdown onChange={(e, data) => setStateCode(data.value)}/>
              </div>
            ) : (
              <div>
                <Button onClick={() => {resetStates()}}>Go Back</Button>
                <Container>
                  <p>
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
                    Aenean massa strong. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur
                    ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla
                    consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.
                    In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede
                    link mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean
                    vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac,
                    enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla
                    ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue.
                    Curabitur ullamcorper ultricies nisi.
                  </p>
                </Container>
                {promulgatedStates.includes(stateCode) && <Button onClick={() => {}}>Generate Rates</Button>}
              </div>
            )
          )}
        </AppContext.Consumer>
      </div>
    </AppContext.Provider>
  );
}

export default App;

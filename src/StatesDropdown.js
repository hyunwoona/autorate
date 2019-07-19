import React from 'react';
import { Dropdown } from 'semantic-ui-react';

import statesJson from './states.json';

const StatesDropdown = () => {
  const stateList = JSON.parse(JSON.stringify(statesJson)).map(item => ({key: item.abbreviation, value: item.abbreviation, flag: item.abbreviation, text: item.name}));
console.log(stateList);

  return   <Dropdown
    placeholder='Select State'
    fluid
    search
    selection
    options={statesJson}
  />

  return <Dropdown text='States'>
    <Dropdown.Menu>
      {stateList.map(state =>
        <Dropdown.Item text={state.abbreviation} description={state.name} />
      )}
    </Dropdown.Menu>
  </Dropdown>;
}


export default StatesDropdown;

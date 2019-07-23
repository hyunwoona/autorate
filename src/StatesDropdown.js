import React from 'react';
import { Dropdown } from 'semantic-ui-react';

import statesJson from './states.json';

const StatesDropdown = (props) => {
  const stateList = JSON.parse(JSON.stringify(statesJson)).map(item => (
    {key: item.abbreviation, value: item.abbreviation, text: item.abbreviation}
  ));

  return <Dropdown
    placeholder='Select State'
    fluid
    clearable
    search
    selection
    options={stateList}
    onChange={props.onChange}
  />
}

export default StatesDropdown;

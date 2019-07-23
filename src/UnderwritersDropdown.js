import React from 'react';
import { Dropdown } from 'semantic-ui-react';

import underwritersJson from './underwriters.json';

const UnderwritersDropdown = (props) => {
  const underwriterList = JSON.parse(JSON.stringify(underwritersJson)).map(item => (
    {key: item.name, value: item.directory_name, text: item.name}
  ));

  return <Dropdown
    placeholder='Select Underwriter'
    fluid
    clearable
    search
    selection
    options={underwriterList}
    onChange={props.onChange}
  />
}

export default UnderwritersDropdown;

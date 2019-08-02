import React, { useState, useEffect } from 'react';
import {
  Button, Input, Label, Form
} from 'semantic-ui-react'

import axios from 'axios';

import AppContext from './contexts/AppContext';

import ParserInput from './ParserInput';


function RateFormPage() {
  const [promulgatedStates, setPromulgatedStates] = useState([]);
  const [cplFee, setCplFee] = useState();
  const [parserOutput, setParserOutput] = useState('');

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


  const handleSubmit = (payload) => {
    axios.post(`http://localhost:4567/generate_rate_files`, payload).then(res => {
      console.log(res);
      console.log(res.data);
    });
  }

  return (
    <AppContext.Consumer>
    { context => {
      const formPayload = {stateCode: context.stateCode, underwriter: context.underwriter};
      if (promulgatedStates.includes(context.stateCode)) {
        return <Button onClick={() => {handleSubmit(formPayload)}}>Submit</Button>;
      }
      const parserOutputHtml = parserOutput.replace(/ /g, "&nbsp;").replace(/\n{2,}/g, "</p><p>").replace(/\n/g, "<br>");

      return (
        <Form>
          <div>
            <Form.Field>
            <label>CPL Fee</label>
            <Input labelPosition='right' type='text' placeholder='Amount' onChange={(e) => {setCplFee(e.target.value);}}>
              <Label basic>$</Label>
              <input placeholder='CPL Fee' />
            </Input>
            </Form.Field>

            <ParserInput
              setParserOutput={setParserOutput}
            />
<div
dangerouslySetInnerHTML={{__html: parserOutputHtml}} />
          </div>
            <Button
              type="submit"
              onClick={(e, value) => {
                Object.assign(formPayload, {cpl_fee: cplFee});
                handleSubmit(formPayload);
              }}>Submit
            </Button>
        </Form>
      );
      }
    }
    </AppContext.Consumer>
  );
}

export default RateFormPage;
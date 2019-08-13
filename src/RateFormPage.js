import React, { useState, useEffect } from 'react';
import {
  Button, Icon, Input, Label, Form, TextArea, Segment
} from 'semantic-ui-react'

import axios from 'axios';

import AppContext from './contexts/AppContext';

import ParserInputModal from './ParserInputModal';
import { getTableVariableName } from './utils';

function RateFormPage() {
  const [tableName, setTableName] = useState(''); // TODO: make this an array
  const [promulgatedStates, setPromulgatedStates] = useState([]);
  const [cplFee, setCplFee] = useState();
  const [parserOutput, setParserOutput] = useState({});

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
      let formPayload = {stateCode: context.stateCode, underwriter: context.underwriter};
      if (promulgatedStates.includes(context.stateCode)) {
        return <Button onClick={() => {handleSubmit(formPayload)}}>Submit</Button>;
      }

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

            <ParserInputModal
              tableName={tableName}
              setTableName={setTableName}
              parserOutput={parserOutput}
              setParserOutput={setParserOutput}
            >
              <Button icon>
                <Icon name="add" /> Add a table
              </Button>
            </ParserInputModal>

            {
              (parserOutput.text) && (
                <Segment>
                  <ParserInputModal
                    tableName={tableName}
                    setTableName={setTableName}
                    parserOutput={parserOutput}
                    setParserOutput={setParserOutput}
                  >
                    <Button icon style={{float: 'right'}}>
                      <Icon name="edit" />
                    </Button>
                  </ParserInputModal>

                  <h4>{getTableVariableName(parserOutput)}</h4>
                  <TextArea style={{resize: 'none'}} value={parserOutput.text} disabled>
                  </TextArea>
                </Segment>
              )
            }
          </div>
          <Form.Field className="button-field">
            <Button
              primary
              className="next-button"
              type="submit"
              size="big"
              onClick={(e, value) => {
                formPayload = Object.assign({}, formPayload, {
                  cpl_fee: cplFee,
                  table_definitions: parserOutput.text,
                });
                handleSubmit(formPayload);
              }}
            >
              Submit
            </Button>
          </Form.Field>
        </Form>
      );
      }
    }
    </AppContext.Consumer>
  );
}

export default RateFormPage;
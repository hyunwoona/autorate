import React, { useState, useEffect } from 'react';
import { convertToRaw, EditorState } from 'draft-js';
import { Container } from 'semantic-ui-react';
import {
  Button, Input, Label, Form, Dropdown, Header, Segment, Radio
} from 'semantic-ui-react'

import axios from 'axios';
import _ from 'underscore';

import AppContext from './contexts/AppContext';

import RateEditor from './RateEditor';
import StatesDropdown from './StatesDropdown';
import UnderwritersDropdown from './UnderwritersDropdown';
import 'semantic-ui-css/semantic.min.css'

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

function ParserInput() {
  const TableTypeRadioButtons = ({tableType, setTableType}) => {
    const tableTypes = ['Fixed', 'Graduated', 'Joint'];

    return (
      <div>
        {
          tableTypes.map(val => (
            <Form.Field key={`tableTypeRadioButton-${val}`}>
              <Radio
                label={val}
                name='radioGroup'
                value={val}
                checked={tableType === val}
                onChange={() => {setTableType(val)}}
              />
            </Form.Field>
          ))
        }
      </div>
    );
  };

  const TableTextEditorStateInput = (
    {tableType, tableTextEditorState, numCols, toAmountColIndex, premiumColIndex,
      setTableTextEditorState, setNumCols, setToAmountColIndex, setPremiumColIndex,
    }) => {
      const numberOptions = _.range(1, 9).map(x => ({key: x, value: x, text: x}));

      return (
        <div>
          <Form.Field>
            <label>{tableType} Table Text</label>
            <RateEditor
              editorState={tableTextEditorState}
              setEditorState={setTableTextEditorState}
            />
          </Form.Field>
          <Form.Field>
            <label>Number of Columns with $</label>
            <Dropdown
              placeholder='Number of Columns with $$$$'
              floating
              options={numberOptions}
              defaultValue={numCols}
              onChange={(e, { value }) => {setNumCols(value)}}
            />
          </Form.Field>
          <Form.Field>
            <label>'To Amount' Column Index</label>
            <Dropdown
              placeholder={'Index of the Column for \'To Amount\' (Upper Bound)'}
              floating
              options={_.take(numberOptions, numCols)}
              defaultValue={toAmountColIndex}
              onChange={(e, { value }) => {setToAmountColIndex(value)}}
            />
          </Form.Field>
          <Form.Field>
            <label>Premium Column Index</label>
            <Dropdown
              placeholder='Index of the Column for Insurance Premium'
              floating
              options={_.take(numberOptions, numCols)}
              defaultValue={premiumColIndex}
              onChange={(e, { value }) => {setPremiumColIndex(value)}}
            />
          </Form.Field>
        </div>
      );
  };

  const [tableType, setTableType] = useState('');

  const [tableTextEditorState, setTableTextEditorState] = useState(EditorState.createEmpty());
  const [numCols, setNumCols] = useState(2);
  const [toAmountColIndex, setToAmountColIndex] = useState(1);
  const [premiumColIndex, setPremiumColIndex] = useState(2);

  const [additionalTableTextEditorState, setAdditionalTableTextEditorState] = useState(EditorState.createEmpty());
  const [additionalNumCols, setAdditionalNumCols] = useState(2);
  const [additionalToAmountColIndex, setAdditionalToAmountColIndex] = useState(1);
  const [additionalPremiumColIndex, setAdditionalPremiumColIndex] = useState(2);


  const isJointTable = tableType === 'Joint';
  const convertEditorStateToText = (editorState) => {
    const blocks = convertToRaw(editorState.getCurrentContent()).blocks;
    return blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');
  };

  const handleGenerateTable = () => {
    const payload = {
      text: convertEditorStateToText(tableTextEditorState),
      interval: 1000,
      type: 'fixed',
      num_cols: 3,
      to_amount_col_idx: 0,
      premium_col_idx: 2
    }

    axios.post(`http://localhost:4567/parse_rate_table_text`, payload).then(res => {
      console.log(res);
      console.log(res.data);

    });
  }

  return (
      <Segment raised>
        <Header size='medium'>Add {tableType} Table</Header>

        <Form.Field>
          <TableTypeRadioButtons
            tableType={tableType}
            setTableType={setTableType}
          />
        </Form.Field>
        <Form.Field>
          <label>Table Name</label>
          <Input labelPosition='right' type='text' placeholder='Amount' onChange={(e) => {}}>
            <input placeholder='Name of the table' />
          </Input>
        </Form.Field>

        <TableTextEditorStateInput
          tableType={!isJointTable ? tableType : 'Fixed'}
          tableTextEditorState={tableTextEditorState}
          numCols={numCols}
          toAmountColIndex={toAmountColIndex}
          premiumColIndex={premiumColIndex}
          setTableTextEditorState={setTableTextEditorState}
          setNumCols={setNumCols}
          setToAmountColIndex={setToAmountColIndex}
          setPremiumColIndex={setPremiumColIndex}
        />
        {
          isJointTable && (
            <TableTextEditorStateInput
              tableType='Graduated'
              tableTextEditorState={additionalTableTextEditorState}
              numCols={additionalNumCols}
              toAmountColIndex={additionalToAmountColIndex}
              premiumColIndex={additionalPremiumColIndex}
              setTableTextEditorState={setAdditionalTableTextEditorState}
              setNumCols={setAdditionalNumCols}
              setToAmountColIndex={setAdditionalToAmountColIndex}
              setPremiumColIndex={setAdditionalPremiumColIndex}
            />
          )
        }
        <Button
          onClick={handleGenerateTable}
        >
          Preview
        </Button>

      </Segment>
  );
}


function RateFormPage() {
  const [promulgatedStates, setPromulgatedStates] = useState([]);
  const [cplFee, setCplFee] = useState();

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

      return (
        <div>
          <Form>
            <Form.Field>
            <label>CPL Fee</label>
            <Input labelPosition='right' type='text' placeholder='Amount' onChange={(e) => {setCplFee(e.target.value);}}>
              <Label basic>$</Label>
              <input placeholder='CPL Fee' />
            </Input>
            </Form.Field>

            <ParserInput />

            <Button
              type="submit"
              onClick={(e, value) => {
                Object.assign(formPayload, {cpl_fee: cplFee});
                handleSubmit(formPayload);
              }}>Submit
            </Button>
          </Form>
        </div>
      );
      }
    }
    </AppContext.Consumer>
  );
}

export default App;

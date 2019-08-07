import React, { useState } from 'react';
import { convertToRaw, EditorState } from 'draft-js';
import {
  Button, Input, Form, Dropdown, Header, Segment, Radio, Modal, TextArea, Dimmer, Loader
} from 'semantic-ui-react'

import axios from 'axios';
import _ from 'underscore';

import RateEditor from './RateEditor';
import { getTableVariableName } from './utils';


function ParserInputModal({tableName, setTableName, parserOutput, setParserOutput, children}) {
  const [tableType, setTableType] = useState('');

  const [tableTextEditorState, setTableTextEditorState] = useState(EditorState.createEmpty());
  const [numCols, setNumCols] = useState(2);
  const [amountInterval, setAmountInterval] = useState(1000);
  const [toAmountColIndex, setToAmountColIndex] = useState(1);
  const [premiumColIndex, setPremiumColIndex] = useState(2);

  const [additionalTableTextEditorState, setAdditionalTableTextEditorState] = useState(EditorState.createEmpty());
  const [additionalAmountInterval, setAdditionalAmountInterval] = useState(1000);
  const [additionalNumCols, setAdditionalNumCols] = useState(2);
  const [additionalToAmountColIndex, setAdditionalToAmountColIndex] = useState(1);
  const [additionalPremiumColIndex, setAdditionalPremiumColIndex] = useState(2);

  const [isGenerating, setIsGenerating] = useState(false);

  const isJointTable = tableType === 'Joint';
  const convertEditorStateToText = (editorState) => {
    const blocks = convertToRaw(editorState.getCurrentContent()).blocks;
    return blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');
  };

  const handleGenerateTable = () => {
    const payload = {
      name: tableName,
      text: convertEditorStateToText(tableTextEditorState),
      interval: amountInterval,
      type: tableType,
      num_cols: numCols,
      to_amount_col_idx: toAmountColIndex - 1,
      premium_col_idx: premiumColIndex - 1,
    };
    setIsGenerating(true);
    axios.post(`http://localhost:4567/parse_rate_table_text`, payload).then(res => {
      setParserOutput(res.data);
      setIsGenerating(false);
    });
  };

  return (
    <Modal trigger={children}>
      <Modal.Header>Add {tableType} Table</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header size='medium'></Header>
          <Form>
            <label>Table Type</label>
            <Form.Field>
              <TableTypeRadioButtons
                tableType={tableType}
                setTableType={setTableType}
              />
            </Form.Field>

            <Form.Field>
              <label>Table Name</label>
              <Input labelPosition='right' type='text' placeholder='Amount' defaultValue={tableName} onChange={(e, { value }) => {setTableName(value)}}>
                <input placeholder='Name of the table' />
              </Input>
            </Form.Field>

            <TableTextEditorStateInput
              tableType={!isJointTable ? tableType : 'Fixed'}
              tableTextEditorState={tableTextEditorState}
              amountInterval={amountInterval}
              numCols={numCols}
              toAmountColIndex={toAmountColIndex}
              premiumColIndex={premiumColIndex}
              setAmountInterval={setAmountInterval}
              handleTableTextEditorStateChange={setTableTextEditorState}
              setNumCols={setNumCols}
              setToAmountColIndex={setToAmountColIndex}
              setPremiumColIndex={setPremiumColIndex}
            />
            {
              isJointTable && (
                <TableTextEditorStateInput
                  tableType='Graduated'
                  tableTextEditorState={additionalTableTextEditorState}
                  amountInterval={additionalAmountInterval}
                  numCols={additionalNumCols}
                  toAmountColIndex={additionalToAmountColIndex}
                  premiumColIndex={additionalPremiumColIndex}
                  setAmountInterval={setAdditionalAmountInterval}
                  handleTableTextEditorStateChange={setAdditionalTableTextEditorState}
                  setNumCols={setAdditionalNumCols}
                  setToAmountColIndex={setAdditionalToAmountColIndex}
                  setPremiumColIndex={setAdditionalPremiumColIndex}
                />
              )
            }

            {
              isGenerating ? (
                <p>Parsing the output...</p>
              ) : (
                parserOutput.text && (
                  <div>
                    <Form.Field>
                      <label>Parser output</label>
                      {getTableVariableName(parserOutput)}
                      <TextArea
                        value={parserOutput.text}
                        onChange={(e, {value}) => {
                          // setTableName(getTableVariableName(parserOutput));
                          setParserOutput({...parserOutput, text: value});
                        }}
                      >
                      </TextArea>
                    </Form.Field>
                    <Form.Field>
                      <Button
                        onClick={handleGenerateTable}
                      >
                        Preview
                      </Button>
                    </Form.Field>
                  </div>
                )
              )
            }
          </Form>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
}

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
  {
    tableType, tableTextEditorState, amountInterval, numCols, toAmountColIndex, premiumColIndex,
    handleTableTextEditorStateChange, setAmountInterval, setNumCols, setToAmountColIndex, setPremiumColIndex, isGenerating
  }) => {
    const numberOptions = _.range(1, 9).map(x => ({key: x, value: x, text: x}));

    return (
      <div>
        <Form.Field>
          <label>{tableType} Table Text</label>
          <RateEditor
            editorState={tableTextEditorState}
            handleEditorStateChange={handleTableTextEditorStateChange}
          />
        </Form.Field>
        <Form.Field>
          <label>Interval Between Tiers</label>
          <Input
            labelPosition='right'
            type='text'
            placeholder='Interval of Amounts Between Tiers After the First Tier'
            defaultValue={amountInterval}
            onChange={(e, { value }) => {setAmountInterval(value)}}
          >
            <input />
          </Input>
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

        {/* TODO: ability to add multiple sets of name & premium column
          <Form.Field>
            <label>Table Name</label>
            <Input labelPosition='right' type='text' placeholder='Amount' onChange={(e) => {}}>
              <input placeholder='Name of the table' />
            </Input>
          </Form.Field>
        */}
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


export default ParserInputModal;
import React, { useContext, useState } from 'react';
import { AppContext } from '../../ContextApi/AppContext';
import { Button, Form, Card } from 'react-bootstrap';
import './DataControls.css';

const DataControls: React.FC = () => {
  const { state, setSelectedDataSource } = useContext(AppContext)!;
  const [thresholdValue, setThresholdValue] = useState<number>(0);
  const [thresholdColor, setThresholdColor] = useState<string>('#ff0000');
  const [thresholdOperator, setThresholdOperator] = useState<string>('>');

  const selectedDataSource = state.dataSources.find(
    ds => ds.id === state.selectedDataSource
  );

  const handleAddThreshold = () => {
    if (!selectedDataSource) return;

    const newThreshold = {
      value: thresholdValue,
      color: thresholdColor,
      operator: thresholdOperator as any,
    };

    // In a real app, you would add this to a specific polygon
    // For simplicity, we're just showing the UI here
    console.log('Would add threshold:', newThreshold);
  };

  return (
    <Card className="mb-3">
      <Card.Header>Data Controls</Card.Header>
      <Card.Body>
        <Form.Group className="mb-3">
          <Form.Label>Data Source</Form.Label>
          <Form.Select
            value={state.selectedDataSource}
            onChange={e => setSelectedDataSource(e.target.value)}
          >
            {state.dataSources.map(source => (
              <option key={source.id} value={source.id}>
                {source.name} ({source.unit})
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {selectedDataSource && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Threshold Value ({selectedDataSource.unit})</Form.Label>
              <Form.Range
                min={selectedDataSource.minValue}
                max={selectedDataSource.maxValue}
                value={thresholdValue}
                onChange={e => setThresholdValue(parseFloat(e.target.value))}
              />
              <Form.Text>
                Current: {thresholdValue} {selectedDataSource.unit}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Operator</Form.Label>
              <Form.Select
                value={thresholdOperator}
                onChange={e => setThresholdOperator(e.target.value)}
              >
                <option value=">">Greater than</option>
                <option value="<">Less than</option>
                <option value=">=">Greater than or equal</option>
                <option value="<=">Less than or equal</option>
                <option value="=">Equal to</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Color</Form.Label>
              <Form.Control
                type="color"
                value={thresholdColor}
                onChange={e => setThresholdColor(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" onClick={handleAddThreshold}>
              Add Threshold
            </Button>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default DataControls;
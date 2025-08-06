import React, { useContext } from 'react';
import { AppContext } from '../../ContextApi/AppContext';
import { Card, ListGroup, Badge, Button } from 'react-bootstrap';
import './PolygonList.css';

const PolygonList: React.FC = () => {
  const { state, updatePolygon, deletePolygon } = useContext(AppContext)!;

  return (
    <Card className="flex-grow-1">
      <Card.Header>Polygons</Card.Header>
      <Card.Body className="p-0">
        {state.polygons.length === 0 ? (
          <div className="p-3 text-muted">No polygons created yet</div>
        ) : (
          <ListGroup variant="flush">
            {state.polygons.map(polygon => {
              const dataSource = state.dataSources.find(
                ds => ds.id === polygon.dataSource
              );
              return (
                <ListGroup.Item key={polygon.id} className="polygon-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{polygon.name}</strong>
                      {dataSource && (
                        <Badge bg="info" className="ms-2">
                          {dataSource.name}
                        </Badge>
                      )}
                    </div>
                    <div>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => deletePolygon(polygon.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div
                      className="color-preview"
                      style={{ backgroundColor: polygon.color }}
                    />
                    <small className="text-muted ms-2">
                      {polygon.coordinates.length} points
                    </small>
                  </div>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
};

export default PolygonList;
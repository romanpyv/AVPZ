import React from "react";
import { Card, Form } from "react-bootstrap";

const CardInfo = ({ title, data, add, riskType }) => (
  <Card>
    <Card.Body>
      <Card.Title>{title}</Card.Title>
      <Card.Text>
        <Form>
          {data.map((el, i) => (
            <Form.Check
              label={el}
              onChange={() => {
                add(i, riskType);
              }}
            />
          ))}
        </Form>
      </Card.Text>
    </Card.Body>
  </Card>
);

export default CardInfo;

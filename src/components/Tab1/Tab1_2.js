import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import CardsInfo from "./Card";
export default class Tab1_2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      techRisk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      valueRisk: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      planRisk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      realizeRisk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      disTechRisK: this.props.data.eventRisk.disTechRisK,
      disValueRisK: this.props.data.eventRisk.disValueRisK,
      disPlanRisK: this.props.data.eventRisk.disPlanRisK,
      disRealizeRisK: this.props.data.eventRisk.disRealizeRisK
    };
  }
  addToArray = (check, arrType) => {
    const tmp = this.state[arrType];
    tmp[check] = tmp[check] ? 0 : 1;
    this.setState({ [arrType]: tmp });
  };
  calculate = () => {
    console.log(this.state);

    let t = this.state.techRisk.reduce(((previousValue, currentValue) => previousValue += currentValue), 0) / 46;
    let v = this.state.valueRisk.reduce(((previousValue, currentValue) => previousValue += currentValue), 0) / 46;
    let p = this.state.planRisk.reduce(((previousValue, currentValue) => previousValue += currentValue), 0) / 46;
    let r = this.state.realizeRisk.reduce(((previousValue, currentValue) => previousValue += currentValue), 0) / 46;

    alert(`
    Технічні ризики: ${(t*100).toFixed(2)}
    Вартісні ризики: ${(v*100).toFixed(2)}
    Планові ризики: ${(p*100).toFixed(2)}
    Управлінські ризики: ${(r*100).toFixed(2)}
    Загальні ризики: ${((t + v + p + r) * 100).toFixed(2)}`);
  };
  render() {
    return (
      <Container fluid className="unselectable">
        <br />
        <Card>
          <Card.Body>
            <Card.Title>
              Якщо наведені нижче твердження справджуються для вашої
              специфікації вимог, то відмітьте це у відповідному полі. Після
              завершення натисність кнопку обрахувати ймовірність появи ризиків,
              щоб переглянути результат роботи.
            </Card.Title>
            <Row>
              <Col md="6">
                <CardsInfo
                  title="Технічні ризикові події"
                  data={this.state.disTechRisK}
                  riskType="techRisk"
                  add={this.addToArray}
                />
              </Col>
              <Col md="6">
                <CardsInfo
                  title="Вартісні ризикові події"
                  data={this.state.disValueRisK}
                  riskType="valueRisk"
                  add={this.addToArray}
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col md="6">
                <CardsInfo
                  title="Планові ризики"
                  data={this.state.disPlanRisK}
                  riskType="planRisk"
                  add={this.addToArray}
                />
              </Col>
              <Col md="6">
                <CardsInfo
                  title="Ризики реалізації та управління проектом"
                  data={this.state.disRealizeRisK}
                  riskType="realizeRisk"
                  add={this.addToArray}
                />
              </Col>
            </Row>
            <br />
            <Button
              block
              onClick={() => {
                this.calculate();
              }}
            >
              Обрахувати ймовірність появи ризику
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }
}

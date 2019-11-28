import React from "react";
import {Container, Row, Col, ListGroup, Table} from "react-bootstrap";
import Tr from "./tr";

export default class Analiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disData: [],
      minVR: 0.01,
      maxVR: 0.6,
      massER: [],
      massInterval: [
        [0.0, 0.0],
        [0.0, 0.0],
        [0.0, 0.0]
      ]
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data.ER !== this.props.data.ER) {
      let tmp2 = [...this.state.disData];
      let loss= []
      let fatherMass;
      let tmpMinVrer;
      let tmpMaxVrer;
      let step;
      fatherMass = this.props.data.ER;


      tmp2.forEach((element, i) => {
        if (i > 0) loss.push(element[2]);
      });
      this.props.updateRootState({loss});
      for (let i = 0; i < fatherMass.length; i++) {
        tmp2[i + 1][1] = fatherMass[i];
      }

      for (let i = 1; i < tmp2.length; i++) {
        tmp2[i][3] = (tmp2[i][1] * tmp2[i][2]).toFixed(2);
      }

      tmpMinVrer = +Math.min(...tmp2.slice(1).map(i => +i[3])).toFixed(2);
      tmpMaxVrer = +Math.max(...tmp2.slice(1).map(i => +i[3])).toFixed(2);
      step = (tmpMaxVrer - tmpMinVrer) / 3;

      this.changeVRER("minVR", tmpMinVrer);
      this.changeVRER("maxVR", tmpMaxVrer);

      for (let i = 1; i < tmp2.length; i++) {
        // console.log(tmp2[i][3]);
        if (tmp2[i][3] >= tmpMinVrer && tmp2[i][3] < tmpMinVrer + step) {
          tmp2[i][4] = 'Низький';
        }
        if (tmp2[i][3] >= tmpMinVrer + step && tmp2[i][3] < tmpMinVrer + 2 * step) {
          tmp2[i][4] = 'Середній';
        }
        if(tmp2[i][3] >= tmpMinVrer + 2 * step && tmp2[i][3] <= tmpMaxVrer) {
          tmp2[i][4] = 'Високий';
        }
      }

      this.setState({disData: tmp2, massER: fatherMass});
    }
  }

  changeVRER = (minMaxVrer, v) => {
    this.setState({[minMaxVrer]: v}, () => {
      let tmpMinVrer = +this.state.minVR;
      let tmpMaxVrer = +this.state.maxVR;
      let tmpMass = [
        [0.0, 0.0],
        [0.0, 0.0],
        [0.0, 0.0]
      ];
      let step = (tmpMaxVrer - tmpMinVrer) / 3;
      step = +step;

      tmpMass[0][0] = +tmpMinVrer;
      tmpMass[0][1] = +tmpMinVrer + +step;
      tmpMass[1][0] = +tmpMass[0][1];
      tmpMass[1][1] = +tmpMass[1][0] + +step;
      tmpMass[2][0] = +tmpMass[1][1];
      tmpMass[2][1] = tmpMaxVrer;

      this.setState({massInterval: tmpMass});
    });
  };
  //tmp2[i][1]->ER
  //tmp2[i][2]->Розмір збитків
  //tmp2[i][3]->VRER
  //tmp2[i][4]->Пріоритет
  //Вставляєш дані і воно буде виводити

  //Ініціалізація всього
  componentDidMount() {
    let tmp2 = [];

    tmp2.push(["Ризикові події", "ER", "Збитки", "VRER", "Пріоритет"]);
    this.props.data.eventRisk.disTechRisK.map(el => tmp2.push([el]));
    this.props.data.eventRisk.disValueRisK.map(el => tmp2.push([el]));
    this.props.data.eventRisk.disPlanRisK.map(el => tmp2.push([el]));
    this.props.data.eventRisk.disRealizeRisK.map(el => tmp2.push([el]));
    //ER
    tmp2.forEach((element, i) => {
      if (i > 0) element.push(0);
    });
    //Збитки
    tmp2.forEach((element, i) => {
      if (i > 0) element.push(Math.random().toFixed(2));
    });
    //VRER
    tmp2.forEach((element, i) => {
      if (i > 0) element.push(0);
    });
    //Пріоритет
    tmp2.forEach((element, i) => {
      if (i > 0) element.push("");
    });

    this.setState({disData: tmp2});
  }

  updateData = (value, rowIndex, colIndex) => {
    this.setState(
      state => {
        const deepCopy = JSON.parse(JSON.stringify(state.disData));
        deepCopy[rowIndex][colIndex] = value;

        return {
          disData: deepCopy
        };
      },
      () => {
      }
    );
  };

  render() {
    return (
      <Container fluid>
        <br/>
        <br/>
        <Row>
          <Col md="9">
            {" "}
            <Table bordered>
              <tbody>
              {this.state.disData.map((el, i) => (
                <Tr data={el} rowIndex={i} updateData={this.updateData}/>
              ))}
              </tbody>
            </Table>
          </Col>
          <Col md="3">
            <Container style={{position: "fixed"}}>
              <ListGroup>
                <ListGroup.Item>
                  Мінінмальний VRER:
                  <input
                    type="text"
                    value={this.state.minVR}
                    style={{marginLeft: "26px"}}
                  />
                  <br/>
                  Максимальний VRER:
                  <input
                    type="text"
                    value={this.state.maxVR}
                    style={{marginLeft: "15px"}}
                  />
                </ListGroup.Item>
                <ListGroup.Item>
                  Інтервал розподілу ризиків
                  <br/>[{this.state.massInterval[0][0].toFixed(2)};
                  {this.state.massInterval[0][1].toFixed(2)}) - Низький
                  <br/>[{this.state.massInterval[1][0].toFixed(2)};
                  {this.state.massInterval[1][1].toFixed(2)}) - Середній
                  <br/>[{this.state.massInterval[2][0].toFixed(2)};
                  {this.state.massInterval[2][1].toFixed(2)}] - Високий
                </ListGroup.Item>
              </ListGroup>
            </Container>
          </Col>
        </Row>
      </Container>
    );
  }
}

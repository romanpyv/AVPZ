import React from "react";
import {Container, Button, Table} from "react-bootstrap";
import Tr from "../Tab2/tr";

export default class Monitoring extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trData: [],
      trNums: []
    };
  }

  resultClick = () => {
    console.log(this.state);
    console.log(this.props);

    let ers = this.calculateErs(0, 46);
    let pt = (1 / ers) * this.calculateErs(0, 11);
    let pv = (1 / ers) * this.calculateErs(11, 19);
    let pc = (1 / ers) * this.calculateErs(19, 30);
    let pm = (1 / ers) * this.calculateErs(30, 46);

    alert(`
    ймовірність настання технічних ризикових подій: ${pt.toFixed(2)}
    ймовірність настання вартісних ризикових подій: ${pv.toFixed(2)}
    ймовірність настання планові ризикові події: ${pc.toFixed(2)}
    ймовірність настання ризикових подій реалізації процесів і процедур управління програмним проектом: ${pm.toFixed(2)}
    `);

  };
  calculateErs = (from, to) => {
    let ers = this.state.trNums.map(i => i[i.length - 1]);

    return ers.slice(from, to).reduce((previousValue, currentValue) => previousValue += +currentValue[currentValue.length - 1], 0);
  };

  /*componentDidUpdate(prevProps) {
    if (prevProps.data.indexMethods !== this.props.data.indexMethods) {
      let {eliminatedPerArray, eliminatedER} = this.props.data, changedIndex = [];
      eliminatedPerArray = [...this.props.data.eliminatedPerArray];

      for (let i = 0; i < this.props.data.indexMethods.length; i++) {
        if (prevProps.data.indexMethods[i] !== this.props.data.indexMethods[i]) {
          changedIndex.push(i);
        }
      }

      for (let i = 0; i < changedIndex.length; i++) {
        for (let j = 0; j < eliminatedPerArray[changedIndex[i]].length - 1; j++) {
          eliminatedPerArray[changedIndex[i]][j] -= Math.random() / 2 - 0.1;
          eliminatedPerArray[changedIndex[i]][j] = +eliminatedPerArray[changedIndex[i]][j].toFixed(2);
        }
        eliminatedER[changedIndex[i]] = (eliminatedPerArray[i].reduce((p, i) => p += +i, 0) / 10).toFixed(2);
        eliminatedPerArray[changedIndex[i]].pop();
      }
      eliminatedPerArray.pop();

      this.props.updateRootState({eliminatedPerArray, eliminatedER});

      let {trData} = this.state;
      console.log(trData, eliminatedPerArray);

      for (let i = 1; i < trData.length; i++) {
        for (let j = 2; j < trData[i].length; j++) {
          // console.log(eliminatedPerArray[i - 1]);
          trData[i][j] = eliminatedPerArray[i - 1][j - 2];
        }
        // trData[i][trData.length - 1] = eliminatedER[i - 1];
      }


      this.setState({trData});
    }
  }*/

  componentDidMount() {
    const reducer = (acumulator, currentValue) => +acumulator + +currentValue;
    let tmp2 = [];
    let numbers = [];
    let tmp1 = [];
    let ER = 0;

    tmp2.push(["№", "Ризикові події", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "ER"]);
    this.props.data.eventRisk.disTechRisK.map(el => tmp2.push([el]));
    this.props.data.eventRisk.disValueRisK.map(el => tmp2.push([el]));
    this.props.data.eventRisk.disPlanRisK.map(el => tmp2.push([el]));
    this.props.data.eventRisk.disRealizeRisK.map(el => tmp2.push([el]));

    for (let i = 1; i < tmp2.length; i++) {
      numbers = [];
      if (!this.props.data.perArray[i - 1]) {
        for (let j = 0; j < 10; j++) {
          numbers.push(0);
        }
      } else {
        numbers = this.props.data.eliminatedPerArray[i - 1];
        // console.log(numbers);
        // numbers.pop();
      }
      ER = numbers.reduce(reducer) / 10;
      numbers.push(ER.toFixed(2));
      tmp1.push(numbers);
      tmp2[i].unshift(i);
      tmp2[i].push(...numbers);
    }


    this.setState({trNums: tmp1});
    this.setState({trData: tmp2});
  }

  updateData = (value, rowIndex, colIndex) => {
    this.setState(
      state => {
        const deepCopy = JSON.parse(JSON.stringify(state.trNums));
        deepCopy[rowIndex - 1][colIndex - 2] = value;
        let tmpData = this.state.trData;
        let result = tmpData;
        let rowId = rowIndex - 1;
        let matrix = [];
        let rowData = [];
        let nums;
        let ER;
        let massEr = [];
        let tmpER = 0;
        const reducer = (acumulator, currentValue) => +acumulator + +currentValue;

        matrix.push(...deepCopy);
        rowData.push(...matrix[rowId]);
        nums = rowData.slice(0, 10);
        ER = nums.reduce(reducer);
        ER /= rowData.length - 1;
        matrix[rowId][10] = ER.toFixed(2);

        for (let i = 1; i < tmpData.length; i++) {
          for (let j = 2; j < tmpData[i].length; j++) {
            result[i][j] = matrix[i - 1][j - 2];
          }
          tmpER = matrix[i - 1][10];
          massEr.push(tmpER);
        }

        this.props.setER(massEr);
        return {
          trData: result
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

        <h5>Ймовірність настання ризикових подій, встановлені експертами</h5>
        <Button
          block
          onClick={() => {
            this.resultClick();
          }}
        >
          Результат по групах
        </Button>
        <br/>
        <Table bordered>
          <tbody>
          {this.state.trData.map((el, i) => (
            <Tr data={el} rowIndex={i} updateData={this.updateData}/>
          ))}
          </tbody>
        </Table>
      </Container>
    );
  }
}

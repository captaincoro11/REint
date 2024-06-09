import React from 'react';
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis } from 'victory';

const MyChart = ({ xData, yData , xfData ,yfData  }: { yData: Array<Number>; xData: Array<String>;xfData:Array<String>;yfData:Array<Number> }) => {
  // Generate tick format to show only every fifth label



  const tickFormat = (value: string, index: number) => (index % 5 === 0 ? value : '');

  return (
    <VictoryChart 
      theme={VictoryTheme.material}
      width={700} // Change the width of the chart
      height={500} // Change the height of the chart
    >
      <VictoryLine
        data={xData.map((x, i) => ({ x, y: yData[i] }))}
        style={{
          data: { stroke: "blue" },
          parent: { border: "1px solid #ccc" }
        }}
      />
      <VictoryLine
       data={xfData.map((x, i) => ({ x, y: yfData[i] }))}
       style={{
         data: { stroke: "green" },
         parent: { border: "1px solid #ccc" }
       }}/>
      
      {/* Custom x-axis with specified tickFormat */}
      <VictoryAxis tickFormat={tickFormat} />
      {/* Standard y-axis */}
      <VictoryAxis dependentAxis />
    </VictoryChart>
  );
};

export default MyChart;



function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildChart function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Create a variable that holds the samples array. 
    var samples = data.samples
    // Create a variable that filters the samples for the object with the desired sample number.
    var samplesArray = samples.filter(sampleObj => sampleObj.id == sample);
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.

    // Create a variable that holds the first sample in the array.
    var resultSample = samplesArray[0];

    // 2. Create a variable that holds the first sample in the metadata array.
    var metadatasArray = data.metadata.filter(sampleObj => sampleObj.id == sample)[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = resultSample.otu_ids; 
    var otu_labels = resultSample.otu_labels; 
    var sample_values = resultSample.sample_values; 

    var sorted_otu_ids = resultSample.otu_ids.sort((a,b) => b.sample_values - a.sample_values).slice(0,10).reverse();
    var sorted_otu_labels = resultSample.otu_labels.sort((a,b) => b.sample_values - a.sample_values).slice(0,10).reverse();
    var sorted_sample_values = resultSample.sample_values.sort((a,b) => b.sample_values - a.sample_values).slice(0,10).reverse();

    // 3. Create a variable that holds the washing frequency.
    var wfreq = metadatasArray.wfreq;

    // Create the yticks for the bar chart.
    var yticks = sorted_otu_ids.map(tick => "OTU "+tick.toString());
    // Use Plotly to plot the bar data and layout.
    var barData = [
      {
       x: sorted_sample_values,
       type: "bar",
       orientation: "h"
       }];
 
     // 9. Create the layout for the bar chart. 
     var barLayout = {
       title: "Top 10 Bacteria Cultures Found",
       yaxis: {
         tickmode: "array",
         tickvals: [0,1,2,3,4,5,6,7,8,9],
         ticktext: yticks
       }
         
     };
     // 10. Use Plotly to plot the data with the layout. 
     Plotly.newPlot("bar", barData, barLayout);
    
    // Use Plotly to plot the bubble data and layout.
    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
        size: sample_values,
        color: sample_values,
        colorscale: "reds"
        }
      }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures per Sample"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
   
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        value: wfreq,
        type: "indicator",
        mode: "gauge+number",
        title: { text: "Scrubs per Week" },
        gauge: {
          axis: { range: [null, 10] },
          bar: { color: "black" },
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange"},
            { range: [4, 6], color: "yellow"},
            { range: [6, 8], color: "green"},
            { range: [8, 10], color: "purple"}
          ]
          }
        }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: "Belly Button Washing Frequency"
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}

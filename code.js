function deepClone(original) {
  return JSON.parse(JSON.stringify(original));
}

const base = {
    chart: {
       height: 600 // Set a fixed height for the chart
    },
    plotOptions: {
      sankey: {
        linkOpacity: 1 // Keeps all links fully opaque
      }
    },
    title: { text: '' },
    subtitle: { text: '' },
    tooltip: {
        headerFormat: null,
        pointFormat:
      '{point.fromNode.name} \u2192 {point.toNode.name}: {point.weight:.2f} ' +
      'kWh',
        nodeFormat: '{point.name}: {point.sum:.2f} kWh'
    },
    series: [{
        keys: ['from', 'to', 'weight', 'color'],
        nodes: [
            {
                id: 'Grid',
                color: '000000',
                offset: 0
            },
            {
                id: 'Solar',
                color: '#4daf4a',
                offset: 10,
            },
            {
                id: 'Battery',
                color: '#999999',
                offset: 0,
                column: 1,
            },
            {
                id: 'House',
                color: '#999999',
                column: 2,
            },
            {
                id: 'GridExport',
                color: '000000',
                column: 2,
                offset: 10,
            }
        ],

        data: [],
        type: 'sankey',
        name: 'Sankey demo series',

        dataLabels: {
            enabled: true, // Always show labels
            format: '{point.weight:.2f} kWh', // Format of the label
            nodeFormat: '{point.name} {point.sum:.2f} kWh',
            style: {
                fontSize: '12px',
                color: '#000000', // Label text color
                textOutline: 'none' // Remove text outline for better readability
            },
            backgroundColor: 'rgba(255, 255, 255, 0.7)', // Background for better contrast
            padding: 5, // Padding around the label
            borderRadius: 5, // Rounded corners for the label background
            borderWidth: 1, // Border width
            borderColor: '#cccccc' // Border color
        }

    }]

};

function calculateData({
  //from screen with 2 circle
  solarToGrid = 32.82,
  solarUsed = 80.82,
  fromGrid = 137.16,
  selfConsumption = 320.94,
  // from yearly chart - from month bar
  batteryDischarge = 313.52
} = {}) {

  const solarToHouse = selfConsumption - batteryDischarge
  const solarToBattery = solarUsed - solarToHouse
  const gridToBattery = batteryDischarge - solarToBattery

  return [
    ['Grid', 'House', fromGrid, '#a65628'],
    ['Grid', 'Battery', gridToBattery, '#a65628'],

    ['Battery', 'House', batteryDischarge, '#edc949'],

    ['Solar', 'Battery', solarToBattery, '#EDC949'],
    ['Solar', 'House', solarToHouse, '#F6E43E'],
    ['Solar', 'GridExport', solarToGrid, '#ffff33'],
  ];
}


function produceChart({
  id,
  title,
  //from screen with 2 circle
  solarToGrid = 32.82,
  solarUsed = 80.82,
  fromGrid = 137.16,
  selfConsumption = 320.94,
  // from yearly chart - from month bar
  batteryDischarge = 313.52,
  offset = 20
} = {}) {
  const options = deepClone(base)

  options.title.text = title
  options.series[0].data = calculateData({
    //from screen with 2 circle
    solarUsed,
    solarToGrid,
    fromGrid,
    selfConsumption,
    // from yearly chart - from month bar
    batteryDischarge
  })
  options.series[0].nodes[2].offset = offset

  Highcharts.chart(id, options)
}


produceChart({
  id: 'sep2024',
  title: 'September 2024 (only 4 days)',
  offset: -160,
  solarUsed: 20.27,
  solarToGrid: 46.65,
  fromGrid: 6.91,
  selfConsumption: 27.51,
  batteryDischarge: 18.31
})

produceChart({
  id: 'oct2024',
  title: 'October 2024',
  offset: -85,
  solarUsed: 173.02,
  solarToGrid: 162.91,
  fromGrid: 51.21,
  selfConsumption: 348.58,
  batteryDischarge: 281.61
})

produceChart({
  id: 'nov2024',
  title: 'November 2024',
  offset: 20,
  solarUsed: 72.42,
  solarToGrid: 56.96,
  fromGrid: 77.27,
  selfConsumption: 203.63,
  batteryDischarge: 194.56
})

produceChart({
  id: 'dec2024',
  title: 'December 2024',
  offset: 50,
  solarUsed: 80.82,
  solarToGrid: 32.82,
  fromGrid: 137.16,
  selfConsumption: 320.94,
  batteryDischarge: 313.52
})

produceChart({
  id: 'jan2025',
  title: 'January 2025',
  offset: -10,
  //from screen with 2 circle
  solarUsed: 82.6,
  solarToGrid: 109.48,
  fromGrid: 87.85,
  selfConsumption: 337.68,
  // from yearly chart - from month bar
  batteryDischarge: 314.92
})

produceChart({
  id: 'feb2025',
  title: 'February 2025',
  offset: -80,
  //from screen with 2 circle
  solarUsed: 56.56,
  solarToGrid: 179.98,
  fromGrid: 59.11,
  selfConsumption: 306.55,
  // from yearly chart - from month bar
  batteryDischarge: 261.41
})

produceChart({
  id: 'mar2025',
  title: 'March 2025 (until 16th)',
  offset: -140,
  //from screen with 2 circle
  solarUsed: 44.12,
  solarToGrid: 173.54,
  fromGrid: 24.28,
  selfConsumption: 144.12,
  // from yearly chart - from month bar
  batteryDischarge: 104.32
})


document.getElementById("generate").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent form submission
    const form = document.querySelector("form");
    const formData = new FormData(form);
    const values = {};
    formData.forEach((value, key) => {
       values[key] = key !== "title" ? parseFloat(value): value;
    });
    produceChart({
      id: 'generated',
      ...values
    })
});

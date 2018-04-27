declare let d3, nv: any;

const dateFormat = (unix) => d3.time.format('%e.%m.%Y')(new Date(unix * 1000));

export const chartOptions = {
  pie: {
    chart: {
      type: 'pieChart',
      x: function (d) {
        return d.key;
      },
      y: function (d) {
        return d.value;
      },
      showLabels: true,
      donut: true,
      labelType: 'percent',
      labelThreshold: 0.01,
      labelSunbeamLayout: false,
      duration: 250,
      noData: 'Ingen data tilgjengelig.',
    }
  }
  ,
  multiBar: {
    chart: {
      duration: 250,
      type: 'multiBarChart',
      stacked: true,
      showLabels: true,
      labelType: 'percent',
      x: (d) => d[0],
      y: (d) => d[1],
      xAxis: {
        axisLabel: 'Innhøsting',
        tickFormat: dateFormat,
        axisLabelDistance: 10,
      }
    },
    yAxis: {
      axisLabel: 'Antall tekster',
      tickFormat: (d) => d3.format(',f')(d),
      axisLabelDistance: 12,
    },
  },

  stackedArea: {
    chart: {
      duration: 250,
      type: 'stackedAreaChart',
      style: 'stacked',
      useInteractiveGuideline: true,
      x: (d) => d[0],
      y: (d) => d[1],
      xAxis: {
        axisLabel: 'Innhøsting',
        tickFormat: dateFormat,
        axisLabelDistance: 12,
      },
      yAxis: {
        axisLabel: 'Antall tekster' + '',
        tickFormat: (d) => d3.format(',f')(d),
        axisLabelDistance: 12,
      },
    },
  },
};

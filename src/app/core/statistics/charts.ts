declare let d3, nv: any;

const dateFormat = (unix) => d3.time.format('%e.%m.%Y')(new Date(unix * 1000));
const noData = 'Ingen data tilgjengelig';

const pieChart: nv.PieChart | any = {
  x: function (d) {
    return d.key;
  },
  y: function (d) {
    return d.value;
  },
  showLabels: true,
  donut: false,
  labelType: 'percent',
  labelThreshold: 0.01,
  labelSunbeamLayout: false,
  duration: 250,
  noData,
};

const multibarChart: nv.MultiBarChart | any = {
  duration: 250,
  stacked: true,
  x: (d) => d[0],
  y: (d) => d[1],
  xAxis: {
    axisLabel: 'Innhøsting',
    tickFormat: dateFormat,
    axisLabelDistance: 10,
  },
  yAxis: {
    axisLabel: 'Antall tekster',
    tickFormat: (d) => d3.format(',f')(d),
    axisLabelDistance: 12,
  },
  noData,
};

const stackedAreaChart: nv.StackedAreaChart | any = {
  duration: 250,
  useInteractiveGuideline: true,
  style: 'expand',
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
  margin: {
    left: 50,
    right: 50,
  },
  noData,
};

// chartOptions in a format used by ng2-nvd3
export const chartOptions = {
  pieChart: (extra?) => ({
    chart: {
      type: 'pieChart',
      ...pieChart,
      ...extra,
    }
  }),

  multiBarChart: (extra?) => ({
    chart: {
      type: 'multiBarChart',
      ...multibarChart,
      ...extra,
    },
  }),

  stackedAreaChart: (extra?) => ({
    chart: {
      type: 'stackedAreaChart',
      ...stackedAreaChart,
      ...extra,
    },
  }),
};


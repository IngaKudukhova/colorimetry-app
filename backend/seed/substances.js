module.exports = [
  {
    name: 'Парацетамол',

    areaEquation: {
      type: 'linear',
      a: -12590,
      b: 12847,
      r2: 0.9933,
    },

    perimeterEquation: {
      type: 'linear',
      a: -377.5,
      b: 580.1,
      r2: 0.9481,
    },
  },

  {
    name: 'Инсулин',

    areaEquation: {
      type: 'linear',
      a: -1976.5,
      b: 7580.7,
      r2: 0.9771,
    },

    perimeterEquation: {
      type: 'linear',
      a: -90.033,
      b: 492.49,
      r2: 0.9869,
    },
  },

  {
    name: 'Глицин',

    areaEquation: {
      type: 'power',
      a: 11999,
      b: 0.3281,
      r2: 0.9877,
    },

    perimeterEquation: {
      type: 'power',
      a: 425.92,
      b: -0.147,
      r2: 0.9847,
    },
  },

  {
    name: 'Резорцин',

    areaEquation: {
      type: 'polynomial',
      a: -204890,
      b: 92330,
      c: 26197,
      r2: 0.9999,
    },

    perimeterEquation: {
      type: 'polynomial',
      a: -2716.2,
      b: 1356.7,
      c: 654.09,
      r2: 0.9999,
    },
  },

  {
    name: 'Инфезол',

    areaEquation: {
      type: 'exponential',
      a: 53393,
      b: -1.294,
      r2: 0.9985,
    },

    perimeterEquation: {
      type: 'exponential',
      a: 885.11,
      b: -0.558,
      r2: 0.9973,
    },
  },
]

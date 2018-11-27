// Worker thread

/**
 *
 * @param event {MessageEvent} a message received from the main thread
 */
onmessage = onMessage;

onerror = onError;

function onError(error) {
  console.error(error);
}

function onMessage(event) {
  postMessage(processData(event.data));
}

function processData(data) {
  if (data.length === 0) {
    return data;
  }
  const languages = Array.from(new Set(data.map(_ => _.language)));

  // group data by end time
  const byEndTime = groupBy(data, 'endTime');

  // sorted array of dates
  const dates = Object.keys(byEndTime).sort();

  // for each date sort by language
  const byEndTimeByLanguage = Object.keys(byEndTime).reduce((acc, curr) => {
    acc[curr] = groupBy(byEndTime[curr], 'language');
    return acc;
  }, {});


  // insert dummy entry for languages not present in set of languages for a date
  dates.forEach((date) => {
    languages.forEach((language) => {
      if (!byEndTimeByLanguage[date].hasOwnProperty(language)) byEndTimeByLanguage[date][language] = [];
    });
  });

  const result = Object.entries(byEndTimeByLanguage).map(([name, series]) => ({name, series}));
  result.sort((a, b) => a.name > b.name);
  return result;
  /*
  // transform data per language
  return languages.reduce((acc, language) => {
    acc[language] = dates.map((date) => {
      return [toUnixTime(date), ...calculateStats(byEndTimeByLanguage[date][language])];
    });
    return acc;
  }, {});
  */
}

function toUnixTime(dateString) {
  return Math.floor(new Date(dateString).getTime() / 1000);
}

function calculateStats(texts) {
  const count = texts.length;
  const short = texts.filter((_) => _.wordCount < 3500).length;
  const long = count - short;
  return [count, short, long];
}

function groupBy(xs, key) {
  return xs.reduce(function (acc, curr) {
    (acc[curr[key]] = acc[curr[key]] || []).push(curr);
    return acc;
  }, {});
}

//using CoinGecko API (no autho required) - https://www.coingecko.com/api/documentations/v3#/simple/get_simple_price

// and using gnews API (API key required and is listed below) - https://gnews.io/docs/v3#introduction


const apiKey = 'a88838548fcd660454d9180836d8bd62'
const baseUrl = 'https://gnews.io/api/v3/search'
const coinUrl = 'https://api.coingecko.com/api/v3';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function toId(query) {
  return query.toLowerCase().trim().replace(/(\w+)/, '-');
}


function displayNews(responseJson) {
  // if there are previous results, remove them
 // console.log(responseJson);
  $('#results-list').empty();

  const articles = responseJson.articles;
  // iterate through the items array
  for (let i = 0; i < articles.length; i++){
    // for each news article object in the items 
    //array, add a list item to the results 
    $('#results-list').append(
      `<li><a href="${articles[i].url}" target="_blank"><h3 class="title">${articles[i].title}</a></h3>
      <p class="articleDes">${articles[i].description}</p>
      </li>`
    )};
  //display the results section  
  $("#results").removeClass("hidden");
}

function displayExchange(responseJson) {
  // clear previous results
  // console.log(Object.keys(responseJson));
  $('#exchange-list').empty();

  const id = responseJson;
   // appending info from coingecko API into the DOM
   $('#exchange-list').append(
      `<li><h3 class="cryptoTitle">${responseJson.name}</h3>
      <p class="exchange">Symbol: ${responseJson.symbol}</p>
      <p class="exchange">Market Cap Rank: ${responseJson.market_cap_rank}</p>
      <p class="exchange exchangeLast">Current Price: $ ${responseJson.market_data.current_price.usd}</p>
      </li>`
    );
    // display the results
   $("#results").removeClass("hidden");
}

function fetchAPI(url) {
  return fetch(url)
    .then(function(response) {
      if (response.ok) {
        return response.json();
      }
      throw Error(response.status);
    });
}

function getNewsArticle(query) {
  const params = {
    token: apiKey,
    q: query
  };

  const urlParams = formatQueryParams(params);
  const url = `${baseUrl}?&${urlParams}`;
  
  return fetchAPI(url);
}

function getExchangeInfo(coinId) {
  const urlCoin =  `${coinUrl}/coins/${coinId}`;
 // console.log(urlCoin)
  
  return fetchAPI(urlCoin);
 
}


function watchForm() {
  $('form').submit(event => {
    $('#exchange-list').empty();
    event.preventDefault();
    const searchTerm = $('#js-search-term').val().trim().toLowerCase();

   // console.log(searchTerm);

    $('#js-exchange-error').empty();

    getNewsArticle(searchTerm)
    .then(displayNews)
    .catch(err => {
     // console.log(err);
      $('#js-exchange-error').append(`<span>Couldn't fetch news about ${searchTerm}.</span>`);
    });

    getExchangeInfo(searchTerm)
      .then(displayExchange)
      .catch(err => {
      //  console.log(err);
        if (err.message == '404') {
          $('#js-exchange-error').append(`<span>There's no such coin: '${searchTerm}'. Please try again with a vaild cryptocurrency. A list can be found <a href="https://www.coingecko.com/en/coins/all" target="_blank">here</a>.</span>`);
        } else {
          $('#js-exchange-error').append(`<span>Couldn't fetch exchange info for '${searchTerm}'.</span>`);
        }
    });

  });
}

$(watchForm);




const axios = require('axios');
const apiKey = '9028e5e51618486d9169da005477883b';
const url = 'https://newsapi.org/v2/everything?q=경제&language=ko&sortBy=publishedAt&apiKey=' + apiKey;

console.log('Testing NewsAPI...');
axios.get(url)
    .then(res => {
        console.log('Status:', res.data.status);
        console.log('Total Results:', res.data.totalResults);
        console.log('Articles Count:', res.data.articles.length);
        if (res.data.articles.length > 0) {
            console.log('First Article Title:', res.data.articles[0].title);
        } else {
            console.log('No articles found.');
        }
    })
    .catch(err => {
        console.error('Error Occurred:');
        if (err.response) {
            console.error('Status:', err.response.status);
            console.error('Data:', JSON.stringify(err.response.data));
        } else {
            console.error(err.message);
        }
    });

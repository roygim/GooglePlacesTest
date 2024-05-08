const axios = require("axios")
const fs = require('fs')
const { config } = require("dotenv");

config()

const api_key = process.env.API_KEY
const query = 'Please return all pet shops in Holon, Israel. Distinct results only.'
const query2 = 'Please return all pet shops in Holon, Israel.'
const query3 = 'חנויות לחיות מחמד בחולון'
const query4 = 'Pet shops in Holon'
const query6 = 'מסעדות בתל אביב, ישראל'
const query7 = 'restaurants in Tel Aviv'

const getPlaces = async (pageToken = null) => {
    try {
        let params = {}

        params.key = api_key
        params.query = query7

        if (pageToken) {
            params.pagetoken = pageToken;
        }

        const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
            params: params
        });

        return response.data
    } catch (error) {
        console.error('Error fetching places:', error);
        throw error;
    }
}

const getAllPlaces = async () => {
    try {
        console.log('getAllPlaces start')

        let nextPageToken = null
        let allResults = []
        let pageNumber = 1
        let maxPageNumber = 10

        do {
            console.log(`page number: ${pageNumber}`);
            const responseData = await getPlaces(nextPageToken)
            allResults = allResults.concat(responseData.results)
            nextPageToken = responseData.next_page_token
            pageNumber++

            // console.log('nextPageToken', nextPageToken)

            // Pause execution for a few seconds as per Google's guidelines
            await new Promise(resolve => setTimeout(resolve, 2000));

        } while (nextPageToken && pageNumber <= maxPageNumber)

        // console.log(allResults)
        await writeToFile(allResults, 'places.json')

        console.log(`allResults total: ${allResults.length}`)
        console.log('getAllPlaces finish')
    } catch (error) {
        console.error('Error fetching places:', error);
        throw error;
    }
}

async function writeToFile(data, fileName) {
    try {
        await fs.promises.writeFile(fileName, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(err);
    }
}

getAllPlaces()
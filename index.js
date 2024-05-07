const axios = require("axios")
const fs = require('fs')

const getPlacesNew = async () => {
    try {
        const baseURL = 'https://places.googleapis.com/v1/places:searchText';

        const response = await axios.post(baseURL,
            {
                textQuery: 'כל החנויות בתל אביב, ישראל כולל אוכל'
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": "AIzaSyAxqcstSo-cQwGcpcUrZa0MxEZhmURJDFM",
                    "X-Goog-FieldMask": "places.displayName,places.formattedAddress"
                }
            });

        console.table(response.data.places)
    } catch (err) {
        console.log(err)
    }
}

// getPlacesNew()

const getPlaces = async (pageToken = null) => {
    try {
        const params = {
            query: 'כל החנויות בתל אביב, ישראל כולל אוכל',
            key: "AIzaSyAxqcstSo-cQwGcpcUrZa0MxEZhmURJDFM",
        }

        if (pageToken) {
            params.pageToken = pageToken;
        }

        const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
            params: params
        });

        return response.data
        // return response.data.next_page_token)
    } catch (error) {
        console.error('Error fetching places:', error);
        throw error;
    }
}

const getAllPlaces = async () => {
    try {
        let nextPageToken = null
        let allResults = []
        let pageNumber = 1
        let maxPageNumber = 3

        do {
            console.log(`page number: ${pageNumber}`);
            const responseData = await getPlaces(nextPageToken)
            allResults = allResults.concat(responseData.results)
            nextPageToken = responseData.next_page_token
            pageNumber++
            
            // Pause execution for a few seconds as per Google's guidelines
            await new Promise(resolve => setTimeout(resolve, 2000));

        } while (nextPageToken && pageNumber <= maxPageNumber)

        // console.log(allResults)
        writeToFile(allResults, 'places.json')
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
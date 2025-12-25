require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

const LOG_FILE = 'test_model_output.txt';

function log(msg) {
    console.log(msg);
    fs.appendFileSync(LOG_FILE, msg + '\n');
}

async function checkModelsViaRest() {
    fs.writeFileSync(LOG_FILE, '--- REST API TEST START ---\n');
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        log("No GEMINI_API_KEY found");
        return;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    log(`Requesting models from: ${url.replace(apiKey, 'HIDDEN_KEY')}`);

    try {
        const response = await axios.get(url);
        log("✅ API Request Success!");
        log(`Status: ${response.status}`);

        if (response.data && response.data.models) {
            log(`Found ${response.data.models.length} models.`);
            response.data.models.forEach(m => {
                log(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`);
            });
        } else {
            log("No models field in response.");
            log(JSON.stringify(response.data, null, 2));
        }

    } catch (error) {
        log("❌ API Request Failed");
        if (error.response) {
            log(`Status: ${error.response.status}`);
            log(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
        } else {
            log(`Error Message: ${error.message}`);
        }
    }
}

checkModelsViaRest();

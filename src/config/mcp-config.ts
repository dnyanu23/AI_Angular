export const MCP_CONFIG = {
    summarize: {
        tool: 'text-summary-service',
        parameters: { data: '' },
        url: 'http://localhost:3001/summarize'
    },
    translate: {
        tool: 'language-service',
        parameters: { data: '', targetLanguage: '', sourceLanguage: '' },
        url: 'http://localhost:3005/translate'
    },
    get_weather: {
        tool: 'weather-service',
        parameters: { city: '' },
        url: 'http://localhost:3005/weather'
    },
    search_airbnb: {
        tool: 'airbnb-service',
        parameters: { location: '', checkin: '', checkout: '' },
        url: 'http://localhost:3005/search'
    },
    send_mail: {
        tool: 'mail-service',
        parameters: { to: '', subject: '', body: '' },
        url: 'http://localhost:3005/send-mail'
    }

};

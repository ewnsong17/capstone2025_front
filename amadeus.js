import config from "./config";

const CLIENT_SECRET = "pkAkjKU7akOGVAl6";
export const getAmadeusAccessToken = async () => {
    try {
        const res = await fetch(`${config.api.base_url}/main/apiKey`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'amadeus' })
        });
        const data = await res.json();
        console.log("🧾 /main/apiKey 응답 확인:", data);
        if (!data.result || !data.api_key) throw new Error('API 키 요청 실패');

        // 아마데우스 API 토큰 요청
        const tokenRes = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `grant_type=client_credentials&client_id=${data.api_key}&client_secret=${CLIENT_SECRET}`
        });
        const tokenData = await tokenRes.json();
        return tokenData.access_token;
    } catch (err) {
        console.error("🔐 Amadeus 토큰 요청 실패", err);
        return null;
    }
};

export const searchFlights = async (origin, destination, departureDate, accessToken) => {
    const res = await fetch(`https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=1&max=5`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    return await res.json();
};

export const searchHotels = async (cityCode, checkIn, checkOut, accessToken) => {
    const res = await fetch(`https://test.api.amadeus.com/v2/shopping/hotel-offers?cityCode=${cityCode}&checkInDate=${checkIn}&checkOutDate=${checkOut}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    return await res.json();
};
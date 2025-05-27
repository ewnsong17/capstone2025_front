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

// amadeus.js

export async function searchHotels(cityCode, checkInDate, checkOutDate, token) {
    const hotelListUrl = `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=${cityCode}`;
    const headers = { Authorization: `Bearer ${token}` };

    try {
        console.log('📡 호텔 ID 요청 시작:', hotelListUrl);  // 추가

        const hotelListResponse = await fetch(hotelListUrl, { headers });
        const hotelListData = await hotelListResponse.json();

        console.log('📥 hotelListData:', hotelListData);  // 추가

        if (!hotelListData.data || hotelListData.data.length === 0) {
            console.warn('⚠️ 호텔 ID 응답 없음');
            return { data: [] };
        }

        const limitedHotelIds = hotelListData.data
            .filter(h => h.hotelId && typeof h.hotelId === 'string')
            .slice(0, 20)
            .map(h => h.hotelId)
            .join(',');

        if (!limitedHotelIds) {
            console.warn('❌ 유효한 hotelId가 없습니다.');
            return { data: [] };
        }

        const hotelOffersUrl = `https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=${limitedHotelIds}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&adults=1`;
        console.log('📡 호텔 Offer 요청 시작:', hotelOffersUrl);  // 추가

        const hotelOffersResponse = await fetch(hotelOffersUrl, { headers });
        const hotelOffersData = await hotelOffersResponse.json();

        console.log('✅ 호텔 Offer 응답:', hotelOffersData);  // 추가

        return hotelOffersData;
    } catch (error) {
        console.error('🔥 searchHotels 에러 발생:', error);
        return { data: [] };
    }
}

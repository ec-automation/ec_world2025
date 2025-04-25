const fetch = require('node-fetch');

async function getGeoInfoFromIP(ipAddress) {
  try {
    if (ipAddress.includes('127.0.0.1') || ipAddress.includes('::1')) {
      return { isLocal: true };
    }

    const response = await fetch(`https://ipwho.is/${ipAddress}`);
    const data = await response.json();

    if (!data.success || data.message === "Reserved range") {
      console.warn(`🌎 IP en rango reservado o no geolocalizable`);
      return {
        isLocal: false,
        reserved: true,
        country: "Desconocido",
        city: "Desconocido",
        region: "Desconocido"
      };
    }

    return {
      isLocal: false,
      reserved: false,
      country: data.country,
      city: data.city,
      region: data.region,
    };
  } catch (error) {
    console.error(`❌ Error en getGeoInfoFromIP:`, error);
    return { isLocal: false };
  }
}

module.exports = { getGeoInfoFromIP };

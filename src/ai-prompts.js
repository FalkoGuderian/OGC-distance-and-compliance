/**
 * AI Prompts for the Geospatial Analysis Application
 * This file contains all AI prompts used in the application for better maintainability
 */

/**
 * Prompt for extracting parameters from natural language instructions
 * @param {string} instruction - The user's natural language instruction
 * @param {string} availableLayers - Text describing available layers
 * @returns {string} The formatted prompt
 */
export function getParameterExtractionPrompt(instruction, availableLayers) {
    return `Sie sind ein Experte für GIS und OGC-Webdienste. Analysieren Sie die folgende Benutzeranweisung und extrahieren Sie die benötigten Parameter für eine WFS-Abfrage.

Verfügbare Layer:
${availableLayers}

Benutzeranweisung: "${instruction}"

Bitte analysieren Sie die Anweisung und antworten Sie ausschließlich mit einem gültigen JSON-Objekt in folgendem Format:
{
    "coordinates": [longitude, latitude],
    "maxSearchDistance": number_in_meters,
    "layerName": "technical_layer_name",
    "serverUrl": "server_url",
    "reasoning": "kurze_erklärung_der_extraktion"
}

Regeln:
- Extrahieren Sie Koordinaten aus GeoJSON Point-Objekten oder Lat/Lon-Angaben
- Konvertieren Sie Entfernungsangaben in Meter (km→m, etc.)
- Wählen Sie den passendsten Layer basierend auf der Anfrage
- Verwenden Sie die technischen Layer-Namen, nicht die Beschreibungen
- Für Naturschutzgebiete: "bfn_sch_Schutzgebiet:Naturschutzgebiete"
- Für Verwaltungsgebiete: "vg250:vg250_gem" (Gemeinden) oder entsprechend
- Server-URLs: "https://geodienste.bfn.de/ogc/wfs/schutzgebiet" für Schutzgebiete, "https://sgx.geodatenzentrum.de/wfs_vg250" für Verwaltungsgebiete

Antworten Sie nur mit dem JSON-Objekt, ohne zusätzlichen Text.`;
}

/**
 * Prompt for compliance checking
 * @param {string} complianceRule - The compliance rule to check against
 * @param {Object} summaryData - Summary of measurement data
 * @returns {string} The formatted prompt
 */
export function getComplianceCheckPrompt(complianceRule, summaryData) {
    return `Sie sind ein Experte für GIS-Compliance und räumliche Analysen. Bewerten Sie die folgenden Messergebnisse gegen die gegebene Prüfvorschrift.

PRÜFVORSCHRIFT:
"${complianceRule}"

MESSERGEBNISSE:
- Objektkoordinaten: ${summaryData.coordinates[1]}°N, ${summaryData.coordinates[0]}°E
- Geprüfter Layer-Typ: ${summaryData.layerType}
- Maximale Suchdistanz: ${summaryData.maxSearchDistance}m
- Gefundene Features gesamt: ${summaryData.totalFeaturesFound}
- Enthaltende Gebiete: ${summaryData.containingFeatures}
- Nahe Gebiete: ${summaryData.nearbyFeatures}
- Kürzeste Distanz: ${summaryData.closestDistance !== null ? summaryData.closestDistance.toFixed(2) + 'm' : 'N/A'}

FEATURE-DETAILS (erste 10):
${summaryData.featuresDetails.map(f =>
    `- ${f.name}: ${f.distance.toFixed(2)}m (${f.isContaining ? 'enthaltend' : 'nahe'})`
).join('\n')}

Bitte analysieren Sie diese Ergebnisse und antworten Sie ausschließlich mit einem gültigen JSON-Objekt in folgendem Format:
{
    "compliant": boolean,
    "status": "ERFÜLLT" | "VERLETZT" | "TEILWEISE_ERFÜLLT",
    "confidence": number_between_0_and_1,
    "reasoning": "detaillierte_begründung_der_bewertung",
    "recommendations": "empfehlungen_falls_nicht_compliant",
    "key_findings": ["wichtigste_erkenntnisse"]
}

Regeln für die Bewertung:
- "ERFÜLLT": Prüfvorschrift ist vollständig eingehalten
- "VERLETZT": Prüfvorschrift ist eindeutig verletzt
- "TEILWEISE_ERFÜLLT": Grenzfall oder teilweise erfüllt
- confidence: Wie sicher Sie sich bei der Bewertung sind (0.0-1.0)
- Berücksichtigen Sie sowohl enthaltende Gebiete (Abstand 0m) als auch nahe Gebiete
- Bei Schutzgebieten sind enthaltende Gebiete meist als vollständig compliant zu bewerten

Antworten Sie nur mit dem JSON-Objekt, ohne zusätzlichen Text.`;
}

/**
 * Default model configuration for AI requests
 */
export const AI_CONFIG = {
    model: 'x-ai/grok-4-fast',
    temperature: 0.1,
    maxTokens: {
        parameterExtraction: 500,
        complianceCheck: 800
    }
};

/**
 * API endpoint for AI requests
 */
export const AI_API_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

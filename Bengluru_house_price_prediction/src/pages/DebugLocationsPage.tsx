import { useState, useEffect } from "react";
import { getLocations, getCities } from "@/services/api";

export function DebugLocationsPage() {
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState("delhi");
  const [locations, setLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCitiesData = async () => {
      try {
        const data = await getCities();
        console.log("[DebugPage] Cities fetched:", data);
        setCities(data);
      } catch (err) {
        console.error("[DebugPage] Error fetching cities:", err);
      }
    };
    fetchCitiesData();
  }, []);

  const fetchLocations = async (city: string) => {
    setLoading(true);
    setError(null);
    console.log(`[DebugPage] ===== START FETCH =====`);
    console.log(`[DebugPage] City: ${city}`);
    console.log(`[DebugPage] Calling getLocations(${city})`);
    try {
      const locs = await getLocations(city);
      console.log(`[DebugPage] Received:`, locs);
      console.log(`[DebugPage] Type:`, typeof locs);
      console.log(`[DebugPage] Is array:`, Array.isArray(locs));
      console.log(`[DebugPage] Length:`, locs?.length || 0);
      
      if (!locs || locs.length === 0) {
        console.warn(`[DebugPage] WARNING: No locations returned!`);
        setError("No locations returned from API");
      }
      
      setLocations(locs);
      console.log(`[DebugPage] State updated with ${locs?.length || 0} locations`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error("[DebugPage] ERROR:", errorMsg);
      console.error("[DebugPage] Full error:", err);
      setError(errorMsg);
      setLocations([]);
    } finally {
      setLoading(false);
      console.log(`[DebugPage] ===== END FETCH =====`);
    }
  };

  useEffect(() => {
    fetchLocations(selectedCity);
  }, [selectedCity]);

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>🔧 Debug Locations Page</h1>
      
      <div style={{ marginBottom: "20px", padding: "10px", backgroundColor: "#f0f0f0" }}>
        <h2>Cities: {cities.length}</h2>
        <select 
          value={selectedCity} 
          onChange={(e) => setSelectedCity(e.target.value)}
          style={{ padding: "10px", fontSize: "16px" }}
        >
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "20px", padding: "10px", backgroundColor: "#f0f0f0" }}>
        <h2>Locations for {selectedCity}</h2>
        {loading && <p>⏳ Loading...</p>}
        {error && <p style={{ color: "red" }}>❌ Error: {error}</p>}
        {!loading && !error && (
          <>
            <p>Count: {locations.length}</p>
            <div style={{ 
              maxHeight: "400px", 
              overflowY: "auto",
              border: "1px solid #ccc",
              padding: "10px"
            }}>
              {locations.length === 0 ? (
                <p style={{ color: "orange" }}>⚠️ No locations found</p>
              ) : (
                <ul>
                  {locations.map((loc, idx) => (
                    <li key={idx}>{loc}</li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>

      <div style={{ 
        padding: "10px", 
        backgroundColor: "#e0e0e0",
        border: "1px solid #999",
        marginTop: "20px"
      }}>
        <h3>Console Output:</h3>
        <p>Open browser DevTools (F12) and check the Console tab for detailed logs</p>
        <p>Look for messages starting with [DebugPage], [API DEBUG], etc.</p>
      </div>
    </div>
  );
}

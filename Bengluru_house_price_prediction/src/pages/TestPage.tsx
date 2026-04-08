export default function TestPage() {
  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1 style={{ color: "#333" }}>✅ App is Rendering!</h1>
      <p style={{ color: "#666", fontSize: "16px" }}>
        If you see this, React and routing are working.
      </p>
      <div style={{ marginTop: "20px", padding: "20px", backgroundColor: "#f0f0f0", borderRadius: "8px" }}>
        <p><strong>Test Info:</strong></p>
        <ul style={{ lineHeight: "1.8" }}>
          <li>Timestamp: {new Date().toISOString()}</li>
          <li>Current Path: {window.location.pathname}</li>
          <li>Node Env: {import.meta.env.MODE}</li>
        </ul>
      </div>
      <div style={{ marginTop: "20px" }}>
        <a 
          href="/" 
          style={{ 
            padding: "10px 20px", 
            backgroundColor: "#0066cc", 
            color: "white", 
            textDecoration: "none", 
            borderRadius: "4px",
            display: "inline-block"
          }}
        >
          Go to Home
        </a>
      </div>
    </div>
  );
}

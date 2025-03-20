use serde_json::Value;

#[tauri::command]
async fn get_balance(address: String) -> Result<f64, String> {
    let client = reqwest::Client::new();

    // Constructing JSON request according to JSON-RPC specification
    let payload = serde_json::json!({
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getBalance",
        "params": [address]
    });

    // Sending a POST request to the RPC endpoint
    let res = client
        .post("https://api.mainnet-beta.solana.com")
        .json(&payload)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let json: Value = res.json().await.map_err(|e| e.to_string())?;

    let lamports = json["result"]["value"]
        .as_u64()
        .ok_or("Failed to get balance")?;

    // Convert lamports to SOL (1 SOL = 1e9 lamports)
    let sol = lamports as f64 / 1e9;

    Ok(sol)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_balance])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

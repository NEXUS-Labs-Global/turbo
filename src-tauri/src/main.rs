// Hides the extra console window on Windows in release builds.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_process::init())
        .setup(|app| {
            // A problem with the updater must never stop the app from starting.
            if let Err(error) = app.handle().plugin(tauri_plugin_updater::Builder::new().build()) {
                eprintln!("updater could not start: {error}");
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running TURBO");
}

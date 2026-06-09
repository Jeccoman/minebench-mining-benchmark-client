// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    // Fix WebKitWebProcess crash in AppImage on Linux:
    // Compositing and DMA-BUF renderer fail in sandboxed/containerized environments;
    // falling back to software rendering avoids the crash without disabling the sandbox.
    #[cfg(target_os = "linux")]
    {
        std::env::set_var("WEBKIT_DISABLE_COMPOSITING_MODE", "1");
        std::env::set_var("WEBKIT_DISABLE_DMABUF_RENDERER", "1");
        // Force X11 backend to avoid Wayland/DMABuf abort on AMD GPUs (Ubuntu 26.04+)
        if std::env::var("GDK_BACKEND").is_err() {
            std::env::set_var("GDK_BACKEND", "x11");
        }
    }
    app_lib::run();
}

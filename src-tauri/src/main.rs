// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[cfg(target_os = "linux")]
fn configure_linux_webkit_environment() {
    // Fix WebKitWebProcess crash in AppImage on Linux:
    // Compositing and DMA-BUF renderer fail in sandboxed/containerized environments;
    // falling back to software rendering avoids the crash without disabling the sandbox.
    std::env::set_var("WEBKIT_DISABLE_COMPOSITING_MODE", "1");
    std::env::set_var("WEBKIT_DISABLE_DMABUF_RENDERER", "1");

    // Prefer native Wayland when available while keeping X11 as GTK's fallback.
    if std::env::var("GDK_BACKEND").is_err() {
        std::env::set_var("GDK_BACKEND", "wayland,x11");
    }
}

fn main() {
    #[cfg(target_os = "linux")]
    configure_linux_webkit_environment();

    app_lib::run();
}

#[cfg(all(test, target_os = "linux"))]
mod tests {
    use super::*;
    use std::sync::Mutex;

    static ENV_LOCK: Mutex<()> = Mutex::new(());

    #[test]
    fn linux_webkit_environment_prefers_wayland_with_x11_fallback() {
        let _guard = ENV_LOCK.lock().unwrap();
        std::env::remove_var("GDK_BACKEND");

        configure_linux_webkit_environment();

        assert_eq!(std::env::var("WEBKIT_DISABLE_COMPOSITING_MODE").as_deref(), Ok("1"));
        assert_eq!(std::env::var("WEBKIT_DISABLE_DMABUF_RENDERER").as_deref(), Ok("1"));
        assert_eq!(std::env::var("GDK_BACKEND").as_deref(), Ok("wayland,x11"));
    }

    #[test]
    fn linux_webkit_environment_preserves_explicit_gdk_backend() {
        let _guard = ENV_LOCK.lock().unwrap();
        std::env::set_var("GDK_BACKEND", "x11");

        configure_linux_webkit_environment();

        assert_eq!(std::env::var("GDK_BACKEND").as_deref(), Ok("x11"));
    }
}

# Clear Linux Build Artifacts

Use this when Linux/AppImage builds fail because the `D:` drive is out of disk space.

Run from WSL:

```bash
cd /mnt/d/Projects/MineBench_dApp/MineBench-Client

# Remove generated frontend output, local build output, and Linux/Tauri build bundles.
# This does not remove source code, package manifests, or miner binaries.
rm -rf \
  web-dist \
  dist \
  build \
  src-tauri/target/debug \
  src-tauri/target/release \
  src-tauri/target/x86_64-unknown-linux-gnu/release/bundle \
  src-tauri/target/x86_64-unknown-linux-gnu/debug \
  src-tauri/target/x86_64-unknown-linux-gnu/release
```

Check available space afterward:

```bash
df -h /mnt/d
```

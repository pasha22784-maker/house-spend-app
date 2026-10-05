# -*- coding: utf-8 -*-
"""
publish_app_updates.py
----------------------
One-command publisher for House Spend App:
1. Increments OTA version in version.json.
2. Syncs assets to Android project directory.
3. Commits and pushes changes to GitHub Pages CDN.
Result: All installed Android apps automatically receive new updates on launch!
"""
import os
import sys
import shutil
import subprocess
import time
import json

ROOT = r"C:\Users\pasha\Documents\House spend app"
ANDROID_ASSETS = r"C:\Users\pasha\Documents\house_spend_android\android\app\src\main\assets"

sys.stdout.reconfigure(encoding='utf-8')
print("==================================================")
print("     House Spend App - Live OTA Publisher        ")
print("==================================================")

# 1. Update version.json
print("\n[1/3] Updating OTA version.json...")
version_code = int(time.time())
timestamp_str = time.strftime("%Y-%m-%d %H:%M:%S")

ver_data = {
    "version": version_code,
    "versionName": "1.1." + time.strftime("%m%d"),
    "lastUpdated": timestamp_str,
    "files": [
        "index.html",
        "initial_data.js"
    ],
    "note": "OTA Live Update"
}

ver_path = os.path.join(ROOT, "version.json")
with open(ver_path, "w", encoding="utf-8") as f:
    json.dump(ver_data, f, indent=2)

print(f"  ✓ version.json updated -> Version Code: {version_code} ({timestamp_str})")

# 2. Sync to Android project assets
print("\n[2/3] Syncing files to Android project assets...")
if os.path.exists(ANDROID_ASSETS):
    for f in ["index.html", "initial_data.js", "manifest.json", "icon-192.png", "icon-512.png"]:
        src = os.path.join(ROOT, f)
        if os.path.exists(src):
            shutil.copy2(src, os.path.join(ANDROID_ASSETS, f))
    print("  ✓ Android assets synchronized.")
else:
    print("  ! Android assets folder not found, skipping local copy.")

# 3. Commit and push to GitHub
print("\n[3/3] Pushing changes to GitHub Pages CDN...")
commands = [
    ["git", "config", "user.name", "Nadeem Pasha"],
    ["git", "config", "user.email", "pasha22784@gmail.com"],
    ["git", "add", "."],
    ["git", "commit", "-m", f"OTA App Update: {timestamp_str} (v{version_code})"],
    ["git", "push", "origin", "main"]
]

for cmd in commands:
    res = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True)
    if res.returncode != 0 and "nothing to commit" not in res.stdout + res.stderr:
        print(f"Warning on '{' '.join(cmd)}':", res.stderr or res.stdout)

print("\n==================================================")
print("  SUCCESS! New update published.")
print("==================================================")
print("  Web Version: https://pasha22784-maker.github.io/house-spend-app/")
print("  OTA Status: Active! Sabhi install shuda phones par")
print("  app khulte hi naya update khud-ba-khud lagoo ho jayega.")
print("==================================================")

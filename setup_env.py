"""
Distributes a root-level .env file into the correct sub-folder .env files.
Run:  python setup_env.py
"""
import os
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
root_env = os.path.join(ROOT, ".env")

if not os.path.exists(root_env):
    print("[INFO] No root .env file found — sub-folder .env files will be used as-is.")
    sys.exit(0)

env_vars = {}
with open(root_env, encoding="utf-8") as f:
    for raw in f:
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        if "=" in line:
            k, v = line.split("=", 1)
            env_vars[k.strip()] = v.strip()

backend_vars = {k: v for k, v in env_vars.items()
                if not k.startswith("NEXT_PUBLIC_") and not k.startswith("EXPO_PUBLIC_")}

frontend_vars = {k: v for k, v in env_vars.items()
                 if k.startswith("NEXT_PUBLIC_") or k == "BACKEND_URL"}

mobile_vars = {k: v for k, v in env_vars.items()
               if k.startswith("EXPO_PUBLIC_")}

def write_env(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        for k, v in data.items():
            f.write(f"{k}={v}\n")
    print(f"  [OK] Written: {path}  ({len(data)} vars)")

write_env(os.path.join(ROOT, "Backend", ".env"), backend_vars)
write_env(os.path.join(ROOT, "frontend", ".env.local"), frontend_vars)
write_env(os.path.join(ROOT, "mobile", ".env"), mobile_vars)

print("[OK] Environment distributed from root .env to all sub-folders.")

import sys
import os
from dotenv import load_dotenv

def check_imports():
    deps = [
        "fastapi",
        "sqlmodel",
        "chromadb",
        "redis",
        "google.generativeai",
        "dotenv",
        "httpx"
    ]
    print("--- O ai Backend Diagnostic ---")
    print(f"Python Version: {sys.version}")
    print(f"Working Directory: {os.getcwd()}")
    
    import importlib
    for dep in deps:
        try:
            importlib.import_module(dep.split(".")[0] if "." in dep else dep)
            print(f"✅ {dep} is correctly installed.")
        except ImportError:
            print(f"❌ {dep} is MISSING.")
            missing.append(dep)
    
    if not missing:
        print("\nSUCCESS: All core dependencies are available.")
        # Check API Key
        load_dotenv()
        if os.getenv("GOOGLE_API_KEY"):
            print("✅ GOOGLE_API_KEY is set.")
        else:
            print("❌ GOOGLE_API_KEY is MISSING.")
            
        # Asset checks
        assets = [
            "/Users/jianyufang/Documents/1/frontend/public/assets/logo.png",
            "/Users/jianyufang/Documents/1/frontend/public/assets/showcase/1.png"
        ]
        for asset in assets:
            if os.path.exists(asset):
                print(f"✅ Asset found: {os.path.basename(asset)}")
            else:
                print(f"❌ Asset MISSING: {os.path.basename(asset)}")
    else:
        print(f"\nFAILURE: Missing {len(missing)} dependencies.")

if __name__ == "__main__":
    check_imports()

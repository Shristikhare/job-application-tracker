#!/usr/bin/env python3
"""
Deployment Helper Script

Generates secure secrets and provides deployment checklist.
"""

import secrets
import json
from datetime import datetime


def generate_secret_key(length=32):
    """Generate a secure random secret key."""
    return secrets.token_hex(length)


def generate_deployment_checklist():
    """Generate a deployment checklist."""
    checklist = {
        "generated_at": datetime.now().isoformat(),
        "frontend_checklist": {
            "repository_pushed": False,
            "vercel_account_created": False,
            "github_connected_to_vercel": False,
            "environment_variables_set": {
                "VITE_API_BASE": "https://job-tracker-api.onrender.com/api"
            },
            "deployment_successful": False,
            "production_url_tested": False,
        },
        "backend_checklist": {
            "repository_pushed": False,
            "render_account_created": False,
            "postgresql_database_created": False,
            "environment_variables_set": {
                "DATABASE_URL": "postgresql://...",
                "SECRET_KEY": "<generated-secret-below>",
                "CORS_ORIGINS": "https://yourfrontend.vercel.app",
                "ENVIRONMENT": "production",
            },
            "deployment_successful": False,
            "health_endpoint_tested": False,
        },
        "database_checklist": {
            "postgresql_created_on_render": False,
            "database_url_saved": False,
            "tables_created": False,
            "backups_enabled": False,
        },
        "security_checklist": {
            "secret_key_is_random": False,
            "database_password_is_strong": False,
            "cors_origins_correct": False,
            "https_enabled": False,
            "environment_is_production": False,
        },
    }
    return checklist


def main():
    print("=" * 60)
    print("Job Application Tracker - Deployment Helper")
    print("=" * 60)
    print()

    # Generate secret key
    print("🔐 Generating SECRET_KEY for backend...")
    secret_key = generate_secret_key()
    print(f"   SECRET_KEY={secret_key}")
    print()

    # Generate deployment checklist
    print("📋 Generating deployment checklist...")
    checklist = generate_deployment_checklist()

    # Save to file
    with open("DEPLOYMENT_CHECKLIST.json", "w") as f:
        json.dump(checklist, f, indent=2)

    print("   ✓ Saved to DEPLOYMENT_CHECKLIST.json")
    print()

    # Print summary
    print("📝 Deployment Summary")
    print("-" * 60)
    print()
    print("1. Frontend (Vercel):")
    print("   - Push code to GitHub")
    print("   - Go to vercel.com and connect your repository")
    print("   - Set VITE_API_BASE to your backend URL")
    print()
    print("2. Backend (Render):")
    print("   - Create PostgreSQL database on Render")
    print("   - Deploy web service from GitHub")
    print("   - Set the following environment variables:")
    print(f"     - SECRET_KEY: {secret_key}")
    print("     - DATABASE_URL: <from-your-postgresql-database>")
    print("     - CORS_ORIGINS: <your-vercel-domain>")
    print()
    print("3. Verify:")
    print("   - Test frontend at https://yourapp.vercel.app")
    print("   - Test API at https://yourapi.onrender.com/health")
    print("   - Verify login/registration works")
    print()
    print("=" * 60)
    print()
    print("⚠️  IMPORTANT SECURITY NOTES:")
    print("   - Never commit .env files with real secrets")
    print("   - Always use strong, random SECRET_KEY values")
    print("   - Keep DATABASE_URL secret")
    print("   - Enable HTTPS (automatic on both platforms)")
    print()


if __name__ == "__main__":
    main()

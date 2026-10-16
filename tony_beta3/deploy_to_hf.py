"""Deploy Tony Beta 3 to Hugging Face Space: Vighneshkumbhar/Tony_Beta3"""

import sys
from huggingface_hub import HfApi

def deploy():
    repo_id = "Vighneshkumbhar/Tony_Beta3"
    print(f"Deploying Tony Beta 3 to Hugging Face Space: {repo_id}...")
    api = HfApi()

    # Upload folder excluding cache and local environment files
    api.upload_folder(
        folder_path=".",
        repo_id=repo_id,
        repo_type="space",
        ignore_patterns=[
            "__pycache__/**",
            "*/__pycache__/**",
            ".pytest_cache/**",
            "*.pyc",
            ".env",
            ".git/**",
            "deploy_to_hf.py",
        ],
        commit_message="Deploy Tony Beta 3 Gradio Assistant to Hugging Face Space",
    )
    print(f"Successfully deployed to https://huggingface.co/spaces/{repo_id}")

if __name__ == "__main__":
    deploy()

import os
import sys
import json
import time
from datetime import date


article_basedir = "articles_src"

folder_name = input("folder name: ")
article_title = input("article title: ")

project_dir = os.path.join(article_basedir, folder_name) 
os.mkdir(project_dir)

project_meta = {
	'title': article_title,
	'date': date.today(),
}

project_content = "Hello world, this is a template for actual writing."

with open(os.path.join(project_dir, "meta.json"), "w") as f:
	json.dump(project_meta, f, default=str)
with open(os.path.join(project_dir, "content.html"), "w") as f:
	f.write(project_content)

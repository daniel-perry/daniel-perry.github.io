import os
import sys
import json

main_template = "index.html.template"
main_html = "index.html"
article_template = "articles/index.html.template"
article_src_dir = "articles_src"
article_target_dir = "articles"


articles = []
for d in os.listdir(article_src_dir):
	d_path = os.path.join(article_src_dir, d)
	if os.path.isdir(d_path):
		article = json.load(open(os.path.join(d_path, "meta.json"), "r"))
		article["content"] = open(os.path.join(d_path, "content.html"), "r").read()
		articles.append(article)

articles = sorted(articles, key=lambda x: x["date"])

main_article = articles[-1]
prev_link = f"<a href='articles/{len(articles)-2}.html'>previous</a>"
heading_text = f"<h2>{main_article['title']}</h2><br/><h4>{main_article['date']}</h4>"
main_html_content = open(main_template, "r").read().replace("<!-- ARTICLE_HEADING -->", heading_text).replace("<!-- ARTICLE_NAVIGATION -->", prev_link).replace("<!-- ARTICLE_CONTENT -->", main_article["content"])

with open(main_html, "w") as f:
	f.write(main_html_content)

for i, article in enumerate(articles[:-1]):
	article_html = f"articles/{i}.html"
	if i > 0:
		prev_link = f"<a href='{i-1}.html'>previous</a>"
	else:
		prev_link = ""
	if i == len(articles)-2:
		next_link = f"<a href='../index.html'>next</a>"
	else:
		next_link = f"<a href='{i+1}.html'>next</a>"
	nav_link = f"{prev_link}  {next_link}"
	heading_text = f"<h2>{article['title']}</h2><br/><h4>{article['date']}</h4>"
	article_html_content = open(article_template, "r").read().replace("<!-- ARTICLE_HEADING -->", heading_text).replace("<!-- ARTICLE_NAVIGATION -->", nav_link).replace("<!-- ARTICLE_CONTENT -->", article["content"])
	with open(article_html, "w") as f:
		f.write(article_html_content)
	

import requests
import bs4
from typing import List
import os
import json

BASE_URL = "https://scirenplans.com"
ALABAMA_HOME = f"{BASE_URL}/doku.php?id=alabama:start"

def slashes_to_dashes(text: str) -> str:
    return text.replace("/", "-")

def get_html(url):
    uri_dashes = slashes_to_dashes(url)
    local_page_location = f"./cache/{uri_dashes}"
    if not os.path.exists(local_page_location):
        print(f"Fetching HTML from {url}")
        req = requests.get(url)
        req.raise_for_status()
        with open(local_page_location, "w") as f:
            f.write(req.text)
    
    with open(local_page_location) as f:
        return f.read()
    

def get_page(html_page: str):
    soup = bs4.BeautifulSoup(html_page, features="html.parser")
    temp = soup.find(class_="page")
    return temp

def get_all_lesson_plan_urls() -> List[str]:
    html_page = get_html(ALABAMA_HOME)

    page = get_page(html_page)
    lesson_plan_anchors = page.find_all("a")

    return [link["href"] for link in lesson_plan_anchors]

def get_all_h3s(lesson_plan_links):
    lesson_plan_info = {}

    for lesson_plan_link in lesson_plan_links:
        html_page = get_html(f"{BASE_URL}{lesson_plan_link}")
        page =get_page(html_page)

        title = page.find("h2").text
        h3s = page.find_all("h3")
        headings_text = [h3.text for h3 in h3s]
        lesson_plan_info[title] = headings_text 

def get_author_information_from_para(para: bs4.Tag):
    categories = {}
    titles = para.find_all("strong")

    text: str = para.text.strip().strip("*")
    for title in titles:
        key = title.text
        end_of_key = text.find(key) + len(key) + 1
        next_star = text.find("*") 
        if next_star == -1:
            next_star = len(text)

        value = text[end_of_key:next_star].strip()
        text = text[next_star:].strip("*")
        categories[key.strip(":")] = value
    return categories



def get_author_information(author_information_content: bs4.Tag) -> dict:
    author_information = {}
    paras = author_information_content.find_all("p")

    for para in paras:
        categories = get_author_information_from_para(para)
        author_information.update(categories)
    
    return author_information

def get_categories(categories_content: bs4.Tag) -> dict:
    categories = {}
    list_elements = categories_content.find_all(class_ = "li")

    for list_element in list_elements:
        title = list_element.find("strong")
        text = list_element.text
        if title:
            key = title.text
            end_of_key = text.find(key) + len(key) + 1
            value = text[end_of_key:].strip()
            categories[key.strip(":")] = value            
        else:
            categories[list(categories.keys())[-1]] += text
    return categories

def get_abstract(abstract_content: bs4.Tag):
    abstract_paras = abstract_content.find_all("p")
    abstract_text = ""
    for para in abstract_paras:
        if not para.find("a"):
            abstract_text += para.text

    return abstract_text

def get_media_links(page: bs4.Tag):
    media = page.find_all("a", class_ = "media")
    # TODO: Add prefix to media links
    media_links = []
    for tag in media:
        media_links.append({
            "text": tag.text,
            "href": f"{BASE_URL}{tag['href']}"
        })
    return media_links

def get_external_links(page: bs4.Tag):
    links: List[dict] = []
    link_tag_list = page.find_all("a", href=True)
    for link_tag in link_tag_list:
        href = link_tag["href"]
        if "http" in href:
            links.append({
                "text": link_tag.text,
                "href": href    
            })
    return links

def clean_data(lesson_plans: dict):
    for lesson_plan in lesson_plans:
        if "Affiliations" in lesson_plan["author_information"].keys():
            lesson_plan["author_information"]["Position"] = lesson_plan["author_information"]["Affiliations"]
            del lesson_plan["author_information"]["Affiliations"]
        if "Freshwater mussel biodiversity" in lesson_plan["title"]:
            lesson_plan["author_information"]["Year contributed"] = "2021"
    return lesson_plans
        

lesson_plan_links = set(get_all_lesson_plan_urls())
lesson_plans = []
for lesson_plan_link in lesson_plan_links:
        html_page = get_html(f"{BASE_URL}{lesson_plan_link}")
        page = get_page(html_page)

        title = page.find("h2").text
        author_information = page.find(id="author_information")
        categories = page.find(id="categories")
        abstract = page.find(id="abstract")


        author_information = get_author_information(author_information.findNext(class_="level3"))
        
        categories = get_categories(categories.findNext(class_="level3"))
        
        abstract_content_tag = abstract.findNext(class_="level3")
        if not abstract_content_tag:
            abstract_content_tag = abstract.findNext(class_="level4")
        abstract = get_abstract(abstract_content_tag)

        external_links = get_external_links(page)
        media_links = get_media_links(page)

        lesson_plans.append({
            "title": title,
            "author_information": author_information,
            "categories": categories,
            "abstract": abstract,
            "external_links": external_links,
            "media_links": media_links
        })

lesson_plans = clean_data(lesson_plans)
with open("results.json", "w") as f:
    f.write(json.dumps(lesson_plans, indent=2))





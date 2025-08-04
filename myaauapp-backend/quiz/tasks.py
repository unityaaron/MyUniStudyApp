# quiz/tasks.py

import requests
from bs4 import BeautifulSoup
from background_task import background
from .models import JobPost, ScholarshipPost 
from datetime import datetime

@background(schedule=20)  # delay before first run (in seconds)
def scrape_all_opportunities():
    scrape_dixcoverhub_jobs()
    scrape_jobsregion_jobs()
    scrape_deroundtable_jobs()
    print("Job scraping finished.")

#For scholarships
    print("Starting scholarship scraping...")
    scrape_smartyacad_scholarships()
    print("Scholarship scraping finished.")

    
    


def scrape_dixcoverhub_jobs():
    url = 'https://dixcoverhub.jobuj.com/category/jobs/'
    source = 'Dixcoverhub'

    try:
        res = requests.get(url)
        soup = BeautifulSoup(res.content, 'html.parser')
        job_items = soup.find_all('article', class_='elementor-post')

        for item in job_items:
            title_tag = item.find('h3', class_='elementor-post__title')
            link_tag = title_tag.find('a') if title_tag else None
            link = link_tag['href'] if link_tag else None
            title = link_tag.get_text(strip=True) if link_tag else 'No title'

            summary_tag = item.find('div', class_='elementor-post__excerpt')
            summary = summary_tag.get_text(strip=True) if summary_tag else 'No summary'

            date_tag = item.find('span', class_='elementor-post-date')
            date_posted = date_tag.get_text(strip=True) if date_tag else 'Unknown date'

            image_tag = item.find('img')
            image = image_tag['src'] if image_tag else ''

            if link:
                JobPost.objects.update_or_create(
                    link=link,
                    defaults={
                        'title': title,
                        'summary': summary,
                        'date_posted': date_posted,
                        'image_url': image,
                        'source': source
                    }
                )

    except Exception as e:
        print(f"[ERROR] Dixcoverhub scraping failed: {e}")


def scrape_jobsregion_jobs():
    url = 'https://www.jobsregion.com/category/job/'
    source = 'JobsRegion'

    try:
        res = requests.get(url)
        soup = BeautifulSoup(res.content, 'html.parser')
        job_items = soup.find_all('div', class_='td-module-thumb')

        for item in job_items:
            a_tag = item.find('a', href=True, title=True)
            link = a_tag['href'] if a_tag else None
            title = a_tag['title'] if a_tag else 'No title'

            image = ''
            span_tag = a_tag.find('span', class_='entry-thumb')
            image = span_tag['data-img-url'] if span_tag and span_tag.has_attr('data-img-url') else ''

            summary, date_posted = 'No summary', 'Unknown date'
            if link:
                post_res = requests.get(link)
                post_soup = BeautifulSoup(post_res.content, 'html.parser')

                date_tag = post_soup.find('time', class_='entry-date')
                date_posted = date_tag.get_text(strip=True) if date_tag else 'Unknown date'

                summary_div = post_soup.find('div', class_='td-post-content')
                summary = summary_div.get_text(strip=True)[:300] if summary_div else 'No summary'

            if link:
                JobPost.objects.update_or_create(
                    link=link,
                    defaults={
                        'title': title,
                        'summary': summary,
                        'date_posted': date_posted,
                        'image_url': image,
                        'source': source
                    }
                )

    except Exception as e:
        print(f"[ERROR] JobsRegion scraping failed: {e}")


def scrape_deroundtable_jobs():
    url = 'https://deroundtable.com/category/jobs-vacancies/'
    source = 'DeRoundTable'

    try:
        res = requests.get(url)
        soup = BeautifulSoup(res.content, 'html.parser')
        job_items = soup.find_all('article')

        for item in job_items:
            h2 = item.find('h2', class_='entry-title')
            link_tag = h2.find('a') if h2 else None
            link = link_tag['href'] if link_tag else None
            title = link_tag.get_text(strip=True) if link_tag else 'No title'

            summary_div = item.find('div', class_='entry-excerpt')
            summary = summary_div.get_text(strip=True) if summary_div else 'No summary'

            date_tag = item.find('li', class_='meta-date')
            date_posted = date_tag.get_text(strip=True) if date_tag else 'Unknown date'

            image = ''  # no clear image in listing

            if link:
                JobPost.objects.update_or_create(
                    link=link,
                    defaults={
                        'title': title,
                        'summary': summary,
                        'date_posted': date_posted,
                        'image_url': image,
                        'source': source
                    }
                )

    except Exception as e:
        print(f"[ERROR] DeRoundTable scraping failed: {e}")





def scrape_smartyacad_scholarships():
    url = "https://jobs.smartyacad.com/category/scholarship/"
    source = "SmartyAcad"

    try:
        res = requests.get(url, timeout=8)
        soup = BeautifulSoup(res.text, "html.parser")

        print(f"DEBUG: Attempting to scrape {url}. Response status: {res.status_code}")

        # *** UPDATED: Main container for each post is now <div class="elementor-post__card"> ***
        scholarship_items = soup.find_all('div', class_='elementor-post__card')

        print(f"DEBUG: Found {len(scholarship_items)} scholarship articles with class 'elementor-post__card'.")

        if not scholarship_items:
            print("DEBUG: No scholarship items found with <div class='elementor-post__card'>. Check selector or website HTML.")

        for i, item in enumerate(scholarship_items):
            print(f"DEBUG: Processing item {i+1}...")

            # *** UPDATED: Title is now <h3 class="elementor-post__title"> with <a> inside ***
            title_h3 = item.find('h3', class_='elementor-post__title')
            link_tag = title_h3.find('a') if title_h3 else None

            link = link_tag['href'].strip() if link_tag and 'href' in link_tag.attrs else None
            title = link_tag.get_text(strip=True) if link_tag else 'No title'

            print(f"DEBUG:   Title: '{title}', Link: '{link}'")

            # *** UPDATED: Date is now <span class="elementor-post-date"> inside a div ***
            date_span = item.find('span', class_='elementor-post-date')
            date_posted = date_span.get_text(strip=True) if date_span else 'Unknown date'
            print(f"DEBUG:   Date Posted: '{date_posted}'")


            # *** UPDATED: Image is <img> nested within the card ***
            image_tag = item.find('img') # Just look for any img within the card
            image_url = image_tag['src'].strip() if image_tag and 'src' in image_tag.attrs else ''
            print(f"DEBUG:   Image URL: '{image_url}'")


            summary = 'No summary provided in listing' # Confirmed this is still not on listing page

            if link: # Only save if we have a valid link
                ScholarshipPost.objects.update_or_create(
                    link=link,
                    defaults={
                        'title': title,
                        'summary': summary,
                        'date_posted': date_posted,
                        'image_url': image_url,
                        'source': source
                    }
                )
                print(f"DEBUG:   Scholarship '{title}' (Link: {link}) processed for DB.")
            else:
                print(f"DEBUG:   Skipping scholarship item due to missing link. Title found: '{title}'")

        print(f"Successfully scraped SmartyAcad scholarships.")
    except Exception as e:
        print(f"[ERROR] SmartyAcad scholarship scraping failed: {e}")

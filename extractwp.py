import os
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup

# Path to your XML file and output folder
xml_file = 'myndworkz.wordpress.2024-10-16.000.xml'
output_folder = 'static_site'

# Ensure output directory exists
if not os.path.exists(output_folder):
    os.makedirs(output_folder)

# Basic HTML template for each page
html_template = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>{title}</h1>
    </header>
    <main>
        {content}
    </main>
    <footer>
        <p>Generated from WordPress XML</p>
    </footer>
</body>
</html>
"""

# List to store all posts for the index page
index_entries = []

# Parse the XML file
tree = ET.parse(xml_file)
root = tree.getroot()

# Define the XML namespaces (WordPress export files usually have namespaces)
namespaces = {
    'wp': 'http://wordpress.org/export/1.2/',
    'content': 'http://purl.org/rss/1.0/modules/content/',
    'dc': 'http://purl.org/dc/elements/1.1/'
}

# Process each item in the XML file (each post/page is an 'item')
for item in root.findall('channel/item'):
    title = item.find('title').text or "Untitled"
    content = item.find('content:encoded', namespaces).text or ""
    post_name = item.find('wp:post_name', namespaces).text or title.lower().replace(" ", "_")
    
    # Clean and format content with BeautifulSoup
    soup = BeautifulSoup(content, 'html.parser')
    formatted_content = soup.prettify()

    # Create the HTML content for each post using the template
    html_content = html_template.format(title=title, content=formatted_content)

    # Save each post as an HTML file
    filename = f"{post_name}.html"
    with open(os.path.join(output_folder, filename), "w", encoding="utf-8") as file:
        file.write(html_content)
    
    # Add the entry to the index list
    index_entries.append((title, filename))

    print(f"Generated {filename}")

# Create the index.html content
index_html = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Index of Posts</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>Index of Posts</h1>
    </header>
    <main>
        <ul>
"""

# Add each post link to the index.html file
for title, filename in index_entries:
    index_html += f'            <li><a href="{filename}">{title}</a></li>\n'

# Close the HTML tags for index.html
index_html += """
        </ul>
    </main>
    <footer>
        <p>Generated index of posts</p>
    </footer>
</body>
</html>
"""

# Save the index.html file
with open(os.path.join(output_folder, "index.html"), "w", encoding="utf-8") as index_file:
    index_file.write(index_html)

print("Generated index.html with links to all posts.")

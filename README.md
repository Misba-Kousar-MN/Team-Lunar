# E-Commerce Link Sanitizer & Product Tracker

A clean, reliable utility designed to parse, clean, and standardize e-commerce product links from Amazon and Flipkart. This project eliminates tracking parameters, extra subdirectories, and vanity slugs, converting noisy URLs into clean, canonical links optimal for databases, price tracking, or web scraping inputs.

## Verified Target Links

The project handles the following raw and canonical structural formats across different regions:

### Amazon Marketplaces

* **Amazon India (Standard DP)**
  https://www.amazon.in/dp/B09XYZ1234

* **Amazon India (Vanity Slugs)**
  https://www.amazon.in/anything-you-want

* **Amazon India (Naked Subdomain)**
  https://amazon.in/dp/B00000000

* **Amazon US Storefront**
  https://www.amazon.com/dp/B08N5WRWNW

* **Amazon UK Storefront**
  https://www.amazon.co.uk/dp/B09ABC123

### Flipkart Marketplaces

* **Flipkart Product Pages**
  https://www.flipkart.com/apple-iphone-15/p/itm6f582cb512f00

* **Flipkart Vanity Slugs**
  https://flipkart.com/some-product

---

## Core Link Matrix

The following reference table maps incoming variants directly to their platform identifiers and cleaned destination paths:

| Platform | Clean Target Link | Identified Asset |
| :--- | :--- | :--- |
| **Amazon IN** | https://www.amazon.in/dp/B09XYZ1234 | `B09XYZ1234` |
| **Amazon IN** | https://www.amazon.in/anything-you-want | *Slug Path Name* |
| **Amazon IN** | https://amazon.in/dp/B00000000 | `B00000000` |
| **Amazon US** | https://www.amazon.com/dp/B08N5WRWNW | `B08N5WRWNW` |
| **Amazon UK** | https://www.amazon.co.uk/dp/B09ABC123 | `B09ABC123` |
| **Flipkart** | https://www.flipkart.com/apple-iphone-15/p/itm6f582cb512f00 | `itm6f582cb512f00` |
| **Flipkart** | https://flipkart.com/some-product | *Slug Path Name* |

---

## Features & Logic

1. **Tracker Striping:** Discards `?tag=`, `&qid=`, `&sr=`, and other tracking parameters attached by sharing links.
2. **Multi-TLD Amazon Evaluation:** Dynamically isolates region endings (`.in`, `.com`, `.co.uk`) to preserve correct routing.
3. **Flipkart Hash Isolation:** Extractions focus explicitly on capturing the 16-character unique identifier found in product endpoints (`/p/`).

## Quick Implementation Guide

```python
import re

def clean_ecommerce_url(url):
    amazon_pattern = re.search(r'amazon\.(in|com|co\.uk)\/.*?dp\/([A-Z0-9]{10})', url)
    if amazon_pattern:
        domain, asin = amazon_pattern.groups()
        return f"https://www.amazon.{domain}/dp/{asin}"

    flipkart_pattern = re.search(r'flipkart\.com\/.*?\/p\/([a-zA-Z0-9]{16})', url)
    if flipkart_pattern:
        product_id = flipkart_pattern.group(1)
        return f"https://www.flipkart.com/p/{product_id}"

    return url
```



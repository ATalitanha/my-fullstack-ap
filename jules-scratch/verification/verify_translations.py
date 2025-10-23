from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    # Verify homepage
    page.goto("http://localhost:3001")
    page.screenshot(path="jules-scratch/verification/homepage.png")

    # Verify login page
    page.goto("http://localhost:3001/login")
    page.screenshot(path="jules-scratch/verification/login.png")

    # Verify signup page
    page.goto("http://localhost:3001/signup")
    page.screenshot(path="jules-scratch/verification/signup.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)

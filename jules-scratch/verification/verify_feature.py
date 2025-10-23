from playwright.sync_api import sync_playwright
import random
import string

def random_string(length=10):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    email = f"{random_string()}@example.com"
    password = "password"

    # Navigate to the signup page
    page.goto("http://localhost:3000/signup")

    # Wait for the email input to be visible
    page.wait_for_selector('input[placeholder="example@email.com"]')

    # Fill in the signup form
    page.fill('input[placeholder="نام کاربری خود را وارد کنید"]', "Test User")
    page.fill('input[placeholder="example@email.com"]', email)
    page.fill('input[placeholder="رمز عبور قوی انتخاب کنید"]', password)

    # Click the signup button
    page.click('button[type="submit"]')

    # Wait for navigation to the login page
    page.wait_for_url("http://localhost:3000/login")

    # Wait for the email input to be visible
    page.wait_for_selector('input[placeholder="example@email.com"]')

    # Fill in the email and password fields
    page.fill('input[placeholder="example@email.com"]', email)
    page.fill('input[placeholder="رمز عبور خود را وارد کنید"]', password)

    # Click the login button
    page.click('button[type="submit"]')

    # Wait for navigation to the dashboard page
    page.wait_for_url("http://localhost:3000/dashboard")

    # Navigate to the todo page
    page.goto("http://localhost:3000/todo")

    # Wait for the new todo input to be visible
    page.wait_for_selector('input[placeholder="What do you want to do..."]')

    # Fill in the new todo input
    page.fill('input[placeholder="What do you want to do..."]', "My new todo")

    # Click the add button
    page.click('button:has-text("Add")')

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)

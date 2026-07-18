package com.employee.automation.utilities;

import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.FluentWait;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;

/**
 * WaitHelper provides standardized waiting mechanisms (Explicit, Fluent, Page Load)
 * to handle asynchronous UI operations and prevent flaky test runs.
 */
public class WaitHelper {

    private WebDriver driver;

    public WaitHelper(WebDriver driver) {
        this.driver = driver;
    }

    /**
     * Explicit Wait: Pauses execution until a specific WebElement becomes visible.
     * Use case: Standard wait for form elements, banners, or static texts to appear.
     */
    public WebElement waitForElementVisible(WebElement element, Duration timeout) {
        WebDriverWait wait = new WebDriverWait(driver, timeout);
        return wait.until(ExpectedConditions.visibilityOf(element));
    }

    /**
     * Explicit Wait: Pauses execution until a specific WebElement becomes clickable.
     * Use case: Before clicking buttons, links, or dropdown elements.
     */
    public WebElement waitForElementClickable(WebElement element, Duration timeout) {
        WebDriverWait wait = new WebDriverWait(driver, timeout);
        return wait.until(ExpectedConditions.elementToBeClickable(element));
    }

    /**
     * Explicit Wait: Pauses execution until an element is present in the DOM.
     * Use case: Verifying background/hidden nodes or elements that exist in source but aren't yet visible.
     */
    public WebElement waitForElementPresence(By locator, Duration timeout) {
        WebDriverWait wait = new WebDriverWait(driver, timeout);
        return wait.until(ExpectedConditions.presenceOfElementLocated(locator));
    }

    /**
     * Fluent Wait: Periodically polls the browser DOM to locate elements while ignoring specified exceptions.
     * Use case: Handling extremely unstable elements that load in unpredictable intervals, or 
     * where elements might temporarily disappear and reappear during loading animations.
     */
    public WebElement waitForElementFluent(final WebElement element, Duration timeout, Duration pollingTime) {
        FluentWait<WebDriver> wait = new FluentWait<>(driver)
                .withTimeout(timeout)
                .pollingEvery(pollingTime)
                .ignoring(NoSuchElementException.class)
                .ignoring(StaleElementReferenceException.class);

        return wait.until(d -> {
            if (element.isDisplayed()) {
                return element;
            }
            return null;
        });
    }

    /**
     * Page Load Wait: Blocks script execution until the browser page state reaches "complete".
     * Use case: Right after clicking navigation links, logins, or submitting forms that load a new document.
     */
    public void waitForPageLoad(Duration timeout) {
        WebDriverWait wait = new WebDriverWait(driver, timeout);
        wait.until(d -> ((JavascriptExecutor) d)
                .executeScript("return document.readyState")
                .toString()
                .equals("complete"));
    }
}

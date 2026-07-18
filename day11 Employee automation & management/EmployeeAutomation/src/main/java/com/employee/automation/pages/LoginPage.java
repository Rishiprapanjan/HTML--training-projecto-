package com.employee.automation.pages;

import com.employee.automation.utilities.WaitHelper;
import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import java.time.Duration;

/**
 * LoginPage class contains locators and action methods for the HR Portal Login Page.
 * It uses Selenium PageFactory annotation '@FindBy' for clean object identification.
 */
public class LoginPage {

    private WebDriver driver;
    private WaitHelper waitHelper;

    // --- WebElements Locators using PageFactory ---

    @FindBy(xpath = "//input[@id='employeeId' or @id='username' or @placeholder='Username' or contains(@placeholder, 'Username') or contains(@placeholder, 'admin') or contains(@placeholder, 'emp')]")
    private WebElement usernameInput;

    @FindBy(xpath = "//input[@id='password' or @placeholder='Password' or @placeholder='••••••••']")
    private WebElement passwordInput;

    @FindBy(xpath = "//button[@type='submit' or contains(@class, 'btn-signin') or text()='Login' or text()='Sign In' or text()='Sign In as Admin']")
    private WebElement loginBtn;

    @FindBy(xpath = "//*[contains(@class, 'login-box') or contains(@class, 'login-glass-card')]")
    private WebElement loginBox;

    // --- Constructor ---
    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.waitHelper = new WaitHelper(driver);
        // PageFactory.initElements initializes all elements annotated with @FindBy
        PageFactory.initElements(driver, this);
    }

    // --- Action Methods ---

    /**
     * Inputs the username into the Username field after waiting for its visibility.
     * @param username The username value
     */
    public void enterUsername(String username) {
        waitHelper.waitForElementVisible(usernameInput, Duration.ofSeconds(10));
        usernameInput.clear();
        usernameInput.sendKeys(username);
    }

    /**
     * Inputs the password into the Password field.
     * @param password The password value
     */
    public void enterPassword(String password) {
        waitHelper.waitForElementVisible(passwordInput, Duration.ofSeconds(10));
        passwordInput.clear();
        passwordInput.sendKeys(password);
    }

    /**
     * Clicks the Login button.
     */
    public void clickLogin() {
        waitHelper.waitForElementClickable(loginBtn, Duration.ofSeconds(10));
        loginBtn.click();
    }

    /**
     * Performs a complete login action sequence.
     * @param username The username value
     * @param password The password value
     */
    public void login(String username, String password) {
        enterUsername(username);
        enterPassword(password);
        clickLogin();
    }

    /**
     * Checks if the login box is visible. Used for verification of Logout and Login Page.
     * @return boolean true if displayed, false otherwise
     */
    public boolean isLoginBoxDisplayed() {
        try {
            return waitHelper.waitForElementVisible(loginBox, Duration.ofSeconds(10)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Captures and handles the JavaScript alert dialog box that appears during invalid logins.
     * @return String the text message displayed inside the alert popup
     */
    public String getAlertTextAndAccept() {
        // Wait for the browser's JavaScript alert popup to appear
        Duration timeout = Duration.ofSeconds(10);
        org.openqa.selenium.support.ui.WebDriverWait wait = new org.openqa.selenium.support.ui.WebDriverWait(driver, timeout);
        Alert alert = wait.until(org.openqa.selenium.support.ui.ExpectedConditions.alertIsPresent());
        
        String alertText = alert.getText();
        alert.accept(); // Clicks OK to dismiss alert
        return alertText;
    }
}

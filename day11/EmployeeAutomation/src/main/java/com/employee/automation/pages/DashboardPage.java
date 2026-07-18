package com.employee.automation.pages;

import com.employee.automation.utilities.WaitHelper;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import java.time.Duration;

/**
 * DashboardPage class containing locators and action methods for the Dashboard landing page.
 * Users land on this page after successful login.
 */
public class DashboardPage {

    private WebDriver driver;
    private WaitHelper waitHelper;

    // --- WebElements Locators ---

    @FindBy(xpath = "//h2[contains(text(), 'Welcome')]")
    private WebElement dashboardTitle;

    @FindBy(id = "logoutBtn")
    private WebElement logoutButton;

    @FindBy(xpath = "//span[text()='Dashboard']")
    private WebElement dashboardTabLink;

    @FindBy(xpath = "//span[text()='Leave Requests']")
    private WebElement leaveRequestsTabLink;

    // Stats values displayed on dashboard cards
    @FindBy(xpath = "//p[text()='Total Employees']/preceding-sibling::h3")
    private WebElement totalEmployeesCount;

    @FindBy(xpath = "//p[text()='Departments']/preceding-sibling::h3")
    private WebElement departmentsCount;

    // --- Constructor ---
    public DashboardPage(WebDriver driver) {
        this.driver = driver;
        this.waitHelper = new WaitHelper(driver);
        PageFactory.initElements(driver, this);
    }

    // --- Action Methods ---

    /**
     * Checks if the Dashboard Title ("Dashboard Overview") is displayed.
     * @return boolean true if displayed, false otherwise
     */
    public boolean isDashboardTitleDisplayed() {
        try {
            return waitHelper.waitForElementVisible(dashboardTitle, Duration.ofSeconds(10)).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Clicks the Logout button located in the navigation header.
     */
    public void clickLogout() {
        waitHelper.waitForElementClickable(logoutButton, Duration.ofSeconds(10));
        // Small delay and use JS click to bypass any loading overlays (e.g. 1200ms delay in EmployeeDashboard)
        try { Thread.sleep(1500); } catch(Exception e){}
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", logoutButton);
    }

    /**
     * Clicks the "Leave Requests" tab in the sidebar menu.
     */
    public void clickLeaveRequestsTab() {
        waitHelper.waitForElementClickable(leaveRequestsTabLink, Duration.ofSeconds(10));
        leaveRequestsTabLink.click();
    }

    /**
     * Clicks the "Dashboard" tab in the sidebar menu.
     */
    public void clickDashboardTab() {
        waitHelper.waitForElementClickable(dashboardTabLink, Duration.ofSeconds(10));
        dashboardTabLink.click();
    }

    /**
     * Retrieves the current Total Employees count displayed on the dashboard stat card.
     * @return int value of total employees, or -1 on error
     */
    public int getTotalEmployeesCount() {
        waitHelper.waitForElementVisible(totalEmployeesCount, Duration.ofSeconds(10));
        String countStr = totalEmployeesCount.getText().trim();
        return Integer.parseInt(countStr);
    }

    /**
     * Retrieves the current Departments count displayed on the dashboard stat card.
     * @return int value of departments count, or -1 on error
     */
    public int getDepartmentsCount() {
        waitHelper.waitForElementVisible(departmentsCount, Duration.ofSeconds(10));
        String countStr = departmentsCount.getText().trim();
        return Integer.parseInt(countStr);
    }
}

package com.employee.automation.tests;

import com.employee.automation.base.BaseTest;
import com.employee.automation.pages.DashboardPage;
import com.employee.automation.pages.LoginPage;
import com.employee.automation.utilities.ConfigReader;
import com.employee.automation.utilities.DriverFactory;
import org.testng.Assert;
import org.testng.annotations.Test;

/**
 * LoginTests verifies authentication functionalities across all gates:
 * valid logins (general, admin, employee), invalid logins, and logout procedures.
 */
public class LoginTests extends BaseTest {

    @Test(priority = 1, description = "Verify successful login on the main gate page")
    public void testValidLogin() {
        LoginPage loginPage = new LoginPage(DriverFactory.getDriver());
        DashboardPage dashboardPage = new DashboardPage(DriverFactory.getDriver());

        log.info("Starting Valid Login Test on Main Gate.");
        
        // Fetch credentials from config.properties
        String adminUser = ConfigReader.getProperty("username");
        String adminPass = ConfigReader.getProperty("password");

        // Act: Perform login on the landing page
        loginPage.login(adminUser, adminPass);

        // Assert: Dashboard title is visible
        boolean isLoaded = dashboardPage.isDashboardTitleDisplayed();
        Assert.assertTrue(isLoaded, "Dashboard Overview title should be visible after successful login.");
        
        log.info("Valid Login Test completed successfully.");
    }

    @Test(enabled = false, priority = 2, description = "Verify successful login specifically through the Admin Gate route")
    public void testAdminGateLogin() {
        LoginPage loginPage = new LoginPage(DriverFactory.getDriver());
        DashboardPage dashboardPage = new DashboardPage(DriverFactory.getDriver());

        log.info("Starting Admin Gate Login Test.");
        
        // Navigate directly to Admin Gate
        String adminGateUrl = ConfigReader.getProperty("url") + "admin-login";
        DriverFactory.getDriver().get(adminGateUrl);
        log.info("Navigated to Admin Gate URL: {}", adminGateUrl);

        // Perform login
        loginPage.login("admin", "admin123");

        // Assert: Dashboard title is visible
        boolean isLoaded = dashboardPage.isDashboardTitleDisplayed();
        Assert.assertTrue(isLoaded, "Dashboard Overview title should be visible after successful Admin Gate login.");
        
        // Logout to cleanup
        dashboardPage.clickLogout();
        Assert.assertTrue(loginPage.isLoginBoxDisplayed(), "Should return to login page after logout.");
        
        log.info("Admin Gate Login Test completed successfully.");
    }

    @Test(enabled = false, priority = 3, description = "Verify successful login specifically through the Employee Gate route")
    public void testEmployeeGateLogin() {
        LoginPage loginPage = new LoginPage(DriverFactory.getDriver());
        DashboardPage dashboardPage = new DashboardPage(DriverFactory.getDriver());

        log.info("Starting Employee Gate Login Test.");
        
        // Navigate directly to Employee Gate
        String employeeGateUrl = ConfigReader.getProperty("url") + "employee-login";
        DriverFactory.getDriver().get(employeeGateUrl);
        log.info("Navigated to Employee Gate URL: {}", employeeGateUrl);

        // Perform login
        loginPage.login("emp001", "emp123");

        // Assert: Dashboard title is visible
        boolean isLoaded = dashboardPage.isDashboardTitleDisplayed();
        Assert.assertTrue(isLoaded, "Dashboard Overview title should be visible after successful Employee Gate login.");
        
        // Logout to cleanup
        dashboardPage.clickLogout();
        try { Thread.sleep(2000); } catch(Exception e){}
        log.info("After logout, current URL is: " + DriverFactory.getDriver().getCurrentUrl());
        Assert.assertTrue(loginPage.isLoginBoxDisplayed(), "Should return to login page after logout.");
        
        log.info("Employee Gate Login Test completed successfully.");
    }

    @Test(enabled = false, priority = 4, description = "Verify error popup is displayed when logging in with invalid credentials")
    public void testInvalidLogin() {
        LoginPage loginPage = new LoginPage(DriverFactory.getDriver());

        log.info("Starting Invalid Login Test.");

        // Act: Attempt login with invalid credentials on landing page
        DriverFactory.getDriver().get(ConfigReader.getProperty("url"));
        loginPage.login("wronguser", "wrongpass");

        // Act: Handle alert popup and fetch its text
        String alertMsg = loginPage.getAlertTextAndAccept();

        // Assert: Verify exact alert message matches
        Assert.assertEquals(alertMsg, "Invalid Login Details", "Incorrect error message on invalid login popup.");
        
        // Assert: Verify we remain on the login page
        Assert.assertTrue(loginPage.isLoginBoxDisplayed(), "Login page box should remain visible after a failed login.");
        
        log.info("Invalid Login Test completed successfully.");
    }

    @Test(enabled = false, priority = 5, description = "Verify user is navigated back to Login Page after logging out")
    public void testLogout() {
        LoginPage loginPage = new LoginPage(DriverFactory.getDriver());
        DashboardPage dashboardPage = new DashboardPage(DriverFactory.getDriver());

        log.info("Starting Logout Test.");

        // Act: Log in first
        DriverFactory.getDriver().get(ConfigReader.getProperty("url"));
        loginPage.login(ConfigReader.getProperty("username"), ConfigReader.getProperty("password"));
        Assert.assertTrue(dashboardPage.isDashboardTitleDisplayed(), "Should be logged in first.");

        // Act: Click Logout
        dashboardPage.clickLogout();

        // Assert: Verify we are redirected back to login screen
        boolean isLoggedOut = loginPage.isLoginBoxDisplayed();
        Assert.assertTrue(isLoggedOut, "User should see the Login Page box after logging out.");
        
        log.info("Logout Test completed successfully.");
    }
}

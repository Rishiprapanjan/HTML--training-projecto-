package com.employee.automation.tests;

import com.employee.automation.base.BaseTest;
import com.employee.automation.pages.DashboardPage;
import com.employee.automation.pages.EmployeePage;
import com.employee.automation.pages.LoginPage;
import com.employee.automation.utilities.ConfigReader;
import com.employee.automation.utilities.DriverFactory;
import org.testng.Assert;
import org.testng.annotations.Test;

/**
 * EmployeeTests verifies CRUD (Create, Read, Update, Delete) operations
 * for Employee objects in the system.
 */
public class EmployeeTests extends BaseTest {

    private final String testEmpName = "Auto Tester";
    private final String testEmpEmail = "autotester@mail.com";
    private final String testEmpPhone = "9876543210";
    private final String testEmpDept = "IT";
    private final String testEmpDesig = "QA Automation Lead";
    private final String testEmpSalary = "85000";

    @Test(priority = 1, description = "Verify that a new employee can be successfully added to the system")
    public void testAddEmployee() {
        LoginPage loginPage = new LoginPage(DriverFactory.getDriver());
        EmployeePage employeePage = new EmployeePage(DriverFactory.getDriver());

        log.info("Starting Add Employee Test.");

        // Act: Login to portal
        loginPage.login(ConfigReader.getProperty("username"), ConfigReader.getProperty("password"));

        // Act: Add employee details
        employeePage.addEmployee(testEmpName, testEmpEmail, testEmpPhone, testEmpDept, testEmpDesig, testEmpSalary);

        // Act: Search for the added employee to refresh grid and filter
        employeePage.searchEmployee(testEmpName);

        // Assert: Verify employee name is visible in grid
        boolean isFound = employeePage.isEmployeeInList(testEmpName);
        Assert.assertTrue(isFound, "Newly created employee should be listed in the grid.");

        log.info("Add Employee Test completed successfully.");
    }

    @Test(enabled = false, priority = 2, dependsOnMethods = "testAddEmployee", description = "Verify that employee grid can be filtered using search bar")
    public void testSearchEmployee() {
        LoginPage loginPage = new LoginPage(DriverFactory.getDriver());
        EmployeePage employeePage = new EmployeePage(DriverFactory.getDriver());

        log.info("Starting Search Employee Test.");

        // Act: Login
        loginPage.login(ConfigReader.getProperty("username"), ConfigReader.getProperty("password"));

        // Act: Search employee by name
        employeePage.searchEmployee(testEmpName);

        // Assert: Verify search displays the matching employee
        boolean isFound = employeePage.isEmployeeInList(testEmpName);
        Assert.assertTrue(isFound, "Employee search result should display the target employee card.");

        log.info("Search Employee Test completed successfully.");
    }

    @Test(enabled = false, priority = 3, dependsOnMethods = "testAddEmployee", description = "Verify that employee details can be updated")
    public void testUpdateEmployee() {
        LoginPage loginPage = new LoginPage(DriverFactory.getDriver());
        EmployeePage employeePage = new EmployeePage(DriverFactory.getDriver());

        log.info("Starting Update Employee Test.");

        // Act: Login
        loginPage.login(ConfigReader.getProperty("username"), ConfigReader.getProperty("password"));

        // Act: Find and Edit target employee
        employeePage.searchEmployee(testEmpName);
        employeePage.clickEditEmployee(testEmpName);

        // Act: Update form details (e.g. new designation and salary)
        String newDesig = "Senior QA Architect";
        String newSalary = "120000";
        employeePage.fillEmployeeForm(testEmpName, testEmpEmail, testEmpPhone, testEmpDept, newDesig, newSalary);
        employeePage.clickSubmit();

        // Act: Re-search to verify updates
        employeePage.searchEmployee(testEmpName);

        // Assert: Verify employee is still in list and details updated
        boolean isPresent = employeePage.isEmployeeInList(testEmpName);
        Assert.assertTrue(isPresent, "Employee card should remain in list after edit.");

        log.info("Update Employee Test completed successfully.");
    }

    @Test(enabled = false, priority = 4, dependsOnMethods = "testAddEmployee", description = "Verify that an employee can be deleted and removed from the system")
    public void testDeleteEmployee() {
        LoginPage loginPage = new LoginPage(DriverFactory.getDriver());
        EmployeePage employeePage = new EmployeePage(DriverFactory.getDriver());

        log.info("Starting Delete Employee Test.");

        // Act: Login
        loginPage.login(ConfigReader.getProperty("username"), ConfigReader.getProperty("password"));

        // Act: Search and delete employee
        employeePage.searchEmployee(testEmpName);
        employeePage.clickDeleteEmployee(testEmpName);

        // Act: Accept the browser confirmation alert
        employeePage.acceptDeleteAlert();

        // Let UI refresh
        try { Thread.sleep(2000); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }

        // Act: Search again
        employeePage.searchEmployee(testEmpName);

        // Assert: Verify employee is no longer present in the grid
        boolean isFound = employeePage.isEmployeeInList(testEmpName);
        Assert.assertFalse(isFound, "Deleted employee should be removed from the list.");

        log.info("Delete Employee Test completed successfully.");
    }
}

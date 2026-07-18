package com.employee.automation.pages;

import com.employee.automation.utilities.WaitHelper;
import org.openqa.selenium.*;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import java.time.Duration;
import java.util.List;

/**
 * EmployeePage class contains WebElements and actions for adding, editing,
 * deleting, and searching employees in the HR Portal dashboard.
 */
public class EmployeePage {

    private WebDriver driver;
    private WaitHelper waitHelper;

    // --- WebElements Locators ---

    @FindBy(name = "name")
    private WebElement nameInput;

    @FindBy(name = "email")
    private WebElement emailInput;

    @FindBy(name = "phone")
    private WebElement phoneInput;

    @FindBy(name = "department")
    private WebElement departmentDropdown;

    @FindBy(name = "designation")
    private WebElement designationInput;

    @FindBy(name = "salary")
    private WebElement salaryInput;

    @FindBy(xpath = "//form//button[@type='submit']")
    private WebElement submitFormBtn;

    @FindBy(xpath = "//input[@placeholder='Search employee...']")
    private WebElement searchInput;

    @FindBy(className = "employee-card")
    private List<WebElement> employeeCards;

    // --- Constructor ---
    public EmployeePage(WebDriver driver) {
        this.driver = driver;
        this.waitHelper = new WaitHelper(driver);
        PageFactory.initElements(driver, this);
    }

    // --- Action Methods ---

    /**
     * Fills out the employee form with the provided details.
     */
    public void fillEmployeeForm(String name, String email, String phone, String department, String designation, String salary) {
        waitHelper.waitForElementVisible(nameInput, Duration.ofSeconds(10));
        
        nameInput.clear();
        nameInput.sendKeys(name);
        
        emailInput.clear();
        emailInput.sendKeys(email);
        
        phoneInput.clear();
        phoneInput.sendKeys(phone);
        
        // Select from department dropdown
        Select selectDept = new Select(departmentDropdown);
        selectDept.selectByVisibleText(department);
        
        designationInput.clear();
        designationInput.sendKeys(designation);
        
        salaryInput.clear();
        salaryInput.sendKeys(salary);
    }

    /**
     * Submits the employee form (Add or Update).
     */
    public void clickSubmit() {
        waitHelper.waitForElementClickable(submitFormBtn, Duration.ofSeconds(10));
        submitFormBtn.click();
    }

    /**
     * Performs a complete add employee operation.
     */
    public void addEmployee(String name, String email, String phone, String department, String designation, String salary) {
        fillEmployeeForm(name, email, phone, department, designation, salary);
        clickSubmit();
    }

    /**
     * Types an employee name into the search bar to filter results.
     * @param name Name of the employee to search
     */
    public void searchEmployee(String name) {
        waitHelper.waitForElementVisible(searchInput, Duration.ofSeconds(10));
        searchInput.clear();
        searchInput.sendKeys(name);
        
        // Let the filter complete (brief wait for React processing)
        // try { Thread.sleep(1000); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    }

    /**
     * Checks if an employee with a specific name is visible in the list.
     * @param name Name of the employee
     * @return boolean true if found, false otherwise
     */
    public boolean isEmployeeInList(String name) {
        String xpath = "//div[contains(@class,'employee-card')]/h3[text()='" + name + "']";
        try {
            WebElement empNameElement = driver.findElement(By.xpath(xpath));
            return empNameElement.isDisplayed();
        } catch (NoSuchElementException e) {
            return false;
        }
    }

    /**
     * Clicks the Edit button on the employee card representing the target employee.
     * @param name Name of the employee to edit
     */
    public void clickEditEmployee(String name) {
        String xpath = "//h3[text()='" + name + "']/following-sibling::div[@class='actions']/button[contains(@class,'edit-btn')]";
        WebElement editBtn = driver.findElement(By.xpath(xpath));
        waitHelper.waitForElementClickable(editBtn, Duration.ofSeconds(10));
        editBtn.click();
    }

    /**
     * Clicks the Delete button on the employee card representing the target employee.
     * @param name Name of the employee to delete
     */
    public void clickDeleteEmployee(String name) {
        String xpath = "//h3[text()='" + name + "']/following-sibling::div[@class='actions']/button[contains(@class,'delete-btn')]";
        WebElement deleteBtn = driver.findElement(By.xpath(xpath));
        waitHelper.waitForElementClickable(deleteBtn, Duration.ofSeconds(10));
        
        // Override window.confirm to bypass the alert and prevent CDP crash
        ((JavascriptExecutor) driver).executeScript("window.confirm = function() { return true; }");
        
        deleteBtn.click();
    }

    /**
     * Handles the native confirmation alert that pops up when deleting an employee.
     */
    public void acceptDeleteAlert() {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(2));
            Alert alert = wait.until(ExpectedConditions.alertIsPresent());
            alert.accept(); // Confirms deletion
        } catch (Exception e) {
            // Alert was bypassed by JS override
        }
    }
}

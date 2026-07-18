package com.employee.automation.base;

import com.employee.automation.utilities.ConfigReader;
import com.employee.automation.utilities.DriverFactory;
import org.openqa.selenium.WebDriver;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.BeforeSuite;
import org.testng.annotations.AfterSuite;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import java.time.Duration;

/**
 * BaseTest serves as the parent class for all TestNG test classes.
 * It manages the test lifecycle annotations to set up and tear down browser sessions.
 */
public class BaseTest {

    // Thread-safe logger initialization
    protected static final Logger log = LogManager.getLogger(BaseTest.class);

    /**
     * Runs once before the entire test suite starts.
     * Used to initialize config properties, logging systems, and reporting mechanisms.
     */
    @BeforeSuite
    public void setupSuite() {
        log.info("Initializing Test Suite Execution.");
        // Initialize config reader
        ConfigReader.initProperties();
    }

    /**
     * Runs before every individual test method (@Test).
     * Initializes the driver and navigates to the application URL.
     */
    @BeforeMethod
    public void setUp() {
        log.info("Setting up browser for test execution.");
        
        // Fetch values from config.properties
        String browser = ConfigReader.getProperty("browser");
        String url = ConfigReader.getProperty("url");
        long implicitWait = Long.parseLong(ConfigReader.getProperty("implicitWait"));

        // Initialize driver
        WebDriver driver = DriverFactory.initDriver(browser);
        log.info("Driver initialized for browser: {}", browser);

        // Apply global implicit wait configurations
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(implicitWait));
        
        // Open application URL
        driver.get(url);
        log.info("Navigated to URL: {}", url);
    }

    /**
     * Runs immediately after every individual test method (@Test) completes.
     * Closes the browser session.
     */
    @AfterMethod
    public void tearDown() {
        log.info("Closing browser session.");
        DriverFactory.closeDriver();
        log.info("Browser session closed cleanly.");
    }

    /**
     * Runs once after all tests in the suite have executed.
     * Used for finalizing reports and cleaning up resources.
     */
    @AfterSuite
    public void tearDownSuite() {
        log.info("All tests completed. Finalizing Test Suite.");
    }
}

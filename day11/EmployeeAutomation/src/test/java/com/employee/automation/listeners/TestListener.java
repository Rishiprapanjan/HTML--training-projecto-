package com.employee.automation.listeners;

import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.Status;
import com.employee.automation.reports.ExtentManager;
import com.employee.automation.utilities.DriverFactory;
import com.employee.automation.utilities.ScreenshotUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.WebDriver;
import org.testng.ITestContext;
import org.testng.ITestListener;
import org.testng.ITestResult;

/**
 * TestListener implements TestNG's ITestListener to intercept test lifecycles.
 * It automatically updates Extent Reports and captures screenshots on test failures.
 */
public class TestListener implements ITestListener {

    private static final Logger log = LogManager.getLogger(TestListener.class);

    @Override
    public void onStart(ITestContext context) {
        log.info("Test Execution Suite Started: " + context.getName());
    }

    @Override
    public void onTestStart(ITestResult result) {
        log.info("Starting Test Method: " + result.getMethod().getMethodName());
        
        // Create an Extent Test entry for the report
        ExtentTest test = ExtentManager.getReporter().createTest(result.getMethod().getMethodName());
        
        // Bind the test logger instance to the executing thread
        ExtentManager.setTest(test);
    }

    @Override
    public void onTestSuccess(ITestResult result) {
        log.info("Test Passed: " + result.getMethod().getMethodName());
        ExtentManager.getTest().log(Status.PASS, "Test Case PASSED: " + result.getMethod().getMethodName());
    }

    @Override
    public void onTestFailure(ITestResult result) {
        log.error("Test Failed: " + result.getMethod().getMethodName());
        log.error(result.getThrowable()); // Log exception trace to console/file
        
        ExtentTest extentTest = ExtentManager.getTest();
        extentTest.log(Status.FAIL, "Test Case FAILED: " + result.getMethod().getMethodName());
        extentTest.log(Status.FAIL, result.getThrowable());

        // Capture screenshot automatically
        WebDriver driver = DriverFactory.getDriver();
        if (driver != null) {
            try {
                String screenshotPath = ScreenshotUtil.takeScreenshot(driver, result.getName());
                // Attach the screenshot file directly to the test report details
                extentTest.addScreenCaptureFromPath(screenshotPath, "Failure Screen View");
                log.info("Failure screenshot captured and attached to report.");
            } catch (Exception e) {
                log.error("Failed to capture failure screenshot: " + e.getMessage());
            }
        }
    }

    @Override
    public void onTestSkipped(ITestResult result) {
        log.warn("Test Skipped: " + result.getMethod().getMethodName());
        ExtentManager.getTest().log(Status.SKIP, "Test Case SKIPPED: " + result.getMethod().getMethodName());
    }

    @Override
    public void onFinish(ITestContext context) {
        log.info("Test Execution Suite Completed: " + context.getName());
        
        // Write all logs to the physical HTML file
        ExtentManager.getReporter().flush();
        
        // Clean thread local memory
        ExtentManager.removeTest();
    }
}

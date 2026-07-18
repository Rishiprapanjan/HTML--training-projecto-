package com.employee.automation.reports;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;
import com.aventstack.extentreports.reporter.configuration.Theme;

/**
 * ExtentManager is a utility class that manages the lifecycle of ExtentReports.
 * It provides thread-safe access to ExtentTest instances for parallel logging.
 */
public class ExtentManager {

    private static ExtentReports extent;
    private static ThreadLocal<ExtentTest> extentTest = new ThreadLocal<>();

    /**
     * Initializes and returns the static ExtentReports instance.
     * Implements a double-checked locking Singleton pattern.
     */
    public static synchronized ExtentReports getReporter() {
        if (extent == null) {
            String reportPath = "./reports/ExtentReport.html";
            ExtentSparkReporter sparkReporter = new ExtentSparkReporter(reportPath);

            // Configure the visual look of the HTML report
            sparkReporter.config().setDocumentTitle("Employee Automation Test Report");
            sparkReporter.config().setReportName("Regressive Execution Dashboard");
            sparkReporter.config().setTheme(Theme.DARK); // Premium Dark theme
            sparkReporter.config().setTimeStampFormat("yyyy-MM-dd HH:mm:ss");

            extent = new ExtentReports();
            extent.attachReporter(sparkReporter);

            // Set system metadata info
            extent.setSystemInfo("Host Name", "Localhost");
            extent.setSystemInfo("Environment", "QA - Local Dev");
            extent.setSystemInfo("Platform", System.getProperty("os.name"));
            extent.setSystemInfo("Java Version", System.getProperty("java.version"));
            extent.setSystemInfo("Author", "QA Automation Team");
        }
        return extent;
    }

    /**
     * Retrieves the ExtentTest instance allocated to the current thread.
     */
    public static ExtentTest getTest() {
        return extentTest.get();
    }

    /**
     * Binds a new ExtentTest instance to the current thread.
     */
    public static void setTest(ExtentTest test) {
        extentTest.set(test);
    }

    /**
     * Clears the current thread's ExtentTest instance to avoid memory leaks.
     */
    public static void removeTest() {
        extentTest.remove();
    }
}
